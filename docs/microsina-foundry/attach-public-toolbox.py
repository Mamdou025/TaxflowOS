"""Attach the verified public toolbox to a copy of MicroSina v3 in Azure Cloud Shell."""
import argparse
import copy
import json
from pathlib import Path
import subprocess
import urllib.error
import urllib.request
import uuid

ENDPOINT = "https://fapi-resource.services.ai.azure.com/api/projects/fapi"
PROJECT = "/subscriptions/b581c769-ee05-48ce-ab58-a26d76571d66/resourceGroups/Fapiplatform/providers/Microsoft.CognitiveServices/accounts/fapi-resource/projects/fapi"
ARM = "https://management.azure.com"
API = "2025-10-01-preview"
TOOLBOX = ENDPOINT + "/toolboxes/inscope-public-tools/versions/1/mcp?api-version=v1"
CONNECTION = "inscope-public-tools-v1"
ROLE = "53ca6127-db72-4b80-b1b0-d745d6d5456d"  # Foundry User (formerly Azure AI User)
RECEIPT = Path("microsina-toolbox-attachment-result.json")
PUBLIC_NAMES = {"microsoft_docs_search", "microsoft_docs_fetch", "microsoft_code_sample_search"}
ATTACHMENT = {
    "type": "mcp", "server_label": "inscope_public_tools", "server_url": TOOLBOX,
    # Foundry serializes the documented array shorthand as an MCPToolFilter.
    "project_connection_id": CONNECTION,
    "allowed_tools": {"tool_names": ["tool_search", "call_tool"]},
    "require_approval": "never",  # Only the verified immutable public toolbox version.
}


def validate_toolbox(toolbox):
    tools = toolbox.get("tools", [])
    remote = [t for t in tools if t.get("type") == "mcp"]
    if (len(tools) != 2 or len(remote) != 1
            or sum(t.get("type") == "toolbox_search" for t in tools) != 1):
        raise ValueError("Expected only Microsoft Learn and toolbox search")
    tool = remote[0]
    if (tool.get("server_url") != "https://learn.microsoft.com/api/mcp"
            or set(tool.get("allowed_tools", [])) != PUBLIC_NAMES
            or tool.get("require_approval") != "never"
            or tool.get("project_connection_id") or tool.get("headers")):
        raise ValueError("Public toolbox differs from the reviewed configuration")


def make_payload(base):
    definition = copy.deepcopy(base["definition"])
    if definition.get("kind") != "prompt":
        raise ValueError("Expected a prompt agent")
    tools = definition.get("tools", [])
    if any(t.get("server_label") == ATTACHMENT["server_label"] for t in tools):
        raise ValueError("Base already has this toolbox; inspect versions before proceeding")
    definition["tools"] = [*tools, copy.deepcopy(ATTACHMENT)]
    return {"definition": definition, "metadata": {
        **base.get("metadata", {}), "inscope_public_toolbox_version": "1",
        "inscope_toolbox_base_agent_version": "3",
    }}


def definition_differences(expected, actual, path="/definition"):
    """Report structure and changed paths, never prompts, credentials or field values."""
    def shape(value):
        if value is None:
            return "null"
        if isinstance(value, dict):
            return "object"
        if isinstance(value, list):
            return "array"
        return type(value).__name__

    if type(expected) is not type(actual):
        return [{"path": path, "change": "type", "expected_type": shape(expected),
                 "actual_type": shape(actual)}]
    differences = []
    if isinstance(expected, dict):
        for key in sorted(expected.keys() | actual.keys()):
            child = path + "/" + key.replace("~", "~0").replace("/", "~1")
            if key not in expected:
                differences.append({"path": child, "change": "added", "actual_type": shape(actual[key])})
            elif key not in actual:
                differences.append({"path": child, "change": "missing", "expected_type": shape(expected[key])})
            else:
                differences.extend(definition_differences(expected[key], actual[key], child))
    elif isinstance(expected, list):
        for index in range(max(len(expected), len(actual))):
            child = path + "/" + str(index)
            if index >= len(expected):
                differences.append({"path": child, "change": "added", "actual_type": shape(actual[index])})
            elif index >= len(actual):
                differences.append({"path": child, "change": "missing", "expected_type": shape(expected[index])})
            else:
                differences.extend(definition_differences(expected[index], actual[index], child))
    elif expected != actual:
        differences.append({"path": path, "change": "value", "value_type": shape(actual)})
    return differences


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    group = parser.add_mutually_exclusive_group()
    group.add_argument("--apply", action="store_true")
    group.add_argument("--verify-only", action="store_true")
    args = parser.parse_args()
    if args.verify_only:
        print("Verify the candidate recorded in the receipt. No agent, connection or role creation.")
    else:
        print("Plan: preserve MicroSina v3 and its functions; attach public toolbox v1 to a new version.")
        print("Grant Foundry User at project scope to the project's managed identity and create its MCP connection.")
    print("The Inscope backend's consumer identity, original Sina and local version pin are unchanged.")
    if not args.apply and not args.verify_only:
        print("Preview only. Use --apply in signed-in Azure Cloud Shell.")
        return
    if args.apply and RECEIPT.exists():
        raise SystemExit("A receipt exists. Use --verify-only; inspect partial setup before retrying creation.")
    tokens = {}

    def request(url, body=None, method=None, missing_ok=False, stream=False):
        resource = ARM + "/" if url.startswith(ARM + "/") else "https://ai.azure.com"
        if resource not in tokens:
            tokens[resource] = subprocess.run([
                "az", "account", "get-access-token", "--resource", resource,
                "--query", "accessToken", "--output", "tsv",
            ], check=True, capture_output=True, text=True).stdout.strip()
        req = urllib.request.Request(url, method=method or ("GET" if body is None else "POST"),
            data=None if body is None else json.dumps(body).encode(),
            headers={"Authorization": "Bearer " + tokens[resource], "Content-Type": "application/json"})
        try:
            with urllib.request.urlopen(req, timeout=180) as response:
                if stream:
                    completed = None
                    calls = []
                    for line in response:
                        if not line.startswith(b"data:"):
                            continue
                        data = line[5:].strip()
                        if not data or data == b"[DONE]":
                            continue
                        event = json.loads(data)
                        if event.get("type") == "response.output_item.done":
                            item = event.get("item", {})
                            if item.get("type") == "mcp_call":
                                output = item.get("output")
                                try:
                                    parsed = json.loads(output) if isinstance(output, str) else output
                                except json.JSONDecodeError:
                                    parsed = None
                                tool_error = isinstance(parsed, dict) and parsed.get("isError") is True
                                calls.append({"name": item.get("name"), "status": item.get("status"),
                                              "error": bool(item.get("error")) or tool_error})
                        if event.get("type") == "response.completed":
                            completed = event.get("response", {}).get("status")
                        if event.get("type") in {"error", "response.failed"}:
                            raise SystemExit("Foundry stream failed. Inspect the candidate in Foundry; no local activation.")
                    return {"status": completed, "calls": calls}
                return json.load(response)
        except urllib.error.HTTPError as error:
            if missing_ok and error.code == 404:
                return None
            raise SystemExit(f"Azure HTTP {error.code}. Stop and return this status; no automatic creation retry.") from None

    base = request(ENDPOINT + "/agents/MicroSina/versions/3?api-version=v1")
    toolbox = request(ENDPOINT + "/toolboxes/inscope-public-tools/versions/1?api-version=v1")
    validate_toolbox(toolbox)
    payload = make_payload(base)
    if args.apply:
        project = request(ARM + PROJECT + "?api-version=" + API)
        principal = project.get("identity", {}).get("principalId")
        if not principal:
            raise SystemExit("Project managed identity not found. Nothing created; return this message.")
        uuid.UUID(principal)
        connection_url = ARM + PROJECT + "/connections/" + CONNECTION + "?api-version=" + API
        properties = {"authType": "ProjectManagedIdentity", "category": "RemoteTool",
                      "target": TOOLBOX, "audience": "https://ai.azure.com",
                      "metadata": {"ApiType": "Azure"}}
        existing = request(connection_url, missing_ok=True)
        if existing and any(existing.get("properties", {}).get(k) != v for k, v in properties.items() if k != "metadata"):
            raise SystemExit("Named connection exists with different settings; nothing overwritten.")
        RECEIPT.write_text(json.dumps({"status": "setup_started", "principal": principal}))
        role_path = PROJECT.split("/resourceGroups/")[0] + "/providers/Microsoft.Authorization/roleDefinitions/" + ROLE
        assignments = request(ARM + PROJECT + "/providers/Microsoft.Authorization/roleAssignments?api-version=2022-04-01&$filter=atScope()")
        if not any(a.get("properties", {}).get("principalId", "").lower() == principal.lower()
                   and a["properties"].get("roleDefinitionId", "").lower() == role_path.lower()
                   for a in assignments.get("value", [])):
            assignment = str(uuid.uuid5(uuid.NAMESPACE_URL, PROJECT + principal + ROLE))
            request(ARM + PROJECT + "/providers/Microsoft.Authorization/roleAssignments/" + assignment + "?api-version=2022-04-01",
                    {"properties": {"principalId": principal, "principalType": "ServicePrincipal", "roleDefinitionId": role_path}}, "PUT")
        if not existing:
            request(connection_url, {"properties": properties}, "PUT")
        RECEIPT.write_text(json.dumps({"status": "agent_submission_started", "principal": principal}))
        created = request(ENDPOINT + "/agents/MicroSina/versions?api-version=v1", payload)
        version = str(created["version"])
        RECEIPT.write_text(json.dumps({"status": "created", "version": version, "principal": principal}))
    else:
        version = str(json.loads(RECEIPT.read_text()).get("version", ""))
    if not version.isdigit():
        raise SystemExit("No confirmed version in receipt. Inspect Foundry before repeating setup.")
    saved = request(ENDPOINT + f"/agents/MicroSina/versions/{version}?api-version=v1")
    differences = definition_differences(payload["definition"], saved.get("definition"))
    if differences:
        print(json.dumps({"status": "definition_mismatch", "agent": "MicroSina", "version": version,
                          "difference_count": len(differences), "differences": differences[:40],
                          "local_activation": False}, indent=2))
        raise SystemExit("Readback differs. Return this diagnostic; do not rerun --apply or activate the candidate.")
    # Synthetic public query only: no workspace data, mailbox, or private documents.
    result = request(ENDPOINT + "/agents/MicroSina/endpoint/protocols/openai/responses?api-version=v1", {
        "agent_reference": {"type": "agent_reference", "name": "MicroSina", "version": version},
        "input": "Use tool_search to discover Microsoft documentation search, then use call_tool to search for Azure Foundry toolboxes. Summarize one result with its official documentation link. Do both operations; do not answer from memory.",
        "stream": True, "store": False,
        "tool_choice": {"type": "allowed_tools", "mode": "auto", "tools": [
            {"type": "mcp", "server_label": "inscope_public_tools", "name": name}
            for name in ["tool_search", "call_tool"]
        ]},
    }, stream=True)
    names = {c["name"] for c in result["calls"] if c["status"] == "completed" and not c["error"]}
    verified = result["status"] == "completed" and {"tool_search", "call_tool"} <= names
    report = {"agent": "MicroSina", "version": version, "toolbox_version": "1",
              "status": "agent_tool_calls_verified" if verified else "verification_incomplete",
              "calls": result["calls"], "local_activation": False}
    RECEIPT.write_text(json.dumps(report, indent=2))
    print(json.dumps(report, indent=2))
    print("Return this result for testing through Inscope's backend before local activation.")


if __name__ == "__main__":
    main()

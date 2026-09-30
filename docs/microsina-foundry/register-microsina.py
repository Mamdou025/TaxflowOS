"""Run in signed-in Azure Cloud Shell beside tools.json. No credentials are saved."""
import argparse
import copy
import hashlib
import json
from pathlib import Path
import subprocess
import urllib.request
import urllib.error

ENDPOINT = "https://fapi-resource.services.ai.azure.com/api/projects/fapi"
AGENT = "MicroSina"
BASE_VERSION = "2"


def make_payload(base, tools):
    definition = copy.deepcopy(base["definition"])
    if definition.get("kind") != "prompt":
        raise ValueError("Expected MicroSina to be a prompt agent")
    names = [tool.get("name") for tool in tools]
    if not tools or len(names) != len(set(names)):
        raise ValueError("Missing or duplicate tool definitions")
    if any(tool.get("type") != "function" or not tool.get("name")
           or tool.get("parameters", {}).get("type") != "object" for tool in tools):
        raise ValueError("Only named function schemas are allowed")
    existing = definition.get("tools", [])
    definition["tools"] = [tool for tool in existing if tool.get("name") not in names] + tools
    digest = hashlib.sha256(json.dumps(tools, sort_keys=True).encode()).hexdigest()
    return {
        "definition": definition,
        "metadata": {**base.get("metadata", {}), "inscope_tools_sha256": digest,
                     "inscope_base_version": BASE_VERSION},
    }


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--apply", action="store_true", help="Create a new agent version")
    args = parser.parse_args()
    receipt = Path("microsina-registration-result.json")
    if receipt.exists():
        raise SystemExit("A prior registration receipt exists. Inspect it before creating another version.")
    tools = json.loads(Path(__file__).with_name("tools.json").read_text(encoding="utf-8"))
    token = subprocess.run(
        ["az", "account", "get-access-token", "--resource", "https://ai.azure.com",
         "--query", "accessToken", "--output", "tsv"],
        check=True, capture_output=True, text=True,
    ).stdout.strip()
    if not token:
        raise SystemExit("Azure CLI did not return an access token")

    def request(path, payload=None):
        req = urllib.request.Request(
            ENDPOINT + path + "?api-version=v1",
            data=None if payload is None else json.dumps(payload).encode(),
            headers={"Authorization": "Bearer " + token, "Content-Type": "application/json"},
            method="GET" if payload is None else "POST",
        )
        try:
            with urllib.request.urlopen(req, timeout=90) as response:
                return json.load(response)
        except urllib.error.HTTPError as error:
            raise SystemExit(f"Foundry HTTP {error.code}. No automatic retry. Check access and agent versions.") from None

    base = request(f"/agents/{AGENT}/versions/{BASE_VERSION}")
    payload = make_payload(base, tools)
    print(f"MicroSina: preserve version {BASE_VERSION} model/instructions; register {len(tools)} function schemas.")
    print("Tool execution and approvals stay in Inscope. No Azure roles, Sina, or app deployment changes.")
    if not args.apply:
        print("Preview only. Run again with --apply to create the new version.")
        return
    # A marker prevents blind retries if the POST succeeds but its response is lost.
    receipt.write_text(json.dumps({"status": "submission_started", "agent": AGENT}), encoding="utf-8")
    created = request(f"/agents/{AGENT}/versions", payload)
    version = str(created["version"])
    receipt.write_text(json.dumps({"status": "created", "agent": AGENT, "version": version}, indent=2), encoding="utf-8")
    saved = request(f"/agents/{AGENT}/versions/{version}")
    saved_tools = {tool.get("name"): tool for tool in saved["definition"].get("tools", [])}
    if any(saved_tools.get(tool["name"], {}).get("parameters") != tool["parameters"] for tool in tools):
        raise SystemExit("New version exists, but tool verification failed. Do not activate it.")
    if any(saved["definition"].get(key) != base["definition"].get(key) for key in ("model", "instructions")):
        raise SystemExit("New version exists, but model/instruction verification failed. Do not activate it.")
    print(json.dumps({"agent": AGENT, "version": version, "registered_functions": len(tools),
                      "next": "Return this result to Codex for testing and local activation."}))


if __name__ == "__main__":
    main()

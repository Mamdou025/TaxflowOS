"""Create and verify an Inscope public toolbox using signed-in Azure Cloud Shell."""
import argparse
import json
from pathlib import Path
import subprocess
import urllib.error
import urllib.request

ENDPOINT = "https://fapi-resource.services.ai.azure.com/api/projects/fapi"
NAME = "inscope-public-tools"
PAYLOAD = {
    "description": "Inscope public documentation tools with runtime tool search",
    "tools": [
        {
            "type": "mcp",
            "server_label": "microsoft_learn",
            "server_url": "https://learn.microsoft.com/api/mcp",
            "description": "Search and read official Microsoft product documentation and code examples",
            "allowed_tools": ["microsoft_docs_search", "microsoft_docs_fetch", "microsoft_code_sample_search"],
            # Only the three named public, read-only documentation operations.
            "require_approval": "never",
        },
        {"type": "toolbox_search"},
    ],
}


def decode_response(text, request_id=None):
    if not text.strip():
        return {}
    try:
        return json.loads(text)
    except json.JSONDecodeError:
        # MCP Streamable HTTP may return SSE, including progress notifications.
        for event in text.replace("\r\n", "\n").split("\n\n"):
            data = "\n".join(line[5:].lstrip() for line in event.splitlines() if line.startswith("data:"))
            if data and data != "[DONE]":
                value = json.loads(data)
                if request_id is None or value.get("id") == request_id:
                    return value
    raise ValueError("No matching JSON-RPC response in the server stream")


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--apply", action="store_true")
    parser.add_argument("--verify-only", action="store_true", help="Retry verification using the existing receipt; creates nothing")
    args = parser.parse_args()
    if args.apply and args.verify_only:
        parser.error("Choose --apply or --verify-only")
    receipt_path = Path("inscope-public-tools-result.json")
    print(json.dumps(PAYLOAD, indent=2))
    if not args.apply and not args.verify_only:
        print("Preview only. Use --apply to create and verify the toolbox.")
        return
    if args.apply and receipt_path.exists():
        raise SystemExit("Receipt already exists. Use --verify-only; do not repeat creation.")
    token = subprocess.run([
        "az", "account", "get-access-token", "--resource", "https://ai.azure.com",
        "--query", "accessToken", "--output", "tsv",
    ], check=True, capture_output=True, text=True).stdout.strip()
    if not token:
        raise SystemExit("No Azure access token returned")
    session_headers = {}

    def request(path, body=None, mcp=False):
        headers = {"Authorization": "Bearer " + token, "Content-Type": "application/json"}
        if mcp:
            headers.update({"Accept": "application/json, text/event-stream", **session_headers})
        req = urllib.request.Request(ENDPOINT + path, headers=headers,
                                     data=None if body is None else json.dumps(body).encode(),
                                     method="GET" if body is None else "POST")
        try:
            with urllib.request.urlopen(req, timeout=90) as response:
                if mcp and response.headers.get("Mcp-Session-Id"):
                    session_headers["Mcp-Session-Id"] = response.headers["Mcp-Session-Id"]
                result = decode_response(response.read().decode(), (body or {}).get("id"))
        except urllib.error.HTTPError as error:
            raise SystemExit(f"Foundry HTTP {error.code}. No automatic creation retry; inspect the receipt.") from None
        if result.get("error"):
            raise SystemExit("MCP error code: " + str(result["error"].get("code")) + ". Nothing activated in MicroSina.")
        return result

    if args.apply:
        receipt_path.write_text(json.dumps({"status": "submission_started", "toolbox": NAME}))
        created = request(f"/toolboxes/{NAME}/versions?api-version=v1", PAYLOAD)
        version = str(created["version"])
        if not version.isdigit():
            raise SystemExit("Unexpected version; inspect Foundry before retrying")
        receipt_path.write_text(json.dumps({"status": "created", "toolbox": NAME, "version": version}))
    else:
        receipt = json.loads(receipt_path.read_text())
        version = str(receipt.get("version", ""))
        if receipt.get("toolbox") != NAME or not version.isdigit():
            raise SystemExit("No confirmed version in receipt. Inspect Foundry; do not blindly repeat creation.")
    path = f"/toolboxes/{NAME}/versions/{version}/mcp?api-version=v1"
    initialized = request(path, {"jsonrpc": "2.0", "id": 1, "method": "initialize", "params": {
        "protocolVersion": "2025-03-26", "capabilities": {},
        "clientInfo": {"name": "inscope-toolbox-verification", "version": "1.0"},
    }}, mcp=True)
    session_headers["MCP-Protocol-Version"] = initialized["result"]["protocolVersion"]
    request(path, {"jsonrpc": "2.0", "method": "notifications/initialized"}, mcp=True)
    listing = request(path, {"jsonrpc": "2.0", "id": 2, "method": "tools/list", "params": {}}, mcp=True)
    names = [tool["name"] for tool in listing.get("result", {}).get("tools", [])]
    if not {"tool_search", "call_tool"}.issubset(names):
        raise SystemExit("Toolbox created but search verification incomplete. Visible tools: " + str(names))
    result = {"status": "search_tools_verified", "toolbox": NAME, "version": version,
              "endpoint": ENDPOINT + path, "tools": names,
              "microsina_changed": False}
    receipt_path.write_text(json.dumps(result, indent=2))
    print(json.dumps(result, indent=2))
    print("Return this result to Codex for agent integration and a live search test. No Azure roles or MicroSina version were changed.")


if __name__ == "__main__":
    main()

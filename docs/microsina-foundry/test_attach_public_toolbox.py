"""Offline checks for the administrative readback diagnostic."""
import copy
import json
from pathlib import Path
import runpy
import unittest

SCRIPT = runpy.run_path(str(Path(__file__).with_name("attach-public-toolbox.py")))
DIFF = SCRIPT["definition_differences"]


class DefinitionReadbackTests(unittest.TestCase):
    def test_attachment_uses_exact_documented_tool_filter(self):
        base = {"definition": {"kind": "prompt", "model": "synthetic", "tools": []}}
        expected = SCRIPT["make_payload"](base)["definition"]
        self.assertEqual(expected["tools"][0]["allowed_tools"],
                         {"tool_names": ["tool_search", "call_tool"]})
        for altered in [{"tool_names": ["tool_search"]},
                        {"tool_names": ["tool_search", "call_tool", "other"]},
                        {}, {"tool_names": ["tool_search", "call_tool"], "read_only": True}]:
            saved = copy.deepcopy(expected)
            saved["tools"][0]["allowed_tools"] = altered
            self.assertTrue(DIFF(expected, saved), "A different filter must still block activation")

    def test_equal_definition_needs_no_diagnostic(self):
        value = {"instructions": "private", "tools": [{"name": "native", "strict": False}]}
        self.assertEqual(DIFF(value, copy.deepcopy(value)), [])

    def test_added_null_is_reported_not_silently_accepted(self):
        self.assertEqual(DIFF({"type": "mcp"}, {"type": "mcp", "headers": None}), [
            {"path": "/definition/headers", "change": "added", "actual_type": "null"},
        ])

    def test_changed_instructions_and_endpoint_do_not_leak_values(self):
        before = {"instructions": "private-before", "tools": [{"server_url": "secret-before"}]}
        after = {"instructions": "private-after", "tools": [{"server_url": "secret-after"}]}
        diagnostic = DIFF(before, after)
        self.assertEqual([d["path"] for d in diagnostic], [
            "/definition/instructions", "/definition/tools/0/server_url",
        ])
        for value in ["private-before", "private-after", "secret-before", "secret-after"]:
            self.assertNotIn(value, json.dumps(diagnostic))

    def test_missing_tool_and_changed_approval_fail_comparison(self):
        before = {"tools": [{"require_approval": "always"}, {"name": "native"}]}
        after = {"tools": [{"require_approval": "never"}]}
        self.assertEqual([d["change"] for d in DIFF(before, after)], ["value", "missing"])

    def test_type_changes_and_list_order_remain_visible(self):
        self.assertTrue(DIFF({"strict": False}, {"strict": 0}))
        self.assertEqual(len(DIFF(["a", "b"], ["b", "a"])), 2)


if __name__ == "__main__":
    unittest.main()

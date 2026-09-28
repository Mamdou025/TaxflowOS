import subprocess, pathlib, gzip, base64
root=pathlib.Path(__file__).resolve().parents[1]
paths=[
'artifacts/ai-workflow-builder/src/features/assistant/ui/assistant-thread.tsx',
'artifacts/ai-workflow-builder/src/features/assistant/ui/chat-source-picker.tsx',
'artifacts/ai-workflow-builder/src/features/assistant/ui/use-assistant.tsx',
'artifacts/ai-workflow-builder/src/features/assistant/workspace/aside-thread.tsx',
'artifacts/ai-workflow-builder/src/features/assistant/workspace/workflow-run-flow.tsx',
'artifacts/ai-workflow-builder/src/features/documents/attach-workflow-source.ts',
'artifacts/ai-workflow-builder/src/features/documents/workflow-source-client.ts',
'artifacts/ai-workflow-builder/src/shared/workflow-engine/parsing/excel-types.ts',
'artifacts/ai-workflow-builder/src/shared/workflow-engine/parsing/excel-utils.ts',
'artifacts/ai-workflow-builder/src/shared/workflow-engine/runtime/workflow-runs/parse-upload.ts',
'tests/unit/chat-workbook-parsing.test.ts','e2e/source-library.spec.ts']
patch=subprocess.check_output(['git','diff','--',*paths],cwd=root)
new='artifacts/ai-workflow-builder/src/features/documents/workbook-import-dialog.tsx'
lines=(root/new).read_text(encoding='utf-8').splitlines()
patch+= ('diff --git a/'+new+' b/'+new+'\nnew file mode 100644\n--- /dev/null\n+++ b/'+new+'\n@@ -0,0 +1,'+str(len(lines))+' @@\n'+'\n'.join('+'+line for line in lines)+'\n').encode()
(root/'test-results/workbook-import-fix.patch').write_bytes(patch)
print(base64.b64encode(gzip.compress(patch)).decode())

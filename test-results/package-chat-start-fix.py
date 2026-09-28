from pathlib import Path
import zipfile, json
root = Path.cwd()
files = [
 'artifacts/ai-workflow-builder/src/features/assistant/runtime/workflow-session-request.ts',
 'artifacts/ai-workflow-builder/src/features/assistant/ui/use-session-tools.tsx',
 'artifacts/ai-workflow-builder/src/features/assistant/ui/assistant-thread.tsx',
 'tests/unit/workflow-session-request.test.ts',
]
with zipfile.ZipFile(root/'test-results/replit-unified-release.zip') as old, zipfile.ZipFile(root/'test-results/replit-chat-start-fix.zip', 'w', zipfile.ZIP_DEFLATED) as out:
 manifest = []
 for name in files:
  base = old.read('current/'+name).decode('utf-8').replace('\r\n','\n') if 'current/'+name in old.namelist() else None
  manifest.append({'path':name, 'before':base, 'after':(root/name).read_text(encoding='utf-8')})
 out.writestr('manifest.json', json.dumps(manifest))
print('Created focused correction package:', len(files), 'files')

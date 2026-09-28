from pathlib import Path
import zipfile, json, subprocess
root = Path.cwd()
files = [
 'artifacts/ai-workflow-builder/src/features/assistant/ui/use-session-tools.tsx',
 'artifacts/ai-workflow-builder/src/features/assistant/ui/assistant-thread.tsx',
 'artifacts/ai-workflow-builder/src/features/assistant/runtime/routing/tool-groups.ts',
]
with zipfile.ZipFile(root/'test-results/replit-chat-start-fix.zip') as old:
 prior = {i['path']:i['after'] for i in json.loads(old.read('manifest.json'))}
with zipfile.ZipFile(root/'test-results/replit-chat-start-v2.zip', 'w', zipfile.ZIP_DEFLATED) as out:
 items=[]
 for name in files:
  base=prior[name] if name in prior else subprocess.check_output(['git','show','HEAD:'+name]).decode('utf-8').replace('\r\n','\n')
  items.append({'path':name,'before':base,'after':(root/name).read_text(encoding='utf-8')})
 out.writestr('manifest.json',json.dumps(items))
print('Packaged three files')

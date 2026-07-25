

import { Label } from "@/shared/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/select";
import { LOGIC_CODE_MODES } from "@/shared/workflow-engine/domain/workflow/inspector-rules";

type LogicModeEditorProps = {
  disabled?: boolean;
  onChange: (value: string) => void;
  value: string;
};

export function LogicModeEditor({
  disabled,
  onChange,
  value,
}: LogicModeEditorProps) {
  return (
    <div className="space-y-2">
      <Label className="ml-1">Logic mode</Label>
      <Select disabled={disabled} onValueChange={onChange} value={value}>
        <SelectTrigger>
          <SelectValue placeholder="Logic mode" />
        </SelectTrigger>
        <SelectContent>
          {LOGIC_CODE_MODES.map((mode) => (
            <SelectItem key={mode} value={mode}>
              {mode}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

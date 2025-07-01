import * as Select from "@radix-ui/react-select";
import { ChevronDown, Check } from "lucide-react";

export default function SelectDiff({ difficultyFilter, setDifficultyFilter }) {
  return (
    <Select.Root value={difficultyFilter} onValueChange={setDifficultyFilter}>
      <Select.Trigger
        className="inline-flex items-center justify-between w-40 px-3 py-1.5 bg-gradient-to-r from-gray-900 to-cyan-900/90 border border-cyan-400/50 text-cyan-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400 transition-all duration-300"
        aria-label="Difficulty"
      >
        <Select.Value placeholder="Select difficulty" />
        <Select.Icon>
          <ChevronDown className="w-4 h-4 text-cyan-300" />
        </Select.Icon>
      </Select.Trigger>

      <Select.Portal>
        <Select.Content
          className="overflow-hidden bg-gray-900 border border-cyan-700 rounded-md shadow-lg"
        >
          <Select.Viewport className="p-1">
            <Select.Item
              value="All"
              className="flex items-center justify-between px-4 py-2 text-cyan-100 rounded hover:bg-cyan-800 cursor-pointer"
            >
              <Select.ItemText>All</Select.ItemText>
              <Select.ItemIndicator>
                <Check className="w-4 h-4 text-cyan-400" />
              </Select.ItemIndicator>
            </Select.Item>
            <Select.Item
              value="easy"
              className="flex items-center justify-between px-4 py-2 text-cyan-100 rounded hover:bg-cyan-800 cursor-pointer"
            >
              <Select.ItemText>Easy</Select.ItemText>
              <Select.ItemIndicator>
                <Check className="w-4 h-4 text-cyan-400" />
              </Select.ItemIndicator>
            </Select.Item>
            <Select.Item
              value="medium"
              className="flex items-center justify-between px-4 py-2 text-cyan-100 rounded hover:bg-cyan-800 cursor-pointer"
            >
              <Select.ItemText>Medium</Select.ItemText>
              <Select.ItemIndicator>
                <Check className="w-4 h-4 text-cyan-400" />
              </Select.ItemIndicator>
            </Select.Item>
            <Select.Item
              value="hard"
              className="flex items-center justify-between px-4 py-2 text-cyan-100 rounded hover:bg-cyan-800 cursor-pointer"
            >
              <Select.ItemText>Hard</Select.ItemText>
              <Select.ItemIndicator>
                <Check className="w-4 h-4 text-cyan-400" />
              </Select.ItemIndicator>
            </Select.Item>
          </Select.Viewport>
        </Select.Content>
      </Select.Portal>
    </Select.Root>
  );
}
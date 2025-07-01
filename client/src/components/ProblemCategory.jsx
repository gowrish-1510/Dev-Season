import * as Select from "@radix-ui/react-select";
import { ChevronDown, Check } from "lucide-react";

function ProblemCategory({ categoryFilter, setCategoryFilter, categories }) {
  return (
    <div className="w-full">
      <Select.Root value={categoryFilter} onValueChange={setCategoryFilter}>
        <Select.Trigger
          className="w-full px-3 py-1.5 bg-white/5 border border-white/20 rounded-md text-white text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/30 focus:border-cyan-500"
          aria-label="Category"
        >
          <Select.Value placeholder="Select category" />
          <Select.Icon>
            <ChevronDown className="w-4 h-4 text-cyan-300" />
          </Select.Icon>
        </Select.Trigger>

        <Select.Portal>
          <Select.Content
            className="w-full overflow-hidden bg-white/5 border border-white/20 rounded-md shadow-lg z-50"
            position="popper"
          >
            <Select.Viewport className="p-1">
              {categories.map((category) => (
                <Select.Item
                  key={category}
                  value={category}
                  className="flex items-center justify-between px-4 py-1.5 text-sm text-white rounded hover:bg-cyan-800 cursor-pointer"
                >
                  <Select.ItemText>{category}</Select.ItemText>
                  <Select.ItemIndicator>
                    <Check className="w-4 h-4 text-cyan-400" />
                  </Select.ItemIndicator>
                </Select.Item>
              ))}
            </Select.Viewport>
          </Select.Content>
        </Select.Portal>
      </Select.Root>
    </div>
  );
}

export default ProblemCategory;
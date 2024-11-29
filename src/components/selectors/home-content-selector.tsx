"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface HomeContentSelectorProps {
  value: string;
  onValueChange: (selectedValue: string) => void;
}

export function HomeContentSelector({
  value,
  onValueChange,
}: HomeContentSelectorProps) {
  return (
    <Select
      value={value}
      onValueChange={(selectedValue) => onValueChange(selectedValue)}
    >
      <SelectTrigger className="w-1/3">
        <SelectValue placeholder="Select content" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="latestTopics">Latest topics</SelectItem>
        <SelectItem value="hotTopics">Hot topics</SelectItem>
        <SelectItem value="usersWithMostComments">
          Users with most comments
        </SelectItem>
      </SelectContent>
    </Select>
  );
}

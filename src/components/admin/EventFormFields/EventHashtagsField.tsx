"use client";

import { XIcon } from "lucide-react";
import { type KeyboardEvent, useState } from "react";
import type { Control, FieldValues, Path, PathValue } from "react-hook-form";
import { Controller } from "react-hook-form";
import { Badge } from "@/components/shadcn/badge";
import { Input } from "@/components/shadcn/input";

interface EventHashtagsFieldProps<T extends FieldValues> {
  control: Control<T>;
  defaultValue?: string[] | null;
}

export function EventHashtagsField<T extends FieldValues>({
  control,
  defaultValue,
}: EventHashtagsFieldProps<T>) {
  return (
    <Controller
      name={"hashtags" as Path<T>}
      control={control}
      defaultValue={(defaultValue ?? []) as PathValue<T, Path<T>>}
      render={({ field }) => (
        <HashtagInput
          value={(field.value as string[]) ?? []}
          onChange={field.onChange}
        />
      )}
    />
  );
}

function HashtagInput({
  value,
  onChange,
}: {
  value: string[];
  onChange: (tags: string[]) => void;
}) {
  const [input, setInput] = useState("");

  const addTag = () => {
    const tag = input.trim().replace(/^#/, "");
    if (tag && !value.includes(tag)) {
      onChange([...value, tag]);
    }
    setInput("");
  };

  const removeTag = (tag: string) => {
    onChange(value.filter((t) => t !== tag));
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addTag();
    }
  };

  return (
    <div className="space-y-2">
      <span className="text-sm font-medium">ハッシュタグ</span>
      <div className="flex flex-wrap gap-2">
        {value.map((tag) => (
          <button
            key={tag}
            type="button"
            onClick={() => removeTag(tag)}
            aria-label={`ハッシュタグ ${tag} を削除`}
            className="inline-flex"
          >
            <Badge variant="secondary" className="gap-1">
              #{tag}
              <XIcon className="size-3" aria-hidden="true" />
            </Badge>
          </button>
        ))}
      </div>
      <Input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="#なしでタグを入力してEnter"
      />
    </div>
  );
}

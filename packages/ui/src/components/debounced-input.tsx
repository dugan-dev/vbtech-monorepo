"use client";

import { useEffect, useRef, useState } from "react";

import { Input } from "@workspace/ui/components/input";

export function DebouncedInput({
  value: initialValue,
  onChange,
  debounce = 500,
  ...props
}: {
  value: string | number;
  onChange: (_: string | number) => void;
  debounce?: number;
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange">) {
  const [value, setValue] = useState(initialValue);
  const onChangeRef = useRef(onChange);
  const debounceRef = useRef(debounce);

  useEffect(() => {
    onChangeRef.current = onChange;
    debounceRef.current = debounce;
  });

  useEffect(() => {
    if (value !== initialValue) {
      const timeout = setTimeout(() => {
        onChangeRef.current(value);
      }, debounceRef.current);

      return () => clearTimeout(timeout);
    }
  }, [value, initialValue]);

  return (
    <Input
      {...props}
      value={value}
      onChange={(e) => setValue(e.target.value)}
    />
  );
}

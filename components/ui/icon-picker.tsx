"use client";

import * as React from "react";
import { useState, useCallback } from "react";
import EmojiPickerReact, {
  EmojiClickData,
  Theme,
  EmojiStyle,
} from "emoji-picker-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useTheme } from "next-themes";

interface EmojiPickerProps {
  value?: string;
  onValueChange?: (emoji: string) => void;
  children?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

const EmojiPicker = React.forwardRef<HTMLButtonElement, EmojiPickerProps>(
  ({ value, onValueChange, children, open, onOpenChange }, ref) => {
    const [isOpen, setIsOpen] = useState(false);
    const { resolvedTheme } = useTheme();

    const controlledOpen = open ?? isOpen;
    const setControlledOpen = onOpenChange ?? setIsOpen;

    const handleEmojiClick = useCallback(
      (emojiData: EmojiClickData) => {
        onValueChange?.(emojiData.emoji);
        setControlledOpen(false);
      },
      [onValueChange, setControlledOpen]
    );

    const pickerTheme = resolvedTheme === "dark" ? Theme.DARK : Theme.LIGHT;

    return (
      <Popover open={controlledOpen} onOpenChange={setControlledOpen}>
        <PopoverTrigger ref={ref} asChild>
          {children}
        </PopoverTrigger>
        <PopoverContent
          className="w-auto p-0 border-none shadow-lg"
          align="start"
          sideOffset={5}>
          <EmojiPickerReact
            onEmojiClick={handleEmojiClick}
            theme={pickerTheme}
            emojiStyle={EmojiStyle.NATIVE}
            searchPlaceHolder="Search emoji..."
            lazyLoadEmojis={true}
            skinTonesDisabled={false}
            width={320}
            height={400}
          />
        </PopoverContent>
      </Popover>
    );
  }
);
EmojiPicker.displayName = "EmojiPicker";

interface EmojiProps extends React.HTMLAttributes<HTMLSpanElement> {
  emoji: string;
  size?: number | string;
}

/**
 * Simple component to render an emoji with consistent sizing
 */
const Emoji = React.forwardRef<HTMLSpanElement, EmojiProps>(
  ({ emoji, size = "1em", className, style, ...props }, ref) => {
    return (
      <span
        ref={ref}
        role="img"
        aria-label="emoji"
        className={className}
        style={{
          fontSize: typeof size === "number" ? `${size}px` : size,
          lineHeight: 1,
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          ...style,
        }}
        {...props}>
        {emoji}
      </span>
    );
  }
);
Emoji.displayName = "Emoji";

export { EmojiPicker, Emoji };

"use client";

import { Minus, Plus } from "lucide-react";

interface QuantityStepperProps {
  quantity: number;
  onChange: (next: number) => void;
  min?: number;
  max?: number;
}

export default function QuantityStepper({ quantity, onChange, min = 1, max = 99 }: QuantityStepperProps) {
  return (
    <div className="inline-flex items-center rounded-card border border-border">
      <button
        type="button"
        aria-label="Decrease quantity"
        className="p-2 text-ink/70 hover:text-ink disabled:opacity-30"
        disabled={quantity <= min}
        onClick={() => onChange(Math.max(min, quantity - 1))}
      >
        <Minus size={14} />
      </button>
      <span className="w-8 text-center text-sm tabular">{quantity}</span>
      <button
        type="button"
        aria-label="Increase quantity"
        className="p-2 text-ink/70 hover:text-ink disabled:opacity-30"
        disabled={quantity >= max}
        onClick={() => onChange(Math.min(max, quantity + 1))}
      >
        <Plus size={14} />
      </button>
    </div>
  );
}

"use client";

import { useState } from "react";
import Image from "next/image";

export default function ProductGallery({ images, name }: { images: string[]; name: string }) {
  const [active, setActive] = useState(0);

  return (
    <div className="flex gap-3">
      <div className="hidden flex-col gap-3 sm:flex">
        {images.map((img, i) => (
          <button
            key={img}
            type="button"
            onClick={() => setActive(i)}
            className={`relative h-16 w-16 overflow-hidden rounded-card border ${
              active === i ? "border-primary" : "border-border"
            }`}
          >
            <Image src={img} alt={`${name} thumbnail ${i + 1}`} fill sizes="64px" className="object-cover" />
          </button>
        ))}
      </div>
      <div className="relative aspect-square flex-1 overflow-hidden rounded-card bg-surface">
        <Image
          src={images[active]}
          alt={name}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover"
          priority
        />
      </div>
    </div>
  );
}

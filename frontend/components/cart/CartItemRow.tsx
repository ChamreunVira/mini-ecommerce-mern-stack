import Image from "next/image";
import { X } from "lucide-react";
import { CartLine } from "@/types/product";
import QuantityStepper from "@/components/ui/QuantityStepper";

interface CartItemRowProps {
  line: CartLine;
  onQuantityChange: (productId: string, quantity: number) => void;
  onRemove: (productId: string) => void;
}

export default function CartItemRow({ line, onQuantityChange, onRemove }: CartItemRowProps) {
  const { product, quantity } = line;
  const subtotal = product.price * quantity;

  return (
    <div className="grid grid-cols-[auto,1fr,auto,auto,auto,auto] items-center gap-4 border-b border-border py-4 last:border-0">
      <div className="relative h-14 w-14 overflow-hidden rounded-card bg-surface">
        <Image src={product.image} alt={product.name} fill sizes="56px" className="object-cover" />
      </div>
      <p className="text-sm font-medium text-ink">{product.name}</p>
      <span className="hidden text-sm text-ink/70 tabular sm:block">${product.price.toFixed(2)}</span>
      <QuantityStepper quantity={quantity} onChange={(q) => onQuantityChange(product.id, q)} />
      <span className="text-sm font-semibold text-ink tabular">${subtotal.toFixed(2)}</span>
      <button
        type="button"
        aria-label={`Remove ${product.name} from cart`}
        onClick={() => onRemove(product.id)}
        className="text-ink/40 hover:text-sale"
      >
        <X size={16} />
      </button>
    </div>
  );
}

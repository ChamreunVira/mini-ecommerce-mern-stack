import Link from "next/link";

interface OrderSummaryProps {
  subtotal: number;
  shipping: number;
  taxRate: number;
}

export default function OrderSummary({ subtotal, shipping, taxRate }: OrderSummaryProps) {
  const tax = subtotal * taxRate;
  const total = subtotal + shipping + tax;

  return (
    <div className="h-fit w-full shrink-0 rounded-card border border-border p-5 md:w-72">
      <h2 className="text-base font-semibold text-ink">Order Summary</h2>
      <dl className="mt-4 space-y-2.5 text-sm">
        <div className="flex justify-between text-ink/60">
          <dt>Subtotal</dt>
          <dd className="tabular">${subtotal.toFixed(2)}</dd>
        </div>
        <div className="flex justify-between text-ink/60">
          <dt>Shipping</dt>
          <dd className="tabular">{shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}</dd>
        </div>
        <div className="flex justify-between text-ink/60">
          <dt>Tax ({Math.round(taxRate * 100)}%)</dt>
          <dd className="tabular">${tax.toFixed(2)}</dd>
        </div>
        <div className="flex justify-between border-t border-border pt-2.5 text-base font-semibold text-ink">
          <dt>Total</dt>
          <dd className="tabular">${total.toFixed(2)}</dd>
        </div>
      </dl>
      <Link
        href="/checkout"
        className="mt-5 block rounded-card bg-primary py-3 text-center text-sm font-medium text-white hover:bg-primary-hover"
      >
        Proceed to Checkout
      </Link>
      <p className="mt-3 text-center text-xs text-ink/40">Secure checkout</p>
    </div>
  );
}

import Link from "next/link";
import Image from "next/image";

export default function Hero() {
  return (
    <section className="overflow-hidden rounded-card bg-primary-light">
      <div className="grid items-center gap-6 px-6 py-10 sm:px-10 sm:py-14 md:grid-cols-2">
        <div>
          <p className="text-sm font-medium text-primary">Summer Collection</p>
          <h1 className="mt-2 text-3xl font-bold text-ink sm:text-4xl">New Arrivals</h1>
          <p className="mt-3 max-w-sm text-ink/60">
            Discover the latest trends of the season, curated from independent sellers across Marlo.
          </p>
          <Link
            href="/category/all"
            className="mt-6 inline-block rounded-card bg-primary px-6 py-3 text-sm font-medium text-white hover:bg-primary-hover"
          >
            Shop Now
          </Link>
        </div>
        <div className="relative aspect-[4/3] w-full overflow-hidden rounded-card">
          <Image
            src="https://images.unsplash.com/photo-1483985988355-763728e1935b?w=900&h=700&fit=crop"
            alt="Summer collection model wearing new-arrival apparel"
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover"
            priority
          />
        </div>
      </div>
    </section>
  );
}

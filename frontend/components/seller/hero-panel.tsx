"use client"

export function SellerHero({ stepIndex = 0 }: { stepIndex?: number }) {
  return (
    <div className="rounded-[20px] border border-border bg-secondary/20 p-6 sm:p-8 md:p-10">
      <h1 className="text-balance text-3xl font-extrabold leading-tight sm:text-4xl">
        <span className="bg-secondary bg-clip-text text-transparent">
          Become
        </span>{" "}
        <span className="text-secondary">A</span>{" "}
        <span className="text-primary">Seller</span>
      </h1>

      {/* PNG illustration */}
      <div className="mt-6 overflow-hidden rounded-[16px] bg-failure] p-6 sm:p-8">
        <img 
          src="/become-seller.png" 
          alt="Illustration: hand pressing button"
          className="h-auto w-full"
        />
      </div>

      <p className="mt-8 text-lg font-medium text-[var(--brand-primary)]">
        Join Wafferli and start growing your business today
      </p>
    </div>
  )
}
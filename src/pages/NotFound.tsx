import { BtnLink, Curve } from "@/components/ui";
import { ProduceArt } from "@/components/ProduceArt";

export default function NotFound() {
  return (
    <section className="relative isolate flex min-h-[80vh] items-center overflow-hidden bg-forest-3">
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-[radial-gradient(70%_60%_at_30%_20%,rgba(199,227,107,0.16),transparent_70%)]"
      />
      <ProduceArt
        name="broccoli"
        aria-hidden="true"
        className="animate-float-slow pointer-events-none absolute right-[8%] top-24 hidden w-48 opacity-60 lg:block"
      />
      <ProduceArt
        name="carrot"
        aria-hidden="true"
        className="animate-float pointer-events-none absolute bottom-16 left-[10%] hidden w-36 opacity-50 lg:block"
      />

      <div className="relative mx-auto max-w-3xl px-5 py-32 text-center sm:px-8">
        <p className="font-display text-[clamp(6rem,20vw,14rem)] font-semibold leading-none text-cream/10">
          404
        </p>
        <h1 className="-mt-6 font-display text-[clamp(2rem,5vw,3.4rem)] font-semibold leading-tight text-cream">
          This stall has <span className="font-script text-lime">packed up</span>
        </h1>
        <p className="mx-auto mt-5 max-w-md text-[15px] leading-relaxed text-cream/70">
          The page you're looking for isn't on the map. Try the market directory or the produce guide
          instead.
        </p>
        <div className="mt-9 flex flex-wrap justify-center gap-4">
          <BtnLink href="#/directory" variant="light" size="lg" withArrow>
            Market Directory
          </BtnLink>
          <BtnLink
            href="#/"
            variant="outline"
            size="lg"
            className="border-cream/35 text-cream hover:border-lime hover:bg-lime/12"
          >
            Back home
          </BtnLink>
        </div>
      </div>
      <Curve fill="var(--color-cream)" className="bottom-0" height={110} />
    </section>
  );
}

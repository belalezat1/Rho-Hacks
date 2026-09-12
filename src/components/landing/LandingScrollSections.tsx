import Link from "next/link";
import { ParticleField } from "@/components/landing/ParticleField";
import { PartnerMarquee } from "@/components/landing/PartnerMarquee";

/** Below-hero landing: partners + product entry points only. No fluff. */
export function LandingScrollSections() {
  return (
    <div className="relative z-10 -mt-[1px] bg-white text-ink">
      <section
        id="integrations"
        className="reveal relative overflow-hidden border-t border-hairline px-6 py-20 md:px-10 md:py-24"
      >
        <ParticleField className="opacity-80" density={1} />
        <div className="relative z-10 mx-auto max-w-5xl">
          <p className="mx-auto w-fit rounded-full border border-hairline px-5 py-2 text-center text-[13px] font-medium tracking-wide text-muted md:text-[14px]">
            Integration using companies such as
          </p>
          <div className="mt-12">
            <PartnerMarquee />
          </div>
        </div>
      </section>

      <section id="how" className="reveal px-6 pb-24 md:px-10">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-center text-3xl font-semibold tracking-tight text-ink md:text-4xl">
            Open Pilot
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-center text-[17px] leading-relaxed text-muted">
            Talk to your books, review spend context, and ship a brief. That is
            the whole product.
          </p>

          <div className="mt-12 grid gap-4 sm:grid-cols-3">
            <EntryCard
              href="/talk"
              title="Talk"
              body="Ask about cash, anomalies, and spend. Get answers from Rho and Tavily."
              cta="Start briefing"
              primary
            />
            <EntryCard
              href="/spend-context"
              title="Spend"
              body="See what you pay next to cited public market ranges."
              cta="Open spend"
            />
            <EntryCard
              href="/briefs"
              title="Briefs"
              body="Assemble the weekly pack and publish to Stan."
              cta="Open Brief Studio"
            />
          </div>
        </div>
      </section>
    </div>
  );
}

function EntryCard({
  href,
  title,
  body,
  cta,
  primary,
}: {
  href: string;
  title: string;
  body: string;
  cta: string;
  primary?: boolean;
}) {
  return (
    <div className="flex flex-col rounded-2xl bg-[#f3f4f4] p-7 md:p-8">
      <h3 className="text-2xl font-semibold tracking-tight text-ink">{title}</h3>
      <p className="mt-3 flex-1 text-[16px] leading-relaxed text-muted">{body}</p>
      <Link
        href={href}
        className={`btn-lift mt-8 inline-flex justify-center px-5 py-3.5 text-[16px] font-medium ${
          primary ? "btn-primary" : "btn-dark"
        }`}
      >
        {cta}
      </Link>
    </div>
  );
}

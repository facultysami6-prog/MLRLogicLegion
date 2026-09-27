import { SITE } from "@/lib/data";

/* Faithful port of the reference footer (wavy two-tone top, brand block,
   Explore / Contact info / Instagram posts columns) onto the site's own
   dark-brown / red / orange palette. */
const FOOTER_BG = "#2E1B0E";
const RED = "#A30824";
const OFF_WHITE = "#E9ECE8";

const EXPLORE = [
  { label: "Home", href: "#/" },
  { label: "Market Directory", href: "#/directory" },
  { label: "About", href: "#/about" },
  { label: "Contact", href: "#/contact" },
  { label: "Saved", href: "#/saved" },
];

const SOCIALS = [
  { short: "X", label: "Twitter", href: "https://x.com" },
  { short: "f", label: "Facebook", href: "https://facebook.com" },
  { short: "ig", label: "Instagram", href: "https://instagram.com" },
  { short: "▶", label: "YouTube", href: "https://youtube.com" },
];

const GRAM = [
  "https://images.pexels.com/photos/30893271/pexels-photo-30893271.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=300&w=300",
  "https://images.pexels.com/photos/3252766/pexels-photo-3252766.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=300&w=300",
  "https://images.pexels.com/photos/33554298/pexels-photo-33554298.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=300&w=300",
  "https://images.pexels.com/photos/4589144/pexels-photo-4589144.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=300&w=300",
  "https://images.pexels.com/photos/12944639/pexels-photo-12944639.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=300&w=300",
  "https://images.pexels.com/photos/30666729/pexels-photo-30666729.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=300&w=300",
];

/* Same two-path wave as the reference: a red band on top, the dark-brown
   footer mass rising over it underneath. viewBox 0 0 1440 120, 110px tall. */
function FooterWave() {
  return (
    <svg
      viewBox="0 0 1440 120"
      preserveAspectRatio="none"
      aria-hidden="true"
      className="block h-[110px] w-full -mb-px"
    >
      <path fill={RED} d="M0 20C200 0 420 70 720 34S1200-6 1440 50V120H0z" />
      <path fill={FOOTER_BG} d="M0 78C260 24 480 30 720 62s520 40 720-30V120H0z" />
    </svg>
  );
}

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer style={{ marginTop: 0 }}>
      <div style={{ height: 96, background: "#fbf6ef" }} />
      <FooterWave />

      <div style={{ backgroundColor: FOOTER_BG, color: OFF_WHITE }} className="pt-[30px]">
        <div className="mx-auto max-w-[1400px] px-6 sm:px-10">
          <div className="grid gap-12 pb-[60px] md:grid-cols-2 lg:grid-cols-[1.2fr_1fr_1.2fr_1.2fr]">
            {/* ---- brand ---- */}
            <div>
              <div className="font-display text-[34px] font-semibold leading-none text-white">
                freshfind
                <small
                  className="mt-2 block font-sans text-[13px] font-medium normal-case"
                  style={{ color: RED }}
                >
                  local farmers markets
                </small>
              </div>

              <p className="mt-[18px] max-w-[320px]" style={{ color: `${OFF_WHITE}b3` }}>
                Discover farmers markets, local growers and seasonal produce around you.
              </p>

              <div className="mt-8 flex gap-4">
                {SOCIALS.map((s) => (
                  <a
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={s.label}
                    className="grid h-[54px] w-[54px] shrink-0 place-items-center rounded-full text-[15px] font-extrabold no-underline transition-transform duration-300 hover:-translate-y-1"
                    style={{ backgroundColor: RED, color: FOOTER_BG }}
                  >
                    <span aria-hidden="true">{s.short}</span>
                  </a>
                ))}
              </div>
            </div>

            {/* ---- explore ---- */}
            <nav aria-label="Explore">
              <h4 className="font-display text-[30px] font-semibold" style={{ color: RED, marginBottom: 26 }}>
                Explore
              </h4>
              <ul className="grid list-none gap-[14px] p-0">
                {EXPLORE.map((l) => (
                  <li key={l.label}>
                    <a
                      href={l.href}
                      className="flex items-center gap-2.5 font-bold text-white no-underline transition-colors duration-300 hover:text-[#A30824]"
                    >
                      <span aria-hidden="true" style={{ color: RED }}>
                        ›
                      </span>
                      {l.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>

            {/* ---- contact info ---- */}
            <div>
              <h4 className="font-display text-[30px] font-semibold" style={{ color: RED, marginBottom: 26 }}>
                Contact info
              </h4>
              <div className="grid gap-[22px]">
                <div>
                  <b className="block" style={{ color: RED }}>
                    Our location:
                  </b>
                  {SITE.addressLine1}
                  <br />
                  {SITE.addressLine2}
                </div>
                <div>
                  <b className="block" style={{ color: RED }}>
                    Phones:
                  </b>
                  {SITE.phone}
                  <br />
                  {SITE.phone2}
                </div>
              </div>
            </div>

            {/* ---- instagram posts ---- */}
            <div>
              <h4 className="font-display text-[30px] font-semibold" style={{ color: RED, marginBottom: 26 }}>
                Instagram posts
              </h4>
              <div className="grid grid-cols-3 gap-2">
                {GRAM.map((src, i) => (
                  <a
                    key={i}
                    href="https://instagram.com"
                    target="_blank"
                    rel="noreferrer"
                    aria-label="Instagram post"
                    className="block aspect-square overflow-hidden rounded-[10px]"
                  >
                    <img src={src} alt="" loading="lazy" className="h-full w-full object-cover" />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ---- bottom bar ---- */}
        <div className="border-t border-white/10 py-[18px] text-center text-[14px] opacity-70">
          © {year} FreshFind. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

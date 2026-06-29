// PROTOTYPE greybox — Phase 2a composition (frontend-design-bar). 3 archetype phân kỳ
// cho stack DƯỚI hero (how-it-works → AVS → operators → CTA → footer). Block-level,
// KHÔNG content/style thật. User chọn 1 lane bằng mắt (desktop + mobile reflow).
// Route: /dev/helix-greybox. Xoá folder sau khi chốt lane.
import "./greybox.css";

type GBProps = {
  l: string;
  h?: "sm" | "md" | "lg";
  focal?: boolean;
  cls?: string;
  i?: string;
};

function GB({ l, h = "md", focal = false, cls = "", i }: GBProps) {
  return (
    <div className={`gb h-${h} ${focal ? "gb--focal" : ""} ${cls}`} data-i={i}>
      <span>{l}</span>
    </div>
  );
}

export default function HelixGreybox() {
  return (
    <div className="helix-gbx">
      {/* ─────────────── Variant A — Threaded spine ─────────────── */}
      <section className="gbx-variant" id="vA">
        <h2 className="gbx-h">Variant A — Threaded spine</h2>
        <p className="gbx-sub">
          Một &quot;strand&quot; chạy dọc nối mọi section (through-line =
          concept &quot;một sợi luồn qua nhiều mạng&quot;). How-it-works = 3
          node nằm trên spine, lệch trái/phải (zig-zag). AVS broken grid,
          operators proof, CTA = nơi strand thắt nút. Trang đọc như MỘT tài
          liệu, không phải đống band xếp chồng.
        </p>
        <div className="vA">
          <div className="vA__spine" aria-hidden="true" />
          <div className="vA__node vA__row">
            <GB l="How · 01 Deposit" />
          </div>
          <div className="vA__node vA__row vA__row--r">
            <GB l="How · 02 Restake" />
          </div>
          <div className="vA__node vA__row">
            <GB l="How · 03 Secure AVS" />
          </div>
          <GB l="AVS / ecosystem — broken grid" h="lg" />
          <GB l="Operators — proof split" />
          <GB l="CTA band — strand knot (focal)" focal />
          <GB l="Footer" h="sm" />
        </div>
      </section>

      {/* ─────────────── Variant B — Swiss ledger grid ─────────────── */}
      <section className="gbx-variant" id="vB">
        <h2 className="gbx-h">Variant B — Swiss ledger grid</h2>
        <p className="gbx-sub">
          Lưới 12-col HIỆN RÕ + index số to + hairline rule — nối tiếp aesthetic
          ledger/blueprint của hero. Bản thân lưới là ornament. Cột không đều,
          item span khác nhau. Đọc kỹ thuật, &quot;drafted&quot;, đúng gu
          Polygon.
        </p>
        <div className="vB">
          <GB l="How · Deposit" h="lg" cls="col-4 vB__idx" i="01" />
          <GB l="How · Restake" h="lg" cls="col-4 vB__idx" i="02" />
          <GB l="How · Secure AVS" h="lg" cls="col-4 vB__idx" i="03" />
          <GB l="AVS net" cls="col-2" />
          <GB l="AVS net" cls="col-2" />
          <GB l="AVS net" cls="col-2" />
          <GB l="AVS net" cls="col-2" />
          <GB l="AVS net" cls="col-2" />
          <GB l="AVS net" cls="col-2" />
          <GB l="Operators — data rows" h="lg" cls="col-8" />
          <GB l="Operator stat (focal)" h="lg" focal cls="col-4" />
          <GB l="CTA band" cls="col-12" focal />
          <GB l="Footer — link columns" h="sm" cls="col-12" />
        </div>
      </section>

      {/* ─────────────── Variant C — Full-bleed alternating ─────────────── */}
      <section className="gbx-variant gbx-variant--c" id="vC">
        <h2 className="gbx-h">Variant C — Full-bleed alternating</h2>
        <p className="gbx-sub">
          Tension contained ↔ released. How-it-works inset (chứa), AVS =
          full-bleed horizontal-scroll band cạnh-tới-cạnh (rhythm break),
          operators inset asymmetric (stat focal to + list), CTA full-bleed
          field echo lại shard. Cinematic, nhịp phá — hợp restraint &quot;hero
          loud, dưới im nhưng có 1 nhịp mạnh&quot;.
        </p>
        <div className="vC">
          <div className="vC__inset">
            <GB l="How-it-works — 3 steps inset" h="lg" />
          </div>
          <div className="vC__bleed">
            <p className="vC__bleedl">
              AVS — full-bleed horizontal-scroll band →
            </p>
            <div className="vC__hscroll">
              {Array.from({ length: 8 }).map((_, i) => (
                <GB key={i} l={`net ${i + 1}`} />
              ))}
            </div>
          </div>
          <div className="vC__inset vC__split">
            <GB l="Operators — big stat (focal)" h="lg" focal />
            <GB l="proof list" h="lg" />
          </div>
          <div className="vC__bleed">
            <div className="vC__inset">
              <GB l="CTA — full-bleed field, shard echo (focal)" h="lg" focal />
            </div>
          </div>
          <div className="vC__inset">
            <GB l="Footer" h="sm" />
          </div>
        </div>
      </section>
    </div>
  );
}

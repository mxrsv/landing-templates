// PROTOTYPE — throwaway. Helix focal options (Focal track). So sánh các geometry
// iridescent glass để user chọn focal cho hero. WebGL — MỞ TRONG CHROME (headless
// không render). Cùng material/ánh sáng, chỉ khác hình. Run: `PORT=3000 pnpm dev`
// (apps/docs) → /dev/helix-focal-options. Xoá folder sau khi chốt focal.
import "../helix-hero/helix-tokens.css";
import "./options.css";
import { IridescentObject, type FocalKind } from "./iridescent-object";

const OPTIONS: { kind: FocalKind; name: string; note: string }[] = [
  { kind: "octahedron", name: "Octahedron", note: "gem / kim cương (Polygon)" },
  { kind: "icosahedron", name: "Icosahedron", note: "faceted ball" },
  { kind: "dodecahedron", name: "Dodecahedron", note: "12 mặt, tròn hơn" },
  { kind: "distorted", name: "Distorted ico", note: "tinh thể hữu cơ, méo" },
  { kind: "shards", name: "Shards", note: "cụm đa-diện bay" },
  { kind: "torusknot", name: "Torus-knot", note: "bản cũ — so sánh" },
];

export default function HelixFocalOptions() {
  return (
    <div className="helix" data-theme="helix" id="top">
      <div className="hx-grid" aria-hidden="true" />
      <div className="hxo-wrap">
        <header className="hxo-head">
          <span className="hx-tag">
            <span>Focal track</span>
          </span>
          <h1 className="hx-h2">Chọn focal cho Helix hero</h1>
          <p className="hx-body">
            Cùng chất kính iridescent + ánh sáng, chỉ khác hình. Xoay chậm. Mở
            trong Chrome (WebGL), soi rồi báo mình số bạn chọn.
          </p>
        </header>

        <div className="hxo-grid">
          {OPTIONS.map((o, i) => (
            <article key={o.kind} className="hxo-cell">
              <div className="hxo-stage">
                <IridescentObject kind={o.kind} />
              </div>
              <div className="hxo-label">
                <span className="hxo-idx">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="hxo-name">{o.name}</span>
                <span className="hxo-note">{o.note}</span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}

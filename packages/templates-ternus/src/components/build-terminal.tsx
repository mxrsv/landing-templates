"use client";

import { Fragment, useState } from "react";
import { Mark } from "./mark";

/** A syntax token: `c` carries a color class (c/p/k/s/o/d), plain text otherwise. */
interface Token {
  c?: "c" | "p" | "k" | "s" | "o" | "d";
  t: string;
}

interface Pane {
  id: "rpc" | "deploy" | "wallet";
  /** Visible tab label — note `rpc` shows as "network" (matches demo v20). */
  label: string;
  lines: Token[][];
}

const PANES: Pane[] = [
  {
    id: "rpc",
    label: "network",
    lines: [
      [{ c: "c", t: "# Ternus testnet — add to foundry.toml" }],
      [{ c: "k", t: "[rpc_endpoints]" }],
      [
        { c: "d", t: "ternus" },
        { t: " " },
        { c: "o", t: "=" },
        { t: " " },
        { c: "s", t: '"https://rpc.testnet.ternus.xyz"' },
      ],
      [],
      [
        { c: "c", t: "# chain id " },
        { c: "p", t: "9400" },
      ],
      [
        { c: "c", t: "# currency " },
        { c: "d", t: "ETH" },
      ],
      [
        { c: "c", t: "# explorer " },
        { c: "s", t: "https://scan.testnet.ternus.xyz" },
      ],
    ],
  },
  {
    id: "deploy",
    label: "deploy",
    lines: [
      [{ c: "c", t: "# deploy with foundry — same as mainnet" }],
      [
        { c: "p", t: "$" },
        { t: " " },
        { c: "k", t: "forge" },
        { t: " create " },
        { c: "d", t: "src/Token.sol:Token" },
        { t: " \\" },
      ],
      [
        { t: "  " },
        { c: "o", t: "--rpc-url" },
        { t: " " },
        { c: "d", t: "ternus" },
        { t: " \\" },
      ],
      [
        { t: "  " },
        { c: "o", t: "--private-key" },
        { t: " " },
        { c: "d", t: "$PK" },
        { t: " \\" },
      ],
      [{ t: "  " }, { c: "o", t: "--broadcast" }],
      [],
      [{ c: "c", t: "[⠊] Compiling... no files changed" }],
      [{ c: "s", t: "Deployer:" }, { t: " 0x9f3c…a21b" }],
      [{ c: "s", t: "Deployed:" }, { t: " 0x4eD8…77Fc" }],
      [{ c: "o", t: "✓ settled to Ethereum L1 in 1.2s" }],
    ],
  },
  {
    id: "wallet",
    label: "wallet",
    lines: [
      [{ c: "c", t: "// add Ternus to any EVM wallet" }],
      [
        { c: "k", t: "await" },
        { t: " " },
        { c: "d", t: "window" },
        { t: ".ethereum.request({ method:" },
      ],
      [{ c: "s", t: '"wallet_addEthereumChain"' }, { t: ", params: [{" }],
      [
        { t: "  chainId: " },
        { c: "s", t: '"0x24b8"' },
        { t: " " },
        { c: "c", t: "// 9400" },
      ],
      [{ t: "  chainName: " }, { c: "s", t: '"Ternus Testnet"' }, { t: "," }],
      [
        { t: "  rpcUrls: [" },
        { c: "s", t: '"https://rpc.testnet.ternus.xyz"' },
        { t: "]," },
      ],
      [
        { t: "  nativeCurrency: { name: " },
        { c: "s", t: '"Ether"' },
        { t: ", symbol: " },
        { c: "s", t: '"ETH"' },
        { t: ", decimals: " },
        { c: "p", t: "18" },
        { t: " } }] });" },
      ],
    ],
  },
];

const STEPS: { n: string; title: string; desc: string }[] = [
  { n: "01", title: "Add the network", desc: "One RPC URL + chain ID." },
  { n: "02", title: "Deploy your contract", desc: "Same Solidity, unchanged." },
  { n: "03", title: "Go live", desc: "Verified, indexed, settled to L1." },
];

const paneText = (pane: Pane): string =>
  pane.lines.map((line) => line.map((tok) => tok.t).join("")).join("\n");

/**
 * "Build" section — a dev terminal with three tabs (network / deploy / wallet)
 * and a copy button that lifts the active pane's text to the clipboard.
 */
export function BuildTerminal() {
  const [tab, setTab] = useState<Pane["id"]>("rpc");
  const [copyLabel, setCopyLabel] = useState("copy");

  const handleCopy = async () => {
    const pane = PANES.find((p) => p.id === tab);
    if (!pane) return;
    try {
      await navigator.clipboard.writeText(paneText(pane));
      setCopyLabel("copied ✓");
      window.setTimeout(() => setCopyLabel("copy"), 1400);
    } catch {
      setCopyLabel("select & ⌘C");
      window.setTimeout(() => setCopyLabel("copy"), 1600);
    }
  };

  return (
    <section id="build">
      <div className="wrap">
        <div className="split">
          <div>
            <div className="eyebrow">
              <Mark /> Build
              <span className="idx">for developers</span>
            </div>
            <h2>
              Point your RPC at Ternus,{" "}
              <span className="ac">ship in minutes</span>.
            </h2>
            <p className="lead">
              Fully EVM-equivalent. Your existing Foundry / Hardhat workflow
              just works — no new SDK, no rewrite. Three steps, same as mainnet.
            </p>
            <div className="utils" style={{ borderTop: "none", marginTop: 26 }}>
              {STEPS.map((step) => (
                <div className="util" key={step.n}>
                  <span
                    style={{
                      font: "500 13px var(--tn-mono)",
                      color: "var(--cy)",
                    }}
                  >
                    {step.n}
                  </span>
                  <div>
                    <div className="ut">{step.title}</div>
                    <div className="ud">{step.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <div className="term">
              <div className="term-bar">
                <span className="term-dot" />
                <span className="term-dot" />
                <span className="term-dot" />
                <div className="term-tabs">
                  {PANES.map((pane) => (
                    <button
                      className={`term-tab ${tab === pane.id ? "on" : ""}`.trim()}
                      type="button"
                      key={pane.id}
                      onClick={() => setTab(pane.id)}
                    >
                      {pane.label}
                    </button>
                  ))}
                </div>
                <button
                  className="term-copy"
                  type="button"
                  onClick={handleCopy}
                >
                  {copyLabel}
                </button>
              </div>
              <div className="term-body">
                {PANES.map((pane) => (
                  <div
                    className={`term-pane ${tab === pane.id ? "on" : ""}`.trim()}
                    key={pane.id}
                  >
                    {pane.lines.map((line, li) => (
                      // biome-ignore lint/suspicious/noArrayIndexKey: static code lines
                      <Fragment key={li}>
                        {li > 0 && "\n"}
                        {line.map((tok, ti) =>
                          tok.c ? (
                            // biome-ignore lint/suspicious/noArrayIndexKey: static tokens
                            <span className={tok.c} key={ti}>
                              {tok.t}
                            </span>
                          ) : (
                            // biome-ignore lint/suspicious/noArrayIndexKey: static tokens
                            <Fragment key={ti}>{tok.t}</Fragment>
                          ),
                        )}
                      </Fragment>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

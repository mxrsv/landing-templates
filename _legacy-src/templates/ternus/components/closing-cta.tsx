export function ClosingCta() {
  return (
    <section id="start">
      <div className="wrap">
        <div className="eyebrow">Get started</div>
        <h2>
          Deploy your first contract on <span className="ac">Ternus</span>.
        </h2>
        <p className="lead" style={{ textAlign: "center" }}>
          Same Solidity, same tooling — point your RPC at Ternus testnet and
          ship in minutes.
        </p>
        <div className="cta">
          <button className="btn btn-primary" type="button">
            Start building
          </button>
          <button className="btn btn-ghost" type="button">
            Add Ternus to wallet
          </button>
        </div>
      </div>
    </section>
  );
}

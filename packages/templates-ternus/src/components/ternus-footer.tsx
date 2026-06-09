import { Mark } from "./mark";

export function TernusFooter() {
  return (
    <footer className="footer">
      <div className="brand">
        <Mark />
        Ternus
      </div>
      <div>
        <a href="#how">How it works</a>
        <a href="#build">Build</a>
        <a href="#token">Token</a>
        <a href="#">GitHub</a>
        <a href="#">Discord</a>
      </div>
    </footer>
  );
}

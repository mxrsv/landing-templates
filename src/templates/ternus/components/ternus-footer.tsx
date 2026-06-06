import { Mark } from "./mark";

export function TernusFooter() {
  return (
    <footer className="footer">
      <div className="brand">
        <Mark />
        Ternus
      </div>
      <div>
        <a href="#how">Technology</a>
        <a href="#token">Token</a>
        <a href="#start">Docs</a>
        <a href="#start">GitHub</a>
        <a href="#start">Discord</a>
      </div>
    </footer>
  );
}

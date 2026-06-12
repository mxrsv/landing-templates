import { SiteNav } from "../../components/shell/site-nav";

/** Shell gallery: top nav neutral chrome. Route `/preview/*` nằm ngoài group này. */
export default function ShellLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <SiteNav />
      {children}
    </>
  );
}

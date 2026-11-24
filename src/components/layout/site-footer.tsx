import Link from "next/link";

const links = [
  { href: "/about", label: "About" },
  { href: "/credits", label: "Photo credits" },
  { href: "/privacy", label: "Privacy" },
];

export function SiteFooter() {
  return (
    <footer className="border-line bg-sand/50 mt-16 border-t">
      <div className="text-ink-muted mx-auto flex w-full max-w-7xl flex-col gap-4 px-4 py-10 text-sm sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
        <p>
          <span className="font-display text-ink text-base font-semibold">CookBook</span> · Original
          recipes, credited photography.
        </p>
        <nav aria-label="Footer">
          <ul className="flex flex-wrap gap-x-6 gap-y-2">
            {links.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="hover:text-ink underline-offset-4 hover:underline"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </footer>
  );
}

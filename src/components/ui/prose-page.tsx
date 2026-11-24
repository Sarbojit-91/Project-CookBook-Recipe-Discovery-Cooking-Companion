import { Container } from "./container";

/** Simple readable layout for text pages. */
export function ProsePage({
  title,
  intro,
  children,
}: {
  title: string;
  intro?: string;
  children: React.ReactNode;
}) {
  return (
    <Container className="max-w-3xl py-10 sm:py-14">
      <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">{title}</h1>
      {intro && <p className="text-ink-muted mt-3 text-lg">{intro}</p>}
      <div className="[&_a]:text-terracotta-700 mt-8 flex flex-col gap-5 text-lg leading-relaxed [&_a]:font-medium [&_a]:underline [&_h2]:mt-6 [&_h2]:text-2xl [&_h2]:font-semibold [&_li]:ml-5 [&_ul]:flex [&_ul]:list-disc [&_ul]:flex-col [&_ul]:gap-2">
        {children}
      </div>
    </Container>
  );
}

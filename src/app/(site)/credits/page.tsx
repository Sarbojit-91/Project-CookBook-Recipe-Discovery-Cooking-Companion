import type { Metadata } from "next";
import Link from "next/link";
import { ProsePage } from "@/components/ui/prose-page";
import { getRecipeImage, recipes } from "@/lib/recipes/catalog";
import { capitalize } from "@/lib/text";

export const metadata: Metadata = {
  title: "Photo credits",
  description: "Credits for every photo used on CookBook.",
};

const LICENSE_URLS: Record<string, string> = {
  unsplash: "https://unsplash.com/license",
  pexels: "https://www.pexels.com/license/",
};

export default function CreditsPage() {
  const credited = recipes.flatMap((r) => {
    const image = getRecipeImage(r);
    return image ? [{ recipe: r, image }] : [];
  });
  return (
    <ProsePage
      title="Photo credits"
      intro="Thank you to the photographers whose work appears on CookBook."
    >
      {credited.length === 0 ? (
        <p>
          We haven’t added any photos yet. Each recipe shows an illustration until a properly
          licensed photo is chosen, and every photographer will be credited here.
        </p>
      ) : (
        <ul>
          {credited.map(({ recipe, image }) => (
            <li key={recipe.slug}>
              <Link href={`/recipes/${recipe.slug}`}>{recipe.title}</Link> — photo by{" "}
              <a href={image.credit.sourceUrl} rel="noopener noreferrer" target="_blank">
                {image.credit.photographer}
              </a>
              {LICENSE_URLS[image.credit.license] ? (
                <>
                  {" "}
                  under the{" "}
                  <a
                    href={LICENSE_URLS[image.credit.license]}
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    {capitalize(image.credit.license)} License
                  </a>
                </>
              ) : (
                " (original photo)"
              )}
            </li>
          ))}
        </ul>
      )}
      <h2>Fonts and icons</h2>
      <p>
        Headings use Fraunces and text uses Inter, both under the SIL Open Font License. Icons are
        from Lucide (ISC License).
      </p>
    </ProsePage>
  );
}

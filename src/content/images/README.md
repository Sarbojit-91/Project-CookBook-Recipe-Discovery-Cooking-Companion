# Recipe photos

Put source photos here, then run `npm run images`. Commit the source photo, the generated files in
`public/images/recipes/` and `src/content/images.generated.json`.

## Before adding a photo

- **Licence:** only Unsplash or Pexels photos (downloaded by hand from the photo page, not through
  their APIs), or your own photos. Never a photo just because it is publicly visible.
- **Content:** no identifiable people, and no visible brand logos or packaging.
- **Accuracy:** the photo must show the dish (or a very close match) as the recipe makes it.
- **File:** at least 1600 px wide, landscape (about 4:3 or 3:2), named after the recipe slug, for
  example `red-lentil-dal.jpg`.

## Then, in the recipe file

```ts
image: {
  file: "red-lentil-dal.jpg",
  alt: "A bowl of golden red lentil dal topped with coriander, beside a stack of chapatis",
  credit: {
    photographer: "Photographer's name as shown on the photo page",
    sourceUrl: "https://unsplash.com/photos/…",
    license: "unsplash",
  },
},
```

The credit is shown on the recipe page and on `/credits`.

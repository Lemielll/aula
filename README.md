# Aula

A React app with browser-based Solid-OIDC authentication and a simple media
dashboard.

## Run locally

```sh
npm install
npm run dev
```

The login form defaults to the SolidCommunity provider at
`https://solidcommunity.net`. Users can change the provider URL if they use a
different Solid identity provider. The app redirects to the selected provider
and handles the OIDC callback at the app root.

No client secret or backend auth server is needed. The Solid authentication
session is managed by `@inrupt/solid-client-authn-browser` in the browser.

After sign-in, the dashboard shows a sample watch-next list with local search,
sorting, and a collection view. The sample titles are UI placeholders; they are
not yet read from or saved to the user's Solid Pod.

## Code layout

- `src/hooks/useSolidAuth.js` owns Solid OIDC session restore, sign-in, and sign-out.
- `src/components/` contains the sign-in, dashboard, media card, icons, and brand components.
- `src/data/mediaItems.js` contains the sample dashboard entries.
- Styling uses Tailwind CSS v4 utilities. `src/styles.css` only imports Tailwind, and
  `vite.config.js` enables the Tailwind Vite plugin.

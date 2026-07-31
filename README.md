# Mela — Mobile (React Native / Expo)

Mobile client for the MELA Pakistani-clothing search engine. Talks to the
existing FastAPI backend (`/search`, `/search/new-arrivals`, `/brands`,
`/categories`) — no separate mobile backend needed.

## Stack

- **Expo SDK 52** + **expo-router** (file-based routing, tabs navigation)
- **TypeScript**
- **expo-image** for cached/perf-friendly product images
- Playfair Display + Inter fonts, matching the web app's editorial look

## Project structure

```
app/
  _layout.tsx              # root layout, loads fonts
  (tabs)/
    _layout.tsx             # bottom tab navigator
    index.tsx               # Home
    search.tsx               # Search + filters (the main screen)
    new-arrivals.tsx          # What's New
    brands.tsx                 # Brand list -> filtered search
components/
  ProductCard.tsx            # single product tile
  ProductGrid.tsx             # FlatList grid w/ pagination, pull-to-refresh
  SearchBar.tsx                 # search input + filter button
  FilterSheet.tsx                # bottom-sheet modal: brand/category/price/stock
lib/
  api.ts                      # fetch wrappers matching the FastAPI routes exactly
  types.ts                      # shared TS types (Article, SearchResponse, Filters)
  usePaginatedSearch.ts           # hook: refetch on query/filter change + infinite scroll
constants/
  theme.ts                      # colors, fonts, spacing
```

## Setup

```bash
npm install
cp .env.example .env
# edit .env and set EXPO_PUBLIC_API_URL
npx expo start
```

Scan the QR code with the **Expo Go** app on your phone. No Android Studio /
Xcode needed for day-to-day development.

### Pointing at the API

- **Local backend**: use your machine's LAN IP, not `localhost` — your phone
  is a separate device on the network. e.g. `http://192.168.1.42:8000`.
- **Deployed backend**: use the real domain once the API is deployed
  (`https://api.your-mela-domain.com`).

`EXPO_PUBLIC_...` env vars are baked in at build time, so if you change
`.env` you need to restart `expo start`.

## Building & publishing (EAS)

This app is set up for [EAS Build](https://docs.expo.dev/build/introduction/),
Expo's cloud build service — you do **not** need Android Studio or Xcode
installed locally to produce a real APK/AAB or IPA.

```bash
npm install -g eas-cli
eas login
eas init          # links this project to your Expo account, fills app.json "extra.eas.projectId"
```

Update `eas.json` env values (`EXPO_PUBLIC_API_URL`) per profile — `preview`
for internal testing, `production` for store submission — before building.

```bash
# Internal test build (installable APK / ad-hoc IPA, share with testers)
eas build --profile preview --platform android
eas build --profile preview --platform ios

# Store-ready build
eas build --profile production --platform android
eas build --profile production --platform ios

# Submit to Play Store / App Store (after production build finishes)
eas submit --platform android
eas submit --platform ios
```

Before your first production build:
- Replace the placeholder images in `assets/images/` (`icon.png`,
  `adaptive-icon.png`, `favicon.png`, `splash.png`) with real branded assets.
- Set real `bundleIdentifier` / `package` values in `app.json` if
  `com.mela.mobile` isn't yours to use.
- iOS builds require an Apple Developer account ($99/yr); Android requires a
  Google Play Console account (one-time $25) — both handled through
  `eas submit`, no local signing needed.

## Notes / things to keep in sync with the backend

- `/search` takes repeated `brand=` / `category=` query params for
  multi-select filters — `lib/api.ts` builds these with `URLSearchParams.append`,
  matching FastAPI's `Annotated[list[str], Query()]` on the backend.
- Facet options shown in the filter sheet come from the `facets` field on
  the search response itself (same data the web app's `FilterSidebar` uses),
  so there's no separate facets endpoint to call.
- CORS on the API currently allows `allow_origins=["*"]` — fine for
  development; if that gets tightened later, make sure your app's requests
  aren't blocked (mobile apps aren't subject to browser CORS, but good to be
  aware of if a shared gateway enforces it).

# Stage 1 Foundation Decision And Dependency Matrix

## Decision

Stage 1 should ship as an **iOS and Android first** product, while keeping **Expo web compatibility enabled from day one**.

That means:

- Mobile is the release target for Stage 1.
- Web must build and stay structurally supported.
- Desktop-optimized planning UX is explicitly deferred until a later stage.

This is the most pragmatic split for the product as currently defined. The product vision needs desktop planning eventually, but the local-first data model, native database integration, and offline execution flows are the real risk drivers. Stage 1 should reduce those risks first without locking the repo into a mobile-only architecture.

## Rationale

### Why not mobile-only

- The product is explicitly split between desktop planning and mobile execution.
- If web is ignored at the repo level, routing, shared UI boundaries, and screen composition tend to drift toward phone-only assumptions.
- Expo Router already supports native and web from the same app structure, so keeping web viable early is cheaper than retrofitting it later.

### Why not a full desktop-quality web commitment in Stage 1

- The highest-risk work is local-first storage, schema design, ordering, and future sync compatibility.
- WatermelonDB introduces native-module constraints, so the project will need development builds rather than relying on Expo Go for the full app workflow.
- A polished desktop planning experience is valuable, but it is not the first technical blocker.

## Recommended Baseline

### Platform target

- Stage 1 deliverables: iOS and Android
- Stage 1 engineering constraint: web must compile and route correctly
- Explicitly deferred: desktop-optimized split panes, advanced drag/drop planning UX, and collaboration surfaces

### Tooling

- Node.js: `20.19.x`
- Package manager: `npm`
- App bootstrap: `create-expo-app`
- Routing: `expo-router`
- Styling: `nativewind`
- Local database: `@nozbe/watermelondb`
- Backend client: `@supabase/supabase-js`

## Dependency Matrix

### Core runtime baseline

| Package | Recommended version | Why |
| :--- | :--- | :--- |
| `expo` | `~54.0.0` | Stable Expo baseline with web support and a less aggressive upgrade profile than SDK 55 |
| `react-native` | `0.81` | Matches Expo SDK 54 |
| `react` | `19.1.0` | Matches Expo SDK 54 |
| `react-native-web` | `0.21.0` | Matches Expo SDK 54 web support |
| `expo-router` | `~6.0.23` | Bundled router version for Expo SDK 54 |

### Expo-managed installs

These should be installed with `npx expo install`, not hand-pinned independently, so Expo resolves versions compatible with SDK 54:

- `expo-router`
- `react-native-safe-area-context`
- `react-native-screens`
- `expo-linking`
- `expo-constants`
- `expo-status-bar`
- `react-dom`
- `react-native-web`
- `expo-dev-client`

### Third-party packages to pin intentionally

| Package | Recommended version | Why |
| :--- | :--- | :--- |
| `@nozbe/watermelondb` | `0.28.0` | Current stable WatermelonDB release in npm, aligned with the offline-first architecture |
| `@supabase/supabase-js` | `^2.57.4` | Current stable Supabase JS client |
| `nativewind` | `4.1.23` | Current stable NativeWind release |
| `tailwindcss` | `^3.4.17` | NativeWind's current Expo install guide still targets Tailwind 3.x |

## Important Implementation Constraints

### Use development builds, not Expo Go, for the full app

WatermelonDB is a native dependency. The project should assume a development-build workflow once the database layer is introduced.

### Keep web enabled, but keep Stage 1 layouts simple

The first scaffold should avoid desktop-specific layout complexity. Shared route structure matters now; desktop-optimized interaction patterns do not.

### Do not hand-pin Expo ecosystem packages outside `expo install`

Expo SDK compatibility is managed as a matrix. For Expo-owned libraries, the safe rule is:

1. pin the Expo SDK
2. use `npx expo install`
3. let Expo choose matching package versions

## Scaffold Recommendation

Use this sequence for the first scaffold:

```bash
npx create-expo-app@latest universal-travel-app
npx expo install expo-router react-native-safe-area-context react-native-screens expo-linking expo-constants expo-status-bar react-dom react-native-web expo-dev-client
npm install @nozbe/watermelondb @supabase/supabase-js nativewind
npm install -D tailwindcss@^3.4.17 prettier-plugin-tailwindcss@^0.5.11 babel-preset-expo
```

After scaffold:

- set Expo Router as the app entry
- switch web bundling to Metro for NativeWind
- add NativeWind Babel and Metro config
- introduce WatermelonDB only after the development-build workflow is confirmed

## Exit Criteria For Issue 1

- Delivery target is explicit
- The Expo SDK baseline is chosen
- The package installation strategy is defined
- The repo has a source-backed dependency matrix the scaffold can follow

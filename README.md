# Mr Patate

Éditeur de personnage 2D : le personnage est composé de parties (corps, bouche, yeux, bras, jambes, dos, fond), chacune déclinée en plusieurs variantes. Export en SVG ou PNG.

## Démarrer

```bash
nvm use
npm i
npm run dev
```

## Scripts

| Script           | Rôle                               |
| ---------------- | ---------------------------------- |
| `npm run dev`    | Serveur de développement Vite      |
| `npm run build`  | Typecheck puis build de production |
| `npm run check`  | Biome (lint + format) et typecheck |
| `npm run format` | Applique les corrections Biome     |

## Stack

Vite, React, TypeScript (strict), Tailwind CSS, Zustand, Biome, Lucide.

## Ajouter une variante

1. Créer le composant SVG `src/catalog/<partie>/<Partie><Variante>.tsx`, en export nommé : un `<g {...props}>` dans le repère `0 0 800 1000`.
2. Le déclarer dans `src/catalog/<partie>/index.ts` avec :
   - un `id` textuel, par exemple `'hero-cape'` ;
   - ses `layers`, chacun avec un `z` (ordre d'empilement) et un `parallax` (amplitude de la parallaxe).
3. Ajouter son icône dans `public/assets/icons/<partie>/<id>.svg`.

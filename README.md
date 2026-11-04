# Kayoo

Compose ton personnage carte par carte : des yeux, une bouche, des bras, une cape, une couleur, un fond… puis garde tes looks préférés, partage-les par lien ou exporte-les en image.

Tout tourne dans le navigateur : pas de compte, pas de serveur.

## ✨ Ce qu'on peut faire

- 🃏 Choisir chaque Partie dans une Main de cartes, avec un essai au survol
- 🎲 Tirer une Variante ou tout un look au hasard
- ⭐ Garder ses looks en Favoris
- ↩️ Annuler et rétablir
- 🔗 Partager un lien, télécharger en PNG ou SVG
- 🌍 Français et anglais

## 🚀 Démarrer

```bash
nvm use
npm i
npm run dev
```

Puis ouvre l'adresse affichée par Vite.

## 🧰 Scripts

| Script                  | Rôle                                   |
| ----------------------- | -------------------------------------- |
| `npm run dev`           | Serveur de développement               |
| `npm run build`         | Build de production                    |
| `npm run check`         | Catalogue, Biome, typecheck et tests   |
| `npm run format`        | Applique les corrections Biome         |
| `npm test`              | Tests Vitest                           |
| `npm run catalog:ids`   | Régénère les ids typés du catalogue    |
| `npm run catalog:clean` | Nettoie un dessin et vérifie ses rôles |

## 🛠️ Stack

Node 24, Vite, React 19 (React Compiler), TypeScript strict, Tailwind CSS 4, Zustand, Zundo, Motion, react-i18next, Biome, Vitest.

## 🎨 Ajouter une variante

Dépose un dessin dans `src/catalog/<partie>/<id>.svg` : avec `npm run dev`, la carte apparaît aussitôt dans sa Main.

Un export brut (Figma, Illustrator…) se nettoie et se range avec `npm run catalog:clean -- <export.svg> --to <partie>/<id>`, ou le skill Claude Code `/catalog-svg`.

- 🏷️ `id` en kebab-case. Il finit dans les liens partagés, donc on n'y touche plus.
- 📐 `viewBox="0 0 800 1000"`, un titre par langue.
- 🧱 Bras et jambes : répartis entre `<g data-plane="back">` et `<g data-plane="front">` (`src/catalog/planes.ts`).

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 1000">
  <title lang="fr">Au repos</title>
  <title lang="en">At ease</title>
  …
  <g data-plane="back">…</g>
  <g data-plane="front">…</g>
  …
</svg>
```

Attributs reconnus :

| Attribut                   | Effet                                     |
| -------------------------- | ----------------------------------------- |
| `data-role="skin"`         | Peint avec la Couleur                     |
| `data-role="shadow"`       | Ombre de la Couleur, suit le pointeur     |
| `data-role="eye-pupil"`    | Pupille qui suit le pointeur              |
| `data-hidden="true"`       | Absente des Mains et du hasard            |
| `data-aliases="ancien-id"` | Les anciens liens mènent à cette variante |

Couleurs et fonds se déclarent dans `src/catalog/<partie>/variants.ts`. Ordre, défaut et Piles dans `src/catalog/parts.ts`.

✅ `npm run check` relit tout le catalogue et dit ce qui cloche.

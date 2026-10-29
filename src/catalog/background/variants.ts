import type { VariantConfig } from '@src/lib/catalog/types.ts'

export default [
  {
    id: 'cream',
    label: {
      fr: 'Crème',
      en: 'Cream',
    },
    fill: '#FFF4DC',
  },
  {
    id: 'sky',
    label: {
      fr: 'Ciel',
      en: 'Sky',
    },
    fill: '#CFE8FF',
  },
  {
    id: 'mint',
    label: {
      fr: 'Menthe',
      en: 'Mint',
    },
    fill: '#CFF3E0',
  },
  {
    id: 'pink',
    label: {
      fr: 'Rose',
      en: 'Pink',
    },
    fill: '#FFDCE8',
  },
  {
    id: 'sun',
    label: {
      fr: 'Soleil',
      en: 'Sun',
    },
    fill: '#FFE27A',
  },
  {
    id: 'apricot',
    label: {
      fr: 'Abricot',
      en: 'Apricot',
    },
    fill: '#FFC9A8',
  },
  {
    id: 'night',
    label: {
      fr: 'Nuit',
      en: 'Night',
    },
    fill: '#2F2A4A',
    dark: true,
  },
  {
    id: 'stripes',
    label: {
      fr: 'Rayures',
      en: 'Stripes',
    },
    fill: '#FFF4DC',
    pattern: {
      width: 44,
      height: 44,
      transform: 'rotate(45)',
      svg: '<rect width="22" height="44" fill="#FFE3B0"/>',
    },
  },
  {
    id: 'dots',
    label: {
      fr: 'Pois',
      en: 'Dots',
    },
    fill: '#FFF4DC',
    pattern: {
      width: 34,
      height: 34,
      svg: '<circle cx="17" cy="17" r="6.5" fill="#FF5B2E" fill-opacity="0.3"/>',
    },
  },
  {
    id: 'grid',
    label: {
      fr: 'Quadrillage',
      en: 'Grid',
    },
    fill: '#FFFFFF',
    pattern: {
      width: 36,
      height: 36,
      svg: '<rect width="36" height="2" fill="#141210" fill-opacity="0.1"/><rect width="2" height="36" fill="#141210" fill-opacity="0.1"/>',
    },
  },
  {
    id: 'curtain',
    label: {
      fr: 'Rideau',
      en: 'Curtain',
    },
    fill: '#A3222E',
    dark: true,
    pattern: {
      width: 52,
      height: 52,
      svg: '<rect width="26" height="52" fill="#861A25"/>',
    },
  },
  {
    id: 'clouds',
    label: {
      fr: 'Nuages',
      en: 'Clouds',
    },
    fill: '#CFE8FF',
    pattern: {
      width: 180,
      height: 120,
      svg: '<g fill="#FFFFFF"><circle cx="34" cy="36" r="13"/><circle cx="50" cy="28" r="17"/><circle cx="68" cy="37" r="12"/><rect x="24" y="36" width="54" height="13" rx="6.5"/></g><g fill="#FFFFFF" fill-opacity="0.8"><circle cx="116" cy="88" r="10"/><circle cx="130" cy="81" r="14"/><circle cx="145" cy="89" r="9"/><rect x="108" y="88" width="45" height="10" rx="5"/></g>',
    },
  },
  {
    id: 'checkers',
    label: {
      fr: 'Damier',
      en: 'Checkers',
    },
    fill: '#FFF4DC',
    pattern: {
      width: 56,
      height: 56,
      svg: '<rect width="28" height="28" fill="#FFD23F" fill-opacity="0.55"/><rect x="28" y="28" width="28" height="28" fill="#FFD23F" fill-opacity="0.55"/>',
    },
  },
  {
    id: 'gingham',
    label: {
      fr: 'Vichy',
      en: 'Gingham',
    },
    fill: '#FFFFFF',
    pattern: {
      width: 32,
      height: 32,
      svg: '<rect width="16" height="32" fill="#FF5B2E" fill-opacity="0.16"/><rect width="32" height="16" fill="#FF5B2E" fill-opacity="0.16"/>',
    },
  },
  {
    id: 'waves',
    label: {
      fr: 'Vagues',
      en: 'Waves',
    },
    fill: '#CFF3E0',
    pattern: {
      width: 64,
      height: 32,
      svg: '<path d="M0 16Q16 6 32 16T64 16" fill="none" stroke="#21C488" stroke-opacity="0.45" stroke-width="3" stroke-linecap="round"/>',
    },
  },
  {
    id: 'confetti',
    label: {
      fr: 'Confettis',
      en: 'Confetti',
    },
    fill: '#FFF4DC',
    pattern: {
      width: 120,
      height: 120,
      svg: '<rect x="14" y="18" width="12" height="5" rx="2" fill="#FF5B2E" transform="rotate(-30 20 20)"/><rect x="70" y="12" width="12" height="5" rx="2" fill="#5AA9E6" transform="rotate(25 76 14)"/><rect x="40" y="62" width="12" height="5" rx="2" fill="#21C488" transform="rotate(60 46 64)"/><rect x="92" y="78" width="12" height="5" rx="2" fill="#FFD23F" transform="rotate(-15 98 80)"/><rect x="16" y="96" width="12" height="5" rx="2" fill="#E86FA8" transform="rotate(40 22 98)"/><circle cx="100" cy="40" r="3.5" fill="#FFD23F"/><circle cx="58" cy="100" r="3" fill="#FF5B2E"/><circle cx="30" cy="54" r="2.5" fill="#5AA9E6"/><circle cx="82" cy="112" r="2.5" fill="#21C488"/>',
    },
  },
  {
    id: 'mountain',
    label: {
      fr: 'Montagne',
      en: 'Mountain',
    },
    fill: '#CFE8FF',
    hidden: true,
  },
] as const satisfies readonly VariantConfig[]

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
    fill: '#FF5B2E',
    pattern: {
      width: 52,
      height: 52,
      svg: '<rect width="26" height="52" fill="#E2461C"/>',
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

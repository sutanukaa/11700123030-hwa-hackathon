export const canopyColors = {
  canvas: '#FFF8EF',
  softWhite: '#FFFEFA',
  cocoaInk: '#51443E',
  mutedText: '#897C72',
  petalPink: '#F2C5D2',
  gardenSage: '#B8CBB0',
  butterYellow: '#F5D98E',
  powderBlue: '#C5D9E8',
  terracotta: '#C9795C',
  lilac: '#D8C9E8',
  olive: '#777D54',
  border: '#E8DED2',
} as const

export const canopyTypography = {
  display: 'Fredoka',
  body: 'DM Sans',
} as const

export const canopySpacing = {
  xs: '0.25rem',
  sm: '0.5rem',
  md: '1rem',
  lg: '1.5rem',
  xl: '2rem',
  '2xl': '3rem',
  '3xl': '4rem',
} as const

export const canopyRadii = {
  sm: '0.25rem',
  md: '0.5rem',
  lg: '0.75rem',
  xl: '1rem',
  full: '9999px',
} as const

export const canopyShadows = {
  sm: '0 1px 2px 0 rgb(81 68 62 / 0.05)',
  md: '0 4px 6px -1px rgb(81 68 62 / 0.08), 0 2px 4px -2px rgb(81 68 62 / 0.04)',
  lg: '0 10px 15px -3px rgb(81 68 62 / 0.08), 0 4px 6px -4px rgb(81 68 62 / 0.04)',
  xl: '0 20px 25px -5px rgb(81 68 62 / 0.08), 0 8px 10px -6px rgb(81 68 62 / 0.04)',
} as const

export const canopyBorders = {
  sm: '1px solid #E8DED2',
  md: '2px solid #E8DED2',
} as const

export const canopyAnimations = {
  duration: {
    fast: 0.2,
    normal: 0.4,
    slow: 0.6,
  },
  ease: {
    easeOut: [0.25, 1, 0.5, 1],
    easeInOut: [0.4, 0, 0.2, 1],
    spring: [0.2, 0, 0, 1],
  },
} as const

export type CanopyColor = keyof typeof canopyColors
export type CanopyRadius = keyof typeof canopyRadii
export type CanopyShadow = keyof typeof canopyShadows

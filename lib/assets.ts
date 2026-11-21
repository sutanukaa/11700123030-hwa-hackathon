export type AssetCategory =
  | 'butterfly'
  | 'flower'
  | 'tree'
  | 'ground'
  | 'mountain'
  | 'sky'
  | 'bush'
  | 'environment'
  | 'other'

export interface AssetEntry {
  src: string
  alt: string
  category: AssetCategory
  transparentBackground?: boolean
  notes?: string
}

export const canopyAssets: Record<string, AssetEntry> = {
  butterfly1: {
    src: '/butterfly-1.png',
    alt: 'Butterfly illustration',
    category: 'butterfly',
    transparentBackground: true,
  },
  butterflyMagical: {
    src: '/butterfly-magical.png',
    alt: 'Magical butterfly illustration',
    category: 'butterfly',
    transparentBackground: true,
  },
  butterflyResting: {
    src: '/butterfly-resting.png',
    alt: 'Resting butterfly illustration',
    category: 'butterfly',
    transparentBackground: true,
  },
  cherryBlossomTree: {
    src: '/cherry-blossom-tree.png',
    alt: 'Cherry blossom tree illustration',
    category: 'tree',
    transparentBackground: false,
    notes: 'May have non-transparent background - verify before use',
  },
  dandelion: {
    src: '/dandelion.png',
    alt: 'Dandelion illustration',
    category: 'flower',
    transparentBackground: true,
  },
  flower1: {
    src: '/flower-1.png',
    alt: 'Flower illustration',
    category: 'flower',
    transparentBackground: true,
  },
  flower2: {
    src: '/flower-2.png',
    alt: 'Flower illustration',
    category: 'flower',
    transparentBackground: true,
  },
  flower3: {
    src: '/flower-3.png',
    alt: 'Flower illustration',
    category: 'flower',
    transparentBackground: true,
  },
  flowerPetal: {
    src: '/flower-petal.png',
    alt: 'Flower petal illustration',
    category: 'flower',
    transparentBackground: true,
  },
  foregroundBushes: {
    src: '/foreground-bushes.png',
    alt: 'Foreground bushes illustration',
    category: 'bush',
    transparentBackground: false,
    notes: 'May have non-transparent background - verify before use',
  },
  image: {
    src: '/image.png',
    alt: 'Unidentified image asset',
    category: 'other',
    transparentBackground: false,
    notes: 'Asset identity not determined - inspect before use',
  },
  masterEnvironment: {
    src: '/master-environment.png',
    alt: 'Master environment scene',
    category: 'environment',
    transparentBackground: false,
    notes: 'Full scene composition - likely non-transparent background',
  },
  meadowGround: {
    src: '/meadow-ground.png',
    alt: 'Meadow ground illustration',
    category: 'ground',
    transparentBackground: false,
    notes: 'Ground layer - likely non-transparent background',
  },
  mountainRange: {
    src: '/mountain-range.png',
    alt: 'Mountain range illustration',
    category: 'mountain',
    transparentBackground: false,
    notes: 'May have non-transparent background - verify before use',
  },
  rollingHills: {
    src: '/rolling-hills.png',
    alt: 'Rolling hills illustration',
    category: 'mountain',
    transparentBackground: false,
    notes: 'May have non-transparent background - verify before use',
  },
  skyAtmosphere: {
    src: '/sky-atmosphere.png',
    alt: 'Sky atmosphere illustration',
    category: 'sky',
    transparentBackground: false,
    notes: 'Sky layer - likely non-transparent background',
  },
  unwindEnvironment: {
    src: '/unwind-environment.png',
    alt: 'Unwind environment scene',
    category: 'environment',
    transparentBackground: false,
    notes: 'Full scene composition - likely non-transparent background',
  },
} as const

export const getAsset = (key: string): AssetEntry | undefined => {
  return canopyAssets[key as keyof typeof canopyAssets]
}

export const getAssetsByCategory = (category: AssetCategory): AssetEntry[] => {
  return Object.values(canopyAssets).filter((asset) => asset.category === category)
}

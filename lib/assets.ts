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
    transparentBackground: true,
    notes: 'Transparent cutout with a full trunk and canopy',
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
    transparentBackground: true,
    notes: 'Transparent foreground framing with planting on both edges',
  },
  image: {
    src: '/image.png',
    alt: 'Complete CANOPY scene with a butterfly and dog burrow',
    category: 'environment',
    transparentBackground: false,
    notes: 'Complete scene reference; not a separable environment layer',
  },
  masterEnvironment: {
    src: '/master-environment.png',
    alt: 'Master environment scene',
    category: 'environment',
    transparentBackground: false,
    notes: 'Complete 16:9 composition used as the visual reference',
  },
  meadowGround: {
    src: '/meadow-ground.png',
    alt: 'Meadow ground illustration',
    category: 'ground',
    transparentBackground: true,
    notes: 'Transparent meadow and foreground flower cutout',
  },
  meadowGroundMobile: {
    src: '/meadow-ground-mobile.png',
    alt: 'Meadow ground mobile illustration',
    category: 'ground',
    transparentBackground: true,
    notes: 'Portrait-oriented mobile meadow cutout',
  },
  mountainRange: {
    src: '/mountain-range.png',
    alt: 'Mountain range and sky panorama',
    category: 'mountain',
    transparentBackground: false,
    notes: 'Opaque panorama with baked sky, clouds, mountains, and distant greenery',
  },
  rollingHills: {
    src: '/rolling-hills.png',
    alt: 'Rolling hills illustration',
    category: 'mountain',
    transparentBackground: true,
    notes: 'Transparent middle-distance hill cutout',
  },
  rollingHillsMobile: {
    src: '/rolling-hills-mobile.png',
    alt: 'Rolling hills mobile illustration',
    category: 'mountain',
    transparentBackground: false,
    notes: 'Portrait-oriented mobile hills and atmosphere',
  },
  skyAtmosphere: {
    src: '/sky-atmosphere.png',
    alt: 'Complete sunlit CANOPY landscape',
    category: 'environment',
    transparentBackground: false,
    notes: 'Complete scene with a tree and meadow; byte-identical to unwind-environment.png',
  },
  skyAtmosphereMobile: {
    src: '/sky-atmosphere-mobile.png',
    alt: 'Sky and atmosphere mobile illustration',
    category: 'sky',
    transparentBackground: false,
    notes: 'Portrait-oriented mobile sky and mountain backplate',
  },
  unwindEnvironment: {
    src: '/unwind-environment.png',
    alt: 'Complete unwind CANOPY landscape',
    category: 'environment',
    transparentBackground: false,
    notes: 'Complete scene reserved for a later milestone; byte-identical to sky-atmosphere.png',
  },
} as const

export const getAsset = (key: string): AssetEntry | undefined => {
  return canopyAssets[key as keyof typeof canopyAssets]
}

export const getAssetsByCategory = (category: AssetCategory): AssetEntry[] => {
  return Object.values(canopyAssets).filter((asset) => asset.category === category)
}
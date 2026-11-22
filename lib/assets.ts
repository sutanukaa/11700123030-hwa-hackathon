export type AssetCategory =
  | 'butterfly'
  | 'flower'
  | 'tree'
  | 'ground'
  | 'mountain'
  | 'sky'
  | 'bush'
  | 'environment'
  | 'dog'
  | 'other'

export interface AssetEntry {
  src: string
  alt: string
  category: AssetCategory
  transparentBackground?: boolean
  notes?: string
}

export const canopyAssets: Record<string, AssetEntry> = {
  // Dog Story Assets (Verified in public/)
  dogPeek: {
    src: '/dog-peek.png',
    alt: 'Golden-cream puppy peeking curiously into the scene',
    category: 'dog',
    transparentBackground: true,
  },
  dogCloseup: {
    src: '/dog-closeup.png',
    alt: 'Golden-cream puppy close-up face with blue floral bandana',
    category: 'dog',
    transparentBackground: true,
  },
  dogSit: {
    src: '/dog-sit.png',
    alt: 'Golden-cream puppy sitting politely on a soft pedestal',
    category: 'dog',
    transparentBackground: true,
  },
  dogPlayful: {
    src: '/dog-happy.png',
    alt: 'Golden-cream puppy in a cheerful playful bow with blue floral bandana',
    category: 'dog',
    transparentBackground: true,
  },
  dogHappy: {
    src: '/dog-happy.png',
    alt: 'Golden-cream puppy in a cheerful playful bow with blue floral bandana',
    category: 'dog',
    transparentBackground: true,
  },

  // Sleeping Bunny (Unwind Mode)
  sleepingBunny: {
    src: '/sleeping-bunny.png',
    alt: 'Sleeping bunny resting quietly in the meadow grass',
    category: 'environment',
    transparentBackground: true,
  },

  // Explore Wildlife & Flora
  ladybugIdle: {
    src: '/ladybug-idle.png',
    alt: 'Ladybug resting naturally on meadow leaf',
    category: 'environment',
    transparentBackground: true,
  },
  ladybugCrawl: {
    src: '/ladybug-crawl.png',
    alt: 'Ladybug preparing wings on meadow leaf',
    category: 'environment',
    transparentBackground: true,
  },
  ladybugFly: {
    src: '/ladybug-fly.png',
    alt: 'Ladybug in flight with open wings',
    category: 'environment',
    transparentBackground: true,
  },
  emptyLeaf: {
    src: '/empty-leaf.png',
    alt: 'Empty meadow leaf after ladybug departure',
    category: 'environment',
    transparentBackground: true,
  },
  rabbitPeek: {
    src: '/rabbit-peek.png',
    alt: 'Shy meadow rabbit peeking',
    category: 'environment',
    transparentBackground: true,
  },
  rabbitAlert: {
    src: '/rabbit-alert.png',
    alt: 'Shy meadow rabbit alert',
    category: 'environment',
    transparentBackground: true,
  },
  rabbitSit: {
    src: '/rabbit-sit.png',
    alt: 'Shy meadow rabbit sitting',
    category: 'environment',
    transparentBackground: true,
  },
  rabbitHop1: {
    src: '/rabbit-hop-1.png',
    alt: 'Shy meadow rabbit hopping',
    category: 'environment',
    transparentBackground: true,
  },
  rabbitHop2: {
    src: '/rabbit-hop-2.png',
    alt: 'Shy meadow rabbit landing',
    category: 'environment',
    transparentBackground: true,
  },
  rabbitHide: {
    src: '/rabbit-hide.png',
    alt: 'Shy meadow rabbit hiding',
    category: 'environment',
    transparentBackground: true,
  },
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
    alt: 'Single flower petal for wind effects',
    category: 'flower',
    transparentBackground: true,
  },
  foregroundBushes: {
    src: '/foreground-bushes.png',
    alt: 'Foreground bushes framing the view',
    category: 'bush',
    transparentBackground: true,
    notes: 'Botanical framing with transparent center',
  },
  meadowGround: {
    src: '/meadow-ground.png',
    alt: 'Lush green meadow ground with flowers and stones',
    category: 'ground',
    transparentBackground: true,
  },
  mountainRange: {
    src: '/mountain-range.png',
    alt: 'Soft layered mountains in the distance',
    category: 'mountain',
    transparentBackground: true,
  },
  rollingHills: {
    src: '/rolling-hills.png',
    alt: 'Rolling green hills under a soft sky',
    category: 'mountain',
    transparentBackground: true,
  },
  skyAtmosphere: {
    src: '/sky-atmosphere.png',
    alt: 'Gentle sky gradient with soft clouds',
    category: 'sky',
    transparentBackground: false,
    notes: 'Base sky layer for the entire scene',
  },
  awakeCloud: {
    src: '/awake-cloud.png',
    alt: 'Awake cloud illustration',
    category: 'environment',
    transparentBackground: true,
  },
  masterEnvironment: {
    src: '/master-environment.png',
    alt: 'Full reference landscape showing all layers composed together',
    category: 'environment',
    transparentBackground: false,
    notes: 'Reference composition for layout and positioning',
  },
  unwindEnvironment: {
    src: '/unwind-environment.png',
    alt: 'Unwind reference environment showing peaceful sunset mood',
    category: 'environment',
    transparentBackground: false,
    notes: 'Reference composition for Unwind mode',
  },
}
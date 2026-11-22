'use client'

import { AuthSessionSync } from '@/components/auth/AuthSessionSync'
import { SignInModal } from '@/components/auth/SignInModal'
import { CanopyEnvironment } from '@/components/environment/CanopyEnvironment'
import { DogReveal } from '@/components/story/DogReveal'
import { CanopyIntroduction } from '@/components/story/CanopyIntroduction'
import { HowCanopyWorks } from '@/components/story/HowCanopyWorks'
import { ProductJourney } from '@/components/story/ProductJourney'
import { useCanopyStore } from '@/state/canopy-store'

export default function Home() {
  const mode = useCanopyStore((state) => state.mode)

  return (
    <>
      <main className="relative min-h-[100svh] w-full max-w-full overflow-x-clip bg-[#B9D3E6]">
        <CanopyEnvironment />
        {mode !== 'idle' && (
          <>
            <DogReveal />
            <CanopyIntroduction />
            <HowCanopyWorks />
            <ProductJourney />
          </>
        )}
      </main>
      <AuthSessionSync />
      <SignInModal />
    </>
  )
}

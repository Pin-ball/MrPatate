import { useWindowWidth } from '@src/hooks/useWindowWidth.ts'
import { DESKTOP_GEOMETRY } from '@src/lib/hand/desktop.ts'
import type { HandGeometry, HandShape } from '@src/lib/hand/geometry.ts'
import { MOBILE_GEOMETRY } from '@src/lib/hand/mobile.ts'
import type { SceneSettings } from '@src/lib/scene.ts'
import { DESKTOP_SCENE, MOBILE_SCENE } from '@src/lib/scene.ts'
import { useSyncExternalStore } from 'react'

type Layout = 'desktop' | 'mobile'

const GEOMETRIES: Record<Layout, HandGeometry> = {
  desktop: DESKTOP_GEOMETRY,
  mobile: MOBILE_GEOMETRY,
}

const SCENES: Record<Layout, SceneSettings> = {
  desktop: DESKTOP_SCENE,
  mobile: MOBILE_SCENE,
}

const DESKTOP_QUERY = '(min-width: 1024px) and (min-height: 600px)'

function subscribe(onChange: () => void) {
  const listeners = new AbortController()
  matchMedia(DESKTOP_QUERY).addEventListener('change', onChange, listeners)
  return () => listeners.abort()
}

function currentLayout(): Layout {
  return matchMedia(DESKTOP_QUERY).matches ? 'desktop' : 'mobile'
}

function useLayout(): Layout {
  return useSyncExternalStore(subscribe, currentLayout)
}

export function useHandGeometry(): HandGeometry {
  const layout = useLayout()
  return GEOMETRIES[layout]
}

export function useSceneSettings(): SceneSettings {
  const layout = useLayout()
  return SCENES[layout]
}

export function useHandShape(count: number): HandShape {
  const geometry = useHandGeometry()
  const width = useWindowWidth()
  return geometry.handShape(width, count)
}

export function useHandTop(): number {
  const geometry = useHandGeometry()
  const width = useWindowWidth()
  return geometry.handTop(width)
}

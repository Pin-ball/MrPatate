import { FRAME, FRAME_CAMERA, FRAME_RATIO } from '@src/lib/catalog/camera.ts'
import { partById } from '@src/lib/catalog/index.ts'
import type { Camera } from '@src/lib/catalog/types.ts'
import type { Hand } from '@src/lib/hand/geometry.ts'

export type SceneSettings = {
  bottomPadding: number
  maxCharacterWidth: number
  zoomWithoutHand: number
  shiftWithoutHand: number
  partZoomFactor: number
  gapAboveHand: number
}

export const DESKTOP_SCENE: SceneSettings = {
  bottomPadding: 90,
  maxCharacterWidth: 360,
  zoomWithoutHand: 1.3,
  shiftWithoutHand: -25,
  partZoomFactor: 1,
  gapAboveHand: 12,
}

export const MOBILE_SCENE: SceneSettings = {
  bottomPadding: 177,
  maxCharacterWidth: 260,
  zoomWithoutHand: 1.35,
  shiftWithoutHand: -20,
  partZoomFactor: 0.6,
  gapAboveHand: 12,
}

function cameraTransform({ zoom, focus: [x, y] }: Camera, shiftY = 0) {
  const [x0, y0, x1, y1] = FRAME
  const originX = ((x - x0) / (x1 - x0)) * 100
  const originY = ((y - y0) / (y1 - y0)) * 100
  return {
    transform: `translate(${50 - originX}%, calc(${shiftY}px + ${50 - originY}%)) scale(${zoom})`,
    transformOrigin: `${originX}% ${originY}%`,
  }
}

export function cameraStyle(hand: Hand, scene: SceneSettings, handTop: number) {
  if (hand.kind === 'none') {
    return cameraTransform({ ...FRAME_CAMERA, zoom: scene.zoomWithoutHand }, scene.shiftWithoutHand)
  }
  const partCamera = hand.kind === 'variants' ? partById[hand.part].camera : null
  const camera = partCamera
    ? { ...partCamera, zoom: 1 + (partCamera.zoom - 1) * scene.partZoomFactor }
    : FRAME_CAMERA
  return cameraTransform(camera, (scene.bottomPadding - handTop) / 2)
}

export function characterWidth(scene: SceneSettings, handTop: number) {
  const roomAboveHand = `100cqh - ${handTop + scene.gapAboveHand - scene.bottomPadding}px`
  return `min(${scene.maxCharacterWidth}px, calc((${roomAboveHand}) * ${FRAME_RATIO}))`
}

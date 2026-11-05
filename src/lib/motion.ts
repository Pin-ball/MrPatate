import type { CSSProperties } from 'react'

type Bezier = [number, number, number, number]

export const DURATIONS = {
  waveStagger: 45,
  press: 120,
  pressHold: 70,
  wiggle: 130,
  short: 150,
  lift: 200,
  appearFade: 200,
  hit: 250,
  leave: 300,
  appear: 350,
  bounce: 350,
  remove: 400,
  tooltipDelay: 400,
  drop: 440,
  longPressGrowDelay: 150,
  longPress: 500,
  move: 550,
  parallax: 600,
  scrollHint: 1400,
}

export const EASES = {
  overshootLg: [0.34, 1.56, 0.64, 1],
  overshootMd: [0.34, 1.4, 0.64, 1],
  overshootSm: [0.34, 1.2, 0.64, 1],
  outStrong: [0.2, 0.8, 0.2, 1],
  inStrong: [0.5, 0, 0.75, 0],
  inExpo: [0.7, 0, 0.84, 0],
} satisfies Record<string, Bezier>

function kebab(name: string) {
  return name.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`)
}

export function seconds(duration: number) {
  return duration / 1000
}

export const MOTION_VARIABLES: CSSProperties = Object.fromEntries([
  ...Object.entries(DURATIONS).map(([name, duration]) => [
    `--duration-${kebab(name)}`,
    `${duration}ms`,
  ]),
  ...Object.entries(EASES).map(([name, bezier]) => [
    `--ease-${kebab(name)}`,
    `cubic-bezier(${bezier.join(', ')})`,
  ]),
])

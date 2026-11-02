import type { CSSProperties } from 'react'

type Bezier = [number, number, number, number]

export const DURATIONS = {
  press: 120,
  short: 150,
  lift: 200,
  appearFade: 200,
  hit: 250,
  fold: 300,
  appear: 350,
  bounce: 350,
  remove: 400,
  move: 550,
  drop: 440,
  parallax: 600,
  scrollHint: 1400,
}

export const EASES = {
  overshootLg: [0.34, 1.56, 0.64, 1],
  overshootMd: [0.34, 1.4, 0.64, 1],
  overshootSm: [0.34, 1.2, 0.64, 1],
  outStrong: [0.2, 0.8, 0.2, 1],
  inStrong: [0.5, 0, 0.75, 0],
} satisfies Record<string, Bezier>

const kebab = (name: string) => name.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`)

export const seconds = (duration: number) => duration / 1000

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

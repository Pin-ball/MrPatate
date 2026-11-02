import { DURATIONS, EASES, seconds } from '@src/lib/motion.ts'
import type { HTMLMotionProps, TargetAndTransition } from 'motion/react'
import { motion } from 'motion/react'

type AppearProps = HTMLMotionProps<'div'> & { delay?: number }

const HIDDEN: TargetAndTransition = { opacity: 0, scale: 0.8 }

const EXIT: TargetAndTransition = {
  ...HIDDEN,
  transition: { duration: seconds(DURATIONS.short), ease: EASES.inStrong },
}

const shown = (delay: number): TargetAndTransition => ({
  opacity: 1,
  scale: 1,
  transition: {
    opacity: { duration: seconds(DURATIONS.appearFade), ease: EASES.outStrong, delay },
    scale: { duration: seconds(DURATIONS.appear), ease: EASES.overshootLg, delay },
  },
})

export function Appear({ delay = 0, ...props }: AppearProps) {
  return <motion.div initial={HIDDEN} animate={shown(delay)} exit={EXIT} {...props} />
}

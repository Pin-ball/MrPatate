import type { HTMLMotionProps, TargetAndTransition } from 'motion/react'
import { motion } from 'motion/react'

type AppearProps = HTMLMotionProps<'div'> & { delay?: number }

const HIDDEN: TargetAndTransition = { opacity: 0, scale: 0.8 }

const EXIT: TargetAndTransition = {
  ...HIDDEN,
  transition: { duration: 0.15, ease: [0.5, 0, 0.75, 0] },
}

const shown = (delay: number): TargetAndTransition => ({
  opacity: 1,
  scale: 1,
  transition: {
    opacity: { duration: 0.2, ease: [0.2, 0.8, 0.2, 1], delay },
    scale: { duration: 0.35, ease: [0.34, 1.56, 0.64, 1], delay },
  },
})

export function Appear({ delay = 0, ...props }: AppearProps) {
  return <motion.div initial={HIDDEN} animate={shown(delay)} exit={EXIT} {...props} />
}

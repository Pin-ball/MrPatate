import type { ClassValue } from 'clsx'
import { clsx } from 'clsx'
import { extendTailwindMerge } from 'tailwind-merge'

const twMerge = extendTailwindMerge({
  extend: {
    theme: {
      shadow: ['hard-sm', 'hard', 'hard-lg'],
      ease: ['spring', 'deal', 'fold', 'soft', 'suck', 'drop'],
    },
    classGroups: {
      'border-w': ['border-stroke'],
    },
  },
})

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

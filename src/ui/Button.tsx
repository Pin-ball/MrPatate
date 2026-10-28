import { cn } from '@src/lib/utils.ts'
import type { VariantProps } from 'class-variance-authority'
import { cva } from 'class-variance-authority'
import type { ComponentProps } from 'react'

const buttonVariants = cva(
  'inline-flex shrink-0 cursor-pointer items-center justify-center gap-2 font-bold whitespace-nowrap disabled:cursor-not-allowed disabled:opacity-30 motion-reduce:transition-none',
  {
    variants: {
      variant: {
        primary:
          'border-stroke bg-primary text-primary-foreground shadow-hard h-[46px] rounded-full px-5 text-[15px] transition-[translate,box-shadow] duration-120 active:translate-x-[3px] active:translate-y-[3px] active:shadow-none',
        secondary:
          'border-stroke bg-secondary text-secondary-foreground h-11 rounded-full px-4 text-sm',
        ghost:
          'hover:bg-background justify-start rounded-sm px-3 py-2.5 text-sm transition-colors duration-150 focus-visible:outline-offset-2',
      },
    },
    defaultVariants: { variant: 'secondary' },
  },
)

type ButtonProps = ComponentProps<'button'> & VariantProps<typeof buttonVariants>

export function Button({ variant, className, type = 'button', ...props }: ButtonProps) {
  return <button type={type} className={cn(buttonVariants({ variant }), className)} {...props} />
}

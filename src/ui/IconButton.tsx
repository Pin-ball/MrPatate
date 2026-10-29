import { cn } from '@src/lib/utils.ts'
import type { VariantProps } from 'class-variance-authority'
import { cva } from 'class-variance-authority'
import type { ComponentProps } from 'react'

const iconButtonVariants = cva(
  'inline-flex shrink-0 cursor-pointer items-center justify-center rounded-full disabled:cursor-not-allowed disabled:opacity-30',
  {
    variants: {
      variant: {
        outline: 'border-stroke bg-secondary text-secondary-foreground size-11',
        primary: 'border-stroke bg-primary text-primary-foreground size-11',
        ghost:
          'hover:bg-background relative size-[34px] transition-[background-color,scale] duration-150 before:absolute before:-inset-[5px] focus-visible:outline-offset-2 active:scale-92 disabled:bg-transparent disabled:active:scale-100',
      },
    },
    defaultVariants: { variant: 'outline' },
  },
)

type IconButtonProps = Omit<ComponentProps<'button'>, 'aria-label' | 'title'> &
  VariantProps<typeof iconButtonVariants> & { label: string }

export function IconButton({
  label,
  variant,
  className,
  type = 'button',
  ...props
}: IconButtonProps) {
  return (
    <button
      type={type}
      aria-label={label}
      title={label}
      className={cn(iconButtonVariants({ variant }), className)}
      {...props}
    />
  )
}

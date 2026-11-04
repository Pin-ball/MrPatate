import { create } from 'zustand'

type ToastAction = { label: string; onClick: () => void }

type ToastTiming = { duration?: number; onExpire?: () => void }

type ToastMessage = { id: number; message: string; action?: ToastAction }

type ToastState = {
  toast: ToastMessage | null
}

const TOAST_DURATION = 4000

const ACTION_TOAST_DURATION = 6000

export const useToast = create<ToastState>()((): ToastState => ({ toast: null }))

const { setState } = useToast

let nextId = 0
let timer: ReturnType<typeof setTimeout> | undefined

export function showToast(
  message: string,
  action?: ToastAction,
  { duration = action ? ACTION_TOAST_DURATION : TOAST_DURATION, onExpire }: ToastTiming = {},
): void {
  clearTimeout(timer)
  setState({ toast: { id: nextId++, message, ...(action && { action }) } })
  timer = setTimeout(() => {
    hideToast()
    onExpire?.()
  }, duration)
}

export function hideToast(): void {
  clearTimeout(timer)
  setState({ toast: null })
}

import { hideToast, useToast } from '@src/stores/toast.ts'
import { Toast } from '@src/ui/Toast.tsx'

export function Toaster() {
  const toast = useToast((state) => state.toast)
  if (!toast) return null

  const { id, message, action } = toast
  return (
    <div className="pointer-events-none fixed inset-x-3 top-2 z-50 flex justify-center md:top-[140px]">
      <Toast
        key={id}
        message={message}
        {...(action && {
          action: {
            label: action.label,
            onClick: () => {
              hideToast()
              action.onClick()
            },
          },
        })}
        className="pointer-events-auto w-full md:w-auto"
      />
    </div>
  )
}

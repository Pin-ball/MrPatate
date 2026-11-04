import { hideToast, useToast } from '@src/stores/toast.ts'
import { Appear } from '@src/ui/Appear.tsx'
import { Toast } from '@src/ui/Toast.tsx'
import { AnimatePresence } from 'motion/react'

export function Toaster() {
  const toast = useToast((state) => state.toast)

  return (
    <div className="desktop:top-[140px] pointer-events-none fixed inset-x-3 top-[calc(var(--safe-top)+4.5rem)] z-50 flex justify-center">
      <AnimatePresence mode="wait">
        {toast && (
          <Appear key={toast.id} className="pointer-events-auto">
            <Toast
              message={toast.message}
              {...(toast.action && {
                action: {
                  label: toast.action.label,
                  onClick: () => {
                    hideToast()
                    toast.action?.onClick()
                  },
                },
              })}
            />
          </Appear>
        )}
      </AnimatePresence>
    </div>
  )
}

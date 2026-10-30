import { hideToast, useToast } from '@src/stores/toast.ts'
import { Appear } from '@src/ui/Appear.tsx'
import { Toast } from '@src/ui/Toast.tsx'
import { AnimatePresence } from 'motion/react'

export function Toaster() {
  const toast = useToast((state) => state.toast)

  return (
    <div className="pointer-events-none fixed inset-x-3 top-2 z-50 flex justify-center md:top-[140px]">
      <AnimatePresence mode="wait">
        {toast && (
          <Appear key={toast.id} className="pointer-events-auto w-full md:w-auto">
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

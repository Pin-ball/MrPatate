import { orientationStep, PERMISSION_GRANTED, TILT_QUERY } from '@src/lib/parallax.ts'
import { showToast, useToast } from '@src/stores/toast.ts'
import { useEffect, useEffectEvent } from 'react'
import { useTranslation } from 'react-i18next'

type PermissionRequest = () => Promise<unknown>

const ORIENTATION_KEY = 'mr-patate:orientation'

const ASK_TOAST_DURATION = 15000

function permissionRequest(): PermissionRequest | null {
  if (typeof DeviceOrientationEvent === 'undefined') return null
  if (!('requestPermission' in DeviceOrientationEvent)) return null
  const { requestPermission } = DeviceOrientationEvent
  if (typeof requestPermission !== 'function') return null
  return () => requestPermission.call(DeviceOrientationEvent)
}

function readAnswer(): string | null {
  try {
    return localStorage.getItem(ORIENTATION_KEY)
  } catch {
    return null
  }
}

function writeAnswer(answer: string): void {
  try {
    localStorage.setItem(ORIENTATION_KEY, answer)
  } catch {}
}

function writeDecline(): void {
  writeAnswer(String(Date.now()))
}

export function useOrientationPermission() {
  const { t } = useTranslation()

  const showPrompt = useEffectEvent((ask: () => void) => {
    showToast(
      t('parallax.ask'),
      { label: t('parallax.enable'), onClick: ask },
      { duration: ASK_TOAST_DURATION, onExpire: writeDecline },
    )
  })

  useEffect(() => {
    if (!matchMedia(TILT_QUERY).matches) return
    const request = permissionRequest()
    if (!request) return

    const ask = () => {
      request()
        .then((answer) => (answer === PERMISSION_GRANTED ? writeAnswer(answer) : writeDecline()))
        .catch(() => {})
    }

    const onTouch = () => {
      if (useToast.getState().toast) return
      listeners.abort()
      const step = orientationStep(readAnswer(), Date.now())
      if (step === 'request') ask()
      if (step === 'prompt') showPrompt(ask)
    }

    const listeners = new AbortController()
    addEventListener('touchend', onTouch, listeners)

    return () => listeners.abort()
  }, [])
}

import { decodeLook, withoutLook } from '@src/lib/share.ts'
import { setLook } from '@src/stores/editor.ts'
import { showToast } from '@src/stores/toast.ts'
import { useLayoutEffect } from 'react'
import { useTranslation } from 'react-i18next'

export function useSharedLink() {
  const { t } = useTranslation()

  useLayoutEffect(() => {
    const shared = decodeLook(location.search)
    if (!shared) return

    setLook(shared.look)
    history.replaceState(history.state, '', withoutLook(location.href))
    if (!shared.complete) showToast(t('toast_link_incomplete'))
  }, [t])
}

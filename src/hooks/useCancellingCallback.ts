import CancellationToken from 'cancellationtoken'
import { DependencyList, useCallback, useEffect, useMemo } from 'react'

const useCancellingCallback = <T extends (cancellationToken: CancellationToken, ...args: any[]) => any>(callback: T, deps: DependencyList) => {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const { token, cancel } = useMemo(() => CancellationToken.create(), deps)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const cb = useCallback(callback, deps)

  useEffect(() => {
    return () => {
      cancel()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)

  return cb.bind(cb, token)
}
export default useCancellingCallback

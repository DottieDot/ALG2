import CancellationToken from 'cancellationtoken'
import { DependencyList, useEffect, useMemo } from 'react'

const useCancellingCallback = <T extends (cancellationToken: CancellationToken, ...args: any[]) => any>(callback: T, deps: DependencyList) => {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const { token, cancel } = useMemo(() => CancellationToken.create(), deps)

  useEffect(() => {
    return () => {
      cancel()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)

  return useMemo(() => (
    callback.bind(callback, token)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  ), deps)
}
export default useCancellingCallback

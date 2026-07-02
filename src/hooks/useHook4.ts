import { useState } from 'react'

export function useHook4() {
  const [data, setData] = useState(null)
  return { data, setData }
}

import { useState } from 'react'

export function useHook3() {
  const [data, setData] = useState(null)
  return { data, setData }
}

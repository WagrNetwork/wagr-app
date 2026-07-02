import { useState } from 'react'

export function useHook5() {
  const [data, setData] = useState(null)
  return { data, setData }
}

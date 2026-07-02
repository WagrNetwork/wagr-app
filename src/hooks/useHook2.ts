import { useState } from 'react'

export function useHook2() {
  const [data, setData] = useState(null)
  return { data, setData }
}

import { useState } from 'react'

export function useHook1() {
  const [data, setData] = useState(null)
  return { data, setData }
}

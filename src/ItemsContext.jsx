import React, { createContext, useContext, useEffect, useState } from 'react'
import { getItems } from '../sanity/queries'

const ItemsContext = createContext([])

let cache = null

export function ItemsProvider({ children }) {
  const [items, setItems] = useState(cache || [])

  useEffect(() => {
    if (cache) return
    getItems().then((data) => {
      cache = data
      setItems(data)
    })
  }, [])

  return <ItemsContext.Provider value={items}>{children}</ItemsContext.Provider>
}

export const useItems = () => useContext(ItemsContext)

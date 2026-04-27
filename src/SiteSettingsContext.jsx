import React, { createContext, useContext, useEffect, useState } from 'react'
import { getSiteSettings } from '../sanity/queries'
import {
  CURRENT_QUESTION,
  CURRENT_QUESTION_AUTHOR,
  CURRENT_QUESTION_AUTHOR_INSTAGRAM,
} from './utils/constants'

const defaults = {
  currentQuestion: CURRENT_QUESTION,
  currentQuestionAuthor: CURRENT_QUESTION_AUTHOR,
  currentQuestionAuthorInstagram: CURRENT_QUESTION_AUTHOR_INSTAGRAM,
}

const SiteSettingsContext = createContext(defaults)

let cache = null

export function SiteSettingsProvider({ children }) {
  const [settings, setSettings] = useState(cache || defaults)

  useEffect(() => {
    if (cache) return
    getSiteSettings().then((data) => {
      if (data) {
        cache = { ...defaults, ...data }
        setSettings(cache)
      }
    })
  }, [])

  return (
    <SiteSettingsContext.Provider value={settings}>
      {children}
    </SiteSettingsContext.Provider>
  )
}

export const useSiteSettings = () => useContext(SiteSettingsContext)

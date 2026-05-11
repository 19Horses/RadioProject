import { createClient } from '@sanity/client'

export const client = createClient({
  projectId: 'yc1lcir6',
  dataset: 'production',
  useCdn: true,
  apiVersion: '2024-01-01',
})

// Convert Sanity portable text blocks → array of HTML strings
// matching the original items.js format that components expect
function ptToHtmlArray(blocks) {
  if (!blocks || !Array.isArray(blocks)) return []
  return blocks.map((block) => {
    if (block._type !== 'block') return null
    return block.children
      .map((span) => {
        let text = span.text || ''
        if (span.marks?.includes('strong')) text = `<b>${text}</b>`
        return text
      })
      .join('')
  }).filter(Boolean)
}

// Convert ISO date "2025-04-05" → "5/4/25" (original items.js format)
function isoToShortDate(iso) {
  if (!iso) return null
  const [year, month, day] = iso.split('-')
  return `${parseInt(day)}/${parseInt(month)}/${year.slice(2)}`
}

function transformMix(item) {
  return {
    ...item,
    description: ptToHtmlArray(item.description),
    releaseDate: isoToShortDate(item.releaseDate),
  }
}

function transformRadiogram(item) {
  return {
    ...item,
    summary: ptToHtmlArray(item.summary),
    releaseDate: isoToShortDate(item.releaseDate),
  }
}

const MIX_FIELDS = `
  "id": _id,
  "type": "mix",
  "src": select(count(coverImages) > 0 => coverImages[].asset->url, coverImage.asset->url),
  "mobileSrc": select(count(mobileCoverImages) > 0 => mobileCoverImages[].asset->url, mobileCoverImage.asset->url),
  "src3": coverImageDesktop.asset->url,
  title,
  "title2": artistName,
  "title3": artistRole,
  "title4": subtitle,
  "url": slug.current,
  genre,
  tags,
  hexCodes,
  description,
  "mixId": audioUrl,
  "scLink": soundcloudLink,
  releaseDate,
  broadcastDate,
  length,
  chapters,
  tracklist,
  dontShow,
`

const RADIOGRAM_FIELDS = `
  "id": _id,
  "type": "radiogram",
  "src": coverImage.asset->url,
  "src2": coverImageMobile.asset->url,
  "src3": coverImageDesktop.asset->url,
  title,
  "title2": authorName,
  "title3": authorRole,
  "title4": subtitle,
  "url": slug.current,
  rpCount,
  tag,
  tags,
  hexCodes,
  summary,
  releaseDate,
  broadcastDate,
  length,
  postLink,
  igLink,
  dontShow,
`

export async function getItems() {
  const [mixes, radiograms] = await Promise.all([
    client.fetch(`*[_type == "mix"] | order(releaseDate asc) { ${MIX_FIELDS} }`),
    client.fetch(`*[_type == "radiogram"] | order(releaseDate asc) { ${RADIOGRAM_FIELDS} }`),
  ])

  return [
    ...mixes.map(transformMix),
    ...radiograms.map(transformRadiogram),
  ].sort((a, b) => {
    const toMs = (d) => {
      if (!d) return 0
      const parts = d.split('/')
      if (parts.length !== 3) return 0
      const [day, month, year] = parts
      return new Date(`20${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`).getTime()
    }
    return toMs(a.releaseDate) - toMs(b.releaseDate)
  })
}

export async function getSiteSettings() {
  return client.fetch(`*[_type == "siteSettings"][0] {
    currentQuestion,
    currentQuestionAuthor,
    "currentQuestionAuthorInstagram": currentQuestionAuthorInstagram
  }`)
}

export async function getItemBySlug(slug) {
  const [mix, radiogram] = await Promise.all([
    client.fetch(`*[_type == "mix" && slug.current == $slug][0] { ${MIX_FIELDS} }`, { slug }),
    client.fetch(`*[_type == "radiogram" && slug.current == $slug][0] { ${RADIOGRAM_FIELDS} }`, { slug }),
  ])

  if (mix) return transformMix(mix)
  if (radiogram) return transformRadiogram(radiogram)
  return null
}

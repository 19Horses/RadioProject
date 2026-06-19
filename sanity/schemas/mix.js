const tracklistItem = {
  type: 'object',
  name: 'tracklistItem',
  fields: [
    { name: 'title', title: 'Title', type: 'string' },
    { name: 'artist', title: 'Artist', type: 'string' },
    { name: 'startTime', title: 'Chapter Start Time (seconds)', type: 'string', description: 'Only set this for chapter header rows' },
  ],
  preview: {
    select: { title: 'title', subtitle: 'artist' },
  },
}

const chapter = {
  type: 'object',
  name: 'chapter',
  fields: [
    { name: 'startTime', title: 'Start Time (seconds)', type: 'number' },
    { name: 'title', title: 'Title', type: 'string' },
  ],
  preview: {
    select: { title: 'title', subtitle: 'startTime' },
  },
}

export default {
  name: 'mix',
  title: 'Mix',
  type: 'document',
  fields: [
    { name: 'title', title: 'Mix Title', type: 'string' },
    { name: 'artistName', title: 'Artist Name', type: 'string' },
    { name: 'artistRole', title: 'Artist Role', type: 'string', description: 'e.g. "Musician", "DJs"' },
    { name: 'subtitle', title: 'Subtitle', type: 'string', description: 'e.g. "Mix + Interview"' },
    {
      name: 'slug',
      title: 'URL Slug',
      type: 'slug',
      options: { source: 'artistName' },
    },
    { name: 'genre', title: 'Genre', type: 'string', description: 'e.g. "DIGITAL PUNK"' },
    { name: 'coverImage', title: 'Cover Image', type: 'image' },
    {
      name: 'coverImages',
      title: 'Cover Images (slideshow)',
      type: 'array',
      of: [{ type: 'image' }],
      description: 'Upload 2+ images to enable a crossfading slideshow. If set, overrides Cover Image.',
    },
    { name: 'mobileCoverImage', title: 'Mobile Cover Image', type: 'image', description: 'Image shown in the mobile top bar. Falls back to Cover Image if not set.' },
    {
      name: 'mobileCoverImages',
      title: 'Mobile Cover Images (slideshow)',
      type: 'array',
      of: [{ type: 'image' }],
      description: 'Upload 2+ images for a crossfading slideshow in the mobile top bar. Overrides Mobile Cover Image.',
    },
    { name: 'fullScreenImage', title: 'Full Screen Picture', type: 'image', description: 'Image shown full screen.' },
    {
      name: 'fullScreenImages',
      title: 'Full Screen Pictures (slideshow)',
      type: 'array',
      of: [{ type: 'image' }],
      description: 'Upload 2+ images for a crossfading full screen slideshow. If set, overrides Full Screen Picture.',
    },
    {
      name: 'dualFullScreen',
      title: 'Dual Full Screen',
      type: 'boolean',
      description: 'Show the full screen image at 90vw instead of 45vw on desktop.',
      initialValue: false,
    },
    { name: 'audioUrl', title: 'Audio URL', type: 'url' },
    { name: 'soundcloudLink', title: 'SoundCloud Link', type: 'url' },
    {
      name: 'tags',
      title: 'Tags',
      type: 'array',
      of: [{ type: 'string' }],
      options: { layout: 'tags' },
    },
    {
      name: 'hexCodes',
      title: 'Hex Codes',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'Exactly 2 hex colours — foreground and background',
      validation: (Rule) => Rule.max(2),
    },
    { name: 'releaseDate', title: 'Release Date', type: 'date' },
    { name: 'broadcastDate', title: 'Broadcast Date', type: 'datetime' },
    { name: 'length', title: 'Length', type: 'string', description: 'e.g. "01:26:06"' },
    {
      name: 'description',
      title: 'Description',
      type: 'array',
      of: [{ type: 'block', styles: [], lists: [] }],
      description: 'Short artist bio shown on the card. Use bold for names.',
    },
    {
      name: 'chapters',
      title: 'Chapters',
      type: 'array',
      of: [chapter],
    },
    {
      name: 'tracklist',
      title: 'Tracklist',
      type: 'array',
      of: [tracklistItem],
    },
    {
      name: 'dontShow',
      title: 'Hidden',
      type: 'boolean',
      description: 'Hide this item from the site',
      initialValue: false,
    },
  ],
  preview: {
    select: { title: 'artistName', subtitle: 'title', media: 'coverImage' },
  },
  orderings: [
    {
      title: 'Release Date',
      name: 'releaseDateDesc',
      by: [{ field: 'releaseDate', direction: 'desc' }],
    },
  ],
}

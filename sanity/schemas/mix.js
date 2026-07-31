const transcriptTurn = {
  type: 'object',
  name: 'transcriptTurn',
  fields: [
    {
      name: 'speaker',
      title: 'Speaker',
      type: 'string',
      options: {
        list: [
          { title: 'RADIOproject', value: 'RP' },
          { title: 'Guest', value: 'guest' },
        ],
        layout: 'radio',
        direction: 'horizontal',
      },
      initialValue: 'RP',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'text',
      title: 'Text',
      type: 'array',
      description: 'Select words and hit Bold (or ⌘B) to emphasise them.',
      of: [
        {
          type: 'block',
          styles: [{ title: 'Normal', value: 'normal' }],
          lists: [],
          marks: {
            decorators: [{ title: 'Bold', value: 'strong' }],
            annotations: [
              {
                name: 'contextNote',
                type: 'object',
                title: 'Context Note',
                description:
                  'Select a phrase and add a note. On the site the phrase becomes clickable and the note appears beside it.',
                fields: [
                  {
                    name: 'note',
                    title: 'Note',
                    type: 'text',
                    rows: 3,
                    validation: (Rule) => Rule.required(),
                  },
                ],
              },
            ],
          },
        },
      ],
      validation: (Rule) => Rule.required(),
    },
  ],
  preview: {
    select: { speaker: 'speaker', text: 'text' },
    prepare({ speaker, text }) {
      // `text` is portable text; older entries may still be a plain string
      const plain =
        typeof text === 'string'
          ? text
          : (text || [])
              .map((block) => (block.children || []).map((s) => s.text).join(''))
              .join(' ')
      return { title: plain || '(empty)', subtitle: speaker === 'guest' ? 'Guest' : 'RP' }
    },
  },
}

const tracklistItem = {
  type: 'object',
  name: 'tracklistItem',
  fields: [
    { name: 'title', title: 'Title', type: 'string' },
    { name: 'artist', title: 'Artist', type: 'string' },
    { name: 'startTime', title: 'Chapter Start Time (seconds)', type: 'string', description: 'Only set this for chapter header rows' },
    {
      name: 'transcript',
      title: 'Interview Transcript',
      type: 'array',
      of: [transcriptTurn],
      description:
        'Only used for PROJECT-section topics — the transcript unfolds under the topic when it is clicked. Speakers labelled "Guest" are shown with the artist\'s initials automatically.',
    },
  ],
  preview: {
    select: { title: 'title', subtitle: 'artist', transcript: 'transcript' },
    prepare({ title, subtitle, transcript }) {
      const turns = transcript?.length
      return {
        title,
        subtitle: turns ? `${subtitle || ''} — ${turns} transcript lines`.trim() : subtitle,
      }
    },
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
    { name: 'audioUrl', title: 'Audio URL', type: 'url' },
    {
      name: 'tags',
      title: 'Tags',
      type: 'array',
      of: [{ type: 'string' }],
      options: { layout: 'tags' },
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
      name: 'transcriptInitials',
      title: 'Transcript Initials (Guest)',
      type: 'string',
      description:
        'How the guest is labelled in interview transcripts, e.g. "DV". Leave blank to use the initials of the artist name.',
      validation: (Rule) => Rule.max(5),
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

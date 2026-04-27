export default {
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  __experimental_actions: ['update', 'publish'],
  fields: [
    {
      name: 'currentQuestion',
      title: 'Current Question',
      type: 'string',
    },
    {
      name: 'currentQuestionAuthor',
      title: 'Question Author',
      type: 'string',
    },
    {
      name: 'currentQuestionAuthorInstagram',
      title: 'Question Author Instagram URL',
      type: 'url',
    },
  ],
  preview: {
    select: { title: 'currentQuestion' },
    prepare({ title }) {
      return { title: title || 'Site Settings' }
    },
  },
}

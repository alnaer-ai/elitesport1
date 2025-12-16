import {defineField, defineType} from 'sanity';

export default defineType({
  name: 'page',
  title: 'Page',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        slugify: (value) =>
          value
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, ''),
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'hero',
      title: 'Hero',
      type: 'reference',
      to: [{type: 'hero'}],
      description:
        'Optional reference for historical link; published heroes are rendered by slug instead.',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      slug: 'slug.current',
      heroTitle: 'hero.title',
    },
    prepare(selection) {
      const {slug, heroTitle} = selection;
      return {
        ...selection,
        subtitle: [slug, heroTitle ? `Hero: ${heroTitle}` : null].filter(Boolean).join(' • '),
      };
    },
  },
});

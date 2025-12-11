import {defineArrayMember, defineField, defineType} from 'sanity';

export default defineType({
  name: 'membershipInfo',
  title: 'Membership Info',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Section Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'heroDescription',
      title: 'Hero Description',
      type: 'text',
    }),
    defineField({
      name: 'ctaLabel',
      title: 'Call to Action Label',
      type: 'string',
    }),
    defineField({
      name: 'ctaUrl',
      title: 'Call to Action URL',
      type: 'url',
    }),
    defineField({
      name: 'tiers',
      title: 'Membership Tiers',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'membershipTier',
          title: 'Membership Tier',
          fields: [
            defineField({
              name: 'name',
              title: 'Tier Name',
              type: 'string',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'price',
              title: 'Price',
              type: 'string',
              description: 'Display-friendly price such as "$199 / month".',
            }),
            defineField({
              name: 'benefits',
              title: 'Benefits',
              type: 'array',
              of: [{type: 'string'}],
            }),
            defineField({
              name: 'isPopular',
              title: 'Mark as Popular',
              type: 'boolean',
              initialValue: false,
            }),
          ],
        }),
      ],
    }),
    defineField({
      name: 'faq',
      title: 'FAQs',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({name: 'question', title: 'Question', type: 'string'}),
            defineField({name: 'answer', title: 'Answer', type: 'text'}),
          ],
        }),
      ],
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'heroDescription',
    },
  },
});

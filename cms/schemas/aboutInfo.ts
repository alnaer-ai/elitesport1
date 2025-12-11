import {defineArrayMember, defineField, defineType} from 'sanity';

export default defineType({
  name: 'aboutInfo',
  title: 'About Us Info',
  type: 'document',
  fields: [
    defineField({
      name: 'heroEyebrow',
      title: 'Hero Eyebrow',
      type: 'string',
      description: 'Short label that appears above the headline.',
    }),
    defineField({
      name: 'heroTitle',
      title: 'Hero Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'heroDescription',
      title: 'Hero Description',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'heroImage',
      title: 'Hero Image',
      type: 'image',
      options: {hotspot: true},
    }),
    defineField({
      name: 'companyDescription',
      title: 'Company Description',
      type: 'text',
      rows: 4,
    }),
    defineField({
      name: 'missionStatement',
      title: 'Mission Statement',
      type: 'text',
    }),
    defineField({
      name: 'missionImage',
      title: 'Mission Supporting Image',
      type: 'image',
      options: {hotspot: true},
    }),
    defineField({
      name: 'vision',
      title: 'Vision',
      type: 'text',
    }),
    defineField({
      name: 'visionImage',
      title: 'Vision Supporting Image',
      type: 'image',
      options: {hotspot: true},
    }),
    defineField({
      name: 'storyHeading',
      title: 'Story Heading',
      type: 'string',
    }),
    defineField({
      name: 'storyIntro',
      title: 'Story Intro',
      type: 'text',
    }),
    defineField({
      name: 'timeline',
      title: 'Story Timeline',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({
              name: 'year',
              title: 'Year',
              type: 'string',
            }),
            defineField({
              name: 'title',
              title: 'Title',
              type: 'string',
            }),
            defineField({
              name: 'description',
              title: 'Description',
              type: 'text',
            }),
          ],
        }),
      ],
    }),
    defineField({
      name: 'teamMembers',
      title: 'Team Members',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'teamMember',
          fields: [
            defineField({
              name: 'name',
              title: 'Name',
              type: 'string',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'role',
              title: 'Role',
              type: 'string',
            }),
            defineField({
              name: 'bio',
              title: 'Bio',
              type: 'text',
            }),
            defineField({
              name: 'photo',
              title: 'Photo',
              type: 'image',
              options: {hotspot: true},
            }),
          ],
        }),
      ],
    }),
    defineField({
      name: 'coreValues',
      title: 'Core Values',
      type: 'array',
      of: [{type: 'string'}],
    }),
    defineField({
      name: 'differentiators',
      title: 'What Makes Us Different',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({name: 'title', title: 'Title', type: 'string'}),
            defineField({name: 'description', title: 'Description', type: 'text'}),
          ],
        }),
      ],
    }),
  ],
  preview: {
    select: {
      title: 'missionStatement',
      subtitle: 'companyDescription',
    },
    prepare({title, subtitle}) {
      return {
        title: title || 'About Us Content',
        subtitle: subtitle
          ? subtitle.substring(0, 80).concat(subtitle.length > 80 ? '…' : '')
          : undefined,
      };
    },
  },
});

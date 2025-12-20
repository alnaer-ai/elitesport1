import {defineArrayMember, defineField, defineType} from 'sanity';

export default defineType({
  name: 'aboutInfo',
  title: 'About Us Info',
  type: 'document',
  fields: [
    defineField({
      name: 'companyDescription',
      title: 'Company Description',
      type: 'text',
      rows: 4,
    }),
    defineField({
      name: 'missionSectionEyebrow',
      title: 'Mission Section Eyebrow',
      type: 'string',
    }),
    defineField({
      name: 'missionSectionTitle',
      title: 'Mission Section Title',
      type: 'string',
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
      name: 'valuesSectionEyebrow',
      title: 'Values Section Eyebrow',
      type: 'string',
    }),
    defineField({
      name: 'valuesSectionTitle',
      title: 'Values Section Title',
      type: 'string',
    }),
    defineField({
      name: 'valuesSectionDescription',
      title: 'Values Section Description',
      type: 'text',
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
    defineField({
      name: 'teamSectionEyebrow',
      title: 'Team Section Eyebrow',
      type: 'string',
    }),
    defineField({
      name: 'teamSectionTitle',
      title: 'Team Section Title',
      type: 'string',
    }),
    defineField({
      name: 'teamSectionDescription',
      title: 'Team Section Description',
      type: 'text',
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


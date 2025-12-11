import {defineArrayMember, defineField, defineType} from 'sanity';

export default defineType({
  name: 'contactInfo',
  title: 'Contact Info',
  type: 'document',
  fields: [
    defineField({
      name: 'address',
      title: 'Address',
      type: 'text',
      rows: 2,
    }),
    defineField({
      name: 'phone',
      title: 'Phone Number',
      type: 'string',
    }),
    defineField({
      name: 'email',
      title: 'Email',
      type: 'string',
    }),
    defineField({
      name: 'mapLocation',
      title: 'Map Coordinates',
      type: 'geopoint',
    }),
    defineField({
      name: 'hours',
      title: 'Business Hours',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({name: 'label', title: 'Label', type: 'string'}),
            defineField({name: 'value', title: 'Hours', type: 'string'}),
          ],
        }),
      ],
    }),
    defineField({
      name: 'socialLinks',
      title: 'Social Links',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({name: 'platform', title: 'Platform', type: 'string'}),
            defineField({name: 'url', title: 'URL', type: 'url'}),
          ],
        }),
      ],
    }),
  ],
  preview: {
    select: {
      title: 'address',
      subtitle: 'phone',
    },
  },
});

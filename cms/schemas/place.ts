import {defineField, defineType} from 'sanity';

const placeCategories = [
  {title: 'Hotel', value: 'hotel'},
  {title: 'Gym', value: 'gym'},
  {title: 'Female Club', value: 'female'},
  {title: 'Kids Club', value: 'kids'},
  {title: 'Spa', value: 'spa'},
  {title: 'Tennis & Squash', value: 'tennisSquash'},
];

export default defineType({
  name: 'place',
  title: 'Place',
  type: 'document',
  groups: [
    {name: 'details', title: 'Details', default: true},
    {name: 'flags', title: 'Highlights'},
  ],
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
      group: 'details',
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {
        list: placeCategories,
        layout: 'radio',
      },
      validation: (Rule) => Rule.required(),
      group: 'details',
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 4,
      group: 'details',
    }),
    defineField({
      name: 'image',
      title: 'Image',
      type: 'image',
      options: {hotspot: true},
      group: 'details',
    }),
    defineField({
      name: 'tags',
      title: 'Tags',
      type: 'array',
      of: [{type: 'string'}],
      description: 'Free-form tags for search or filtering.',
      group: 'details',
    }),
    defineField({
      name: 'isMostPopular',
      title: 'Most Popular',
      type: 'boolean',
      description: 'Mark to include in the “Most Popular” home page section.',
      initialValue: false,
      group: 'flags',
    }),
    defineField({
      name: 'isNearby',
      title: 'Nearby Highlight',
      type: 'boolean',
      description: 'Mark to include in “Nearby” or location-focused sections.',
      initialValue: false,
      group: 'flags',
    }),
    defineField({
      name: 'priority',
      title: 'Display Priority',
      type: 'number',
      description: 'Lower numbers show first when sorted manually.',
      group: 'flags',
    }),
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'category',
      media: 'image',
      isMostPopular: 'isMostPopular',
    },
    prepare(selection) {
      const {title, subtitle, isMostPopular} = selection;
      return {
        ...selection,
        subtitle: [subtitle, isMostPopular ? 'Most Popular' : null]
          .filter(Boolean)
          .join(' • '),
      };
    },
  },
});

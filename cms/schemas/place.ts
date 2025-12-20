import {defineField, defineType} from 'sanity';

const placeCategories = [
  {title: 'Hotel', value: 'hotel'},
  {title: 'Gym', value: 'gym'},
  {title: 'Female Club', value: 'female'},
  {title: 'Kids Club', value: 'kids'},
  {title: 'Tennis & Squash', value: 'tennisSquash'},
  {title: 'Wellness', value: 'wellness'},
];

const getCategoryTitle = (value?: string) => {
  if (!value) return undefined;
  return placeCategories.find((item) => item.value === value)?.title ?? value;
};

export default defineType({
  name: 'place',
  title: 'Place',
  type: 'document',
  groups: [
    {name: 'card', title: 'Card Fields', default: true},
    {name: 'details', title: 'Modal Details'},
  ],
  fields: [
    defineField({
      name: 'name',
      title: 'Place Name',
      type: 'string',
      description: 'Displayed on cards and inside the modal header.',
      validation: (Rule) => Rule.required().error('Place name is required.'),
      group: 'card',
    }),
    defineField({
      name: 'placeType',
      title: 'Place Type',
      type: 'string',
      description: 'Category used for grouping and filtering.',
      options: {
        list: placeCategories,
        layout: 'radio',
      },
      validation: (Rule) => Rule.required().error('Place type is required.'),
      group: 'card',
    }),
    defineField({
      name: 'location',
      title: 'Location Label',
      type: 'string',
      description: 'Short location text shown on cards (e.g., "Dubai Marina").',
      validation: (Rule) => Rule.required().error('Location label is required.'),
      group: 'card',
    }),
    defineField({
      name: 'featuredImage',
      title: 'Featured Image',
      type: 'image',
      description: 'Primary image used on cards and in the modal.',
      options: {hotspot: true},
      validation: (Rule) => Rule.required().error('Featured image is required.'),
      group: 'card',
      fields: [
        defineField({
          name: 'alt',
          title: 'Alt Text',
          type: 'string',
          description: 'Accessibility text. Leave empty to auto-generate from the place name.',
        }),
      ],
    }),
    defineField({
      name: 'images',
      title: 'Gallery Images',
      type: 'array',
      of: [
        {
          type: 'image',
          options: {hotspot: true},
          fields: [
            {
              name: 'alt',
              type: 'string',
              title: 'Alt Text',
            },
          ],
        },
      ],
      description: 'Additional images displayed in the modal gallery.',
      group: 'details',
    }),
    defineField({
      name: 'showInMostPopular',
      title: 'Show in Most Popular',
      type: 'boolean',
      description: 'Enable this to display the place in the Most Popular section.',
      initialValue: false,
      group: 'card',
    }),
    defineField({
      name: 'overview',
      title: 'Overview',
      type: 'array',
      of: [{type: 'block'}],
      description: 'Short rich overview shown at the top of the modal.',
      group: 'details',
    }),
    defineField({
      name: 'benefits',
      title: 'Benefits',
      type: 'array',
      of: [{type: 'string'}],
      description: 'List of benefits (bullet points).',
      group: 'details',
    }),
  ],
  preview: {
    select: {
      title: 'name',
      placeType: 'placeType',
      location: 'location',
      media: 'featuredImage',
    },
    prepare(selection) {
      const {title, placeType, location, media} = selection;
      const subtitleParts = [getCategoryTitle(placeType), location].filter(Boolean);
      return {
        title: title || 'Untitled Place',
        subtitle: subtitleParts.join(' • ') || 'Place',
        media,
      };
    },
  },
});

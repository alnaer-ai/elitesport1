import {defineField, defineType} from 'sanity';

const promotionTypes = [
  {title: 'Hotel', value: 'hotel'},
  {title: 'Gym', value: 'gym'},
  {title: 'Female Club', value: 'female'},
  {title: 'Kids Club', value: 'kids'},
  {title: 'Tennis & Squash', value: 'tennisSquash'},
  {title: 'Dining', value: 'dining'},
  {title: 'Retail', value: 'retail'},
];

const isValidCtaAction = (value?: string) => {
  if (!value) return true;
  if (value.startsWith('/')) return true;

  try {
    new URL(value);
    return true;
  } catch {
    return 'CTA Action must be a valid URL or an internal route starting with /.';
  }
};

export default defineType({
  name: 'promotion',
  title: 'Promotion',
  type: 'document',
  groups: [
    {name: 'content', title: 'Content', default: true},
    {name: 'cta', title: 'CTA'},
    {name: 'publishing', title: 'Publishing'},
  ],
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      description: 'Displayed on the promotions page and in the promotion modal.',
      validation: (Rule) => Rule.required().error('Promotion title is required.'),
      group: 'content',
    }),
    defineField({
      name: 'featuredImage',
      title: 'Featured Image',
      type: 'image',
      description: 'Primary image used on promotion cards and in the modal header.',
      options: {hotspot: true},
      validation: (Rule) => Rule.required().error('Featured image is required.'),
      group: 'content',
      fields: [
        defineField({
          name: 'alt',
          title: 'Alt Text',
          type: 'string',
          description: 'Accessibility text. Leave empty to auto-generate from the title.',
        }),
      ],
    }),
    defineField({
      name: 'overview',
      title: 'Overview',
      type: 'array',
      of: [{type: 'block'}],
      description: 'Rich text overview shown in the promotion detail view.',
      group: 'content',
    }),
    defineField({
      name: 'benefits',
      title: 'Benefits',
      type: 'array',
      of: [{type: 'string'}],
      description: 'Bullet point list shown in the promotion detail view.',
      group: 'content',
    }),
    defineField({
      name: 'discountPercentage',
      title: 'Discount Percentage',
      type: 'number',
      description: 'Optional badge value. Use integers between 0 and 100.',
      group: 'content',
      validation: (Rule) =>
        Rule.custom((value) => {
          if (value === undefined || value === null) return true;
          if (value >= 0 && value <= 100) return true;
          return 'Discount must be between 0% and 100%.';
        }),
    }),
    defineField({
      name: 'promotionType',
      title: 'Category',
      type: 'string',
      options: {
        list: promotionTypes,
        layout: 'dropdown',
      },
      description: 'Optional label used for filtering and display badges.',
      group: 'content',
    }),
    defineField({
      name: 'ctaLabel',
      title: 'CTA Label',
      type: 'string',
      description: 'Button label shown in the promotion detail view.',
      group: 'cta',
    }),
    defineField({
      name: 'ctaAction',
      title: 'CTA Action',
      type: 'string',
      description: 'URL or internal route (e.g. https://example.com or /memberships).',
      validation: (Rule) => Rule.custom(isValidCtaAction),
      group: 'cta',
    }),
    defineField({
      name: 'isPublished',
      title: 'Publish Status',
      type: 'boolean',
      initialValue: true,
      group: 'publishing',
    }),
    defineField({
      name: 'publishStartDate',
      title: 'Publish Start Date',
      type: 'datetime',
      description: 'Optional start date for scheduled promotions.',
      group: 'publishing',
    }),
    defineField({
      name: 'publishEndDate',
      title: 'Publish End Date',
      type: 'datetime',
      description: 'Optional end date for time-limited promotions.',
      group: 'publishing',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      media: 'featuredImage',
      isPublished: 'isPublished',
      publishStartDate: 'publishStartDate',
      publishEndDate: 'publishEndDate',
      discount: 'discountPercentage',
    },
    prepare(selection) {
      const {title, media, isPublished, publishStartDate, publishEndDate, discount} =
        selection;
      const now = Date.now();
      const start = publishStartDate ? Date.parse(publishStartDate) : null;
      const end = publishEndDate ? Date.parse(publishEndDate) : null;

      let status = isPublished === false ? 'Unpublished' : 'Published';
      if (start && !Number.isNaN(start) && start > now) {
        status = 'Scheduled';
      }
      if (end && !Number.isNaN(end) && end <= now) {
        status = 'Ended';
      }

      const parts = [
        typeof discount === 'number' ? `${discount}% off` : null,
        status,
      ]
        .filter(Boolean)
        .join(' • ');

      return {
        title: title || 'Untitled Promotion',
        subtitle: parts || 'Promotion',
        media,
      };
    },
  },
});

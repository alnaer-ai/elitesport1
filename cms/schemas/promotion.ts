import {defineField, defineType} from 'sanity';

export default defineType({
  name: 'promotion',
  title: 'Promotion',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'promoCode',
      title: 'Promo Code',
      type: 'string',
      description: 'Optional code shown on the site for members to redeem.',
    }),
    defineField({
      name: 'image',
      title: 'Promo Image',
      type: 'image',
      options: {hotspot: true},
    }),
    defineField({
      name: 'imageAlt',
      title: 'Image Alt Text',
      type: 'string',
      description: 'Optional descriptive text for the promo image.',
    }),
    defineField({
      name: 'validFrom',
      title: 'Valid From',
      type: 'date',
    }),
    defineField({
      name: 'validTo',
      title: 'Valid To',
      type: 'date',
    }),
    defineField({
      name: 'isFeatured',
      title: 'Featured Promotion',
      type: 'boolean',
      initialValue: false,
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
  ],
  preview: {
    select: {
      title: 'title',
      media: 'image',
      validFrom: 'validFrom',
      validTo: 'validTo',
    },
    prepare(selection) {
      const {validFrom, validTo} = selection;
      const dateRange = [validFrom, validTo].filter(Boolean).join(' → ');
      return {
        ...selection,
        subtitle: dateRange || 'Ongoing',
      };
    },
  },
});

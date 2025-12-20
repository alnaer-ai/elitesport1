import {defineField, defineType, type SanityDocument} from 'sanity';

const mediaTypes = [
  {title: 'Image', value: 'image'},
  {title: 'Video', value: 'video'},
];

const layoutVariants = [
  {title: 'Centered', value: 'centered'},
  {title: 'Split', value: 'split'},
  {title: 'Overlay', value: 'overlay'},
];

const textAlignments = [
  {title: 'Left', value: 'left'},
  {title: 'Center', value: 'center'},
  {title: 'Right', value: 'right'},
];

const HERO_TARGET_PAGE_OPTIONS = [
  {title: 'Home', value: 'home'},
  {title: 'About', value: 'about'},
  {title: 'Contact', value: 'contact'},
  {title: 'Memberships', value: 'memberships'},
  {title: 'Partners & Clients', value: 'partners-clients'},
  {title: 'Places', value: 'places'},
  {title: 'Promotions', value: 'promotions'},
];

export default defineType({
  name: 'hero',
  title: 'Hero',
  type: 'document',
  groups: [
    {name: 'content', title: 'Content', default: true},
    {name: 'media', title: 'Media'},
    {name: 'layout', title: 'Layout'},
    {name: 'slideshow', title: 'Slideshow (Home Page Only)'},
    {name: 'publishing', title: 'Publishing'},
  ],
  fields: [
    defineField({
      name: 'internalName',
      title: 'Internal Name',
      type: 'string',
      description: 'Editor-facing label to quickly find this hero.',
      validation: (Rule) =>
        Rule.required().error('Give the hero an internal name for reference.'),
      group: 'content',
    }),
    defineField({
      name: 'targetPage',
      title: 'Target Page',
      type: 'reference',
      to: [{type: 'page'}],
      description: 'Only this page will render this hero when published.',
      group: 'content',
      hidden: true,
    }),
    defineField({
      name: 'targetSlug',
      title: 'Target Page Slug',
      type: 'string',
      description:
        'Choose the page this hero should display on (the drop-down helps avoid typos).',
      options: {
        list: HERO_TARGET_PAGE_OPTIONS,
        layout: 'dropdown',
      },
      validation: (Rule) =>
        Rule.required().error('Pick the page slug this hero targets.'),
      group: 'publishing',
    }),
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required().error('Hero titles are required.'),
      group: 'content',
    }),
    defineField({
      name: 'subtitle',
      title: 'Subtitle',
      type: 'text',
      rows: 3,
      group: 'content',
    }),
    defineField({
      name: 'mediaType',
      title: 'Media Type',
      type: 'string',
      options: {
        list: mediaTypes,
        layout: 'radio',
      },
      initialValue: 'image',
      validation: (Rule) => Rule.required(),
      group: 'media',
    }),
    defineField({
      name: 'image',
      title: 'Image',
      type: 'image',
      options: {hotspot: true},
      group: 'media',
      hidden: ({document}) => document?.mediaType !== 'image',
      validation: (Rule) =>
        Rule.custom((value, context) => {
          if (context.document?.mediaType === 'image' && !value) {
            return 'Provide an image when using the image media type.';
          }
          return true;
        }),
    }),
    defineField({
      name: 'video',
      title: 'Video',
      type: 'object',
      group: 'media',
      options: {collapsible: true},
      hidden: ({document}) => document?.mediaType !== 'video',
      fields: [
        defineField({
          name: 'file',
          title: 'Upload',
          type: 'file',
          options: {accept: 'video/*'},
        }),
        defineField({
          name: 'url',
          title: 'Hosted Video URL',
          type: 'url',
          description: 'Use for Vimeo/MP4 links when not uploading directly.',
        }),
      ],
      validation: (Rule) =>
        Rule.custom((value, context) => {
          if (context.document?.mediaType === 'video') {
            if (value?.file || value?.url) {
              return true;
            }
            return 'Upload a file or supply a video URL when using the video media type.';
          }
          return true;
        }),
    }),
    defineField({
      name: 'ctaLabel',
      title: 'CTA Label',
      type: 'string',
      group: 'content',
    }),
    defineField({
      name: 'ctaLink',
      title: 'CTA Link',
      type: 'url',
      validation: (Rule) =>
        Rule.uri({
          allowRelative: true,
          scheme: ['http', 'https', 'mailto', 'tel'],
        }),
      group: 'content',
    }),
    defineField({
      name: 'layoutVariant',
      title: 'Layout Variant',
      type: 'string',
      options: {
        list: layoutVariants,
      },
      initialValue: 'overlay',
      validation: (Rule) => Rule.required(),
      group: 'layout',
    }),
    defineField({
      name: 'overlayOpacity',
      title: 'Overlay Opacity (0-100)',
      type: 'number',
      description: 'Applies to the Overlay layout to strengthen contrast.',
      validation: (Rule) => Rule.min(0).max(100),
      hidden: ({document}) => document?.layoutVariant !== 'overlay',
      group: 'layout',
    }),
    defineField({
      name: 'textAlignment',
      title: 'Text Alignment',
      type: 'string',
      options: {
        list: textAlignments,
        layout: 'radio',
      },
      initialValue: 'left',
      validation: (Rule) => Rule.required(),
      group: 'layout',
    }),
    defineField({
      name: 'isPublished',
      title: 'Published',
      type: 'boolean',
      description: 'Publish this hero to show it on the linked page.',
      initialValue: false,
      group: 'publishing',
      validation: (Rule) =>
        Rule.required().custom(async (value, {document, getClient}) => {
          if (!value) {
            return true;
          }

          const client = getClient({apiVersion: '2023-10-31'});
          // Sanity's `document` type inside validation context is intentionally loose.
          // Cast to strict type so we can safely read reference fields without TS errors.
          const doc = document as SanityDocument & {
            targetPage?: {_ref: string};
            targetSlug?: string;
          };
          const pageRef = doc?.targetPage?._ref;
          let targetSlug = doc?.targetSlug;

          if (!targetSlug && pageRef) {
            targetSlug = await client.fetch<string | undefined>(
              `*[_id == $pageRef][0].slug.current`,
              {pageRef}
            );
          }

          if (!targetSlug) {
            return 'Pick the page slug this hero targets before publishing.';
          }

          const docId = doc?._id as string | undefined;
          const publishedDocId = docId?.startsWith('drafts.')
            ? docId.replace(/^drafts\./, '')
            : docId;
          const docIdsToExclude = Array.from(
            new Set([docId, publishedDocId].filter(Boolean))
          ) as string[];

          const duplicateCount = await client.fetch<number>(
            `count(*[_type == "hero" && isPublished == true && (targetSlug == $slug || targetPage->slug.current == $slug) && !(_id in $docIds)])`,
            {
              slug: targetSlug,
              docIds: docIdsToExclude,
            }
          );

          if (duplicateCount > 0) {
            return 'Only one published hero may target a page at a time.';
          }

          return true;
        }),
    }),
  ],
  preview: {
    select: {
      title: 'title',
      targetSlug: 'targetSlug',
      pageTitle: 'targetPage.title',
      internalName: 'internalName',
      media: 'image',
      isPublished: 'isPublished',
    },
    prepare(selection) {
      const {
        title,
        targetSlug,
        pageTitle,
        internalName,
        isPublished,
        media,
      } = selection;
      const slugLabel = targetSlug || pageTitle;
      return {
        title: title || internalName,
        subtitle: [slugLabel, isPublished ? 'Published' : 'Draft']
          .filter(Boolean)
          .join(' • '),
        media,
      };
    },
  },
});

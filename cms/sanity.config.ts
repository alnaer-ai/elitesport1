import {visionTool} from '@sanity/vision';
import {defineConfig} from 'sanity';
import {deskTool, type StructureBuilder} from 'sanity/desk';

import schemaTypes from './schemas';

const projectId =
  process.env['SANITY_STUDIO_PROJECT_ID'] ||
  process.env['SANITY_PROJECT_ID'] ||
  'your-project-id';
const dataset =
  process.env['SANITY_STUDIO_DATASET'] ||
  process.env['SANITY_DATASET'] ||
  'production';

const hiddenDocumentTypes = ['page'];

const structure = (S: StructureBuilder) =>
  S.list()
    .title('Content')
    .items(
      S.documentTypeListItems().filter(
        (listItem) => !hiddenDocumentTypes.includes(listItem.getId() ?? '')
      )
    );

export default defineConfig({
  name: 'elitesport',
  title: 'elitesport',
  projectId,
  dataset,
  plugins: [deskTool({structure}), visionTool()],
  schema: {
    types: schemaTypes,
  },
});

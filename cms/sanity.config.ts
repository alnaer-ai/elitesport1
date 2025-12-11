import {visionTool} from '@sanity/vision';
import {defineConfig} from 'sanity';
import {deskTool} from 'sanity/desk';

import schemaTypes from './schemas';

const projectId =
  process.env.SANITY_STUDIO_PROJECT_ID ||
  process.env.SANITY_PROJECT_ID ||
  'your-project-id';
const dataset =
  process.env.SANITY_STUDIO_DATASET ||
  process.env.SANITY_DATASET ||
  'production';

export default defineConfig({
  name: 'elitesport',
  title: 'elitesport',
  projectId,
  dataset,
  plugins: [deskTool(), visionTool()],
  schema: {
    types: schemaTypes,
  },
});

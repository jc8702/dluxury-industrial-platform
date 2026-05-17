import { createRouteHandler } from 'uploadthing/next';
import { industrialFileRouter } from './core';

export const { GET, POST } = createRouteHandler({
  router: industrialFileRouter,
});

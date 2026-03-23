import { createRouter, createBrowserHistory } from '@tanstack/react-router'
import { routeTree } from './routeTree.gen'

// Get base path from Vite config
const basepath = import.meta.env.BASE_URL

export const router = createRouter({
  routeTree,
  history: createBrowserHistory(),
  basepath,
  defaultPreload: 'intent',
})

// Type augmentation for router
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

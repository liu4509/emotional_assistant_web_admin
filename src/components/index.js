import { defineAsyncComponent } from 'vue'

export default {
  install: (app) => {
    const components = import.meta.glob('./**/*.vue', { eager: true })

    Object.entries(components).forEach(([path, module]) => {
      const componentName = path
        .split('/')
        .pop()
        .replace(/\.\w+$/, '')
        .split('-')
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
        .join('')

      app.component(
        componentName,
        defineAsyncComponent(() => module),
      )
    })
  },
}

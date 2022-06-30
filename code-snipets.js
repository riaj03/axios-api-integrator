module.exports = {
  modelSnippets: {
    imports: `import { http } from 'plugins';
import { endpoints } from './endpoints';`,

    exports: `
export const @{model}Apis = {
@{methdos}
};
`,

    methods: {
      gets: `	get@{pleuralModel}: () => http.get(endpoints.GET_@{toCapPleuralModel}, {})`,
      // Get a single area by id
      get: `	get@{model}: id => http.get(endpoints.GET_@{toCapModel}(id))`,

      // Create a new @{model}
      post: `	post@{model}: payload => http.post(endpoints.POST_@{toCapModel}, payload)`,

      // Put @{model}
      put: `	put@{model}: (payload, id) => http.put(endpoints.PUT_@{toCapModel}(id), payload)`,

      // Delete a @{model}
      delete: `	delete@{model}: id => http.delete(endpoints.DELETE_@{toCapModel}(id))`,
    },
  },

  indexSnippets: `// Export interface (API methods)
export * from './@{model}';
`,

  endpointsSnipptes: `import { apiEndpoints } from '../@{file}';

export const endpoints = Object.freeze({
@{methdos}
});
`,
};

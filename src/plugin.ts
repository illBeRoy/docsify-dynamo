import ejs from 'ejs';
import memoizee from 'memoizee';
import { DocsifyHook, DocsifyVm } from './docsify';

export interface DocsifyDynamoOpts {
  cache?: boolean;
}

export interface DocsifyDynamoRenderProps {
  path: string;
  basename: string;
  query: Record<string, string>;
}

export function docsifyDynamo({ cache = true }: DocsifyDynamoOpts = {}) {
  function memoize<T extends (...args: any[]) => any>(fn: T): T {
    if (cache) {
      return memoizee(fn, { normalizer: JSON.stringify });
    } else {
      return fn;
    }
  }

  const fetchEjsFile = memoize((file: string) => {
    return fetch(file)
      .then((res) => res.text())
      .catch(() => null);
  });

  const renderEjs = memoize(
    (template: string, renderProps: DocsifyDynamoRenderProps) =>
      ejs.render(template, renderProps, { async: true })
  );

  const getDynamicRouteFile = memoize((originalFilePath: string) => {
    const pathParts = originalFilePath.split('/');
    pathParts[pathParts.length - 1] = '[...].md.ejs';
    return pathParts.join('/');
  });

  return function (hook: DocsifyHook, vm: DocsifyVm) {
    hook.beforeEach(async (markdown, next) => {
      const exactRouteEjsFile = await fetchEjsFile(`${vm.route.file}.ejs`);
      if (exactRouteEjsFile) {
        const generatedMarkdown = await renderEjs(exactRouteEjsFile, {
          path: vm.route.path,
          basename: vm.route.path.split('/').pop() ?? '',
          query: vm.route.query,
        });
        return next(generatedMarkdown);
      }

      const dynamicRouteEjsFile = await fetchEjsFile(
        getDynamicRouteFile(vm.route.file)
      );
      if (dynamicRouteEjsFile) {
        const generatedMarkdown = await renderEjs(dynamicRouteEjsFile, {
          path: vm.route.path,
          basename: vm.route.path.split('/').pop() ?? '',
          query: vm.route.query,
        });
        return next(generatedMarkdown);
      }

      next(markdown);
    });
  };
}

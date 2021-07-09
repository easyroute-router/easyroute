import { RouteComponent } from '../../types';

export async function checkAsyncAndDownload(component: RouteComponent) {
  const isAsync = /(\.then|import\(.+\)|vitePreload|_+import_+)/i.test(
    component.toString()
  );
  if (!isAsync) return component;
  else {
    try {
      const newComponent = await component();
      return newComponent.default;
    } catch (e) {
      console.warn(
        `[Easyroute] caught an error while trying to download async component: "${e.message}"`
      );
      return component;
    }
  }
}

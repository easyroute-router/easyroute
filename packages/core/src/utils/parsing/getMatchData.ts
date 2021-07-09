import { deleteEdgeSlashes } from '../path/deleteEdgeSlashes';
import { generateId } from '../misc/generateId';
import { RouteComponent, RouteDefineData, RouteMatchData } from '../../types';
import regexparam from 'regexparam';

export function getMatchData(
  arr: any[],
  parentId: string | null = null,
  nestingDepth = 0,
  parentPath = '/'
): any[] {
  return arr.reduce((acc: RouteMatchData[], val: RouteDefineData) => {
    const componentPart: RouteComponent | RouteComponent[] =
      (val.component && { component: val.component }) ||
      (val.components && { components: val.components });
    const path =
      deleteEdgeSlashes(parentPath) + '/' + deleteEdgeSlashes(val.path);
    const { pattern, keys } = regexparam(path);
    const newRoute: RouteMatchData = {
      ...val,
      ...componentPart,
      parentId,
      nestingDepth,
      path,
      id: generateId(),
      regexpPath: pattern,
      pathKeys: keys
    };
    if (Array.isArray(val.children)) {
      acc = acc.concat(
        getMatchData(
          (newRoute.children ?? []) as any[],
          newRoute.id,
          nestingDepth + 1,
          newRoute.path
        )
      );
    }
    return acc.concat(newRoute);
  }, []);
}

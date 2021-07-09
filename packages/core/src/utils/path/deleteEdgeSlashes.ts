import { deleteFirstSlash } from './deleteFirstSlash';
import { deleteLastSlash } from './deleteLastSlash';

export const deleteEdgeSlashes = (url: string) =>
  deleteFirstSlash(deleteLastSlash(url));

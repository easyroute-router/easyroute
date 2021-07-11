import { deleteFirstSlash } from '../deleteFirstSlash';
import { deleteLastSlash } from '../deleteLastSlash';

export const deleteEdgeSlashes = (url) =>
  deleteFirstSlash(deleteLastSlash(url));

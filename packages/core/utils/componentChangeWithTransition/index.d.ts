import Router from '../../dist';
import { RouteInfoData } from '../../dist/types';

declare function componentChangeWithTransition(
  component: any,
  currentRoute: RouteInfoData,
  transition: string,
  classCallback: (string) => void,
  componentCallback: (any) => void,
  router: Router,
  transitionData: {
    enteringDuration: number;
    leavingDuration: number;
  }
): Promise<void>;

export default componentChangeWithTransition;

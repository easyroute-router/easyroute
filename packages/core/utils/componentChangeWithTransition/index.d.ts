import Router from '../../dist';
import { RouteInfoData, RouteMatchData } from '../../dist/types';

declare function componentChangeWithTransition(
  component: any,
  currentRoute: RouteInfoData | RouteMatchData,
  transition: string,
  classCallback: (c: string) => void,
  componentCallback: (c: any) => void,
  router: Router,
  transitionData: {
    enteringDuration: number;
    leavingDuration: number;
  }
): Promise<void>;

export default componentChangeWithTransition;

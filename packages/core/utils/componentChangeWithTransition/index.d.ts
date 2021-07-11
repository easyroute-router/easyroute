import Router from '../../dist';

declare function componentChangeWithTransition(
  component: any,
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

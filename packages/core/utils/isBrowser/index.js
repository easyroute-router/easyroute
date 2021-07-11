/**
 * @description Is current environment - browser
 * @author flexdinesh/browser-or-node
 * @returns {boolean}
 */
export function isBrowser() {
  return (
    typeof window !== 'undefined' && typeof window.document !== 'undefined'
  );
}

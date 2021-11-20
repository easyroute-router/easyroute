### v2.0.1
* **feat**: add "replace" method for history mode (#3);
* **fix:** add "go" method placeholder in core class (#4).

### v2.0.0
* **breaking**: modes are functions from now;
* **breaking**: utils functions are in separate modules;
* **feat**: util-function for CSS transitions is now on core-side;
* **refactor:** observable is now created by a function, `setValue` 
  method has been renamed to `set`;
* **refactor:** size reduction and speed up.

### v1.4.4
* **feat**: updated async component check regexp
  (vite compatibility again);
* **refactor:** different types for before and after hooks.

### v1.4.3
* **refactor:** better code-split check (vite compatibility)

### v1.4.2
* **fix:** planning microtask for first route 
parsing (broken initial hooks in last release)

### v1.4.1
* **fix:** types for `meta` and `children` property;
* removed macrotask planning in the constructor.

### v1.4.0
* **breaking**: removed setters `beforeEach` and 
  `afterEach` for global hooks, please pass 
  callbacks to methods with the same names 
  (for example, `router.beforeEach((to, from, next) => ...)`;
* **feat**: introducing `router.transitionOut` hooks 
  to handle operations after the exit animation 
  has finished;
* **refactor:** better types declaration.

### v1.3.5
* **fix:** wrong `from` route data in hooks.

### v1.3.4-1
* **fix:** broken url set if slash trailing enabled.

### v1.3.4
* Rollback to full routes tree search;
* added `omitTrailingSlash` key in router settings (#12);
* fix types path in package.json.

### v1.3.3
* Types simplified;
* forced semicolon;
* refactored, extra modules deleted.

### v1.3.2
* Fallback to "hash" mode by default;
* fixed dependabot alert.

### v1.3.1
* Base url feature fixed;
* path sanitizing for routes;
* a bit of refactoring (size reducing and speed up).

### v1.3.0
* Size reduced from ~26kb raw to ~16kb raw;
* types are in root dedicated file now;
* some services are replaced with functions;
* multiple code optimize; 
* fixed problem with route base url in history mode.

### v1.2.1
* Detecting enviroment (for SSR reasons);
* typed `utils` module.

### v1.2.0
* Removed `url-join` module;
* `path-to-regexp` replaced with `regexparam`;
* `tsconfig.json`: target changed do "es2018", module chaged to "es2015";
* lib file size reduced from 69.7kb to 26.4kb (x2.6)

### v1.1.0
* `beforeEnter` hook for each route - individual hooks yeah!
* named routes support via `components` key in route object;
* methods for dynamic routes downloading are now in separated modules;
* implemented `lint-staged`.

### v1.0.2
* Core is now downloading dynamic modules by itself, without bindings outlets;
* fixed premature after hook trigger when dynamic component is downloading;
* initializers for router modes are now in separated modules;
* reorganized file system.

### v1.0.1
* Separated file for utils methods for better module system.

### v1.0.0
* Launched separated module;
* component type inherits any for different libs compatibility.

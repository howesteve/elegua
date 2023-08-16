import type { ComponentType } from 'svelte';
import { derived, get, readable, writable, type Subscriber } from 'svelte/store';

let pathSetter: Subscriber<string>;
export const path = (() => {
  const { subscribe, set, update } = writable('');
  pathSetter = set;
  return {
    subscribe,
    set: (x: string) => {
      const u = get(url);
      u.pathname = x;
      url.set(u);
      return set(x);
    },
    update
  };
})();

let hashSetter: Subscriber<string>;
// A store for the previous full url
export const hash = (() => {
  const { subscribe, set, update } = writable('');
  hashSetter = set;
  return {
    subscribe,
    set: (x: string) => {
      const u = get(url);
      u.hash = x;
      url.set(u);
      return set(x);
    },
    update
  };
})();

let urlSetter: (u: URL) => void;
export const url = (() => {
  const { subscribe, set: set_, update } = writable(new URL(window.location.href));
  urlSetter = (u: URL) => {
    const sset = u.searchParams.set;
    const sdel = u.searchParams.delete;
    u.searchParams.set = (name, value) => {
      const res = sset.call(u.searchParams, name, value);
      set_(u);
      history.pushState({}, '', u.toString());
      return res;
    };
    u.searchParams.delete = (name) => {
      const res = sdel.call(u.searchParams, name);
      set_(u);
      history.pushState({}, '', u.toString());
      return res;
    };
    oldUrlSetter(get(url));
    set_(u);
    if (get(path) !== u.pathname) pathSetter(u.pathname);
    if (get(hash) !== u.hash) hashSetter(u.hash.slice(1, u.hash.length));
  };
  return {
    subscribe,
    set: (u: URL) => {
      history.pushState(null, '', u);
      urlSetter(u);
    },
    update
  };
})();
// A writable store for the current path. If url is changed, subscribers will be notified;
// if store value is set, current url will change as well and path will be resolved.
let oldUrlSetter: Subscriber<URL>;
// A store for the previous full url
export const oldUrl = readable<URL>(new URL(window.location.href), (set) => {
  oldUrlSetter = set;
});
get(oldUrl);

// searchParams
export const searchParams = derived(url, (x) => x.searchParams);

let matchSetter: Subscriber<RegExpExecArray | undefined>;
// A read-only store that will always be reflecting the current url's RegExp match array
export let match = readable<RegExpExecArray | undefined>(undefined, (set: typeof matchSetter) => {
  matchSetter = set;
});
get(match);

let params_: { [key: string]: string } = {};
let paramsSetter: Subscriber<typeof params_>;
// A read-only store that will always be reflecting the current url's dynamic params
// match array, i.e. when matched "/blog/my-post" against route="/blog/:id"
// => params = {id: my-post}
export let params = readable(params_, (set) => {
  paramsSetter = set;
});
// making sure paramsSetter gets set
get(params);

const regExpEscape = (s: string) => s.replace(/[-[\]{}()*+!<=:?.\/\\^$|#\s,]/g, '\\$&');

// compiles a named path such as /blog/:slug into a RegExp. 
// Usually this will not be needed to be called directly since resolve() 
// will detect named paths automatically and call this internally, but
// it's exported in case you want to use it.
// @param {string} route - a route to be compiled into regexp, ex: '/blog/:id'.
export function namedPath(route: string): RegExp {
  // checking for named component paths
  return RegExp(
    route.split('/').map((x) =>
        x.startsWith(':') ? `(?<${regExpEscape(x.slice(1, x.length))}>[a-zA-Z0-9][a-zA-Z0-9\_\-]*)` : regExpEscape(x)
      ).join(`\\/`)
  );
}

// Dynamic routing
// <svelte:component this={dynamic([routes], error)} />
// If no route among [routes] is resolved, return the "defaultRoute" route. 
// If defaultRoute is not defined, undefined is returned.
export type DynamicRoute = [string | RegExp, ComponentType, any?];
export function dynamic(path: string, routes: DynamicRoute[], defaultRoute?: ComponentType): ComponentType|undefined {
  for (let i=0;i<routes.length;i++) {
    const [route, component] = routes[i];
    if (resolve(path, route)) return component;
  }
  return defaultRoute;
}

let preventChange_ : (()=> boolean|undefined) | undefined;
// Global hook function for preventing routing/page changes. Use this to prevent routing 
// changes using either goto() or <a> clicking on undesirable situations, ex. 
// when a form is dirty and you want the user to save changes before 
// leaving the form.
// @param {()=> boolean) | undefined} f - the function to be called to allow or not 
//   routing. If this function is defined and returns true, routing request will be ignored. 
//   See docs for usage example.
export function preventChange(f?: typeof preventChange_) {
  preventChange_ = f
}

// Core route function; resolves a path.
// @param {string} route - a string (fixed or dynamic) route, or a regexp route. If '/:' is found in the route, it's considered a named route.
// @param {string} path - an optional param for providing a path to resolve to. Defaults to $path
export function resolve(path: string, route: string | RegExp): boolean {
  if (typeof route === 'string') {
    // compiling a dynamic path
    if (route.indexOf('/:') >= 0) route = namedPath(route);
    // trying a fixed path match
    else {
      if (route === path) {
        matchSetter(undefined);
        paramsSetter({});
        return true;
      } else return false;
    }
  }
  // trying a regexp match
  const m = (route as RegExp).exec(path);
  if (m) {
    matchSetter(m);
    if (m.groups) paramsSetter({ ...m.groups });
    return true;
  }
  return false;
}

// Navigates to a new url and updates all related stores
// @param {string} href - the href/path to to go, ex: '/blog'
// @param {any} data - not used right now
export function goto(href: string | URL, data: any = undefined) {
  // preventing changes 
  if (preventChange_ && (preventChange_()===true)) return;
  if (href instanceof URL) href = href.toString();
  url.set(new URL(href, window.location.href));
}

// first time url assignment
urlSetter(new URL(document.location.href));
// event handlers
window?.addEventListener('load', () => {
  // forwarding hash change events
  addEventListener('hashchange', () => {
    urlSetter(new URL(window.location.href));
  });
  addEventListener('popstate', (event: PopStateEvent) => {
    const u = new URL(window.location.href);
    urlSetter(u);
    event.preventDefault();
  });
  
  let lastKbdEv: KeyboardEvent|undefined
  addEventListener('keydown', (ev: KeyboardEvent) => lastKbdEv = ev);
  addEventListener('keyup', (ev: KeyboardEvent) => lastKbdEv = undefined);

  // <a> tags click hook; let Elegua handle them
  addEventListener('click', (event) => {
    // Ctrl/Shift + clicks should open another tab/window
      let targetElement = event.target as HTMLElement;
      while (targetElement && targetElement !== document.body) {
        if (targetElement.tagName.toLowerCase() === 'a') {
          if (lastKbdEv?.ctrlKey || lastKbdEv?.shiftKey) return;
          if (preventChange_ && (preventChange_()===true)) return event.preventDefault();
          if (targetElement.hasAttribute('data-native-router')) return;
            const href = targetElement.getAttribute('href') || '';
            // do not handle external links
            if (!/^http?s\:\/\//.test(href)) {
              if (href) url.set(new URL(href, window.location.href));
              return event.preventDefault();
          }
        }
        targetElement = targetElement.parentElement || document.body;
      }
  });
});

// Bonus: svelte action for preventing unloading/focus changing
// If callback returns true, unfocusing is prevented.
// If callback returns a string, unfocusing is prevented and message is returned.
// However, message display is browser-dependent and usually ignored.
export function preventUnload(node: HTMLElement, callback: () => boolean | string| undefined) {
	const handler = (ev: BeforeUnloadEvent) => {
		const res = callback();
		if (res === true) {
			// If callback returns a truthy value, show the browser's default
			// confirmation message to ask the user if they want to leave the page.
			ev.preventDefault();
			ev.returnValue = '';
			return '';
		} else if (typeof res === 'string') {
			// if callback returns a string, send it to the browser. However as exposed, 
      // it's usually ignored by browsers.
      ev.preventDefault();
			ev.returnValue = res;
			return res;
		}
	};
	node.addEventListener('beforeunload', handler, { capture: true });
	return {
  		destroy() {
			node.removeEventListener('beforeunload', handler);
		}
	};
}

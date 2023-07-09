import { derived, get, readable } from 'svelte/store';
import { writable, type Subscriber } from 'svelte/store';

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
const path_ = path;

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

// compiles a named path such as /blog/:slug into a RegExp
// @param {string} route - a route to be compiled into regexp, ex: '/blog/:id'.
export function namedPath(route: string): RegExp {
  // checking for named component paths
  return RegExp(
    route
      .split('/')
      .map((x) =>
        x.startsWith(':') ? `(?<${regExpEscape(x.slice(1, x.length))}>[a-zA-Z][a-zA-Z0-9\_\-]*)` : regExpEscape(x)
      )
      .join(`\\/`)
  );
}

// Core route function; resolves a path.
// @param {string} route - a string (fixed or dynamic) route, or a regexp route. If '/:' is found in the route, it's considered a dynamic route.
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
  if (href instanceof URL) href = href.toString();
  url.set(new URL(href, window.location.href));
}

urlSetter(new URL(document.location.href));
window?.addEventListener('load', (event) => {
  // setting the URL for the first time
  urlSetter(new URL(document.location.href));
  // forwaring hash changed events
  addEventListener('hashchange', (event: HashChangeEvent) => {
    // hashSetter({ new: event.newURL, old: event.oldURL });
    urlSetter(new URL(window.location.href));
  });
  addEventListener('popstate', (event: PopStateEvent) => {
    const u = new URL(window.location.href);
    urlSetter(u);
    event.preventDefault();
  });

  // <a> tag click hook; let Elegua handle it
  addEventListener('click', (event) => {
    let targetElement = event.target as HTMLElement;
    while (targetElement && targetElement !== document.body) {
      if (targetElement.tagName.toLowerCase() === 'a') {
        const href = targetElement.getAttribute('href') || '';
        // handling external links
        if (!/^http?s\:\/\//.test(href)) {
          event.preventDefault();
          if (href) url.set(new URL(href, window.location.href));
          return;
        }
      }
      targetElement = targetElement.parentElement || document.body;
    }
  });
});

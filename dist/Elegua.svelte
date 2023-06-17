<script context="module">import { afterUpdate, getContext, onMount, setContext, tick } from "svelte";
import { derived, get, readable } from "svelte/store";
import { writable } from "svelte/store";
let current = writable(0);
let _id = 0;
const hashes = /* @__PURE__ */ new Map();
const routes = [];
let _fallback = void 0;
let pathSetter;
export const path = (() => {
  const { subscribe, set, update } = writable("");
  pathSetter = set;
  return {
    subscribe,
    set: (x) => {
      const u = get(url);
      u.pathname = x;
      url.set(u);
      return set(x);
    },
    update
  };
})();
let hashSetter;
export const hash = (() => {
  const { subscribe, set, update } = writable("");
  hashSetter = set;
  return {
    subscribe,
    set: (x) => {
      const u = get(url);
      u.hash = x;
      url.set(u);
      return set(x);
    },
    update
  };
})();
let urlSetter;
export const url = (() => {
  const {
    subscribe,
    set: set_,
    update
  } = writable(new URL(window.location.href));
  urlSetter = (u) => {
    const sset = u.searchParams.set;
    const sdel = u.searchParams.delete;
    u.searchParams.set = (name, value) => {
      const res = sset.call(u.searchParams, name, value);
      set_(u);
      history.pushState({}, "", u.toString());
      return res;
    };
    u.searchParams.delete = (name) => {
      const res = sdel.call(u.searchParams, name);
      set_(u);
      history.pushState({}, "", u.toString());
      return res;
    };
    oldUrlSetter(get(url));
    set_(u);
    if (get(path) !== u.pathname)
      pathSetter(u.pathname);
    if (get(hash) !== u.hash)
      hashSetter(u.hash);
  };
  return {
    subscribe,
    set: (u) => {
      const current2 = get(url);
      history.pushState(null, "", u);
      resolve(u.pathname);
      urlSetter(u);
    },
    update
  };
})();
let oldUrlSetter;
export const oldUrl = readable(new URL(window.location.href), (set) => {
  oldUrlSetter = set;
});
get(oldUrl);
export const searchParams = derived(url, (x) => x.searchParams);
let matchSetter;
export let match = readable(
  void 0,
  (set) => {
    matchSetter = set;
  }
);
get(match);
let params_ = {};
let paramsSetter;
export let params = readable(params_, (set) => {
  paramsSetter = set;
});
const regExpEscape = (s) => s.replace(/[-[\]{}()*+!<=:?.\/\\^$|#\s,]/g, "\\$&");
export function resolve(path2) {
  const res = hashes.get(path2);
  if (res) {
    matchSetter(void 0);
    paramsSetter({});
    current.set(res);
  } else if (!routes.some((route) => {
    const m = route.regex.exec(path2);
    if (m) {
      matchSetter(m);
      if (m.groups)
        paramsSetter({ ...m.groups });
      current.set(route.id);
      if (route.options?.keepMatching !== true)
        return true;
    }
  }) && _fallback)
    current.set(_fallback);
}
export function goto(href, data = void 0) {
  if (href instanceof URL)
    href = href.toString();
  url.set(new URL(href, window.location.href));
}
export const refresh = () => goto(get(path));
window?.addEventListener("load", (event) => {
  urlSetter(new URL(document.location.href));
  resolve(get(path));
  addEventListener("hashchange", (event2) => {
    urlSetter(new URL(window.location.href));
  });
  addEventListener("popstate", (event2) => {
    const u = new URL(window.location.href);
    urlSetter(u);
    resolve(u.pathname);
    event2.preventDefault();
  });
  addEventListener("click", (event2) => {
    let targetElement = event2.target;
    while (targetElement && targetElement !== document.body) {
      if (targetElement.tagName.toLowerCase() === "a") {
        const href = targetElement.getAttribute("href") || "";
        if (!/^http?s\:\/\//.test(href)) {
          event2.preventDefault();
          if (href)
            url.set(new URL(href, window.location.href));
          return;
        }
      }
      targetElement = targetElement.parentElement || document.body;
    }
  });
});
</script>

<script>export let route;
export let options = void 0;
let id = _id += 1;
const parent = getContext("parent");
const children = /* @__PURE__ */ new Set();
setContext("parent", (x) => {
  children.add(x);
  if (parent)
    parent(x);
});
if (parent)
  parent(id);
if (route === "*")
  _fallback = id;
else if (typeof route === "string") {
  if (route.indexOf("/:") >= 0) {
    route = RegExp(
      route.split("/").map(
        (x) => x.startsWith(":") ? `(?<${regExpEscape(
          x.slice(1, x.length)
        )}>[a-zA-Z][a-zA-Z0-9_-]*)` : regExpEscape(x)
      ).join(`\\/`)
    );
  }
}
if (typeof route === "string")
  hashes.set(route, id);
else
  routes.push({ regex: route, id, options });
</script>

{#if $current === id || children.has($current)}
	<slot />
{/if}

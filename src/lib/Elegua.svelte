<script lang="ts" context="module">
	import { afterUpdate, getContext, onMount, setContext, tick } from 'svelte';
	import { derived, get, readable } from 'svelte/store';
	import { writable, type Subscriber } from 'svelte/store';
	let current = writable(0);
	let _id = 0;
	// hash for path => component mapping
	const hashes = new Map<string, number>();
	const routes: { regex: RegExp; id: number; options?: RouteOptions }[] = [];
	// the default route if no other else matches
	let _fallback: number | undefined = undefined;
	// Route options
	export interface RouteOptions {
		// if true, keep matching even after finding a route
		keepMatching?: boolean;
	}
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
			update,
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
			update,
		};
	})();

	let urlSetter: (u: URL) => void;
	export const url = (() => {
		const {
			subscribe,
			set: set_,
			update,
		} = writable(new URL(window.location.href));
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
				const current = get(url);
				history.pushState(null, '', u);
				resolve(u.pathname);
				urlSetter(u);
			},
			update,
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
	export let match = readable<RegExpExecArray | undefined>(
		undefined,
		(set: typeof matchSetter) => {
			matchSetter = set;
		}
	);
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
	const regExpEscape = (s: string) =>
		s.replace(/[-[\]{}()*+!<=:?.\/\\^$|#\s,]/g, '\\$&');

	// Resolves the route. The matching component will be rendered.
	export function resolve(path: string) {
		// trying a direct hash match
		const res = hashes.get(path);
		if (res) {
			matchSetter(undefined);
			paramsSetter({});
			current.set(res);
		} else if (
			!routes.some((route) => {
				// trying regexp mathes
				const m = route.regex.exec(path);
				if (m) {
					matchSetter(m);
					if (m.groups) paramsSetter({ ...m.groups });
					current.set(route.id);
					if (route.options?.keepMatching !== true) return true;
				}
			}) &&
			_fallback
		)
			current.set(_fallback);
	}

	// Navigates to a new url and updates all related stores
	export function goto(href: string | URL, data: any = undefined) {
		if (href instanceof URL) href = href.toString();
		url.set(new URL(href, window.location.href));
	}
	// just re-resolve the current path manually
  export const refresh = () => resolve(get(path));

	window?.addEventListener('load', (event) => {
		// setting the URL for the first time
		urlSetter(new URL(document.location.href));
		resolve(get(path));
		// forwaring hash changed events
		addEventListener('hashchange', (event: HashChangeEvent) => {
			// hashSetter({ new: event.newURL, old: event.oldURL });
			urlSetter(new URL(window.location.href));
		});
		addEventListener('popstate', (event: PopStateEvent) => {
			const u = new URL(window.location.href);
			urlSetter(u);
			resolve(u.pathname);
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
</script>

<script lang="ts">
	// The route/path to point to (ex: '/about' or /[a-z+]/)
	export let route: string | RegExp;
	// Router options
	export let options: RouteOptions | undefined = undefined;
	let id = (_id += 1);
	const parent = getContext<ChildSetter>('parent');
	const children = new Set<number>();
	type ChildSetter = (x: number) => void;
	setContext<ChildSetter>('parent', (x: number) => {
		children.add(x);
		if (parent) parent(x);
	});
	if (parent) parent(id);
	// handling fallback route
	if (route === '*') _fallback = id;
	else if (typeof route === 'string') {
		// checking for named component paths
		if (route.indexOf('/:') >= 0) {
			route = RegExp(
				route
					.split('/')
					.map((x) =>
						x.startsWith(':')
							? `(?<${regExpEscape(
									x.slice(1, x.length)
							  )}>[a-zA-Z][a-zA-Z0-9\_\-]*)`
							: regExpEscape(x)
					)
					.join(`\\/`)
			);
		}
	}
	if (typeof route === 'string') hashes.set(route, id);
	else routes.push({ regex: route, id: id, options });
</script>

{#if $current === id || children.has($current)}
	<slot />
{/if}

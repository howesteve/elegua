# What is Elegua?

Elegua: the best Svelte client router you'll ever see in 180 LoC.

## Demo

```sh
$ git clone http://github.com/howesteve/elegua
$ cd elegua/src/test
$ pnpm install
$ pnpm run dev
```

## Features

- Dependency free (except for Svelte, of course)
- A single file/component (1.5Kb gzipped)
- Fully reactive
- History API only (who uses hash paths nowawdays?)
- Regular \<a\> links supported out of the box. No need for \<Link\> additional components.
- Route types supported:
  - Fixed paths (uses a hash lookup - fast!)
  - Dynamic routes (`/xxx/:group/:id`) (yes, they can be nested)
  - Regexp: any rule you could imagine if it can be expressed by a RegExp expression (ex: `/id/[0-9]+\.json`)
  - Fallback/error route

## Why?

- Existing dynamic routers for Svelte are too large, complicated, buggy, unmanteined, and/or not satisfying me.
- Elegua is designed for PWA applications
- I absolutely hated what they did to [SvelteKit](https://kit.svelte.dev/) and it's "file-based router". Things like:
  - `src/routes/blog/[slug]/+page.js`
  - `src/routes/blog/page/[page]/+page.js`
  - `src/routes/blog/page/[page]/+page.server.js`
  - `src/routes/blog/category/[category]/page/[page]/+page.server.js`
    ... then all the boilerplate to make it work, just make me sick. Pages and pages and pages of docs just to learn how to re-learn routing! Shoot me. I have no patience.
- I actually use this on my projects and thought about sharing.

## Homepage

[http://github.com/howesteve/elegua](http://github.com/howesteve/elegua)

## About this repository

Most of this repository is a demo applicaion for [Elegua](http://github.com/howesteve/elegua). The component itself is a [single file](https://github.com/howesteve/elegua/tree/master/src/lib).

## Documentation

You mean, besides [reading the source code](https://github.com/howesteve/elegua/tree/master/src/lib)? :)
Here it goes.

## Install

### pnpm

`pnpm i -D elegua`

### npm

`npm i -D elegua`

### yarn

`yarn i -D elegua`

## Usage

It's hopefully very straighforward: there is only one component, and only one property (route) has to be set:

```svelte
<Router route="/">
  <h1>Home page</h1>
</Route>
```

[Elegua](https://github.com/howesteve/elegua)'s routing is designed expecting most routes are guided by `path`, of course. However, you can route by hash, searchParams or anything else you want.

Every time the current browser's url changes, [Elegua](https://github.com/howesteve/elegua) will try to match it against the routes defined in your code, no matter where. Static paths will be tried first; if they fail, Regexp/ When a route route matches, that route's children are rendered. All other routes that do not get matched, remains hidden.
[Elegua](https://github.com/howesteve/elegua)'s stores will always be updated accordingly to he current url.

> :warning: WARNING: Define routes in your main application's page and not in subpages that are lazily loaded, otherwise routes might not be defined when you think they are, and that could lead to unexpected results.

```svelte
<script lang="ts">
  import Route, { params, matches } from 'elegua';
</script>
<main>
  <!-- Simple main page route -->
  <Route route="/">
    <Home  />
  </Route>
    <!-- /about - another static route. This will be matched instantly (map lookup) -->
  <Route route='/about'>
    <About />
  </Route>
  <!-- Nested path routing - it doesn't matters if the path exists, as long as
  the child component is valid -->
  <Route route='/blog/main-post'>
    <MainBlogPost />
  </Route>
  <!-- Dynamic path: $matches will have the matching param "slug" -->
  <Route route='/blog/:slug'>
    <PostPage slug={$matches['slug']} />
  </Route>
  <!-- Multiple dynamic paths: $matches will have all the matching params -->
  <Route route='/blog/:author/:slug'>
    <PostPage author={$params['author']} slug={$params['slug']} />
  </Route>
  <!-- RegExp route: $matches will have the matching params, same as with dynamic paths -->
  <Route route={/\/authors/([0-9]+)/}>
    <Author id={$matches[1]} />
  </Route>
  <!-- Fallback/error route "*" - this will get matched/rendered if nothing else did. You can inspect $path, $url, etc as usual to see what user tried to reach -->
  <Route route="*">
    <Error />
  </Route>
</main>
```

## Stores, methods and objects

### $path

A writable store that reflects the current url's path. If you load `http://localhost/blog`, `$path` will be set as `"/blog"`.
 If you call `path.set("/")`, the browser load home route (similar to `goto("/")`).

```svelte
<script lang="ts">
	import Router, { hash } from 'elegua';
</script>

<h1>Your are now in the {$path} page.</h1>
<p>Set path:</p>
<button on:click|preventDefault={() => ($path = '/blog')}>Set $path='/blog'</button>
```

### $url

This writable store is a [URL](https://developer.mozilla.org/pt-BR/docs/Web/API/URL) object for the current loaded url. Anytime the url changes, `$url` will be updated. If you update `url`, the current browser's url will change as well.
You can inspect/use `url.pathname`, `url.hash`, `url.searchParams`, etc.

```svelte
<script lang="ts">
	import { url } from 'elegua';
</script>

Current page: {$url.pathname}
<br />Current path: {$url.pathname}
<br />Current hash: {$url.hash}
<br />Current searchParams: {$url.searchParams}
```

Using `$url` you can handle anything you want. For instance, loading a post by hash using `$url`:

```svelte
<script lang="ts">
	import { url } from 'elegua';
	let post: Post;
	url.subscribe(async (u) => {
		// Loading post by hash
		post = await getPost(u.hash);
	});
</script>

<Post data={post} />
```

### $hash

A writable store that will always be reflecting the current url's hash. If you load `http://localhost/#xxx`, `$hash` will be set as `"xxx"`. If you call `hash.set('xxx')`, the current hash will become `'xxx'`.

```svelte
<script lang="ts">
	import Router, { hash } from 'elegua';
</script>

<h1>The current hash is: {$hash}</h1>
```

Loading post by hash (async):

```svelte
<Route route="/blog">
  {#await loadPost($hash)}
    <!-- TODO: add fade in animation -->
    <p>Loading post...</p>
  {:then post}
    <Post data={post} />
  {/await}
</Route>
</script>
```

### $searchParams

This readable store is a [URLSearchParams](https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams) object for the current url. For instance, if you load:`http://localhost/blog?x=1` and call `$searchParams.get('x')`, you'll get `"1"` (yes, a string). For changing a `searchParam` value, call `$searchParams.set("x", "1")`. Check the [URLSearchParams](https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams) for other methods.

[Elegua](http://github.com/howesteve/elegua) has reactive `searchParams.set()` and `searchParams.delete()` methods; if you use them, the current browser's url and [history](https://developer.mozilla.org/en-US/docs/Web/API/History) will automatically be updated.

Reading from `searchParam`:

```svelte
<script lang="ts">
  import Router, { params } from "elegua"
</script>

<Router route="/blog">
  <!-- when you load /blog/searchparams?x=1-->
  Param <code>x</code> is {$params.get("x")}.
  <br>(should print "1")
</Route>
```

Setting a `searchParam` value (reactive):

```svelte
<button
	on:click|preventDefault={() => {
		$searchParams.set('x', '1');
	}}>Set x</button
>
```

Removing a `searchParam` (reactive):

```svelte
<button
	on:click|preventDefault={() => {
		$searchParams.delete('x');
	}}>Remove x</button
>
```

### $match

This store will be set after a match operation (i.e. after a match on named or regexp routes). For instance, if you load `http://localhost/blog/my-post`:

```svelte
<script lang="ts">
  import Router, { matches } from "elegua"
</script>

<Router route="/blog/:slug">
  You are rendering the {matches[1]} blog post.
</Route>
```

### $params

This store contains the named dynamic parts of a path; is kinda similar to [$match](#match).

```svelte
<script lang="ts">
  import Router, { matches } from "elegua"
</script>

<Router route="/blog/:slug">
  You are rendering the {params["slug"]} blog post.
</Route>
```

If the last routed was matched through a hash (i.e. fixed path) match, `params` will be empty.

### $oldUrl

A store for the old (previous) url before the last browser change.

```svelte
<script lang="ts">
	import Router, { hash } from 'elegua';
</script>

<h1>Your are now in the {$path} page, coming from {$oldUrl.pathname}.</h1>
```

## resolve()

The `resolve()` function is [Elegua](https://github.com/howesteve/elegua)'s internal resolver and will be used internally to route and sync stores when a url changes. It's exported just in case you want to do some manual routing, but typically there is no need to be used otherwise.

## goto()

The `goto()` method navigates to some url/path. Internally, it uses [`history.pushState()`](https://developer.mozilla.org/en-US/docs/Web/API/History/replaceState). Calls to goto will trigger updates in all the reactive stores: [$path](#path), [$url](#url), [$hash](#hash), [$oldUrl](#oldurl), etc.

## RouteOptions

Options for the router. Currently there is just a `keepMatching` option that allows to keep matching further RegExp/dynamic routes routes even if one was matched.

```svelte
<script lang="ts">
  import Router, {hash} from "elegua"
</script>

<Route route="/" options={keepMatching: true}>
  This will be rendered
</Route>
<Route route='*'>
  This will be rendered too;
</Route>
```

## Howto's/Recipes/FAQ

## Matching exact/fixed paths

Just set the route property for the exact path:

```svelte
<Route route="/">
	<Home />
</Route>
<Route route="/about">
	<About />
</Route>
```

Fixed path routes are very fast; they are matched using a hash function (`Map.get()`)[https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map].

## Nesting

Paths can also be nested. It doesn't matter for [Elegua](http://github.com/howesteve/elegua). Just provide a valid child and it will work:

```svelte
<Route route="/about/authors/steve">
	<Steve />
</Route>
```

## Fallback route/404/error page

If no other routes are matched, the Route marked with a `route="*"` will be matched. You can inspect [$path](#path), [$params](#params), [$url](#url), etc, to show an error page and provide the user with more info.

```svelte
<script lang="ts">
	import Router, { path } from 'elegua';
</script>

<Route route="*">
	<h1>Error</h1>
	<p>No such path: {$path}</p>
</Route>
```

## Named routes

Named routes are routes that can have named variable path sets, such as `/blog/:slug`:

```svelte
<script lang="ts">
	import Router, { path } from 'elegua';
</script>

<Route route="/blog/:slug">
	This blog's slug is {$params["slug"]}
</Route>
```

The [$params](#params) store will reflect the params by name. Internally, this is implemented using a RegExp route.

If the last routing did not use named routes/or regexp matching (i.e. a hash match), [$params](#params) will be empty.

## Regexp routes

Sometimes you might want a route to match only on certain specific path patterns; ex: `/users/123`. Use a regexp as route:

```svelte
<Route route={/\/users/([0-9]+)/}>
  Rendering user {$match[1]} page
</Route>
```

- `\/users` will _not_ match this route.
- `\/users\/howe` will _not_ match this route.
- `\/users\/123` _will_ match this route, and `$match[1]` will be `123`

You could use other patterns in the same way. Ex:

- `\/users\/(howe|steve)` => $match[1] will match `"/users/howe"` or `"/users/steve"`
- `\/users\/([a-zA-Z\_\\])*` => inspect $match[1], $match[2]

The downsize of regexp routes compared to hash routes is that they are slower and must to be matched sequentially. However, it should be fast enough anyway even for hundreds of paths.

## Hash routes

Use the `$hash` store.

```svelte
<script lang="ts">
	import Router, { hash } from 'elegua';
</script>

<Route route="/blog">
	{#if $hash === 'tab1'}
		Tab1
	{:else if $hash === 'tab2'}
		Tab2
	{:else if $hash === 'tab2'}
		Tab2
	{/if}
</Route>
```

To set hash values, either assign to `$hash`:

```svelte
<!-- Svelte version -->
{($hash = 'tab1')}
```

...or:

```ts
// Typescript version
hash.set('tab1');
```

... or use plain `goto()`:

```ts
goto('#tab1');
```

## Nav menu highlighting

Sometimes you want to highlight a nav menu item when you are on a page, so that the user can see at a glance where they are. For instance, if you are in `"/about"` and your nav menu has the following links:

`BLOG | ORDERS | ABOUT`

... and you want `ABOUT` highlighted when user is on that page (`/about`).
In this case, just set a dynamic class inspecting [$path](#path):

```svelte
<script lang="ts">
	import { path } from 'elegua';
</script>

<nav>
	<a href={'/blog'} class:selected={$path === '/blog'}>BLOG </a>
	<a href={'/orders'} class:selected={$path === '/orders'}>ORDERS </a>
	<a href={'/about'} class:selected={$path === '/about'}>ABOUT </a>
</nav>

<style>
	.selected {
		font-weight: bold;
	}
</style>
```

## How do I handle any other kind of url changes?

Subscribe to [url](#url). It's the DOM [URL](https://developer.mozilla.org/en-US/docs/Web/API/URL) object for the current browser's url. Then you can do anything you want with it.

## Redirects

No need to bloat [Elegua](https://github.com/howesteve/elegua) with that. Just use `\<meta refresh="url..."\>`:

```svelte
<Route route="/old_blog/:1">
  <svelte:head>
    <meta http-equiv="refresh" content="3; url = /blog"/>
  </svelte:head>
  Blog has changed path; redirecting...
</Route>
```

## How do I render \<Link\>s?

There is no `<Link>` objects in [Elegua](https://github.com/howesteve/elegua); just use your plain `\<a\>` tag. It will be handled automatically. Are you coming from other routers?...

## File system dynamic routes, like Sveltekit?

I would have implemented this better, but [Vite](https://vitejs.dev/) only allows string literals in `import.meta.glob()` calls, so this has has to be manual.

```ts
await Promise.all(
	// '/src/posts' is fixed below because vite only accepts literals.
	// If posts dir gets moved, it has to be updated accordingly
	Object.entries(import.meta.glob('/src/posts/**/*.md')).map(async ([path, resolver]) => {
    // ... handle path/resolver, vite style
  })
);
```

There is an example of this on the demo page.

## How to change url but not really triggering page changes and all these store updates?

DOM's [`history`](https://developer.mozilla.org/en-US/docs/Web/API/History) is still your friend. Just use `history.replaceState()`:

```ts
history.replaceState({}, '', '/blog');
```

No \<Link\> objects in lib: just use your plain \<a\> tag. It will be handled automatically. Are you coming from other Routers?...

## If I change the url manually in the browser, will all these stores get updated accordingly?

Of course. That's the point about this lib.

## I need to route using search parameters, i.e. http://xxx.com/x=1

Just use [$searchParams](#searchparams):

```svelte
<Router route="/blog?post_id=1&mode=plain">
  <Post id={$searchParams.get('post_id') mode={$searchParams.get('mode')}}>
</Route>
```

or:

```svelte
<script lang='ts'>
  import {searchParams} from 'Elegua'
  let id: number;
  let mode: string;
  searchparams.subscribe((params: SearchParams)=>{
    id = url.searhParams.get('id');
    mode = url.searhParams.get('mode');
  })
</script>
<Router route="/blog?post_id=1&mode=plain">
  <Post {id} {mode}}>
</Route>
```

## Why is this called "Elegua"?

That is the Yoruba deity of the paths, directions, and crossroads. Elegua controls the routes.

## License

MIT

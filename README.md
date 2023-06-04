# What is Elegua?

Elegua: the best Svelte client router you'll ever see in 180 LoC.

## Demo

Online:

Or

```sh
$ git clone http://github.com/howesteve/elegua
$ cd elegua/src/test
$ pnpm install
$ pnpm run dev
```

## Features

- Dependency free (except for Svelte, of course)
- A single file/component
- Fully reactive
- History API only (who uses hash paths nowawdays?)
- Regular \<a\> links supported out of the box. No need for \<Link\> additional components.
- Routes types supported:
  - Hash/fixed paths (fast!)
  - Dynamic routes (```/xxx/:group/:id```) (yes, they can be nested)
  - Regexp: any rule you could imagine if it can be expressed by a RegExp expression
  - Fallback/error route

## Why?

- Existing dynamic routers for Svelte are too complicated, buggy, unmanteined, large and/or not satisfying me.
- Elegua is designed for PWA applications
- I absolutely hated what they did to SvelteKit and it's "file-based router". Things like:
- `src/routes/blog/[slug]/+page.js`
- `src/routes/blog/page/[page]/+page.js`
- `src/routes/blog/page/[page]/+page.server.js`
- `src/routes/blog/category/[category]/page/[page]/+page.server.js`
  ... then all the boilerplate to make it work, just make me sick. Pages and pages and pages of docs just to learn how to re-learn routing! Shoot me. I have no patience.
- I had to prove my boss (...I mean, gf) I was really working on something on all these hours on the computer. Hope she does not read this.
- I actually use this on my projects and thought about sharing.

## Homepage

[http://github.com/howesteve/elegua](http://github.com/howesteve/elegua)

## About this repository

Most of this repository is a demo applicaion with components examples. The component itself is a single file.

## Documentation

You mean, besides reading the source code? :)
Here it goes.

### Install

#### Pnpm

`pnpm i -D elegua`

#### npm

`npm i -D elegua`

#### yarn

`yarn i -D elegua`

### Usage

It's hopefully very straighforward: there is only one component and one property (route) has to be set:

```svelte
<Router route="/">
  <h1>Home page</h1>
</Route>
```

- Every time the current browser's url changes, [Elegua](https://github.com/howesteve/elegua) will try to match every route defined in your code, no matter where. When a route route matches, it's children are rendered. All other routes that do not gets matched, remains hidden. The beulty in [Elegua](https://github.com/howesteve/elegua) is that it's stores always be updated, reflecting current url.
- Define routes in your main application page and not in subpages that are lazily loaded, otherwise routes might not be defined when you think they are and that could lead to unexpected results.

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
    <PostPage author={$matches['author']} slug={$matches['slug']} />
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

### Stores, methods and objects

#### $path

A writable store that will always be reflecting the current url's path. If you load `http://localhost/blog`, $path will be set as `"/blog"`. If you call `path.set("/")`, the browser load home route (similar to ```goto()```).

```svelte
<script lang="ts">
 import Router, { hash } from 'elegua';
</script>

<h1>Your are now in the {$path} page.</h1>
```

#### $url

This writable store is a [URL](https://developer.mozilla.org/pt-BR/docs/Web/API/URL) object for the current loaded url. Anytime the url changes, $url will be updated. If you update ```url```, the current browser's url will change as well.
You can inspect `url.pathname`, `url.hash`, `url.searchParams`, etc.

```svelte
<script lang="ts">
 import { url } from 'elegua';
</script>

Current page: {$url.pathname}
<br />Current path: {$url.pathname}
<br />Current hash: {$url.hash}
<br />Current searchParams: {$url.searchParams}
```

Using $url you can handle anything you want. For instance, loading a post by hash using $url:

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

#### $hash

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

#### $searchParams

This readable store is a [URLSearchParams](https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams) object that reflects the search params for the current url. For instance, if you load:`http://localhost/blog?x=1` and call `$params.get('x')`, you'll get `"1"` (yes, a string). For changing a param value, call`$params.set("x", "1")`. [Elegua](http://github.com/howesteve/elegua) has reactive ```searchParams.set()``` and ```searchParams.delete()``` methods; if you use them, the current browser's url will be reflected.  

```svelte
<script lang="ts">
  import Router, { params } from "elegua"
</script>

<Router route="/blog">
  Param <code>x</code> is {$params.get("x")}.
  <br>(should print "1")
</Route>
```

Removing a searchParam (reactive):

```svelte
<button
 on:click|preventDefault={() => {
  $searchParams.delete('x');
 }}>Remove x</button>
```

#### $match

This store will be set after a match operation (i.e. on matched dynamic or regexp routes). For instance, if you load `http://localhost/blog/my-post`:

```svelte
<script lang="ts">
  import Router, { matches } from "elegua"
</script>

<Router route="/blog/:slug">
  You are rendering the {matches[1]} blog post.
</Route>
```

If the last routed was matched through a hash (i.e. fixed path) match, ```matches``` will be empty.

#### $oldUrl

A store that will have the old (previous) url before the last browser change. For instance, if you were on `http://localhost/blog` and navigate to `http://localhost/about`, `$oldUrl.pathname` will be "/blog" and `$path` will become `"/about"`.

```svelte
<script lang="ts">
 import Router, { hash } from 'elegua';
</script>

<h1>Your are now in the {$path} page, coming from {$oldUrl.pathname}.</h1>
```

### resolve()

The `resolve()` function is the Router's resolver and used internally to sync stores when a url changes. It's exported just in case you want to do some manual routing, but typically there is no need to be used otherwise.

### goto()

The `goto()` method navigates to some url/path. Internally, it uses `history.pushState()`. Calls to goto will trigger updates in all the reactive stores:  $path, $url, $hash, $oldUrl, etc.

#### RouteOptions

Options for the router. Currently there is just a "keepMatching" option that allows to keep matching further routes even if one was matched.

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

### Matching exact/fixed paths

Just set the route property for the exact path:

```svelte
<Route route="/">
 <Home />
</Route>
<Route route="/about">
 <About />
</Route>
```

### Nesting

Paths can also be nested. It doesn't matter for [Elegua](http://github.com/howesteve/elegua). Just provide a valid child:

```svelte
<Route route="/about/authors/steve">
 <Steve />
</Route>
```

Fixes path routes are matches using a hash function and thus are as fast as possible: they just use a (```Map.get()```)[https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map] lookup.

### Fallback route/404

If no other routes are matched, the Route marked with a `route="*"` will be matched. You can inspect $path, $params, $url, etc, to provide the user with more info.

```svelte
<script lang="ts">
 import Router, { path } from 'elegua';
</script>

<Route route="*">
 <h1>Error</h1>
 <p>No such path: $path</p>
</Route>
```

### Dynamic routes

Dynamic routes are routes that can have variable path sets, such as ```/blog/:slug```:

```svelte
<script lang="ts">
 import Router, { path } from 'elegua';
</script>

<Route route="/blog/:slug">
  This blog's slug is {$params[1]}
</Route>
```

The `$params` store will reflect the params by name. Internally, this is implemented using a RegExp route.

### Regexp routes

Sometimes you might want a route to match only on certain specific path patterns; ex: `/users/123`. Just use a regexp as route:

```svelte
<Route route={/\/users/([0-9]+)/}>
  Rendering user {$match[1]} page
</Route>
```

- `/users` will _not_ match this route.
- `/users/howe` will _not_ match this route.
- `/users/123` _will_ match this route, and `$match[1]` will be `123`

You could use other patterns in the same way. Ex:

- `/users/(howe|steve)` => $match[1] will either be `"howe"` or `"steve"`
- `/users/([a-zA-Z\_\\])*` => $match[1], $match(2)

The downsize of regexp routes compared to hash routes is that have to be matched sequentially until something does match. However, it should be fast enough anyway even for hundreds of paths.

### Hash routes?

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

... or use plain goto:

```ts
goto('#tab1');
```

### Nav menu highlighting

Sometimes you want to highlight a nav menu item when you are on a page, so taht can see at a glance where they are. For instance, if you are in `"/about"` and your nav menu has the following links:

`BLOG  | ORDERS | *ABOUT*`

... and you want `ABOUT` highlighted when user is on `/about`.
In this case, just set a dynamic class inspecting $path:

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

### How do I handle any other kind of url changes?

Subscribe to [url](#url). It's the DOM `URL` object for the current browser's url. Then you can do anything you want with it.

### Redirects

No need to bloat [Elegua](https://github.com/howesteve/elegua) with that. Just use \<meta refresh="url..."\>:

```svelte
<Route route="/old_blog/:1">
  <svelte:head>
    <meta http-equiv="refresh" content="3; url = /blog"/>
  </svelte:head>
  Blog has changed path; redirecting...
```

### How do I render \<Link\>s?

There is no \<Link\> objects in [Elegua](https://github.com/howesteve/elegua); just use your plain \<a\> tag. It will be handled automatically. Are you coming from other routers?...

### File system dynamic routes?

I would have implemented this better, but [Vite](https://vitejs.dev/) only allows string literals in `import.meta.glob()` calls, so this has has to be manual.

```ts
await Promise.all(
 // '/src/posts' is fixed below because vite only accepts literals.
 // If posts dir gets moved, it has to be updated accordingly
 Object.entries(import.meta.glob('/src/posts/**/*.md')).map(async ([path, resolver]) => {})
);
```

There is an example of this on the demo page.

### How to change url but not really triggering changing pages and all these store updates?

DOM's []`history`](https://developer.mozilla.org/en-US/docs/Web/API/History) is still your friend. Call `history.replaceState()`:

```ts
history.replaceState({}, '', '/blog')
```

No \<Link\> objects in lib: just use your plain \<a\> tag. It will be handled automatically. Are you coming from other Routers?...

### If I change the url manually in the browser, will all these stores get updated accordingly?

Of course. That's the point about this lib.

### I need to route using search parameters

Just use `$searchParams`:

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

### Why is this called "Elegua"?

That is the Yoruba deity of the paths, directions, and crossroads. Elegua controls the routes.

### License

MIT

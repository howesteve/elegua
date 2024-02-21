<!-- markdownlint-disable-next-line -->
[![Netlify Status](https://api.netlify.com/api/v1/badges/078adfcb-8470-4e63-b972-13367eb5f6e7/deploy-status)](https://app.netlify.com/sites/elegua/deploys)

# What is Elegua?

Elegua: the best Svelte micro client router you'll ever see.

## Small example

It's hopefully very straighforward: there are no components, just some stores reflecting current path/parts of url, and a [`resolve()`](#resolve) function for more complex (regexp/named routes) routings. The rest is just your plain Svelte logical blocks.

```svelte
{#if $path === '/'}
  <h1>Home page</h1>
{:else if $path === '/about'}
  <h1>About page</h1>
{:else if resolve($path, '/blog/:slug')}
  <Post slug={$params('slug')}/>
{:else}
  <h1>404</h1>
  <p>Not found: {$path}</p>
{/if}
```

## Demo

Online: [https://elegua.netlify.app/](https://elegua.netlify.app/)

... or run yourself:

```sh
git clone http://github.com/howesteve/elegua
cd elegua
pnpm install
pnpm run dev
```

## Features

- Dependency free (except for Svelte, of course)
- Easy api, feels very natural and intuitive.
- Minimalist: it's all in a single file (**2.2KB** gzipped/**6.7KB** unpacked)
  - It's tree-shakable, could end up smaller than that depending on what you use.
- Fully reactive: changes to api reflect the browser's url, and vice versa.
- No `<Route>`, `<Link>` or any other components. Uses regular `{#if}/{:else}` blocks from Svelte to control routing/rendering. It's all stores/functions.
- History API only (who uses hash paths nowawdays?)
- [Dynamic routing](#dynamic)
- Regular \<a\> links supported out of the box. No need for \<Link\> additional components.
- Can [prevent route changes](#preventchange) on conditions (e.g. prevent exit from changed form)
- Route types supported:
  - [Fixed path](#path) routes, i.e. `/` or `/blog`
  - [Variable routes](#resolve) (`/xxx/:group/:id`) (yes, they can be nested)
  - [Regexp routes](#regexp-routes): any rule you could imagine if it can be expressed by a RegExp expression (ex: `/id/[0-9]+\.json`)
  - Fallback/error routes
- Elegua doesn't get into your way, giving full flexibility (I prize that one a lot).
- Unique features such as [`preventUnload()`](#preventunload) and [`preventChange()`](#preventchange).
- Really fast.

## Why?

- [Elegua](http://github.com/howesteve/elegua) has a very different approach from other routers. Other routers I know of introduce new components such as `<Route>` or `<Link>`, or complicated filesystem logic. I wanted to get rid of those and just use plain Svelte logic blocks for routing.
- In my opinion, existing PWA routers for Svelte are too large, complicated, buggy, restricting, unmainteined, unfeatured, full of hacks, and/or just not satisfying me.
- [Elegua](http://github.com/howesteve/elegua) is designed specifically for SPA/PWA applications
- I absolutely hated what they did to [SvelteKit](https://kit.svelte.dev/) and it's "file-based router". Things like:
  - `src/routes/blog/[slug]/+page.js`
  - `src/routes/blog/page/[page]/+page.js`
  - `src/routes/blog/page/[page]/+page.server.js`
  - `src/routes/blog/category/[category]/page/[page]/+page.server.js`
  ... then all the boilerplate to make it work, just make me sick. Pages and pages and pages of docs just to learn how to re-learn routing! Shoot me. I have no patience.
- I had to justify my boss (i.e., my gf) I was actuallky doing something all these hours on the computer.
- I actually use this on some of my projects and thought about sharing.

## Homepage

[http://github.com/howesteve/elegua](http://github.com/howesteve/elegua)

## About this repository

Most of this repository is a demo applicaion for [Elegua](http://github.com/howesteve/elegua). But [Elegua](http://github.com/howesteve/elegua) itself is a [single file](https://github.com/howesteve/elegua/tree/master/src/lib).

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

[Elegua](https://github.com/howesteve/elegua)'s routing is designed expecting routes are mainly guided by [`path`](#path), of course. However, you can route by [hash](#hash), [searchParams](#searchparams), [url](#url) or anything else you want.

Every time the current browser's url changes, [Elegua](https://github.com/howesteve/elegua) will update its stores and your routing logic will do the rest.

> :warning: WARNING: It's best to define routes in your main application's page and not in subpages that are lazily loaded, otherwise routes might not be defined when you think they are, and that could lead to unexpected results.

A more comprehensive example of how routing looks like in [Elegua](https://github.com/howesteve/elegua):

```svelte
<script lang="ts">
  import { path, resolve, params, match } from 'elegua';
</script>

<main>
  <!-- Simple main page route -->
  {#if $path === '/'}
    <Home />
    <!-- /about - another static route. -->
  {:else if $path === '/about'}
    <About />
    <!-- Nested paths routing - you can use any path -->
  {:else if $path === '/blog/main-post'}
    <MainBlogPost />
    <!-- Static page resolving using resolve() function -->
  {:else if resolve($path, '/users')}
    <Users />
    <!-- Named param: $match will have the matching param "slug" -->
  {:else if resolve($path, '/blog/:slug')}
    <PostPage slug={$match['slug']} />
    <!-- Multiple named paths: $match will have all the matching params -->
  {:else if resolve($path, '/blog/:author/:slug')}
    <PostPage author={$params['author']} slug={$params['slug']} />
    <!-- RegExp route: $match will have the matching params, same as with named paths -->
  {:else if resolve($path, /\/authors\/([0-9]+)/)}
    <Author id={$match[1]} />
  {:else}
    <!-- Fallback/error route "*" - this will get matched/rendered if nothing else did. You can inspect $path, $url, etc as usual to see what user tried to reach -->
    <Error />
  {/if}
</main>
```

## Methods

## resolve()

`resolve(path: string, route: string|RegExp)`

The [`resolve(path, route)`](#resolve) function is [Elegua](https://github.com/howesteve/elegua)'s core route resolver. It accepts plain string, [named](#named-routes) or [regExp](#regexp-routes) route param, and while in a template block, it's designed to be used with the [`$path`](#path) argument to be called reactively whenever the url changes

- If `route` is a plain string, [`$match`](#match) and [`$params`](#params) will be empty.  
- If `route` is a [named params route](#named-routes), [`$match`](#match) will be empty but [`$params`](#params) will have each named param set.
- If `route` is a [regexp route](#regexp-routes), [`$match`](#match) and [`$params`](#params) will both be set.

See below for examples:

```svelte
<!-- fixed route -->
{#if resolve($path, '/')}
  <h1>Home page</h2>
<!-- named params route -->
{:else if resolve($path, '/blog/:post_id')}
  <Post id={$params["post_id"]}/>
<!-- regexp route -->
{:else if resolve($path, /users\/([a-zA-Z])+/)}
  <p>This is the page for user {$match[1]}
{:else}
  <!-- None of the above matched? Render the error route -->
  <h1>Error 404</h1>
  <p>Page {$path} not found</p>
{/if}
```

> **Note**
>
> Implementation detail. One might wonder why I left a [`$path`](#path) param in the [`resolve(path, route)`](#resolve) api - it might seem cumbersome, why not using just `resolve('/')`? It's because otherwise Svelte wouldn't know it has to re-render the template containing the resolve block. With [`$path`](#path) explicitly appearing in template block, Svelte will re-render it every time [`$path`](#path) changes, and [`resolve()`](#resolve) gets called. Otherwise, path changes would not be perceived.

## goto()

`goto(href: string|URL)`

The [`goto(href)`](#goto) method navigates to some url/path programmatically. Internally, it uses [`history.pushState()`](https://developer.mozilla.org/en-US/docs/Web/API/History/replaceState). Calls to [`goto(href)`](#goto) will trigger updates in all the expected reactive stores: [$path](#path), [$url](#url), [$hash](#hash), [$oldUrl](#oldurl), etc. - and also will update the current browser's url.

## preventChange()

`preventChange : (()=> boolean|undefined) | undefined`

This function allows setting a callback for preventing exiting a route/page from either clicking `<a>` links or using [`goto()`](goto). If the callback function returns `true`, the link change will be blocked. If it returns anything else, it will be allowed. For instance, for preventing going away from a form has been changed:

```ts
preventChange(() => {
  if (formIsDirty) {
    alert('Please save or cancel changes before navigating away.');
    return true;
  }
});
```

To unset the callback, just call [`preventChange()`](preventchange) without arguments:

```ts
preventChange()
```

For a more useful example of calling [`preventChange()`](preventchange) inside the `onMount()`/`onDestroy()` handlers, check [our demo app](https://elegua.netlify.app/preventchange) and [it's source](https://github.com/howesteve/elegua/blob/master/src/PreventChange.svelte).

> **Note**
>
> This method will not prevent the user from closing the window/reloading the page. That is accomplished by handiling the [beforeload event](https://developer.mozilla.org/en-US/docs/Web/API/Window/beforeunload_event). But check the [`preventUnload` action](#preventunload) for a nice wrapper.

I don't know of any other routers that have this feature.

## preventUnload()

`preventUnload(callback: () => boolean | string| undefined)`

This is a svelte action that will prevent the user from closing the current window if a condition is met. It can be used in set with [`preventChange`](#preventchange) to prevent the user from closing or navigating away from the changed forms.

```svelte
<svelte:window use:preventUnload={() => formIsdirty()} />
...
</svelte:window>
```

Although this is not a part of the routing system *per se*, I think it's a nice addition to Elegua. Same as with [`preventChange`](#preventchange), I don't know about any other routers that have this feature.

- Check [the preventChange](https://elegua.netlify.app/preventchange) page for a demo (it will both prevent exiting the page and closing the window)
- Check [it's source](https://github.com/howesteve/elegua/blob/master/src/PreventChange.svelte)

## dynamic()

`dynamic(path: string, routes: DynamicRoute[], defaultRoute?: ComponentType): ComponentType|undefined`
`type DynamicRoute = [string | RegExp, ComponentType, any?]`

The [`dynamic()`](dynamic) method is a very special one; it allows dynamic routing using [Elegua](http://github.com/howesteve/elegua):

```svelte
<script lang="ts">
  import {dynamic} from 'elegua';
  import Home from './Home.svelte';
  import About from './About.svelte';
  import Blog from './Blog.svelte';
  import Error from './Error404.svelte';
</script> 

<svelte:component this={dynamic($path, [
  ['/', Home],
  ['/about', About],
  ['/blog', Blog],
  ['/blog/:post', Post],
], Error)} />
```

Sometimes you might have a lot of static routes that point to components and don't want to define them one by one in `{$if}` blocks, or you just don't know the routes beforehand. For such cases, [`dynamic()`](dynamic) is very handy.

The arguments are:

- `path`: the current [`$path`](#path)
- `routes`: the defined routes, i.e. an Array\<DynamicRoute\>:
  - [0] `route`: a string or regexp; the same you'd use in a [`resolve()`](#resolve) call
  - [1] component: The component to render. Any Svelte component is valid.
- `defaultRoute`: an optional default route that will be rendered if no other route matches. This is typically used for displaying 404/error pages.

If you need to inspect any [Elegua](http://github.com/howesteve/elegua) variables inside your dynamically rendered component, please do it from inside the component. For instance, in the example above, the `Post` component could be implemented as:

```svelte
<p>This is post id {$params["post"]}</p>
```

or:

```svelte
<script>
  onMount(()=> {
    if ($params['post']) {
      <!-- Load post from server -->
    }
  })
</script>
```

- See it working [in our demo](https://elegua.netlify.app/dynamic)
- See the demo's [source code](https://github.com/howesteve/elegua/tree/master/src/Dynamic)

## Stores

### $path

A writable store that reflects the current url's path. If you load `http://localhost/blog`, `$path` will be set as `"/blog"`.
If you set [`$path`](#path) using `path.set("/")` or `$path = "/"`, it will update the value store and the browser will load home route (similar to using [`goto("/")`](#goto)).

This is used very often for simple, fixed routings.

```svelte
<script lang="ts">
  import { path } from 'elegua';
</script>

<h1>Your are now in the {$path} page.</h1>
<p>Set path:</p>
<button on:click|preventDefault={() => ($path = '/blog')}>Set $path='/blog'</button>
```

Use Svelte's `{#if}` blocks for routing using [`$path`](#path):

```svelte
<script lang="ts">
  import { path } from 'elegua';
  import Home from './Home.svelte';
  import Blog from './Blog.svelte';
</script>

{#if $path === '/'}
  <Home />
{:else if $path === '/blog'}
  <Blog />
{/if}
```

> **Note**
>
> Routing using [`$path`](#path) as stated above (e.g.`$path === '/blog'`) works fine, but [`$match`](#match) and [`$params`](#params) will be unchanged and might be reflecting the values from the latest previous [`resolve()`](#resolve) call. If that's not what you want, route static paths using [`resolve()`](#resolve):

```svelte
<script lang="ts">
  import { path } from 'elegua';
</script>

{#if resolve($path, '/')}
  <h1>Home page. {$match} and {$params} are empty.</h1>
{/if}
```

### $url

This writable store is a [URL](https://developer.mozilla.org/pt-BR/docs/Web/API/URL) object for the current loaded url. Anytime the browser's url changes, [`$url`](#url) will be updated. And if you update [`$url`](#url), the current browser's url will change to reflect it as well.
You can inspect/use [`url.pathname`](https://developer.mozilla.org/en-US/docs/Web/API/URL/pathname), [`url.hash`](https://developer.mozilla.org/en-US/docs/Web/API/URL/hash), [`url.searchParams`](https://developer.mozilla.org/en-US/docs/Web/API/URL/searchParams), etc.

```svelte
<script lang="ts">
  import { url } from 'elegua';
</script>

Current page: {$url.pathname}
<br />Current path: {$url.pathname}
<br />Current hash: {$url.hash}
<br />Current searchParams: {$url.searchParams}
```

Using [`$url`](#url), you can handle any kind of routing. For instance, loading a post by hash using [`$url`](#url):

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

A writable store that reflects the current url's hash. If you load `http://localhost/#xxx`, [`$hash`](#hash) will be set as `"xxx"`. If you call `hash.set('xxx')`, [`$hash`](#hash) will be set to `'xxx'`, and the browser url will be updated.

> **Important**
>
> [Elegua](http://github.com/howesteve/elegua) strips the `#` symbol is from the `hash` string, i.e. on url `http://localhost/blog#myhash`, `$hash` will be `myhash` instead of `#myhash`.

```svelte
<script lang="ts">
  import Router, { hash } from 'elegua';
</script>

<h1>The current hash is: {$hash}</h1>
```

Internally, it works by monitoring both [popstate](https://developer.mozilla.org/en-US/docs/Web/API/PopStateEvent) and [hashchange](https://developer.mozilla.org/en-US/docs/Web/API/Window/hashchange_event) events.

### $searchParams

This readable store is a [URLSearchParams](https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams) object for the current url. For instance, if you load:`http://localhost/blog?x=1` and call `$searchParams.get('x')`, you'll get `"1"` (yes, a string). For changing a [`searchParams`](#searchparams) value, call `$searchParams.set("x", "1")`. Check the [URLSearchParams](https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams) reference for other methods.

[Elegua](http://github.com/howesteve/elegua) has reactive `searchParams.set()` and `searchParams.delete()` and `searchParams.append()`methods for convenience; if you use them, the current browser's url and [history](https://developer.mozilla.org/en-US/docs/Web/API/History) will automatically be updated, and if you change the url values, [`searchParams`](#searchparams) will reflect them.

Reading from [`searchParams`](#searchparams):

```svelte
<script lang="ts">
  import { searparams } from 'elegua';
</script>

{#if resolve($path, '/blog')}
  <!-- when you load /blog/searchparams?x=1-->
  Param <code>x</code> is {$searchParams.get('x')}.
  <br />(should print "1")
{/if}
```

Routing using [`searchParams`](#searchparams):

```svelte
<script lang="ts">
  import { searparams } from 'elegua';
</script>

<!-- when you load, ex /blog?x=1-->
{@const x = $searchParams.get('x')}
{#if x === 1}
  Param <code>x</code> is 1.
{:else if x === 2}
  Param <code>x</code> is 2.
{:else}
  Param <code>x</code> is {x}.
{/if}
<br />(should print "1")
```

Setting a `searchParam` (reactive - browser url will change):

```svelte
<button
  on:click|preventDefault={() => {
    $searchParams.set('x', '1');
  }}>Set x</button
>
```

Removing a `searchParam` (reactive - browser url will change):

```svelte
<button
  on:click|preventDefault={() => {
    $searchParams.delete('x');
  }}>Remove x</button
>
```

Appending a `searchParam` (reactive - browser url will change):

```svelte
<button
  on:click|preventDefault={() => {
    $searchParams.append('y', 1);
  }}>Append('y', 1)</button
>
```

> **Note**
> `searchParam.append()` will perform exactly as [`URLSearchParam.append()`](https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams/append), i.e. if you call it multiple times, it will append params multiple times.

### $match

This readable store will be set after a [`resolve(path, route)`](#resolve) call. If the route is a [regexp route](#regexp-routes), `match[x]` will have all matching results.

[`$match`](#match) is just the return from the [`regexp.exec().groups()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp/exec#return_value) called internally to resolve the route - so, it's number indexed.
For instance, when loading `http://localhost/blog/my-post` or `http://localhost/users/my-user`

```svelte
<script lang="ts">
  import { matches } from 'elegua';
</script>

{#if resolve($path, '/blog/:slug')}
  Blog post {match[1]} (="my-post")
{:else if resolve($path, /users\/([a-zA-Z\-])+/)}
  User: {match[1]} (="my-user")
{/if}
```

> **Important**
>
> [$match](#match) is only updated after a [`resolve()`](#resolve) call. Specifically, [`$path`](#path)-based routing will **not** update this store.

### $params

This store contains the [named](#named-routes) (variable) parts of a match, after a [`resolve`](#resolve) call; is kinda similar to [$match](#match), but whereas [$match](#match) is indexed by number, [`$params`](#params) expects strings.

```svelte
<script lang="ts">
  import { params } from 'elegua';
</script>

{#if resolve($path, '/blog/:slug')}
  You are rendering the {$params['slug']} blog post.
{/if}
```

[`$params`](#params) will also have any [regexp](#regexp-routes) named groups:

```svelte
<script lang="ts">
  import { params } from 'elegua';
</script>

{#if resolve($path, /\/blog\/(?<slug>[a-zA-Z0-9]+)/)}
  You are rendering the {$params['slug']} blog post.
{/if}
```

> **Important**
>
> Just as with [$match](#match), [`$params`](#params) is only updated after a [`resolve()`](#resolve) call. Specifically, [`$path`](#path)-based routing will **not** update these stores.

### $oldUrl

A store for the old (previous) url before the last change.

```svelte
<script lang="ts">
  import { path, oldUrl } from 'elegua';
</script>

<h1>Your are now in the {$path} page, coming from {$oldUrl.pathname}.</h1>
```

## Howto's/Recipes/FAQ

### How to start a project from scratch

```sh
$ pnpm create vite@latest elegua-test --template svelte
$ cd elegua-test
$ pnpm install -D elegua
```

Then, edit `src/App.svelte` (i.e. `"code ."` if you use vscode) and replace it with something like:

```svelte
<script>
  import { path } from "elegua";
</script>

<header>
  <nav>
    <ul id="menu">
      <li><a href="/" class:selected={$path === "/"}>Home</a></li>
      <li><a href="/about" class:selected={$path === "/about"}>About</a></li>
    </ul>
  </nav>
</header>

<main>
  {#if $path === "/"}
    <h1>Home page</h1>
  {:else if $path === "/about"}
    <h1>About page</h1>
  {:else}
    <h1>Error 404</h1>
    <p>Not found</p>
  {/if}
</main>

<style>
  a {
    text-decoration: none;
  }
  a:hover {
    text-decoration: underline;
  }
  a:visited {
    color: inherit;
  }
  .selected {
    font-weight: bolder;
  }
  ul#menu li {
    display: inline;
    margin-right: 1em;
  }
  header {
    font-size: large;
  }
</style>
```

### Fallback route/404/error page

Just use regular Svelte `if` blocks. When nothing else matches, show your error page.

```svelte
<script lang="ts">
  import { path } from 'elegua';
</script>

{#if $path === '/'}
  <h1>Home page</h1>
{:else}
  <p>No such path: {$path}</p>
{/if}
```

### Named routes

Named routes are routes that can have named variables, prefixed with `":"`, such as `/blog/:slug`:

```svelte
<script lang="ts">
  import { resolve } from 'elegua';
</script>

{#if resolve('/blog/:slug')}
  <Post id={$params['slug']} />
{/if}
```

The [$params](#params) store will reflect the params by name. Internally, this is implemented using a [RegExp route](#regexp-routes).

If the last [`resolve()`](#resolve) call did not use named routes/or regexp matching (i.e. a hash match), [$params](#params) will be empty.

A named route will resolve with *any* string. If you need more control of what's matched by a named route, you should either be using [regexp routes](#regexp-routes) or a more specialized subrouting:

```svelte
<script lang="ts">
  import { resolve } from 'elegua';
</script>

{#if resolve('/blog/:slug')}
  {#if $params['slug'] == "1"}
    <Post1/>
  {:else if $params['slug'] == "2"}
    <Post2/>
  {:else if $params['slug'] == "3"}
    <Post3/>
  {:else}  
    <h1>Post not found</h1>
  {/if}
{/if}
```

### Regexp routes

If you might want a route to match only on certain specific path patterns; ex: `/users/123`. For that, use [regexp routes](#regexp-routes) by passing a regexp as route in the `resolve(path, route)` method:

```svelte
{#if resolve($path, /\/users/([0-9]+)/)}
  <p>Rendering user {$match[1]} page</p>
{/if}
```

- `\/users` will *not* match this route.
- `\/users\/howe` will *not* match this route.
- `\/users\/123` *will* match this route, and `$match[1]` will be `123`

You could use other patterns in the same way. Ex:

- `resolve($path, '\/users\/(howe|steve)')` => $match[1] will match `"/users/howe"` or `"/users/steve"`
- `resolve($path, '\/users\/([a-zA-Z\_\\])*')` => inspect $match[1], $match[2]

Named groups work as expected, and captured groups will be reflected in [`$params`](#params). After (and *only* after ) [`resolve()`](#resolve) is called, [`$match`](#match) and [`$params`](#params) will be redefined.

```svelte
{#if resolve($path, /users\/(?<user_id>[0-9]+)/)}
  <p>User by $match: {$match && $match[1]}</p>
  <p>User by $param: {$param['user_id']}</p>
{/if}
```

### Nav menu highlighting

Often you want to highlight a nav menu item when user is on that page, so that he can see at a glance where they are. For instance, if you are in `"/about"` and your nav menu has the following links:

`BLOG | ORDERS | ABOUT`

... and you want `ABOUT` highlighted when user is on that page (`/about`).
In this case, just set a dynamic class inspecting [`$path`](#path):

```svelte
<script lang="ts">
  import { path } from 'elegua';
</script>

<nav>
  <a href={'/blog'} class:selected={$path === '/blog' || $path.startsWith('/blog/')}>BLOG </a>
  <a href={'/orders'} class:selected={$path === '/orders'}>ORDERS </a>
  <a href={'/about'} class:selected={$path === '/about'}>ABOUT </a>
</nav>

<style>
  .selected {
    font-weight: bold;
  }
</style>
```

Now when you are on `/about`, nav menu will show something as:

<code>BLOG | ORDERS | <b>ABOUT</b></code>

### How do I handle any other kind of url changes?

Subscribe to [$url](#url). It's the DOM [URL](https://developer.mozilla.org/en-US/docs/Web/API/URL) object for the current browser's url. Then you can do anything you want with it.

### Redirects

No need to bloat [Elegua](https://github.com/howesteve/elegua) with that. Just use `<meta refresh="url...">`:

```svelte
<script lang="ts">
  import { path } from 'elegua';
</script>

{#if $path ==="/old_blog"}
  <svelte:head>
    <meta http-equiv="refresh" content="3; url = /blog"/>
  </sve
  Blog has changed path; redirecting...
{/if}
```

[`goto()`](#goto) is another way to do it:

```svelte
<script lang="ts">
  import { goto } from 'elegua';
  import { onMount } from 'svelte';
  onMount(() => {
    goto('/new_path');
  });
</script>
```

### File system dynamic routes, like Sveltekit?

I would have implemented this better, but [Vite](https://vitejs.dev/) only allows string literals in [`import.meta.glob()`](https://vitejs.dev/guide/features.html#glob-import) calls, so I end up impolthis had to be manual.

```ts
await Promise.all(
  // '/src/posts' is fixed below because vite only accepts literals.
  // If posts dir gets moved, it has to be updated accordingly
  Object.entries(import.meta.glob('/src/posts/**/*.md')).map(async ([path, resolver]) => {
    // ... handle path/resolver, vite style
  })
);
```

There is an [example](https://github.com/howesteve/elegua/blob/master/src/FileSystem.svelte) of this on the demo page.

### How to change url but not really triggering page changes and all these store updates?

Just use [`history.replaceState()`](https://developer.mozilla.org/en-US/docs/Web/API/History/replaceState):

```ts
history.replaceState({}, '', '/blog');
```

### If I change the url manually in the browser, will all these stores get updated accordingly?

Of course. That's the point about this lib.

### Async routing?

Same as usual. Ex: loading post by hash (async):

`http://localhost/blog/#mypost`

```svelte
<script lang="ts">
  import { path, hash } from 'elegua';
</script>

{#if $path === '/blog'}
  {#await loadPost($hash)}
    <p>Loading post {$hash}...</p>
  {:then post}
    <Post data={post} />
  {/await}
{/if}
```

### Can I do partial path matching?

Sure:

```svelte
{#if $path.startsWith("/blog")}
  <!-- Only pages starting with "/blog" from now on: /blog, /blog/post1, /blog/post2... -->
{/if}

{#if $path.test(/myregexp/)}
  <!-- Match $path against regexp -->
{/if}
```

### Native browser routing

If you want, you can let the browser route the <a> links natively, skipping [Elegua](http://github.com/howesteve/elegua). Just add the `data-native-router` attribute to attribute to the <a> link:

```svelte
<a href="/blog" data-native-router>Blog</a>
```

When you can click such links, you can see the browser's "refresh" animation active, indicating the link was loaded from server, skipping [Elegua](http://github.com/howesteve/elegua).

### I'm getting 404 errors when refreshing urls pointing to paths

Your server must redirect all requests to `/index.html` so that [Elegua](https://github.com/howesteve/elegua) gets loaded and handle the routing by itself; otherwise, the server will try to route and you'll probably not get what you were hoping for.
For instance, if you load `/blog` without setting up the server to load `/index.html` on all requests, it will reply with a `404` error.

In netlify, where the [demo](https://elegua.netlify.app/) is hosted, this is done by [adding a `_redirect` file with the following contents](https://www.netlify.com/blog/2019/01/16/redirect-rules-for-all-how-to-configure-redirects-for-your-static-site/):

```text
/* /index.html 200
```

## Can I use this in Sveltekit?

Yes - see [here](https://kit.svelte.dev/docs/single-page-apps).

### Upgrading from 1.0

Version 1.x used a `<Route>` component; this version routes using [`resolve()`](#resolve) and [`$path`](#path), which is much cleaner and more flexible.

### Benchmarks

No, I'm not benchmarking a client router. However if you care to see the source code, you'll see it's very fast.

### Why is this called "Elegua"?

That is the Yoruba deity of the paths, directions, and crossroads. Elegua controls the routes.

## License

MIT

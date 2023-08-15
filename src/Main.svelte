<script lang="ts">
  import { path, url, hash, params, searchParams, resolve, match } from './lib/Elegua';
  import Home from './Home.svelte';
  import About from './About.svelte';
  import Blog from './Blog.svelte';
  import RegExp from './RegExp.svelte';
  import posts from './posts';
  import Post from './Post.svelte';
  import Error from './Error.svelte';
  import StaticFiles from './StaticFiles.svelte';
  import Hash from './Hash.svelte';
  import SearchParams from './SearchParams.svelte';
  import PreventChange from './PreventChange.svelte';
  let staticPages: Array<{ path: string; html: () => Promise<string> }> = [];
</script>

<header>
  <nav>
    <ul id="menu">
      <li><a href="/" class:selected={$path === '/'}>Home</a></li>
      <li><a href="/blog" class:selected={$path.startsWith('/blog')}>Blog</a></li>
      <li><a href="/regexp" class:selected={$path.startsWith('/regexp')}>RegExp</a></li>
      <li><a href="/hash" class:selected={$path === '/hash'}>Hash demo</a></li>
      <li>
        <a href="/searchparams" class:selected={$path === '/searchparams'}>Search Params</a>
      </li>
      <li>
        <a href="/preventchange" class:selected={$path === '/preventchange'}>Prevent Changes</a>
      </li>
      <li>
        <a href="/filesystem" class:selected={$path === '/filesystem'}>Static files</a>
      </li>
      <li><a href="/about" class:selected={$path === '/about'}>About</a></li>
    </ul>
  </nav>
</header>

<main>
  <!-- Home page - a fixed route -->
  {#if $path === '/'}
    <Home />
    <!-- Another fixed route -->
  {:else if $path === '/about'}
    <About />
    <!-- Fixed route again, but now using resolve() -->
  {:else if resolve($path, '/blog')}
    <Blog posts={$posts} />
    <!-- Fixed route -->
  {:else if $path === '/regexp'}
    <RegExp />
    <!-- A regexp match using resolve() -->
  {:else if resolve($path, /users\/(?<user_id>[0-9]+)/)}
    <h1>URL: {$url.toString()}</h1>
    <h2>User by $match:</h2>
    <p>{$match && $match[1]}</p>
    <h2>User by $params (regexp named group):</h2>
    <p>{$params['user_id']}</p>
    <!-- Another regexp match using resolve() -->
  {:else if resolve($path, /authors\/([a-zA-Z\ 0-9]+)/)}
    <h1>Author {$match && $match[1]}</h1>
    <!-- Loads posts using named params -->
  {:else if resolve($path, '/blog/:post')}
    <Post id={$params['post']} />
    <!-- Hash routing -->
  {:else if $path === '/hash'}
    <Hash />
    <!-- Search params -->
  {:else if $path === '/searchparams'}
    <SearchParams />
    <!-- Filesystem/static routing. Uses startsWith() to easy routing, but is not needed. -->
  {:else if $path.startsWith('/filesystem')}
    <StaticFiles pages={staticPages} />
    <!-- Prevent changing -->
  {:else if resolve($path, '/preventchange')}
    <PreventChange />
    <!-- Fallback route - will be displayed if nothing else matches -->
  {:else}
    <Error />
  {/if}
</main>

<footer>
  <h2>Router stores</h2>
  <ul>
    <li><b>Current full url ($url.toString()):</b> {$url}</li>
    <li><b>Current path ($path):</b> {$path}</li>
    <li><b>Current hash ($hash):</b> {$hash}</li>
    <li>
      <b>Current searchParams ($searchParams.entries):</b>
      {JSON.stringify(Object.fromEntries([...$searchParams.entries()]))}
    </li>
  </ul>
  <p>History backward/forward should be working all the time.</p>
</footer>

<style>
  :root {
    font-family: 'Roboto', sans-serif;
  }
  a {
    text-decoration: none;
    color: blue;
  }
  a:hover {
    font-weight: bold;
  }
  a:visited {
    color: purple;
  }
  nav a:visited {
    color: inherit;
  }
  .selected {
    font-weight: bolder;
    border-bottom: 2px solid;
  }
  ul#menu li {
    display: inline;
    margin-right: 1em;
  }
  header {
    font-size: large;
  }
  footer {
    margin-top: 2em;
    box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
    padding-top: 1em;
    background-color: lightgrey;
    border-radius: 0.5em;
    padding-top: 0.2em;
    padding-left: 1em;
    padding-right: 1em;
    padding-bottom: 1em;
  }
</style>

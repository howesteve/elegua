<script lang="ts">
  import { goto, path, url } from './lib/Elegua';
  import * as package_json from '../package.json';
</script>

<h1>This is the home page.</h1>
<p>
  <b
    >This is the demo application for <a href="https://github.com/howesteve/elegua">Elegua v{package_json.version}</a>,
    a Svelte SPA router library.</b
  >
</p>

<p>This is a static route.</p>

<p>Error route (<code>route="*"</code> - non-existing path); should display error page:</p>
<a href="/xxx">Error</a>

<h2>$path testing</h2>
<p>Current $path is: {$path}</p>
<button on:click|preventDefault={() => ($path = '/blog')}>Set $path='/blog'</button>

<h2>$url.set() testing - goto to '/blog'</h2>
<button
  on:click|preventDefault={() => {
    const u = $url;
    u.pathname = '/blog';
    url.set(u);
  }}>url.set()</button
>

<h2>goto() testing</h2>
<button on:click|preventDefault={() => goto('/blog')}>goto("/blog")</button>
<button on:click|preventDefault={() => goto('/about')}>goto("/about")</button>
<button on:click|preventDefault={() => goto('/invalid_route')}>goto("/invalid_route")</button>

<h2>history.replaceState() testing</h2>
<p>Will change browser url, but not actually refresh pages - just a default DOM api, no magic here</p>
<button on:click|preventDefault={() => history.replaceState('', '', '/blog')}
  >history.replaceState('', "", "/blog")</button
>

<h2>Native data routing (skips Elegua)</h2>
<p>
  To prevent <a href="https://github.com/howesteve/elegua">Elegua</a> from handling a link, and let the native browser
  route it, set the <code>data-native-router</code> attribute in the anchor:
</p>
<p><code>&lt;a href="/blog" <b>data-native-router</b>&gt;Blog&lt/a&gt;</code></p>
<p>Example: <a href="/blog" data-native-router>Blog </a></p>

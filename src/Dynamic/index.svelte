<script lang="ts">
  import { dynamic, path, type DynamicRoute } from '../lib/Elegua';
  import Dynamic1 from './Dynamic1.svelte';
  import Dynamic2 from './Dynamic2.svelte';
  import Error from '../Error.svelte';
  import DynamicDefault from './Default.svelte';
  import Param from './Params.svelte';
  import RegExp from './RegExp.svelte';
  let lazy = import('./Dynamic1.svelte')
  let routes: Array<DynamicRoute> = [
    ['/dynamic', DynamicDefault],
    ['/dynamic/dynamic1', Dynamic1],
    ['/dynamic/dynamic2', Dynamic2],
    ['/dynamic/lazy', lazy],
    ['/dynamic/params/:param', Param],
    [/dynamic\/re[0-9]+/, RegExp]
  ];
  let random = Math.floor(Math.random() * 1000);
</script>

<svelte:head>
  <title>Dynamic routing</title>
</svelte:head>

<h1>Dynamic routing</h1>
<p>Demo for the <code>dynamic()</code> function.</p>
<p>The following routes are defined in this page (<a href="dynamic/{random}">see source</a>) matched dynamically:</p>

<code>
  let routes: Array&lt;DynamicRoute&gt; = [<br />
</code>
{#each routes as route}
  {@const p = route[0]}
  <code>
    <!-- &nbsp;&nbsp;[{typeof p === 'string' ? `"${p}"` : p}, {route[1].name}],<br /> -->
  </code>
{/each}
];

<pre>
&lt;svelte:component this={'{'}dynamic($path, routes, Error){'}'} /&gt;
</pre>

<p>Try clicking on them and you'll see the rendered route changing below:</p>
<ul>
  <li><a href="/dynamic/dynamic1">Dynamic Static Route 1</a></li>
  <li><a href="/dynamic/dynamic2">Dynamic Static Route 2</a></li>
  <li><a href="/dynamic/params/{random}">Dynamic Named Param Route: /dynamic/params/{random}</a></li>
  <li><a href="/dynamic/re{random}">Dynamic RegExp Route: /dynamic/re{random}</a></li>
  <li><a href="/dynamic/invalid">Invalid route (/dynamic/invalid)</a></li>
</ul>

<div>
  <h2>Renderized dynamic component:</h2>
  <svelte:component this={dynamic($path, routes, Error)} />
</div>

<style>
  div {
    /* background-color: red; */
    padding-bottom: 0.5em;
    padding-top: 0.5em;
    padding-left: 1em;
    padding-right: 1em;
    border: black dotted 3px;
  }
</style>

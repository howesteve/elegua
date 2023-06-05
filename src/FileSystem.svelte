<script lang="ts">
	import { onMount } from 'svelte';
	import Router, { path } from './lib/Elegua.svelte';
	export let pages: Array<{ path: string; html: () => Promise<string> }>;
	const prefix = '/src/posts/';

	onMount(async () => {
		pages = await Promise.all(
			Object.entries(import.meta.glob('/src/posts/**/*.html', { as: 'raw' })).map(
				async ([path, resolver]) => {
					return {
						path:
							'/filesystem/' +
							(path.startsWith(prefix) ? path.slice(prefix.length, path.length) : path),
						html: resolver
					};
				}
			)
		);
	});
</script>

<h1>Filesystem routing</h1>
<p>
	These are being loaded directly from filesystem using <a href="https://vitejs.dev/">Vite's</a>
	<a href="https://vitejs.dev/guide/features.html#glob-import">import.meta.glob()</a> and will be
	lazily rendered. This cannot be better integrated into Elegua's core at the moment because it uses
	<code>glob()</code>'s implementation currently only accept string literals. However it's easy to
	implement; just see this page's <code>onMount()</code> code.
</p>

{#each pages as page}
	<ul>
		<li><a href={page.path}>{page.path}</a></li>
	</ul>
	<Router route={page.path}>
		<h3>{page.path}</h3>
		{#await page.html() then html}
			{@html html}
		{/await}
	</Router>
{/each}

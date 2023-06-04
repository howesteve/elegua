<script>
	import { onMount } from 'svelte';

	let i = 5000;
	let x = i;
	let url = '/blog';
	onMount(() => {
		setInterval(() => (x -= 1000), 1000);
	});
</script>

<svelte:head>
	<meta http-equiv="refresh" content="{Math.trunc(i / 1000)}; url = {url}" />
</svelte:head>

<h1>Sorry...</h1>
<p>
	Old blog does not exist anymore. Redirecting you to <a href={url}>{url}</a> in {x / 1000}s...
</p>
<p>If you do not get automatically redirected to the new blog, <a href={url}>click here</a>.</p>

<script lang="ts">
	import { hash } from './lib/Elegua.svelte';
	import Tab1 from './Tabs/Tab1.svelte';
	import Tab2 from './Tabs/Tab2.svelte';
	import Tab3 from './Tabs/Tab3.svelte';
	import Tabs from './Tabs/Tabs.svelte';

	// List of tab items with labels, values and assigned components
	let items = [
		{ label: 'Tab 1', value: 1, component: Tab1 },
		{ label: 'Tab 2', value: 2, component: Tab2 },
		{ label: 'Tab 3', value: 3, component: Tab3 }
	];
</script>

<svelte:head>
	<title>Hash</title>
</svelte:head>

<h1>Hash demo using Tabs</h1>
<p>As you click the tabs, see url's hash is changing accordingly.</p>
<p>
	This is reactive: if you change the url manually to a valid tab number, it will change the tab as
	well.
</p>

<h2>$hash() testing</h2>
<p>Current $hash: {$hash}</p>

set $hash: <button on:click|preventDefault={() => hash.set(Math.floor(Math.random() * 1000).toString())}
	>$hash=random()</button
>
<Tabs {items} />

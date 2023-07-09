<script lang="ts">
  import { searchParams } from './lib/Elegua';
  // List of tab items with labels, values and assigned components
</script>

<svelte:head>
  <title>Search params</title>
</svelte:head>

<h1>SearchParams test</h1>

<b>$searchParams.get("x"):</b>
{$searchParams.get('x')}
<br /><b>($searchParams.get("y")):</b>
{$searchParams.get('y')}

<p>As you click the buttons, see $searchParams and the browser url changing accordingly.</p>
<p>If you change the values directly in the url, they will be updated below as well.</p>

<button
  on:click|preventDefault={() => {
    $searchParams.set('x', '1');
  }}
  >Set x=1
</button>
<button
  on:click|preventDefault={() => {
    $searchParams.set('y', '2');
  }}>Set y=2</button
>
<button
  on:click|preventDefault={() => {
    $searchParams.delete('x');
  }}>Remove x</button
>
<button
  on:click|preventDefault={() => {
    $searchParams.delete('y');
  }}>Remove y</button
>

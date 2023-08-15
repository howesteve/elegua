<script lang="ts">
  import { onDestroy, onMount } from 'svelte';
  import { preventChange as preventChange } from './lib/Elegua';
  let initValue = '';
  let value = initValue;

  let isDirty_ = false;

  $: isDirty_ = initValue !== value;

  function save() {
    initValue = value;
  }

  function cancel() {
    value = initValue;
  }

  let locked = false;
  onMount(() => {
    preventChange(() => {
      if (isDirty_) {
        alert('Please save or cancel changes before navigating away');
        return true;
      } else if (locked) {
        alert("Locked! Can't go away");
        return true;
      }
    });
  });

  onDestroy(() => {
    // reset handler
    preventChange();
  });
</script>

<svelte:head>
  <title>preventChange()</title>
</svelte:head>

<h1>preventChange()</h1>
<p>
  Sometimes you need to prevent the user from leaving the current route; for instance, a form might be dirty and needs
  to be saved. The <a href="https://github.com/howesteve/elegua#prevent_change"><code>preventChange()</code></a>
  method allows controlling that behaviour. Here is an example of how to use it.
</p>

<p>
  If you change the input below, <a href="https://github.com/howesteve/elegua">Elegua</a>
  will not allow you to navigate to any other links until you either save the form. Try changing the value and navigating
  to any links, and you'll see you can't.
</p>

<form on:submit|preventDefault>
  <input bind:value />
  <button on:click={save} disabled={!isDirty_}>Save</button>
  <button on:click={cancel} disabled={!isDirty_}>Cancel</button>
</form>

<p>This is the handler used on this page:</p>

<pre>
  onMount(() =&gt; {'{'}
    preventChange(() = &gt; {'{'}
      if (isDirty_) {'{'}
        alert('Please save or cancel changes before navigating away');
        return true;
      {'}'}
    {'}'});
  {'}'});

  onDestroy(() =&gt; {'{'}
    // reset handler
    preventChange();
  {'}'});
</pre>

<p>You can also use the checkbox below for locking yourself into the current page:</p>
<input type="checkbox" bind:checked={locked} /> Lock into this form

<p>
  See <a href="https://github.com/howesteve/elegua/blob/master/src/PreventChange.svelte"
    >this page's source code for more details.</a
  >
</p>

<p>
  Obs: this will not prevent window reloads (i.e. browser pressing F5); for that, handle the <a
    href="https://developer.mozilla.org/en-US/docs/Web/API/Window/beforeunload_event">beforeunload event</a
  >.
</p>

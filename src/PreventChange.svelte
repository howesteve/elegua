<script lang="ts">
  import { onDestroy, onMount } from 'svelte';
  import { preventChange as preventChange, preventUnload } from './lib/Elegua';
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

<svelte:window use:preventUnload={() => isDirty_} />

<svelte:head>
  <title>preventChange() and preventUnload()</title>
</svelte:head>

<h1>preventChange()</h1>
<p>
  Sometimes you need to prevent the user from leaving the current route; for instance, a form might has been changed and
  needs to be saved before the user forgets about it. The <a href="https://github.com/howesteve/elegua#preventchange"
    ><code>preventChange()</code></a
  >
  method allows implementing that.
</p>

<h1>preventUnload()</h1>
<p>
  Also, there are situations where you want to prevent the current window from being closed - for instance, also when a
  form has changed. The <a href="https://github.com/howesteve/elegua#preventunload"><code>preventUnload()</code></a>
  action is very handy for that.
</p>

<h2>Demo</h2>
<p>
  So here is an example of how to use both: If you change the input below, <a href="https://github.com/howesteve/elegua"
    >Elegua</a
  >
  will not allow you to navigate to any other links until you either save the form. Try changing the value and navigating
  to any links, and you'll see you can't. Also, since
  <a href="https://github.com/howesteve/elegua#preventunload"><code>preventUnload()</code></a>
  is used, if you try to close the window (e.g. Ctrl-W), the browser will ask for confirmation.
</p>

<form on:submit|preventDefault>
  <input bind:value />
  <button on:click={save} disabled={!isDirty_}>Save</button>
  <button on:click={cancel} disabled={!isDirty_}>Cancel</button>
</form>

<p>Thsee are the handlers used on this very page:</p>

<pre>
  &lt;script lang="ts"&gt;
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
&lt;/script&gt;
<pre>&lt;svelte:window use:preventUnload={'{'}() => isDirty_{'}'} /=&gt;</pre>

</pre>

<p>
  You can also use the checkbox below for locking yourself into the current page (can't navigate away, nor close the
  window):
</p>
<input type="checkbox" bind:checked={locked} /> Lock into this form

<p>
  See <a href="https://github.com/howesteve/elegua/blob/master/src/PreventChange.svelte"
    >this page's source code for more details.</a
  >
</p>

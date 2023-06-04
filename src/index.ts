import Main from './Main.svelte'

const app = new Main({
  target: document.getElementById('app') as HTMLElement
})

export default app

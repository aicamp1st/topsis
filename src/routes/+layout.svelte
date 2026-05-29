<script lang="ts">
  import '../app.css'
  import Sidebar from '$lib/components/Sidebar.svelte'

  let { children } = $props()
</script>

<div class="flex min-h-screen bg-slate-50">
  <Sidebar />
  <main class="flex-1 ml-64 min-h-screen">
    {@render children()}
  </main>
</div>

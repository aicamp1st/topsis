<script lang="ts">
  import '../app.css'
  import { afterNavigate } from '$app/navigation'
  import { base } from '$app/paths'
  import Sidebar from '$lib/components/Sidebar.svelte'
  import { Menu } from '@lucide/svelte'

  let { children } = $props()

  let menuOpen = $state(false)

  // Tutup drawer otomatis setiap pindah halaman (mobile)
  afterNavigate(() => {
    menuOpen = false
  })
</script>

<div class="flex min-h-screen">
  <!-- Header mobile -->
  <header class="lg:hidden fixed top-0 inset-x-0 h-14 z-30 flex items-center justify-between px-4 bg-slate-900 text-white shadow-sm">
    <a href="{base}/" class="flex items-center gap-2.5">
      <span class="w-8 h-8 rounded-xl bg-primary-500 flex items-center justify-center font-display font-semibold text-white rotate-3">T</span>
      <span class="font-display font-semibold text-[15px]">SPK&middot;TOPSIS</span>
    </a>
    <button
      onclick={() => (menuOpen = true)}
      class="p-2 -mr-2 rounded-lg hover:bg-white/10 transition-colors"
      aria-label="Buka menu"
    >
      <Menu size={22} />
    </button>
  </header>

  <!-- Backdrop drawer (mobile) -->
  {#if menuOpen}
    <button
      class="lg:hidden fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-sm"
      onclick={() => (menuOpen = false)}
      aria-label="Tutup menu"
    ></button>
  {/if}

  <Sidebar open={menuOpen} onclose={() => (menuOpen = false)} />

  <main class="flex-1 lg:ml-64 min-h-screen pt-14 lg:pt-0">
    {@render children()}
  </main>
</div>

<script lang="ts">
  import { page } from '$app/stores'
  import { base } from '$app/paths'
  import { ClipboardList, LayoutGrid, LayoutDashboard, Trophy, Users } from '@lucide/svelte'

  const nav = [
    { href: '/', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/kriteria', label: 'Kriteria', icon: LayoutGrid },
    { href: '/karyawan', label: 'Karyawan', icon: Users },
    { href: '/penilaian', label: 'Penilaian', icon: ClipboardList },
    { href: '/hasil', label: 'Hasil TOPSIS', icon: Trophy },
  ]

  const current = $derived(($page.url.pathname.replace(base, '') || '/'))
</script>

<aside class="fixed inset-y-0 left-0 w-64 flex flex-col z-40 bg-slate-900 text-slate-100">
  <!-- tekstur halus -->
  <div
    class="absolute inset-0 opacity-[0.35] pointer-events-none"
    style="background-image: radial-gradient(at 70% 0%, rgba(194,95,55,0.25) 0px, transparent 50%), radial-gradient(at 0% 100%, rgba(133,145,57,0.18) 0px, transparent 45%);"
  ></div>

  <!-- Brand -->
  <div class="relative px-6 pt-7 pb-6">
    <div class="flex items-center gap-3">
      <div class="w-10 h-10 rounded-2xl bg-primary-500 flex items-center justify-center shadow-lg shadow-primary-900/40 rotate-3">
        <span class="font-display font-semibold text-white text-lg leading-none">T</span>
      </div>
      <div>
        <p class="font-display font-semibold text-[15px] leading-tight text-white">SPK&middot;TOPSIS</p>
        <p class="text-slate-400 text-[11px] tracking-wide">Karyawan Terbaik</p>
      </div>
    </div>
  </div>

  <!-- Navigation -->
  <nav class="relative flex-1 px-3 py-2 space-y-1 overflow-y-auto">
    <p class="px-3 pb-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">Menu</p>
    {#each nav as item}
      {@const active = current === item.href || (item.href !== '/' && current.startsWith(item.href))}
      {@const Icon = item.icon}
      <a
        href="{base}{item.href}"
        class="group relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200
          {active
            ? 'bg-primary-500/90 text-white shadow-md shadow-primary-900/30'
            : 'text-slate-400 hover:bg-white/5 hover:text-white'}"
      >
        {#if active}
          <span class="absolute -left-3 top-1/2 -translate-y-1/2 h-5 w-1 rounded-full bg-honey-300"></span>
        {/if}
        <Icon size={17} class={active ? 'text-white' : 'text-slate-500 group-hover:text-honey-300 transition-colors'} />
        {item.label}
      </a>
    {/each}
  </nav>

  <!-- Footer -->
  <div class="relative px-5 py-5 border-t border-white/5">
    <div class="rounded-xl bg-white/5 px-3.5 py-3">
      <p class="text-slate-300 text-xs font-medium">Metode TOPSIS</p>
      <p class="text-slate-500 text-[11px] mt-0.5 leading-snug">Multi-Criteria Decision Making</p>
    </div>
  </div>
</aside>

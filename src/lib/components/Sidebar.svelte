<script lang="ts">
  import { page } from '$app/stores'
  import { BarChart3, ClipboardList, Home, LayoutGrid, Trophy, Users } from '@lucide/svelte'

  const nav = [
    { href: '/', label: 'Dashboard', icon: Home },
    { href: '/kriteria', label: 'Kriteria', icon: LayoutGrid },
    { href: '/karyawan', label: 'Karyawan', icon: Users },
    { href: '/penilaian', label: 'Penilaian', icon: ClipboardList },
    { href: '/hasil', label: 'Hasil TOPSIS', icon: Trophy },
  ]
</script>

<aside class="fixed inset-y-0 left-0 w-64 bg-slate-900 flex flex-col z-40">
  <!-- Brand -->
  <div class="px-6 py-5 border-b border-slate-800">
    <div class="flex items-center gap-3">
      <div class="w-9 h-9 rounded-xl bg-primary-600 flex items-center justify-center shadow-lg">
        <BarChart3 size={18} class="text-white" />
      </div>
      <div>
        <p class="text-white font-semibold text-sm leading-tight">SPK TOPSIS</p>
        <p class="text-slate-400 text-xs">Karyawan Terbaik</p>
      </div>
    </div>
  </div>

  <!-- Navigation -->
  <nav class="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
    {#each nav as item}
      {@const active = $page.url.pathname === item.href || ($page.url.pathname.startsWith(item.href) && item.href !== '/')}
      <a
        href={item.href}
        class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150
          {active
            ? 'bg-primary-600 text-white shadow-sm'
            : 'text-slate-400 hover:bg-slate-800 hover:text-white'}"
      >
        <svelte:component this={item.icon} size={17} />
        {item.label}
      </a>
    {/each}
  </nav>

  <!-- Footer -->
  <div class="px-4 py-4 border-t border-slate-800">
    <p class="text-slate-500 text-xs text-center">Metode TOPSIS</p>
    <p class="text-slate-600 text-xs text-center">Multi-Criteria Decision Making</p>
  </div>
</aside>

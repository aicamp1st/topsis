<script lang="ts">
  import { X } from '@lucide/svelte'

  let {
    open = $bindable(false),
    title,
    children,
    size = 'md',
  }: {
    open: boolean
    title: string
    children: import('svelte').Snippet
    size?: 'sm' | 'md' | 'lg'
  } = $props()

  const sizeClass = { sm: 'max-w-sm', md: 'max-w-md', lg: 'max-w-2xl' }

  function onKeydown(e: KeyboardEvent) {
    if (e.key === 'Escape') open = false
  }
</script>

<svelte:window onkeydown={onKeydown} />

{#if open}
  <!-- Backdrop -->
  <div
    class="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
    role="dialog"
    aria-modal="true"
    onclick={() => (open = false)}
  >
    <!-- Panel -->
    <div
      class="bg-white rounded-2xl shadow-2xl w-full {sizeClass[size]} max-h-[90vh] flex flex-col"
      onclick={(e) => e.stopPropagation()}
      role="presentation"
    >
      <div class="flex items-center justify-between px-6 py-4 border-b border-slate-100">
        <h2 class="font-semibold text-slate-900">{title}</h2>
        <button onclick={() => (open = false)} class="btn-ghost p-1.5 rounded-lg">
          <X size={18} />
        </button>
      </div>
      <div class="overflow-y-auto flex-1 p-6">
        {@render children()}
      </div>
    </div>
  </div>
{/if}

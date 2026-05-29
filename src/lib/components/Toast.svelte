<script lang="ts">
  import { CheckCircle2, XCircle } from '@lucide/svelte'

  let {
    message,
    type = 'success',
    show = $bindable(false),
  }: {
    message: string
    type?: 'success' | 'error'
    show: boolean
  } = $props()

  $effect(() => {
    if (show) {
      const t = setTimeout(() => (show = false), 3500)
      return () => clearTimeout(t)
    }
  })
</script>

{#if show}
  <div
    class="fixed bottom-6 right-6 z-[100] flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg text-sm font-medium transition-all duration-300
      {type === 'success' ? 'bg-emerald-600 text-white' : 'bg-rose-600 text-white'}"
  >
    {#if type === 'success'}
      <CheckCircle2 size={16} />
    {:else}
      <XCircle size={16} />
    {/if}
    {message}
  </div>
{/if}

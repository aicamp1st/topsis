<script lang="ts">
  import { initials } from '$lib/utils'

  let {
    items,
  }: {
    items: { name: string; value: number; rank: number }[]
  } = $props()

  // Layout
  const W = 720
  const H = 300
  const padX = 40
  const padTop = 30
  const padBottom = 54
  const plotW = W - padX * 2
  const plotH = H - padTop - padBottom

  const n = $derived(items.length)
  const slot = $derived(n > 0 ? plotW / n : plotW)
  const barW = $derived(Math.min(56, slot * 0.55))

  // sumbu Y 0..1, garis bantu tiap 0.25
  const gridLines = [0, 0.25, 0.5, 0.75, 1]

  function x(i: number): number {
    return padX + slot * i + (slot - barW) / 2
  }
  function barH(v: number): number {
    return Math.max(2, v * plotH)
  }
  function y(v: number): number {
    return padTop + plotH - barH(v)
  }
</script>

<div class="w-full overflow-x-auto">
  <svg viewBox="0 0 {W} {H}" class="w-full min-w-[520px]" role="img" aria-label="Grafik skor kedekatan Ci">
    <defs>
      <linearGradient id="barTop" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#d27c4f" />
        <stop offset="100%" stop-color="#a84a2b" />
      </linearGradient>
      <linearGradient id="barRest" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#a3ae53" />
        <stop offset="100%" stop-color="#67722b" />
      </linearGradient>
    </defs>

    <!-- Gridlines + label sumbu -->
    {#each gridLines as g}
      {@const gy = padTop + plotH - g * plotH}
      <line x1={padX} y1={gy} x2={W - padX} y2={gy} stroke="#e6dccd" stroke-width="1" stroke-dasharray={g === 0 ? '0' : '3 4'} />
      <text x={padX - 8} y={gy + 3} text-anchor="end" font-size="10" fill="#ab9c84" font-family="Figtree">
        {(g * 100).toFixed(0)}
      </text>
    {/each}

    <!-- Bars -->
    {#each items as it, i}
      {@const bx = x(i)}
      {@const by = y(it.value)}
      {@const bh = barH(it.value)}
      <g>
        <rect
          x={bx}
          y={by}
          width={barW}
          height={bh}
          rx="8"
          fill={it.rank === 1 ? 'url(#barTop)' : 'url(#barRest)'}
          opacity={it.rank === 1 ? 1 : 0.92}
        >
          <animate attributeName="height" from="0" to={bh} dur="0.6s" fill="freeze" calcMode="spline" keySplines="0.2 0.8 0.2 1" keyTimes="0;1" />
          <animate attributeName="y" from={padTop + plotH} to={by} dur="0.6s" fill="freeze" calcMode="spline" keySplines="0.2 0.8 0.2 1" keyTimes="0;1" />
        </rect>

        <!-- nilai di atas bar -->
        <text x={bx + barW / 2} y={by - 8} text-anchor="middle" font-size="12" font-weight="700" fill="#4c4133" font-family="Figtree">
          {(it.value * 100).toFixed(1)}
        </text>

        <!-- inisial di bawah -->
        <text x={bx + barW / 2} y={padTop + plotH + 20} text-anchor="middle" font-size="11" font-weight="700" fill="#655844" font-family="Figtree">
          {initials(it.name)}
        </text>
        <text x={bx + barW / 2} y={padTop + plotH + 36} text-anchor="middle" font-size="9.5" fill="#ab9c84" font-family="Figtree">
          #{it.rank}
        </text>
      </g>
    {/each}
  </svg>
</div>

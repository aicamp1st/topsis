<script lang="ts">
  let {
    axes,
    series,
  }: {
    axes: string[]
    series: { name: string; values: number[] }[]
  } = $props()

  const size = 360
  const cx = size / 2
  const cy = size / 2
  const R = 120
  const rings = [0.25, 0.5, 0.75, 1]
  const colors = ['#c25f37', '#67722b', '#e3a02f'] // terracotta, olive, honey

  const m = $derived(axes.length)

  // Skala per-sumbu: bagi dengan nilai maksimum sumbu itu (radar relatif)
  const axisMax = $derived(
    axes.map((_, k) => Math.max(...series.map((s) => s.values[k] ?? 0), 1e-9)),
  )

  function angle(k: number): number {
    return -Math.PI / 2 + (k * 2 * Math.PI) / m
  }
  function point(k: number, r01: number): [number, number] {
    const a = angle(k)
    return [cx + Math.cos(a) * R * r01, cy + Math.sin(a) * R * r01]
  }
  function polygon(values: number[]): string {
    return values
      .map((v, k) => {
        const [px, py] = point(k, Math.min(1, (v ?? 0) / axisMax[k]))
        return `${px.toFixed(1)},${py.toFixed(1)}`
      })
      .join(' ')
  }
</script>

<div class="flex flex-col items-center gap-4">
  <svg viewBox="0 0 {size} {size}" class="w-full max-w-[360px]" role="img" aria-label="Radar perbandingan kriteria">
    <!-- Cincin grid -->
    {#each rings as ring}
      <polygon
        points={axes.map((_, k) => point(k, ring).join(',')).join(' ')}
        fill="none"
        stroke="#e6dccd"
        stroke-width="1"
      />
    {/each}

    <!-- Spokes + label sumbu -->
    {#each axes as ax, k}
      {@const [ex, ey] = point(k, 1)}
      {@const [lx, ly] = point(k, 1.18)}
      <line x1={cx} y1={cy} x2={ex} y2={ey} stroke="#e6dccd" stroke-width="1" />
      <text
        x={lx}
        y={ly}
        text-anchor={Math.abs(lx - cx) < 8 ? 'middle' : lx > cx ? 'start' : 'end'}
        dominant-baseline="middle"
        font-size="9.5"
        fill="#655844"
        font-family="Figtree"
        font-weight="600"
      >
        {ax.length > 14 ? ax.slice(0, 13) + '…' : ax}
      </text>
    {/each}

    <!-- Polygon tiap kandidat -->
    {#each series as s, i}
      <polygon
        points={polygon(s.values)}
        fill={colors[i % colors.length]}
        fill-opacity="0.14"
        stroke={colors[i % colors.length]}
        stroke-width="2"
        stroke-linejoin="round"
      />
      {#each s.values as v, k}
        {@const [px, py] = point(k, Math.min(1, (v ?? 0) / axisMax[k]))}
        <circle cx={px} cy={py} r="3" fill={colors[i % colors.length]} />
      {/each}
    {/each}
  </svg>

  <!-- Legend -->
  <div class="flex flex-wrap items-center justify-center gap-4">
    {#each series as s, i}
      <div class="flex items-center gap-2">
        <span class="w-3 h-3 rounded-full" style="background:{colors[i % colors.length]}"></span>
        <span class="text-xs font-medium text-slate-600">{s.name}</span>
      </div>
    {/each}
  </div>
</div>

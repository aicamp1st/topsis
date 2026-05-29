export function fmt(n: number, dp = 4): string {
  return n.toFixed(dp)
}

export function pct(n: number): string {
  return (n * 100).toFixed(1) + '%'
}

export function initials(name: string): string {
  return name
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase()
}

export function departmentColor(dept: string): string {
  const colors: Record<string, string> = {
    Keuangan: 'bg-emerald-100 text-emerald-700',
    Pemasaran: 'bg-blue-100 text-blue-700',
    Teknologi: 'bg-violet-100 text-violet-700',
    SDM: 'bg-amber-100 text-amber-700',
    Operasional: 'bg-rose-100 text-rose-700',
  }
  return colors[dept] ?? 'bg-slate-100 text-slate-700'
}

export function rankMedal(rank: number): string {
  const medals: Record<number, string> = { 1: '🥇', 2: '🥈', 3: '🥉' }
  return medals[rank] ?? `#${rank}`
}

export function closenessLabel(c: number): { label: string; class: string } {
  if (c >= 0.7) return { label: 'Sangat Baik', class: 'bg-emerald-100 text-emerald-700' }
  if (c >= 0.5) return { label: 'Baik', class: 'bg-blue-100 text-blue-700' }
  if (c >= 0.3) return { label: 'Cukup', class: 'bg-amber-100 text-amber-700' }
  return { label: 'Kurang', class: 'bg-rose-100 text-rose-700' }
}

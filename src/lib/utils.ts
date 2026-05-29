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
  // Palet earthy hangat — variasi tetap koheren, bukan "pelangi"
  const colors: Record<string, string> = {
    Keuangan: 'bg-olive-100 text-olive-700',
    Pemasaran: 'bg-primary-100 text-primary-700',
    Teknologi: 'bg-honey-100 text-[#8a5a12]',
    SDM: 'bg-slate-200 text-slate-700',
    Operasional: 'bg-rose-100 text-rose-600',
    Produksi: 'bg-olive-200 text-olive-800',
  }
  return colors[dept] ?? 'bg-slate-100 text-slate-600'
}

export function rankMedal(rank: number): string {
  const medals: Record<number, string> = { 1: '🥇', 2: '🥈', 3: '🥉' }
  return medals[rank] ?? `#${rank}`
}

export function closenessLabel(c: number): { label: string; class: string } {
  if (c >= 0.7) return { label: 'Sangat Baik', class: 'bg-olive-100 text-olive-700' }
  if (c >= 0.5) return { label: 'Baik', class: 'bg-primary-100 text-primary-700' }
  if (c >= 0.3) return { label: 'Cukup', class: 'bg-honey-100 text-[#8a5a12]' }
  return { label: 'Kurang', class: 'bg-rose-100 text-rose-600' }
}

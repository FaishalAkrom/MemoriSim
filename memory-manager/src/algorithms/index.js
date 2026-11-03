import { fifo } from './fifo.js'
import { lru } from './lru.js'
import { optimal } from './optimal.js'

export const ALGORITHMS = {
  FIFO: { label: 'FIFO', run: fifo, color: '#3b6fe0' },
  LRU: { label: 'LRU', run: lru, color: '#10b981' },
  Optimal: { label: 'Optimal', run: optimal, color: '#f59e0b' },
}

export function parseInput(text) {
  if (!text || !text.trim()) return { error: 'Urutan data tidak boleh kosong.' }
  const parts = text.split(',').map((s) => s.trim())
  if (parts.some((p) => p === '')) return { error: 'Format salah: ada nilai kosong di antara koma.' }
  if (parts.some((p) => !/^\d+$/.test(p))) return { error: 'Hanya angka bulat (0 atau lebih) yang diperbolehkan, dipisahkan koma.' }
  if (parts.length > 50) return { error: 'Maksimal 50 permintaan data.' }
  return { pages: parts.map(Number) }
}

export function summarize(steps) {
  const total = steps.length
  const hits = steps.filter((s) => s.hit).length
  const faults = total - hits
  return { total, hits, faults, faultRatio: (faults / total) * 100, hitRatio: (hits / total) * 100 }
}

export function compareAll(pages, cap) {
  return Object.entries(ALGORITHMS).map(([key, a]) => ({
    name: a.label, key, color: a.color, ...summarize(a.run(pages, cap)),
  }))
}

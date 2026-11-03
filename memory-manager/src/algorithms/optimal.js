import { simulate } from './common.js'
// Optimal: ganti data yang permintaan berikutnya paling jauh (atau tidak pernah diminta lagi).
export function optimal(pages, cap) {
  return simulate(pages, cap, ({ mem, pages, i }) => {
    let best = 0, bestDist = -1
    mem.forEach((p, s) => {
      const next = pages.indexOf(p, i + 1)
      const dist = next === -1 ? Infinity : next
      if (dist > bestDist) { bestDist = dist; best = s }
    })
    return best
  })
}

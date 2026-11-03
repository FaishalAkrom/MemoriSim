import { simulate } from './common.js'
// LRU: ganti data yang paling lama tidak digunakan.
export function lru(pages, cap) {
  return simulate(pages, cap, ({ lastUsed }) => lastUsed.indexOf(Math.min(...lastUsed)))
}

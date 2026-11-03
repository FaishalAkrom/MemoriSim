import { simulate } from './common.js'
// FIFO: ganti data yang paling awal masuk ke memori.
export function fifo(pages, cap) {
  return simulate(pages, cap, ({ loadedAt }) => loadedAt.indexOf(Math.min(...loadedAt)))
}

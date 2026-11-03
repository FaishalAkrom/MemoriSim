// Mesin simulasi bersama. Tiap algoritma hanya menentukan slot korban (victim).
export function simulate(pages, cap, pickVictim) {
  const mem = Array(cap).fill(null)
  const loadedAt = Array(cap).fill(-1)
  const lastUsed = Array(cap).fill(-1)
  const steps = []
  pages.forEach((page, i) => {
    let slot = mem.indexOf(page)
    const hit = slot !== -1
    let evicted = null
    if (hit) {
      lastUsed[slot] = i
    } else {
      slot = mem.indexOf(null)
      if (slot === -1) {
        slot = pickVictim({ mem, loadedAt, lastUsed, pages, i })
        evicted = mem[slot]
      }
      mem[slot] = page
      loadedAt[slot] = i
      lastUsed[slot] = i
    }
    const explanation = hit
      ? `Data ${page} sudah tersedia di memori. Tidak perlu dimasukkan kembali.`
      : evicted === null
        ? `Data ${page} belum ada di memori. Data dimasukkan ke slot kosong.`
        : `Data ${page} belum ada di memori dan memori sudah penuh. Data ${evicted} dikeluarkan dan digantikan oleh data ${page}.`
    steps.push({ step: i + 1, page, hit, slot, evicted, memory: [...mem], explanation })
  })
  return steps
}

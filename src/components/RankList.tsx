import { useState } from 'react'

type Props = {
  ids: string[]
  names: Record<string, string>
  onChange?: (ordered: string[]) => void
}

// Simple up/down list reordering
export default function RankList({ ids, names, onChange }: Props) {
  const [order, setOrder] = useState<string[]>(ids)

  const move = (i: number, dir: -1 | 1) => {
    const j = i + dir
    if (j < 0 || j >= order.length) return
    const copy = [...order]
    const tmp = copy[i]
    copy[i] = copy[j]
    copy[j] = tmp
    setOrder(copy)
    onChange?.(copy)
  }

  return (
    <ul className="space-y-2">
      {order.map((id, i) => (
        <li key={id} className="flex items-center justify-between rounded-xl bg-neutral-950 border border-neutral-800 p-3">
          <span>{names[id] ?? id}</span>
          <div className="flex gap-2">
            <button className="btn" onClick={() => move(i, -1)} disabled={i === 0}>↑</button>
            <button className="btn" onClick={() => move(i, +1)} disabled={i === order.length - 1}>↓</button>
          </div>
        </li>
      ))}
    </ul>
  )
}

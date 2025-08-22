import { Outlet } from 'react-router-dom'

export default function App(){
  return (
    <div className="min-h-full">
      <header className="sticky top-0 z-10 backdrop-blur bg-neutral-950/70 border-b border-neutral-800">
        <div className="mx-auto max-w-3xl px-4 py-3 flex items-center justify-between">
          <div className="font-semibold">Dinner Party Game</div>
          <a className="text-sm opacity-70 hover:opacity-100" href="https://github.com/">GitHub</a>
          <p className="text-pink-500">Tailwind works!</p>
        </div>
      </header>
      <main className="mx-auto max-w-3xl px-4 py-6">
        <Outlet />
      </main>
    </div>
  )
}

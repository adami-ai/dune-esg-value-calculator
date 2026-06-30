import { useState } from 'react'
import { brand } from './branding/brand'
import AbsenteeismCalculator from './components/AbsenteeismCalculator'
import TurnoverCalculator from './components/TurnoverCalculator'
import GreenEnergyCalculator from './components/GreenEnergyCalculator'

const TABS = [
  { key: 'E', label: 'Environmental' },
  { key: 'S', label: 'Social' },
  { key: 'G', label: 'Governance' },
]

const LEVER_CATEGORIES = {
  E: ['green_energy'],
  S: ['absenteeism', 'turnover'],
  G: [],
}

const LEVER_LABELS = {
  green_energy: 'Green Energy',
  absenteeism:  'Absenteeism',
  turnover:     'Turnover',
}

const fmt = (n) =>
  new Intl.NumberFormat('nl-NL', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(n)

export default function App() {
  const [activeTab, setActiveTab] = useState('S')
  const [levers, setLevers] = useState({
    green_energy: { enabled: false, vcp: 0 },
    absenteeism:  { enabled: false, vcp: 0 },
    turnover:     { enabled: false, vcp: 0 },
  })

  const update = (key, patch) =>
    setLevers((prev) => ({ ...prev, [key]: { ...prev[key], ...patch } }))

  const totalVcp = Object.values(levers)
    .filter((l) => l.enabled)
    .reduce((sum, l) => sum + l.vcp, 0)

  const activeLevers = Object.values(levers).filter((l) => l.enabled).length

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'var(--c-bg)' }}>

      {/* Header */}
      <header className="border-b px-8 py-4 flex items-center justify-between"
        style={{ background: 'var(--c-surface)', borderColor: 'var(--c-primary-light)' }}>
        <img src={brand.logoPath} alt={brand.name} className="h-8" />
        <span className="text-xs font-medium" style={{ color: 'var(--c-muted)' }}>
          ESG Value Creation Calculator
        </span>
      </header>

      {/* Tab nav */}
      <div className="border-b px-8" style={{ background: 'var(--c-surface)', borderColor: 'var(--c-primary-light)' }}>
        <div className="flex gap-0">
          {TABS.map(({ key, label }) => {
            const active = activeTab === key
            return (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                className="px-6 py-3 text-sm font-medium border-b-2 transition-colors"
                style={{
                  borderColor: active ? 'var(--c-primary)' : 'transparent',
                  color: active ? 'var(--c-primary)' : 'var(--c-muted)',
                }}
              >
                <span className="font-bold mr-1">{key}</span>
                <span className="hidden sm:inline">{label}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Content */}
      <main className="flex-1 flex flex-col lg:flex-row gap-6 p-6 lg:p-8 max-w-6xl mx-auto w-full">

        {/* Left: calculators */}
        <div className="flex-1 flex flex-col gap-6">
          {activeTab === 'S' && (
            <>
              <AbsenteeismCalculator
                enabled={levers.absenteeism.enabled}
                onToggle={() => update('absenteeism', { enabled: !levers.absenteeism.enabled })}
                onVcpChange={(vcp) => update('absenteeism', { vcp })}
              />
              <TurnoverCalculator
                enabled={levers.turnover.enabled}
                onToggle={() => update('turnover', { enabled: !levers.turnover.enabled })}
                onVcpChange={(vcp) => update('turnover', { vcp })}
              />
            </>
          )}
          {activeTab === 'E' && (
            <GreenEnergyCalculator
              enabled={levers.green_energy.enabled}
              onToggle={() => update('green_energy', { enabled: !levers.green_energy.enabled })}
              onVcpChange={(vcp) => update('green_energy', { vcp })}
            />
          )}
          {activeTab === 'G' && <ComingSoon label="Governance" />}
        </div>

        {/* Right: summary */}
        <div className="lg:w-72 xl:w-80">
          <div className="sticky top-6 rounded-2xl border p-6"
            style={{ background: 'var(--c-surface)', borderColor: 'var(--c-primary-light)' }}>
            <h2 className="font-semibold mb-1" style={{ color: 'var(--c-primary)' }}>
              Total VCP
            </h2>
            <p className="text-xs mb-5" style={{ color: 'var(--c-muted)' }}>
              Selected levers
            </p>

            {/* Lever rows grouped by E / S / G */}
            <div className="flex flex-col gap-3 mb-5">
              {TABS.map(({ key, label }) => {
                const keys = LEVER_CATEGORIES[key]
                const subtotal = keys
                  .filter((k) => levers[k]?.enabled)
                  .reduce((sum, k) => sum + (levers[k]?.vcp ?? 0), 0)
                const hasActive = keys.some((k) => levers[k]?.enabled)

                return (
                  <div key={key}>
                    <div className="flex justify-between items-center mb-1.5">
                      <span className="text-xs font-semibold" style={{ color: 'var(--c-primary)' }}>
                        {key} — {label}
                      </span>
                      {hasActive && (
                        <span className="text-xs font-semibold tabular-nums" style={{ color: 'var(--c-primary)' }}>
                          {fmt(subtotal)}
                        </span>
                      )}
                    </div>
                    {keys.length > 0 ? (
                      <div className="flex flex-col gap-1.5 pl-2 border-l-2" style={{ borderColor: 'var(--c-primary-light)' }}>
                        {keys.map((k) => (
                          <LeverRow
                            key={k}
                            label={LEVER_LABELS[k]}
                            vcp={levers[k]?.vcp ?? 0}
                            enabled={levers[k]?.enabled ?? false}
                          />
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs pl-2 border-l-2" style={{ color: 'var(--c-muted)', borderColor: 'var(--c-primary-light)' }}>
                        Coming soon
                      </p>
                    )}
                  </div>
                )
              })}
            </div>

            <div className="border-t pt-4" style={{ borderColor: 'var(--c-primary-light)' }}>
              <div className="flex justify-between items-end">
                <div>
                  <p className="text-xs" style={{ color: 'var(--c-muted)' }}>
                    {activeLevers} lever{activeLevers !== 1 ? 's' : ''} active
                  </p>
                  <p className="text-xs mt-0.5" style={{ color: 'var(--c-muted)' }}>
                    Potential OpEx saving
                  </p>
                </div>
                <p className="text-2xl font-bold tabular-nums" style={{ color: 'var(--c-primary)' }}>
                  {fmt(totalVcp)}
                </p>
              </div>
            </div>

            {activeLevers === 0 && (
              <p className="text-xs mt-4 text-center" style={{ color: 'var(--c-muted)' }}>
                Toggle a lever to include it in the total
              </p>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}

function LeverRow({ label, vcp, enabled }) {
  const fmt = (n) =>
    new Intl.NumberFormat('nl-NL', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(n)

  return (
    <div className="flex justify-between items-center rounded-lg px-3 py-2"
      style={{ background: enabled ? '#05353410' : 'var(--c-bg)', opacity: enabled ? 1 : 0.45 }}>
      <div className="flex items-center gap-2">
        <div className="w-2 h-2 rounded-full" style={{ background: enabled ? 'var(--c-primary)' : 'var(--c-primary-light)' }} />
        <span className="text-sm" style={{ color: 'var(--c-text)' }}>{label}</span>
      </div>
      <span className="text-sm font-semibold tabular-nums" style={{ color: enabled ? 'var(--c-primary)' : 'var(--c-muted)' }}>
        {enabled ? fmt(vcp) : '—'}
      </span>
    </div>
  )
}

function ComingSoon({ label }) {
  return (
    <div className="rounded-2xl border border-dashed flex items-center justify-center p-16"
      style={{ borderColor: 'var(--c-primary-light)' }}>
      <div className="text-center">
        <p className="font-medium" style={{ color: 'var(--c-primary)' }}>{label}</p>
        <p className="text-sm mt-1" style={{ color: 'var(--c-muted)' }}>Coming soon</p>
      </div>
    </div>
  )
}

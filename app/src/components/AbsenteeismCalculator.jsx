import { useState, useEffect } from 'react'
import InputField from './InputField'

const fmt = (n) =>
  new Intl.NumberFormat('nl-NL', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(n)

const fmtPct = (n) => `${(n * 100).toFixed(1)}%`

export default function AbsenteeismCalculator({ enabled, onToggle, onVcpChange }) {
  const [inputs, setInputs] = useState({
    absentium_actual: 6,
    absentium_market: 4,
    tot_fte: 250,
    tot_revenue: 50_000_000,
  })

  const set = (key) => (e) =>
    setInputs((prev) => ({ ...prev, [key]: parseFloat(e.target.value) || 0 }))

  const delta = (inputs.absentium_actual - inputs.absentium_market) / 100
  const rev_per_fte = inputs.tot_fte > 0 ? inputs.tot_revenue / inputs.tot_fte : 0
  const vcp = delta * inputs.tot_fte * rev_per_fte
  const positive = vcp > 0

  useEffect(() => { onVcpChange(vcp) }, [vcp])

  return (
    <div
      className="rounded-2xl border p-6 transition-opacity"
      style={{
        background: 'var(--c-surface)',
        borderColor: enabled ? 'var(--c-primary)' : 'var(--c-primary-light)',
        opacity: enabled ? 1 : 0.65,
      }}
    >
      <div className="flex items-start justify-between mb-5">
        <div>
          <h3 className="font-semibold" style={{ color: 'var(--c-primary)' }}>Absenteeism</h3>
          <p className="text-xs mt-0.5" style={{ color: 'var(--c-muted)' }}>
            VCP = Δabsenteeism% × FTE × revenue/FTE
          </p>
        </div>
        <Toggle enabled={enabled} onToggle={onToggle} />
      </div>

      <div className="grid grid-cols-2 gap-3 mb-5">
        <InputField label="Actual absenteeism%" value={inputs.absentium_actual} onChange={set('absentium_actual')} suffix="%" step="0.1" />
        <InputField label="Market benchmark%" value={inputs.absentium_market} onChange={set('absentium_market')} suffix="%" step="0.1" />
        <InputField label="Total FTE" value={inputs.tot_fte} onChange={set('tot_fte')} suffix="FTE" />
        <InputField label="Total revenue" value={inputs.tot_revenue} onChange={set('tot_revenue')} prefix="€" step="100000" />
      </div>

      <div className="flex gap-3 mb-4">
        <Chip label="Δ absenteeism" value={fmtPct(delta)} accent={delta > 0} />
        <Chip label="Revenue / FTE" value={fmt(rev_per_fte)} />
      </div>

      <ResultBanner vcp={vcp} positive={positive} />
    </div>
  )
}

export function Toggle({ enabled, onToggle }) {
  return (
    <label className="flex items-center gap-2 cursor-pointer select-none">
      <span className="text-xs" style={{ color: 'var(--c-muted)' }}>Include</span>
      <div
        className="relative w-9 h-5 rounded-full transition-colors cursor-pointer"
        style={{ background: enabled ? 'var(--c-primary)' : 'var(--c-primary-light)' }}
        onClick={onToggle}
      >
        <div
          className="absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform"
          style={{ transform: enabled ? 'translateX(18px)' : 'translateX(2px)' }}
        />
      </div>
    </label>
  )
}

function Chip({ label, value, accent }) {
  return (
    <div className="flex-1 rounded-lg px-3 py-2" style={{ background: 'var(--c-bg)' }}>
      <p className="text-xs" style={{ color: 'var(--c-muted)' }}>{label}</p>
      <p className="font-semibold text-sm mt-0.5" style={{ color: accent ? 'var(--c-primary)' : 'var(--c-text)' }}>{value}</p>
    </div>
  )
}

export function ResultBanner({ vcp, positive }) {
  const fmtEur = (n) =>
    new Intl.NumberFormat('nl-NL', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(n)

  return (
    <div
      className="rounded-xl p-4 flex items-center justify-between"
      style={{ background: positive ? '#05353415' : '#FEF2F2' }}
    >
      <div>
        <p className="text-sm font-medium" style={{ color: positive ? 'var(--c-primary)' : '#991B1B' }}>
          Value Creation Potential
        </p>
        <p className="text-xs mt-0.5" style={{ color: positive ? 'var(--c-muted)' : '#EF4444' }}>
          {positive ? 'Room above market average' : 'Already below market — no VCP'}
        </p>
      </div>
      <p className="text-2xl font-bold tabular-nums" style={{ color: positive ? 'var(--c-primary)' : '#EF4444' }}>
        {fmtEur(vcp)}
      </p>
    </div>
  )
}

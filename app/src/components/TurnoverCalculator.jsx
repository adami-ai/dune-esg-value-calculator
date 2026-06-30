import { useState, useEffect } from 'react'
import InputField from './InputField'
import { Toggle, ResultBanner } from './AbsenteeismCalculator'

const DISTRIBUTION = { junior: 0.6, medior: 0.3, senior: 0.1 }
const REPLACEMENT  = { junior: 0.20, medior: 1.20, senior: 2.00 }

export default function TurnoverCalculator({ enabled, onToggle, onVcpChange }) {
  const [inputs, setInputs] = useState({
    salary_junior: 35_000,
    salary_medior: 55_000,
    salary_senior: 85_000,
    tot_fte: 250,
    delta_turnover: 1,
  })

  const set = (key) => (e) =>
    setInputs((prev) => ({ ...prev, [key]: parseFloat(e.target.value) || 0 }))

  // Weighted replacement cost per leaver
  const cost_per_leaver =
    inputs.salary_junior * REPLACEMENT.junior * DISTRIBUTION.junior +
    inputs.salary_medior * REPLACEMENT.medior * DISTRIBUTION.medior +
    inputs.salary_senior * REPLACEMENT.senior * DISTRIBUTION.senior

  // VCP = delta_turnover% × FTE × cost_per_leaver
  const vcp = (inputs.delta_turnover / 100) * inputs.tot_fte * cost_per_leaver

  useEffect(() => { onVcpChange(vcp) }, [vcp])

  const fmt = (n) =>
    new Intl.NumberFormat('nl-NL', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(n)

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
          <h3 className="font-semibold" style={{ color: 'var(--c-primary)' }}>Turnover</h3>
          <p className="text-xs mt-0.5" style={{ color: 'var(--c-muted)' }}>
            VCP = Δturnover% × FTE × weighted replacement cost
          </p>
        </div>
        <Toggle enabled={enabled} onToggle={onToggle} />
      </div>

      {/* Salary inputs */}
      <div className="grid grid-cols-3 gap-3 mb-3">
        <InputField label="Junior salary" value={inputs.salary_junior} onChange={set('salary_junior')} prefix="€" step="1000"
          hint="Replacement cost: 20%" />
        <InputField label="Medior salary" value={inputs.salary_medior} onChange={set('salary_medior')} prefix="€" step="1000"
          hint="Replacement cost: 120%" />
        <InputField label="Senior salary" value={inputs.salary_senior} onChange={set('salary_senior')} prefix="€" step="1000"
          hint="Replacement cost: 200%" />
      </div>

      {/* FTE + delta */}
      <div className="grid grid-cols-2 gap-3 mb-5">
        <InputField label="Total FTE" value={inputs.tot_fte} onChange={set('tot_fte')} suffix="FTE" />
        <InputField label="Δ turnover (assumption)" value={inputs.delta_turnover} onChange={set('delta_turnover')} suffix="%" step="0.1"
          hint="Default: 1% reduction" />
      </div>

      {/* Distribution chips */}
      <div className="rounded-lg p-3 mb-4 text-xs" style={{ background: 'var(--c-bg)' }}>
        <p className="font-medium mb-2" style={{ color: 'var(--c-muted)' }}>Population distribution & replacement factor</p>
        <div className="grid grid-cols-3 gap-2">
          {[
            { label: 'Junior', dist: DISTRIBUTION.junior, repl: REPLACEMENT.junior, salary: inputs.salary_junior },
            { label: 'Medior', dist: DISTRIBUTION.medior, repl: REPLACEMENT.medior, salary: inputs.salary_medior },
            { label: 'Senior', dist: DISTRIBUTION.senior, repl: REPLACEMENT.senior, salary: inputs.salary_senior },
          ].map(({ label, dist, repl, salary }) => (
            <div key={label} className="rounded-md px-2 py-1.5" style={{ background: 'var(--c-surface)' }}>
              <p className="font-medium" style={{ color: 'var(--c-primary)' }}>{label}</p>
              <p style={{ color: 'var(--c-muted)' }}>{(dist * 100).toFixed(0)}% of FTE</p>
              <p style={{ color: 'var(--c-muted)' }}>{(repl * 100).toFixed(0)}% of salary</p>
              <p className="font-semibold mt-0.5" style={{ color: 'var(--c-text)' }}>{fmt(salary * repl)}</p>
            </div>
          ))}
        </div>
        <div className="flex justify-between mt-2 pt-2 border-t" style={{ borderColor: 'var(--c-primary-light)' }}>
          <span style={{ color: 'var(--c-muted)' }}>Weighted cost per leaver</span>
          <span className="font-semibold" style={{ color: 'var(--c-primary)' }}>{fmt(cost_per_leaver)}</span>
        </div>
      </div>

      <ResultBanner vcp={vcp} positive={vcp > 0} />
    </div>
  )
}

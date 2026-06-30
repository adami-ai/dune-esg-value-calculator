import { useState, useEffect } from 'react'
import InputField from './InputField'
import { Toggle, ResultBanner } from './AbsenteeismCalculator'

export default function GreenEnergyCalculator({ enabled, onToggle, onVcpChange }) {
  const [inputs, setInputs] = useState({
    mwh_consumption: 5_000,
    emission_factor: 0.26,
    green_energy_cost: 80,
    offset_price: 75,
  })

  const set = (key) => (e) =>
    setInputs((prev) => ({ ...prev, [key]: parseFloat(e.target.value) || 0 }))

  // CO2 offset value per MWh = emission_factor × offset_price
  const co2_value_per_mwh = inputs.emission_factor * inputs.offset_price
  // Net benefit per MWh = co2_value - green_energy_cost
  const net_per_mwh = co2_value_per_mwh - inputs.green_energy_cost
  // VCP = MWh × (emission_factor × offset_price − green_energy_cost)
  const vcp = inputs.mwh_consumption * net_per_mwh

  useEffect(() => { onVcpChange(vcp) }, [vcp])

  const fmt = (n) =>
    new Intl.NumberFormat('nl-NL', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(n)

  const fmtCO2 = (n) => `${n.toFixed(2)} t`

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
          <h3 className="font-semibold" style={{ color: 'var(--c-primary)' }}>Guarantees of Origin vs. Offsetting</h3>
          <p className="text-xs mt-0.5" style={{ color: 'var(--c-muted)' }}>
            VCP = MWh × (emission factor × offset price − guarantees of origin cost)
          </p>
        </div>
        <Toggle enabled={enabled} onToggle={onToggle} />
      </div>

      <div className="grid grid-cols-2 gap-3 mb-5">
        <InputField
          label="Energy consumption"
          value={inputs.mwh_consumption}
          onChange={set('mwh_consumption')}
          suffix="MWh"
          step="100"
        />
        <InputField
          label="Emission factor"
          value={inputs.emission_factor}
          onChange={set('emission_factor')}
          suffix="t CO₂/MWh"
          step="0.01"
          hint="Default: 0.26 t CO₂/MWh"
        />
        <InputField
          label="Guarantees of Origin cost"
          value={inputs.green_energy_cost}
          onChange={set('green_energy_cost')}
          prefix="€"
          suffix="/MWh"
          step="1"
        />
        <InputField
          label="CO₂ offset price"
          value={inputs.offset_price}
          onChange={set('offset_price')}
          prefix="€"
          suffix="/t CO₂"
          step="1"
          hint="Range: €50–€100"
        />
      </div>

      {/* Intermediate values */}
      <div className="rounded-lg p-3 mb-4 text-xs" style={{ background: 'var(--c-bg)' }}>
        <div className="grid grid-cols-3 gap-2">
          <div>
            <p style={{ color: 'var(--c-muted)' }}>CO₂ avoided</p>
            <p className="font-semibold mt-0.5" style={{ color: 'var(--c-text)' }}>
              {fmtCO2(inputs.mwh_consumption * inputs.emission_factor)}
            </p>
          </div>
          <div>
            <p style={{ color: 'var(--c-muted)' }}>Offset value / MWh</p>
            <p className="font-semibold mt-0.5" style={{ color: 'var(--c-text)' }}>
              {fmt(co2_value_per_mwh)}
            </p>
          </div>
          <div>
            <p style={{ color: 'var(--c-muted)' }}>Net benefit / MWh</p>
            <p
              className="font-semibold mt-0.5"
              style={{ color: net_per_mwh >= 0 ? 'var(--c-primary)' : '#EF4444' }}
            >
              {fmt(net_per_mwh)}
            </p>
          </div>
        </div>
      </div>

      <ResultBanner vcp={vcp} positive={vcp > 0} />
    </div>
  )
}

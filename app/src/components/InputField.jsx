export default function InputField({ label, value, onChange, suffix, prefix, step = '1', hint }) {
  return (
    <div>
      <label className="block text-xs font-medium mb-1" style={{ color: 'var(--c-muted)' }}>
        {label}
      </label>
      <div
        className="flex items-center rounded-lg overflow-hidden border focus-within:ring-2"
        style={{ borderColor: 'var(--c-primary-light)', '--tw-ring-color': 'var(--c-primary)' }}
      >
        {prefix && (
          <span className="px-3 py-2 text-sm border-r" style={{ background: 'var(--c-sand)', color: 'var(--c-muted)', borderColor: 'var(--c-primary-light)' }}>
            {prefix}
          </span>
        )}
        <input
          type="number"
          value={value}
          onChange={onChange}
          step={step}
          className="flex-1 px-3 py-2 text-sm outline-none"
          style={{ background: 'var(--c-surface)', color: 'var(--c-text)' }}
        />
        {suffix && (
          <span className="px-3 py-2 text-sm border-l" style={{ background: 'var(--c-sand)', color: 'var(--c-muted)', borderColor: 'var(--c-primary-light)' }}>
            {suffix}
          </span>
        )}
      </div>
      {hint && <p className="text-xs mt-1" style={{ color: 'var(--c-muted)' }}>{hint}</p>}
    </div>
  )
}

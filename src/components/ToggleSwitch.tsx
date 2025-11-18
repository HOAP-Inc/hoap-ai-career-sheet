import React from 'react';
import './ToggleSwitch.css';

interface ToggleSwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  disabled?: boolean;
}

export const ToggleSwitch: React.FC<ToggleSwitchProps> = ({
  checked,
  onChange,
  label,
  disabled = false,
}) => {
  return (
    <label className={`toggle-switch ${disabled ? 'disabled' : ''}`}>
      {label && <span className="toggle-switch-label">{label}</span>}
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        disabled={disabled}
        className="toggle-switch-input"
      />
      <span className={`toggle-switch-slider ${checked ? 'checked' : ''}`} />
    </label>
  );
};


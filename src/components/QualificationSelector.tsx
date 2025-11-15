import React, { useState, useEffect } from 'react';
import type { Qualification } from '../types';
import {
  getAllQualifications,
  getQualificationById,
} from '../utils/qualificationsService';
import './TagSelector.css'; // 既存のスタイルを再利用

interface QualificationSelectorProps {
  value?: number | number[]; // 単一選択 or 複数選択
  onChange: (value: number | number[]) => void;
  multiple?: boolean;
  placeholder?: string;
  disabled?: boolean;
}

export const QualificationSelector: React.FC<QualificationSelectorProps> = ({
  value,
  onChange,
  multiple = false,
  placeholder = '選択してください',
  disabled = false,
}) => {
  const [availableQualifications, setAvailableQualifications] = useState<Qualification[]>([]);
  const [selectedQualifications, setSelectedQualifications] = useState<number[]>([]);

  // 初期化
  useEffect(() => {
    const quals = getAllQualifications();
    setAvailableQualifications(quals);

    if (value) {
      const ids = Array.isArray(value) ? value : [value];
      setSelectedQualifications(ids);
    }
  }, [value]);

  const handleQualificationChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const id = parseInt(e.target.value);
    if (!id) return;

    if (multiple) {
      // 複数選択の場合
      const newSelected = selectedQualifications.includes(id)
        ? selectedQualifications.filter((q) => q !== id)
        : [...selectedQualifications, id];
      setSelectedQualifications(newSelected);
      onChange(newSelected);
    } else {
      // 単一選択の場合
      setSelectedQualifications([id]);
      onChange(id);
    }
  };

  const handleQualificationRemove = (id: number) => {
    const newSelected = selectedQualifications.filter((q) => q !== id);
    setSelectedQualifications(newSelected);
    onChange(newSelected);
  };

  return (
    <div className="tag-selector">
      {/* 資格選択 */}
      <div className="tag-selector-step">
        <label className="tag-selector-label">資格名</label>
        {multiple ? (
          <select
            className="tag-selector-select"
            onChange={handleQualificationChange}
            disabled={disabled}
          >
            <option value="">選択してください</option>
            {availableQualifications.map((qual) => (
              <option 
                key={qual.id} 
                value={qual.id} 
                disabled={selectedQualifications.includes(qual.id)}
              >
                {qual.name}
              </option>
            ))}
          </select>
        ) : (
          <select
            className="tag-selector-select"
            value={selectedQualifications[0] || ''}
            onChange={handleQualificationChange}
            disabled={disabled}
          >
            <option value="">{placeholder}</option>
            {availableQualifications.map((qual) => (
              <option key={qual.id} value={qual.id}>
                {qual.name}
              </option>
            ))}
          </select>
        )}
      </div>

      {/* 複数選択の場合、選択済み資格を表示 */}
      {multiple && selectedQualifications.length > 0 && (
        <div className="tag-selector-selected">
          {selectedQualifications.map((id) => {
            const qual = getQualificationById(id);
            return qual ? (
              <span key={id} className="tag-selector-badge">
                {qual.name}
                <button
                  type="button"
                  className="tag-selector-remove"
                  onClick={() => handleQualificationRemove(id)}
                  disabled={disabled}
                >
                  ×
                </button>
              </span>
            ) : null;
          })}
        </div>
      )}
    </div>
  );
};


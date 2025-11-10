import React, { useState } from 'react';
import type { CareerItem } from '../../types';
import './CareerAddForm.css';

interface CareerAddFormProps {
  onAdd: (item: CareerItem) => void;
  onCancel: () => void;
}

export const CareerAddForm: React.FC<CareerAddFormProps> = ({ onAdd, onCancel }) => {
  const now = new Date()
  const currentYear = now.getFullYear()
  const years = Array.from({ length: 71 }, (_, i) => currentYear - i)
  const months = Array.from({ length: 12 }, (_, i) => i + 1)

  const [careerItem, setCareerItem] = useState<Partial<CareerItem>>({
    startYear: currentYear,
    startMonth: now.getMonth() + 1,
    endYear: undefined,
    endMonth: undefined,
    organization: '',
    department: '',
    isCurrent: false,
  })

  const handleCareerChange = (field: keyof CareerItem, value: string | number | boolean | undefined) => {
    setCareerItem(prev => {
      const next = { ...prev, [field]: value }

      const startYear = next.startYear ?? currentYear
      const startMonth = next.startMonth ?? 1

      if (field === 'isCurrent' && value === true) {
        next.endYear = undefined
        next.endMonth = undefined
      }

      if (field === 'startYear' && typeof value === 'number') {
        if (next.endYear && next.endYear < value) {
          next.endYear = value
        }
      }

      if (field === 'startMonth' && typeof value === 'number') {
        if (
          next.endYear === startYear &&
          typeof next.endMonth === 'number' &&
          next.endMonth < value
        ) {
          next.endMonth = value
        }
      }

      if (field === 'endYear' && typeof value === 'number') {
        if (value < startYear) {
          next.endYear = startYear
        }
      }

      if (
        field === 'endMonth' &&
        typeof value === 'number' &&
        next.endYear === startYear &&
        value < startMonth
      ) {
        next.endMonth = startMonth
      }

      if (
        typeof next.endYear === 'number' &&
        next.endYear < startYear
      ) {
        next.endYear = startYear
      }

      if (
        typeof next.endYear === 'number' &&
        next.endYear === startYear &&
        typeof next.endMonth === 'number' &&
        next.endMonth < startMonth
      ) {
        next.endMonth = startMonth
      }

      return next
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!careerItem.organization || !careerItem.department || !careerItem.startYear || !careerItem.startMonth) {
      alert('すべての必須フィールドを入力してください')
      return
    }

    if (!careerItem.isCurrent && (!careerItem.endYear || !careerItem.endMonth)) {
      alert('在籍中でない場合は終了年月も選択してください')
      return
    }

    const newItem: CareerItem = {
      startYear: careerItem.startYear!,
      startMonth: careerItem.startMonth,
      endYear: careerItem.isCurrent ? undefined : (careerItem.endYear as number | undefined),
      endMonth: careerItem.isCurrent ? undefined : careerItem.endMonth,
      organization: careerItem.organization,
      department: careerItem.department,
      isCurrent: careerItem.isCurrent || false,
    }

    onAdd(newItem)
  }

  return (
    <div className="career-add-form">
      <h3 className="form-title">キャリア履歴を追加</h3>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>在籍期間</label>
          <div className="period-inputs">
            <div className="period-select">
              <select
                value={careerItem.startYear}
                onChange={(e) => handleCareerChange('startYear', parseInt(e.target.value))}
                required
              >
                {years.map((year) => (
                  <option key={`start-${year}`} value={year}>
                    {year}
                  </option>
                ))}
              </select>
              <span className="period-suffix">年</span>
              <select
                value={careerItem.startMonth}
                onChange={(e) => handleCareerChange('startMonth', parseInt(e.target.value))}
                required
              >
                {months.map((month) => (
                  <option key={`start-month-${month}`} value={month}>
                    {month}
                  </option>
                ))}
              </select>
              <span className="period-suffix">月</span>
            </div>

            <span className="period-divider">〜</span>

            <div className="period-select">
              <select
                value={careerItem.endYear ?? ''}
                onChange={(e) =>
                  handleCareerChange('endYear', e.target.value ? parseInt(e.target.value) : undefined)
                }
                disabled={careerItem.isCurrent}
              >
                <option value="">--</option>
                {years.map((year) => (
                  <option key={`end-${year}`} value={year}>
                    {year}
                  </option>
                ))}
              </select>
              <span className="period-suffix">年</span>
              <select
                value={careerItem.endMonth ?? ''}
                onChange={(e) =>
                  handleCareerChange('endMonth', e.target.value ? parseInt(e.target.value) : undefined)
                }
                disabled={careerItem.isCurrent}
              >
                <option value="">--</option>
                {months.map((month) => (
                  <option key={`end-month-${month}`} value={month}>
                    {month}
                  </option>
                ))}
              </select>
              <span className="period-suffix">月</span>
            </div>
          </div>
        </div>
        <div className="form-group">
          <label>法人名（医院・クリニック名）</label>
          <input
            type="text"
            value={careerItem.organization || ''}
            onChange={(e) => handleCareerChange('organization', e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>部署／診療科</label>
          <input
            type="text"
            value={careerItem.department || ''}
            onChange={(e) => handleCareerChange('department', e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={careerItem.isCurrent || false}
              onChange={(e) => handleCareerChange('isCurrent', e.target.checked)}
            />
            <span className="checkbox-text">在籍中</span>
          </label>
        </div>
        <div className="form-actions">
          <button type="button" onClick={onCancel} className="btn-cancel">
            キャンセル
          </button>
          <button type="submit" className="btn-submit">
            更新
          </button>
        </div>
      </form>
    </div>
  );
};


import React, { useState } from 'react';
import type { CareerItem } from '../../types';
import { TagSelector } from '../../components/TagSelector';
import { getTagName } from '../../utils/tagsService';
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
    serviceType: '',
    serviceTypeId: undefined,
    medicalField: '',
    medicalFieldId: undefined,
    isCurrent: false,
    jobTitle: '',
    jobTitleId: undefined,
    workType: '',
    experienceDetail: '',
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
    if (!careerItem.organization || !careerItem.serviceTypeId || !careerItem.startYear || !careerItem.startMonth) {
      alert('すべての必須フィールドを入力してください')
      return
    }

    if (!careerItem.isCurrent && (!careerItem.endYear || !careerItem.endMonth)) {
      alert('在籍中でない場合は終了年月も選択してください')
      return
    }

    // IDから名前を生成（後方互換性のため）
    const newItem: CareerItem = {
      startYear: careerItem.startYear!,
      startMonth: careerItem.startMonth,
      endYear: careerItem.isCurrent ? undefined : (careerItem.endYear as number | undefined),
      endMonth: careerItem.isCurrent ? undefined : careerItem.endMonth,
      organization: careerItem.organization,
      serviceType: careerItem.serviceTypeId ? getTagName(careerItem.serviceTypeId) : '',
      serviceTypeId: careerItem.serviceTypeId,
      medicalField: careerItem.medicalFieldId ? getTagName(careerItem.medicalFieldId) : '',
      medicalFieldId: careerItem.medicalFieldId,
      isCurrent: careerItem.isCurrent || false,
      jobTitle: careerItem.jobTitleId ? getTagName(careerItem.jobTitleId) : '',
      jobTitleId: careerItem.jobTitleId,
      workType: careerItem.workType,
      experienceDetail: careerItem.experienceDetail,
    }

    console.log('CareerAddForm - 追加するデータ:', newItem)
    onAdd(newItem)
  }

  return (
    <div className="career-add-overlay" onClick={onCancel}>
      <div className="career-add-modal" onClick={(e) => e.stopPropagation()}>
        <div className="career-add-header">
          <h3 className="career-add-title">キャリア履歴を追加</h3>
          <button type="button" className="career-add-close" onClick={onCancel}>
            ×
          </button>
        </div>
        <form className="career-add-body" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>入社年月</label>
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
        </div>

        <div className="form-group">
          <label>退社年月（予定含む）</label>
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
        <div className="form-group">
          <label>勤務先</label>
          <input
            type="text"
            value={careerItem.organization || ''}
            onChange={(e) => handleCareerChange('organization', e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>サービス形態</label>
          <TagSelector
            category="サービス形態"
            value={careerItem.serviceTypeId || 0}
            onChange={(value) => handleCareerChange('serviceTypeId', value as number)}
            multiple={false}
            placeholder="分類を選択"
            secondPlaceholder="形態を選択"
            inlineLayout
            labelWeight="normal"
            labelOverrides={{ first: '　分類', second: '形態' }}
            indentFirstStep
          />
        </div>
        <div className="form-group">
          <label>診療科／分野</label>
          <TagSelector
            category="診療科・分野"
            value={careerItem.medicalFieldId || 0}
            onChange={(value) => handleCareerChange('medicalFieldId', value as number)}
            multiple={false}
            placeholder="大分類を選択"
            secondPlaceholder="詳細を選択"
            inlineLayout
            labelWeight="normal"
            labelOverrides={{ first: '　大分類', second: '詳細' }}
            indentFirstStep
          />
        </div>
        <div className="form-group">
          <label>勤務形態</label>
          <select
            value={careerItem.workType || ''}
            onChange={(e) => handleCareerChange('workType', e.target.value)}
          >
            <option value="">選択してください</option>
            <option value="正社員">正社員</option>
            <option value="時短正社員">時短正社員</option>
            <option value="パート">パート</option>
            <option value="業務委託">業務委託</option>
            <option value="その他">その他</option>
          </select>
        </div>
        <div className="form-group">
          <label>経験詳細</label>
          <textarea
            value={careerItem.experienceDetail || ''}
            onChange={(e) => handleCareerChange('experienceDetail', e.target.value)}
            rows={4}
            placeholder="経験詳細を入力してください"
            style={{ resize: 'vertical', minHeight: '100px' }}
          />
        </div>
        <div className="career-add-footer">
          <button type="button" onClick={onCancel} className="btn-cancel">
            キャンセル
          </button>
          <button type="submit" className="btn-submit">
            更新
          </button>
        </div>
      </form>
      </div>
    </div>
  );
};


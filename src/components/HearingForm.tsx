'use client'

import React, { useState } from 'react';
import type { ProfileData, CareerItem } from '../types';
import './HearingForm.css';

interface HearingFormProps {
  onSubmit: (data: ProfileData) => void;
  initialData?: Partial<ProfileData>;
}

export const HearingForm: React.FC<HearingFormProps> = ({ onSubmit, initialData }) => {
  const [formData, setFormData] = useState<Partial<ProfileData>>({
    name: initialData?.name || '',
    location: initialData?.location || '',
    jobTitle: initialData?.jobTitle || '',
    can: initialData?.can || '',
    will: initialData?.will || '',
    must: initialData?.must || '',
    personalWords: initialData?.personalWords || '',
    doing: initialData?.doing || '',
    being: initialData?.being || '',
    careerHistory: initialData?.careerHistory || [],
  });

  const [careerItem, setCareerItem] = useState<Partial<CareerItem>>({
    startYear: new Date().getFullYear(),
    startMonth: undefined,
    endYear: undefined,
    endMonth: undefined,
    organization: '',
    department: '',
    isCurrent: false,
  });

  const handleChange = (field: keyof ProfileData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleCareerChange = (field: keyof CareerItem, value: string | number | boolean | undefined) => {
    setCareerItem(prev => ({ ...prev, [field]: value }));
  };

  const addCareerItem = () => {
    if (!careerItem.organization || !careerItem.department || !careerItem.startYear) {
      alert('すべてのフィールドを入力してください');
      return;
    }

    const newItem: CareerItem = {
      startYear: careerItem.startYear!,
      startMonth: careerItem.startMonth,
      endYear: careerItem.isCurrent ? undefined : (careerItem.endYear as number),
      endMonth: careerItem.isCurrent ? undefined : careerItem.endMonth,
      organization: careerItem.organization,
      department: careerItem.department,
      isCurrent: careerItem.isCurrent || false,
    };

    setFormData(prev => ({
      ...prev,
      careerHistory: [...(prev.careerHistory || []), newItem].sort((a, b) => a.startYear - b.startYear),
    }));

    setCareerItem({
      startYear: new Date().getFullYear(),
      startMonth: undefined,
      endYear: undefined,
      endMonth: undefined,
      organization: '',
      department: '',
      isCurrent: false,
    });
  };

  const removeCareerItem = (index: number) => {
    setFormData(prev => ({
      ...prev,
      careerHistory: prev.careerHistory?.filter((_, i) => i !== index) || [],
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) {
      alert('名前を入力してください');
      return;
    }
    onSubmit(formData as ProfileData);
  };

  return (
    <div className="hearing-form-container">
      <form onSubmit={handleSubmit} className="hearing-form">
        <h2 className="form-title">ヒアリングフォーム</h2>

        <div className="form-group">
          <label htmlFor="name">名前</label>
          <input
            id="name"
            type="text"
            value={formData.name}
            onChange={(e) => handleChange('name', e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="location">所属/場所</label>
          <input
            id="location"
            type="text"
            value={formData.location || ''}
            onChange={(e) => handleChange('location', e.target.value)}
            placeholder="例：東京都中央区"
          />
        </div>

        <div className="form-group">
          <label htmlFor="jobTitle">職種</label>
          <input
            id="jobTitle"
            type="text"
            value={formData.jobTitle || ''}
            onChange={(e) => handleChange('jobTitle', e.target.value)}
            placeholder="例：正看護師 | ケアマネ"
          />
        </div>

        <div className="form-group">
          <label htmlFor="can">できること（Can）</label>
          <textarea
            id="can"
            value={formData.can}
            onChange={(e) => handleChange('can', e.target.value)}
            rows={4}
            placeholder="あなたができることを入力してください"
          />
        </div>

        <div className="form-group">
          <label htmlFor="will">やりたいこと（Will）</label>
          <textarea
            id="will"
            value={formData.will}
            onChange={(e) => handleChange('will', e.target.value)}
            rows={4}
            placeholder="あなたがやりたいことを入力してください"
          />
        </div>

        <div className="form-group">
          <label htmlFor="must">転職時に譲れない条件（Must）</label>
          <textarea
            id="must"
            value={formData.must}
            onChange={(e) => handleChange('must', e.target.value)}
            rows={4}
            placeholder="転職時に譲れない条件を入力してください"
          />
        </div>

        <div className="form-group">
          <label htmlFor="personalWords">本人の言葉</label>
          <textarea
            id="personalWords"
            value={formData.personalWords}
            onChange={(e) => handleChange('personalWords', e.target.value)}
            rows={4}
            placeholder="あなたの言葉を入力してください"
          />
        </div>

        <div className="form-group">
          <label htmlFor="doing">AIによる分析 - Doing（行動パターン/行動・役割・成果）</label>
          <textarea
            id="doing"
            value={formData.doing}
            onChange={(e) => handleChange('doing', e.target.value)}
            rows={4}
            placeholder="行動パターン、行動、役割、成果を入力してください"
          />
        </div>

        <div className="form-group">
          <label htmlFor="being">AIによる分析 - Being（価値観・姿勢・在り方）</label>
          <textarea
            id="being"
            value={formData.being}
            onChange={(e) => handleChange('being', e.target.value)}
            rows={4}
            placeholder="価値観、姿勢、在り方を入力してください"
          />
        </div>

        <div className="form-group career-group">
          <label>キャリア履歴</label>
          <div className="career-input">
            <input
              type="number"
              placeholder="開始年"
              value={careerItem.startYear || ''}
              onChange={(e) => handleCareerChange('startYear', parseInt(e.target.value))}
            />
            <input
              type="number"
              placeholder="開始月（1-12）"
              min="1"
              max="12"
              value={careerItem.startMonth || ''}
              onChange={(e) => handleCareerChange('startMonth', e.target.value ? parseInt(e.target.value) : undefined)}
            />
            <input
              type="number"
              placeholder="終了年（現在の場合は空欄）"
              value={careerItem.endYear || ''}
              onChange={(e) => handleCareerChange('endYear', e.target.value ? parseInt(e.target.value) : undefined)}
              disabled={careerItem.isCurrent}
            />
            <input
              type="number"
              placeholder="終了月（1-12）"
              min="1"
              max="12"
              value={careerItem.endMonth || ''}
              onChange={(e) => handleCareerChange('endMonth', e.target.value ? parseInt(e.target.value) : undefined)}
              disabled={careerItem.isCurrent}
            />
            <input
              type="text"
              placeholder="組織名（例：〇〇病院）"
              value={careerItem.organization || ''}
              onChange={(e) => handleCareerChange('organization', e.target.value)}
            />
            <input
              type="text"
              placeholder="部署/部門（例：急性期）"
              value={careerItem.department || ''}
              onChange={(e) => handleCareerChange('department', e.target.value)}
            />
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={careerItem.isCurrent || false}
                onChange={(e) => handleCareerChange('isCurrent', e.target.checked)}
              />
              現在
            </label>
            <button type="button" onClick={addCareerItem} className="add-button">
              追加
            </button>
          </div>
          {formData.careerHistory && formData.careerHistory.length > 0 && (
            <div className="career-list">
              {formData.careerHistory.map((item, index) => (
                <div key={index} className="career-list-item">
                  <span>
                    {item.startYear}年{item.startMonth || 1}月〜{item.isCurrent ? '現在' : `${item.endYear}年${item.endMonth || 1}月`} {item.organization} {item.department}
                  </span>
                  <button type="button" onClick={() => removeCareerItem(index)} className="remove-button">
                    削除
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <button type="submit" className="submit-button">
          シートを生成
        </button>
      </form>
    </div>
  );
};


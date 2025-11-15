import React, { useState, useEffect } from 'react';
import type { CareerItem } from '../../types';
import { TagSelector } from '../../components/TagSelector';
import { getTagName } from '../../utils/tagsService';
import './CareerDetailModal.css';

interface CareerDetailModalProps {
  item: CareerItem;
  index: number;
  isOpen: boolean;
  onClose: () => void;
  onSave: (item: CareerItem) => void;
  onDelete: (index: number) => void;
}

export const CareerDetailModal: React.FC<CareerDetailModalProps> = ({
  item,
  index,
  isOpen,
  onClose,
  onSave,
  onDelete,
}) => {
  const [editedItem, setEditedItem] = useState<CareerItem>(item);
  const [isEditing, setIsEditing] = useState(false);

  const now = new Date();
  const currentYear = now.getFullYear();
  const years = Array.from({ length: 71 }, (_, i) => currentYear - i);
  const months = Array.from({ length: 12 }, (_, i) => i + 1);

  useEffect(() => {
    setEditedItem(item);
    setIsEditing(false);
  }, [item, isOpen]);

  if (!isOpen) return null;

  const getStartMonth = (value: CareerItem) => value.startMonth ?? 1;
  const getEndYear = (value: CareerItem) =>
    value.isCurrent ? currentYear : value.endYear ?? value.startYear;
  const getEndMonth = (value: CareerItem) =>
    value.isCurrent ? now.getMonth() + 1 : value.endMonth ?? 1;

  const handleFieldChange = (
    field: keyof CareerItem,
    value: string | number | boolean | undefined,
  ) => {
    setEditedItem((prev) => {
      const next = { ...prev, [field]: value };
      const startYear = next.startYear ?? item.startYear;
      const startMonth = next.startMonth ?? getStartMonth(item);

      if (field === 'isCurrent' && value === true) {
        next.endYear = undefined;
        next.endMonth = undefined;
      }

      if (field === 'startYear' && typeof value === 'number') {
        if (next.endYear && next.endYear < value) {
          next.endYear = value;
        }
      }

      if (field === 'startMonth' && typeof value === 'number') {
        if (
          next.endYear === startYear &&
          typeof next.endMonth === 'number' &&
          next.endMonth < value
        ) {
          next.endMonth = value;
        }
      }

      if (field === 'endYear' && typeof value === 'number') {
        if (value < startYear) {
          next.endYear = startYear;
        }
      }

      if (
        field === 'endMonth' &&
        typeof value === 'number' &&
        next.endYear === startYear &&
        value < startMonth
      ) {
        next.endMonth = startMonth;
      }

      if (
        typeof next.endYear === 'number' &&
        next.endYear < startYear
      ) {
        next.endYear = startYear;
      }

      if (
        typeof next.endYear === 'number' &&
        next.endYear === startYear &&
        typeof next.endMonth === 'number' &&
        next.endMonth < startMonth
      ) {
        next.endMonth = startMonth;
      }

      return next;
    });
  };

  const formatPeriod = (item: CareerItem) => {
    const startMonth = item.startMonth || 1;
    const endMonth = getEndMonth(item);
    const startStr = `${item.startYear}年${startMonth}月`;
    const endStr = item.isCurrent ? '在籍中' : `${getEndYear(item)}年${endMonth}月`;
    return `${startStr} - ${endStr}`;
  };

  const handleSave = () => {
    if (
      !editedItem.organization ||
      !editedItem.serviceTypeId ||
      !editedItem.startYear ||
      !editedItem.startMonth
    ) {
      alert('必須項目を入力してください');
      return;
    }

    if (
      !editedItem.isCurrent &&
      (!editedItem.endYear || !editedItem.endMonth)
    ) {
      alert('在籍中でない場合は終了年月も選択してください');
      return;
    }

    // IDから名前を生成（後方互換性のため）
    const updatedItem = {
      ...editedItem,
      serviceType: editedItem.serviceTypeId ? getTagName(editedItem.serviceTypeId) : '',
      medicalField: editedItem.medicalFieldId ? getTagName(editedItem.medicalFieldId) : '',
      jobTitle: editedItem.jobTitleId ? getTagName(editedItem.jobTitleId) : '',
    };

    onSave(updatedItem);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedItem(item);
    setIsEditing(false);
  };

  const handleDelete = () => {
    if (window.confirm('この職歴を削除します。よろしいですか？')) {
      onDelete(index);
    }
  };

  return (
    <div className="career-detail-overlay" onClick={onClose}>
      <div className="career-detail-content" onClick={(e) => e.stopPropagation()}>
        <div className="career-detail-header">
          <h2 className="career-detail-title">職歴詳細</h2>
          <button className="career-detail-close" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="career-detail-body">
          {/* ヘッダー情報 */}
          <div className="career-header-info">
            <div className="career-number-circle">{index + 1}</div>
            <div className="career-header-text">
              <div className="career-company-name">{item.organization}</div>
              <div className="career-period-display">
                {formatPeriod(item)}
                <span className="external-link-icon">↗</span>
              </div>
            </div>
          </div>

          {/* 詳細情報 */}
          <div className="career-details">
            <div className="detail-item">
              <div className="detail-label">在籍期間</div>
              {isEditing ? (
                <div className="period-inputs">
                  <div className="period-select">
                    <select
                      value={editedItem.startYear}
                      onChange={(e) =>
                        handleFieldChange('startYear', parseInt(e.target.value))
                      }
                    >
                      {years.map((year) => (
                        <option key={`edit-start-${year}`} value={year}>
                          {year}
                        </option>
                      ))}
                    </select>
                    <span className="period-suffix">年</span>
                    <select
                      value={editedItem.startMonth}
                      onChange={(e) =>
                        handleFieldChange('startMonth', parseInt(e.target.value))
                      }
                    >
                      {months.map((month) => (
                        <option key={`edit-start-month-${month}`} value={month}>
                          {month}
                        </option>
                      ))}
                    </select>
                    <span className="period-suffix">月</span>
                  </div>
                  <span className="period-divider">〜</span>
                  <div className="period-select">
                    <select
                      value={editedItem.endYear ?? ''}
                      onChange={(e) =>
                        handleFieldChange(
                          'endYear',
                          e.target.value ? parseInt(e.target.value) : undefined
                        )
                      }
                      disabled={editedItem.isCurrent}
                    >
                      <option value="">--</option>
                      {years.map((year) => (
                        <option key={`edit-end-${year}`} value={year}>
                          {year}
                        </option>
                      ))}
                    </select>
                    <span className="period-suffix">年</span>
                    <select
                      value={editedItem.endMonth ?? ''}
                      onChange={(e) =>
                        handleFieldChange(
                          'endMonth',
                          e.target.value ? parseInt(e.target.value) : undefined
                        )
                      }
                      disabled={editedItem.isCurrent}
                    >
                      <option value="">--</option>
                      {months.map((month) => (
                        <option key={`edit-end-month-${month}`} value={month}>
                          {month}
                        </option>
                      ))}
                    </select>
                    <span className="period-suffix">月</span>
                  </div>
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={editedItem.isCurrent || false}
                      onChange={(e) =>
                        handleFieldChange('isCurrent', e.target.checked)
                      }
                    />
                    <span className="checkbox-text">在籍中</span>
                  </label>
                </div>
              ) : (
                <div className="detail-value">{formatPeriod(editedItem)}</div>
              )}
            </div>

            <div className="detail-item">
              <div className="detail-label">勤務先</div>
              {isEditing ? (
                <input
                  type="text"
                  className="detail-input"
                  value={editedItem.organization || ''}
                  onChange={(e) =>
                    setEditedItem({ ...editedItem, organization: e.target.value })
                  }
                  placeholder="勤務先を入力"
                />
              ) : (
                <div className="detail-value">
                  {editedItem.organization || '未入力'}
                </div>
              )}
            </div>

            <div className="detail-item">
              <div className="detail-label">サービス形態</div>
              {isEditing ? (
                <TagSelector
                  category="サービス形態"
                  value={editedItem.serviceTypeId || 0}
                  onChange={(value) =>
                    setEditedItem({ ...editedItem, serviceTypeId: value as number })
                  }
                  multiple={false}
                  placeholder="分類を選択"
                  inlineLayout
                  labelWeight="normal"
                  labelOverrides={{ first: '　分類', second: '形態' }}
                  indentFirstStep
                />
              ) : (
                <div className="detail-value">
                  {editedItem.serviceTypeId ? getTagName(editedItem.serviceTypeId) : editedItem.serviceType || '未入力'}
                </div>
              )}
            </div>

            <div className="detail-item">
              <div className="detail-label">診療科／分野</div>
              {isEditing ? (
                <TagSelector
                  category="診療科・分野"
                  value={editedItem.medicalFieldId || 0}
                  onChange={(value) =>
                    setEditedItem({ ...editedItem, medicalFieldId: value as number })
                  }
                  multiple={false}
                  placeholder="大分類を選択"
                  inlineLayout
                  labelWeight="normal"
                  labelOverrides={{ first: '　大分類', second: '詳細' }}
                  indentFirstStep
                />
              ) : (
                <div className="detail-value">
                  {editedItem.medicalFieldId ? getTagName(editedItem.medicalFieldId) : editedItem.medicalField || '未入力'}
                </div>
              )}
            </div>

            <div className="detail-item">
              <div className="detail-label">勤務形態</div>
              {isEditing ? (
                <select
                  className="detail-input"
                  value={editedItem.workType || ''}
                  onChange={(e) =>
                    setEditedItem({ ...editedItem, workType: e.target.value })
                  }
                >
                  <option value="">選択してください</option>
                  <option value="正社員">正社員</option>
                  <option value="時短正社員">時短正社員</option>
                  <option value="パート">パート</option>
                  <option value="業務委託">業務委託</option>
                  <option value="その他">その他</option>
                </select>
              ) : (
                <div className="detail-value">
                  {editedItem.workType || '未入力'}
                </div>
              )}
            </div>

            <div className="detail-item">
              <div className="detail-label">経験詳細</div>
              {isEditing ? (
                <textarea
                  className="detail-textarea"
                  value={editedItem.experienceDetail || ''}
                  onChange={(e) =>
                    setEditedItem({ ...editedItem, experienceDetail: e.target.value })
                  }
                  placeholder="経験詳細を入力"
                  rows={6}
                  style={{ resize: 'vertical', minHeight: '120px' }}
                />
              ) : (
                <div className="detail-value">
                  {editedItem.experienceDetail || '未入力'}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="career-detail-footer">
          {isEditing ? (
            <div className="career-detail-footer-actions">
              <button className="btn-cancel" onClick={handleCancel}>
                キャンセル
              </button>
              <button className="btn-save" onClick={handleSave}>
                保存
              </button>
            </div>
          ) : (
            <div className="career-detail-footer-actions">
              <button className="btn-delete" onClick={handleDelete}>
                削除
              </button>
              <button className="btn-edit" onClick={() => setIsEditing(true)}>
                編集
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

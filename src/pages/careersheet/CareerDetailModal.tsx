import React, { useState, useEffect } from 'react';
import type { CareerItem } from '../../types';
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
      !editedItem.department ||
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

    onSave(editedItem);
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
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">職歴詳細</h2>
          <button className="modal-close" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="modal-body">
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
              <div className="detail-label">職種</div>
              {isEditing ? (
                <input
                  type="text"
                  className="detail-input"
                  value={editedItem.jobTitle || ''}
                  onChange={(e) =>
                    setEditedItem({ ...editedItem, jobTitle: e.target.value })
                  }
                  placeholder="職種を入力"
                />
              ) : (
                <div className="detail-value">
                  {editedItem.jobTitle || '未入力'}
                </div>
              )}
            </div>

            <div className="detail-item">
              <div className="detail-label">やったこと</div>
              {isEditing ? (
                <textarea
                  className="detail-textarea"
                  value={editedItem.whatDid || ''}
                  onChange={(e) =>
                    setEditedItem({ ...editedItem, whatDid: e.target.value })
                  }
                  placeholder="やったことを入力"
                  rows={4}
                />
              ) : (
                <div className="detail-value">
                  {editedItem.whatDid || '未入力'}
                </div>
              )}
            </div>

            <div className="detail-item">
              <div className="detail-label">学んだこと</div>
              {isEditing ? (
                <textarea
                  className="detail-textarea"
                  value={editedItem.whatLearned || ''}
                  onChange={(e) =>
                    setEditedItem({
                      ...editedItem,
                      whatLearned: e.target.value,
                    })
                  }
                  placeholder="学んだことを入力"
                  rows={4}
                />
              ) : (
                <div className="detail-value">
                  {editedItem.whatLearned || '未入力'}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="modal-footer">
          {isEditing ? (
            <div className="modal-footer-actions">
              <button className="btn-cancel" onClick={handleCancel}>
                キャンセル
              </button>
              <button className="btn-save" onClick={handleSave}>
                保存
              </button>
            </div>
          ) : (
            <div className="modal-footer-actions">
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

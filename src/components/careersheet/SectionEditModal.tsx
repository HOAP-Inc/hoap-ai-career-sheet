'use client'

import React, { useState, useEffect } from 'react';
import './SectionEditModal.css';

interface SectionEditModalProps {
  isOpen: boolean;
  title: string;
  subtitle?: string;
  value: string;
  onClose: () => void;
  onSave: (value: string) => void;
}

export const SectionEditModal: React.FC<SectionEditModalProps> = ({
  isOpen,
  title,
  subtitle,
  value,
  onClose,
  onSave,
}) => {
  const [editedValue, setEditedValue] = useState(value);

  useEffect(() => {
    setEditedValue(value);
  }, [value, isOpen]);

  if (!isOpen) {
    return null;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(editedValue);
    onClose();
  };

  return (
    <div className="section-edit-overlay" onClick={onClose}>
      <div className="section-edit-content" onClick={(e) => e.stopPropagation()}>
        <div className="section-edit-header">
          <div>
            <h2 className="section-edit-title">{title}</h2>
            {subtitle && <p className="section-edit-subtitle">{subtitle}</p>}
          </div>
          <button className="section-edit-close" onClick={onClose}>
            ×
          </button>
        </div>
        <form className="section-edit-body" onSubmit={handleSubmit}>
          <div className="section-edit-group">
            <textarea
              value={editedValue}
              onChange={(e) => setEditedValue(e.target.value)}
              placeholder={`${title}を入力してください`}
              rows={8}
              className="section-edit-textarea"
            />
          </div>
          <div className="section-edit-footer">
            <button type="button" className="btn-cancel" onClick={onClose}>
              キャンセル
            </button>
            <button type="submit" className="btn-save">
              保存
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};



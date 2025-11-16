import React, { useState, useEffect } from 'react';
import type { Tag } from '../types';
import {
  getSubcategories,
  getTagsByCategoryAndSubcategory,
  getTagById,
} from '../utils/tagsService';
import './TagSelector.css';

interface TagSelectorProps {
  category: string;
  value?: number | number[]; // 単一選択 or 複数選択
  onChange: (value: number | number[]) => void;
  multiple?: boolean;
  placeholder?: string;
  secondPlaceholder?: string;
  disabled?: boolean;
  inlineLayout?: boolean;
  labelWeight?: 'bold' | 'normal';
  labelOverrides?: {
    first?: string;
    second?: string;
  };
  indentFirstStep?: boolean;
}

export const TagSelector: React.FC<TagSelectorProps> = ({
  category,
  value,
  onChange,
  multiple = false,
  placeholder = '選択してください',
  secondPlaceholder,
  disabled = false,
  inlineLayout = false,
  labelWeight = 'bold',
  labelOverrides,
  indentFirstStep = false,
}) => {
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>('');
  const [subcategories, setSubcategories] = useState<string[]>([]);
  const [availableTags, setAvailableTags] = useState<Tag[]>([]);
  const [selectedTags, setSelectedTags] = useState<number[]>([]);

  useEffect(() => {
    const subs = getSubcategories(category);
    setSubcategories(subs);

    if (value) {
      const ids = Array.isArray(value) ? value : [value];
      if (ids.length > 0) {
        const tag = getTagById(ids[0]);
        if (tag) {
          setSelectedSubcategory(tag.subcategory);
        }
      }
      setSelectedTags(ids);
    }
  }, [category, value]);

  useEffect(() => {
    if (selectedSubcategory) {
      const tags = getTagsByCategoryAndSubcategory(category, selectedSubcategory);
      setAvailableTags(tags);
    } else {
      setAvailableTags([]);
    }
  }, [category, selectedSubcategory]);

  const handleSubcategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const sub = e.target.value;
    setSelectedSubcategory(sub);
    setSelectedTags([]);
    if (multiple) {
      onChange([]);
    } else {
      onChange(0);
    }
  };

  const handleTagChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const id = parseInt(e.target.value);
    if (!id) return;

    if (multiple) {
      const newSelected = selectedTags.includes(id)
        ? selectedTags.filter((t) => t !== id)
        : [...selectedTags, id];
      setSelectedTags(newSelected);
      onChange(newSelected);
    } else {
      setSelectedTags([id]);
      onChange(id);
    }
  };

  const handleTagRemove = (id: number) => {
    const newSelected = selectedTags.filter((t) => t !== id);
    setSelectedTags(newSelected);
    onChange(newSelected);
  };

  const firstLabelDefault =
    category === 'サービス形態'
      ? 'サービス分類'
      : category === '診療科・分野'
        ? '分野'
        : category === '専門資格'
          ? '資格分類'
          : 'カテゴリー';

  const secondLabelDefault =
    category === 'サービス形態'
      ? 'サービス形態'
      : category === '診療科・分野'
        ? '診療科・分野'
        : category === '専門資格'
          ? '資格名'
          : '項目';

  const firstLabel = labelOverrides?.first ?? firstLabelDefault;
  const secondLabel = labelOverrides?.second ?? secondLabelDefault;

  const labelClassName = `tag-selector-label${labelWeight === 'normal' ? ' tag-selector-label-normal' : ''}`;

  const firstStepClasses = [
    'tag-selector-step',
    (category === '専門資格' || indentFirstStep) ? 'indented' : '',
    inlineLayout ? 'inline-start' : '',
  ]
    .filter(Boolean)
    .join(' ');

  const secondStepClasses = [
    'tag-selector-step',
    inlineLayout ? 'inline-end' : '',
    (category === '専門資格' || indentFirstStep) ? 'indented' : '',
  ]
    .filter(Boolean)
    .join(' ');

  const isSecondStepDisabled = disabled || !selectedSubcategory;
  const secondPlaceholderText = secondPlaceholder || placeholder;

  const secondStepContent = (
    <div className={secondStepClasses}>
      <label className={labelClassName}>{secondLabel}</label>
      {multiple ? (
        <select
          className="tag-selector-select"
          onChange={handleTagChange}
          disabled={isSecondStepDisabled}
        >
          <option value="">{secondPlaceholderText}</option>
          {availableTags.map((tag) => (
            <option key={tag.id} value={tag.id} disabled={selectedTags.includes(tag.id)}>
              {tag.name}
            </option>
          ))}
        </select>
      ) : (
        <select
          className="tag-selector-select"
          value={selectedSubcategory ? selectedTags[0] || '' : ''}
          onChange={handleTagChange}
          disabled={isSecondStepDisabled}
        >
          <option value="">{secondPlaceholderText}</option>
          {availableTags.map((tag) => (
            <option key={tag.id} value={tag.id}>
              {tag.name}
            </option>
          ))}
        </select>
      )}
    </div>
  );

  const steps = inlineLayout ? (
    <div className="tag-selector-inline">
      <div className={firstStepClasses}>
        <label className={labelClassName}>{firstLabel}</label>
        <select
          className="tag-selector-select"
          value={selectedSubcategory}
          onChange={handleSubcategoryChange}
          disabled={disabled}
        >
          <option value="">{placeholder}</option>
          {subcategories.map((sub) => (
            <option key={sub} value={sub}>
              {sub}
            </option>
          ))}
        </select>
      </div>
      {secondStepContent}
    </div>
  ) : (
    <>
      <div className={firstStepClasses}>
        <label className={labelClassName}>{firstLabel}</label>
        <select
          className="tag-selector-select"
          value={selectedSubcategory}
          onChange={handleSubcategoryChange}
          disabled={disabled}
        >
          <option value="">{placeholder}</option>
          {subcategories.map((sub) => (
            <option key={sub} value={sub}>
              {sub}
            </option>
          ))}
        </select>
      </div>
      {selectedSubcategory && secondStepContent}
    </>
  );

  return (
    <div className="tag-selector">
      {steps}

      {multiple && selectedTags.length > 0 && (
        <div className={`tag-selector-selected ${category === '専門資格' ? 'indented' : ''}`}>
          {selectedTags.map((id) => {
            const tag = getTagById(id);
            return tag ? (
              <span key={id} className="tag-selector-badge">
                {tag.name}
                <button
                  type="button"
                  className="tag-selector-remove"
                  onClick={() => handleTagRemove(id)}
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

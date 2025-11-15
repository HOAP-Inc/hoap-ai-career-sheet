import React, { useState, useEffect } from 'react';
import type { Tag } from '../types';
import {
  getTagsByCategory,
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
  disabled?: boolean;
}

export const TagSelector: React.FC<TagSelectorProps> = ({
  category,
  value,
  onChange,
  multiple = false,
  placeholder = '選択してください',
  disabled = false,
}) => {
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>('');
  const [subcategories, setSubcategories] = useState<string[]>([]);
  const [availableTags, setAvailableTags] = useState<Tag[]>([]);
  const [selectedTags, setSelectedTags] = useState<number[]>([]);

  // 初期化：既存の値からサブカテゴリーを設定
  useEffect(() => {
    const subs = getSubcategories(category);
    setSubcategories(subs);

    // 既存の値がある場合、サブカテゴリーを自動選択
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

  // サブカテゴリーが選ばれたらタグ一覧を更新
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
    // サブカテゴリー変更時は選択をクリア
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
      // 複数選択の場合
      const newSelected = selectedTags.includes(id)
        ? selectedTags.filter((t) => t !== id)
        : [...selectedTags, id];
      setSelectedTags(newSelected);
      onChange(newSelected);
    } else {
      // 単一選択の場合
      setSelectedTags([id]);
      onChange(id);
    }
  };

  const handleTagRemove = (id: number) => {
    const newSelected = selectedTags.filter((t) => t !== id);
    setSelectedTags(newSelected);
    onChange(newSelected);
  };

  return (
    <div className="tag-selector">
      {/* ステップ1: サブカテゴリー選択 */}
      <div className="tag-selector-step">
        <label className="tag-selector-label">
          {category === 'サービス形態'
            ? 'サービス分類'
            : category === '診療科・分野'
              ? '分野'
              : category === '専門資格'
                ? '資格分類'
                : 'カテゴリー'}
        </label>
        <select
          className="tag-selector-select"
          value={selectedSubcategory}
          onChange={handleSubcategoryChange}
          disabled={disabled}
        >
          <option value="">選択してください</option>
          {subcategories.map((sub) => (
            <option key={sub} value={sub}>
              {sub}
            </option>
          ))}
        </select>
      </div>

      {/* ステップ2: タグ選択 */}
      {selectedSubcategory && (
        <div className="tag-selector-step">
          <label className="tag-selector-label">
            {category === 'サービス形態'
              ? 'サービス形態'
              : category === '診療科・分野'
                ? '診療科・分野'
                : category === '専門資格'
                  ? '資格名'
                  : '項目'}
          </label>
          {multiple ? (
            <select
              className="tag-selector-select"
              onChange={handleTagChange}
              disabled={disabled}
            >
              <option value="">選択してください</option>
              {availableTags.map((tag) => (
                <option key={tag.id} value={tag.id} disabled={selectedTags.includes(tag.id)}>
                  {tag.name}
                </option>
              ))}
            </select>
          ) : (
            <select
              className="tag-selector-select"
              value={selectedTags[0] || ''}
              onChange={handleTagChange}
              disabled={disabled}
            >
              <option value="">{placeholder}</option>
              {availableTags.map((tag) => (
                <option key={tag.id} value={tag.id}>
                  {tag.name}
                </option>
              ))}
            </select>
          )}
        </div>
      )}

      {/* 複数選択の場合、選択済みタグを表示 */}
      {multiple && selectedTags.length > 0 && (
        <div className="tag-selector-selected">
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


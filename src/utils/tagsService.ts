import type { Tag } from '../types';
import tagsData from '../data/tags.json';

interface TagsData {
  meta: {
    version: string;
    total_tags: number;
  };
  tags: Tag[];
}

const data = tagsData as TagsData;

/**
 * タグデータを取得（将来的にはAPIから取得）
 */
export function getAllTags(): Tag[] {
  return data.tags;
}

/**
 * カテゴリーでフィルタリング
 */
export function getTagsByCategory(category: string): Tag[] {
  return data.tags.filter((tag) => tag.category === category);
}

/**
 * カテゴリーとサブカテゴリーでフィルタリング
 */
export function getTagsByCategoryAndSubcategory(
  category: string,
  subcategory: string,
): Tag[] {
  return data.tags.filter(
    (tag) => tag.category === category && tag.subcategory === subcategory,
  );
}

/**
 * IDからタグを取得
 */
export function getTagById(id: number): Tag | undefined {
  return data.tags.find((tag) => tag.id === id);
}

/**
 * IDから名前を取得
 */
export function getTagName(id: number): string {
  const tag = getTagById(id);
  return tag ? tag.name : '';
}

/**
 * カテゴリー内のサブカテゴリー一覧を取得
 */
export function getSubcategories(category: string): string[] {
  const tags = getTagsByCategory(category);
  const subcategories = new Set(tags.map((tag) => tag.subcategory));
  return Array.from(subcategories);
}

/**
 * 複数IDから名前の配列を取得
 */
export function getTagNames(ids: number[]): string[] {
  return ids.map((id) => getTagName(id)).filter(Boolean);
}


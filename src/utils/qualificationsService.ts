import type { Qualification } from '../types';
import qualificationsData from '../data/qualifications.json';

interface QualificationsData {
  meta: {
    version: string;
    total_qualifications: number;
  };
  qualifications: Qualification[];
}

const data = qualificationsData as QualificationsData;

/**
 * 資格データを取得
 */
export function getAllQualifications(): Qualification[] {
  return data.qualifications;
}

/**
 * カテゴリーでフィルタリング
 */
export function getQualificationsByCategory(category: string): Qualification[] {
  return data.qualifications.filter((qual) => qual.category === category);
}

/**
 * IDから資格を取得
 */
export function getQualificationById(id: number): Qualification | undefined {
  return data.qualifications.find((qual) => qual.id === id);
}

/**
 * IDから名前を取得
 */
export function getQualificationName(id: number): string {
  const qual = getQualificationById(id);
  return qual ? qual.name : '';
}

/**
 * 複数IDから名前の配列を取得
 */
export function getQualificationNames(ids: number[]): string[] {
  return ids.map((id) => getQualificationName(id)).filter(Boolean);
}

/**
 * カテゴリー一覧を取得
 */
export function getQualificationCategories(): string[] {
  const categories = new Set(data.qualifications.map((qual) => qual.category));
  return Array.from(categories);
}


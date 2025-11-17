export interface Tag {
  id: number;
  category: string;
  subcategory: string;
  name: string;
}

export interface Qualification {
  id: number;
  category: string;
  name: string;
}

export interface ProfileData {
  name: string;
  photo?: string;
  location?: string;
  postalCode?: string;
  addressDetail?: string;
  email?: string;
  phone?: string;
  age?: number;
  birthYear?: number;
  birthMonth?: number;
  birthDay?: number;
  gender?: string;
  jobTitle?: string;
  can: string;
  will: string;
  must: string;
  personalWords: string;
  doing: string;
  being: string;
  careerHistory: CareerItem[];
  qualifications?: string[]; // 後方互換性のため残す
  qualificationIds?: number[]; // 所有資格ID配列（qualifications.json）
  specializedSkills?: string[]; // 後方互換性のため残す
  specializedSkillIds?: number[]; // 専門資格ID配列（tags.json）
  memberId?: string;
}

export interface CareerItem {
  startYear: number;
  startMonth?: number; // 1-12
  endYear?: number;
  endMonth?: number; // 1-12
  organization: string; // 勤務先
  serviceType?: string; // サービス形態（後方互換性のため残す）
  serviceTypeId?: number; // サービス形態ID（新規）
  medicalField?: string; // 診療科／分野（後方互換性のため残す）
  medicalFieldId?: number; // 診療科・分野ID（新規）
  department?: string; // 部署／診療科（後方互換性のため残す）
  isCurrent: boolean;
  jobTitle?: string; // 職種（後方互換性のため残す）
  jobTitleId?: number; // 職種ID（新規）
  workType?: string; // 勤務形態
  experienceDetail?: string; // 経験詳細
  whatDid?: string; // やったこと（後方互換性のため残す）
  whatLearned?: string; // 学んだこと（後方互換性のため残す）
}

// ===== メッセージ機能の型定義 =====

export interface MessageThread {
  id: string;
  partnerId: string;
  partnerName: string;
  partnerCompanyName: string;
  partnerIconUrl?: string;
  latestMessageContent: string;
  latestMessageTimestamp: Date;
  unreadCount: number;
  updatedAt: Date;
}

export interface Message {
  id: string;
  threadId: string;
  senderId: string;
  content: string;
  sentAt: Date;
  readAt: Date | null;
}

export interface SendMessageRequest {
  threadId: string;
  content: string;
}


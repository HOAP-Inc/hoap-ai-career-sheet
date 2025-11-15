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
  qualifications?: string[];
  memberId?: string;
}

export interface CareerItem {
  startYear: number;
  startMonth?: number; // 1-12
  endYear?: number;
  endMonth?: number; // 1-12
  organization: string; // 勤務先
  serviceType?: string; // サービス形態（新規）
  medicalField?: string; // 診療科／分野
  department?: string; // 部署／診療科（後方互換性のため残す）
  isCurrent: boolean;
  jobTitle?: string; // 職種
  workType?: string; // 勤務形態
  experienceDetail?: string; // 経験詳細
  whatDid?: string; // やったこと（後方互換性のため残す）
  whatLearned?: string; // 学んだこと（後方互換性のため残す）
}


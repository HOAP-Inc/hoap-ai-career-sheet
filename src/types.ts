export interface ProfileData {
  name: string;
  photo?: string;
  location?: string;
  postalCode?: string;
  addressDetail?: string;
  email?: string;
  phone?: string;
  age?: number;
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
}

export interface CareerItem {
  startYear: number;
  startMonth?: number; // 1-12
  endYear?: number;
  endMonth?: number; // 1-12
  organization: string;
  department: string;
  isCurrent: boolean;
  jobTitle?: string; // 職種
  whatDid?: string; // やったこと
  whatLearned?: string; // 学んだこと
}


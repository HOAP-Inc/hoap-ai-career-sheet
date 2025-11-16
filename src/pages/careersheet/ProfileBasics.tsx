import React from 'react';
import { Card } from '../../components/Card';
import { getTagNames } from '../../utils/tagsService';
import { getQualificationNames } from '../../utils/qualificationsService';
import './ProfileBasics.css';

interface ProfileBasicsProps {
  age?: number;
  birthYear?: number;
  birthMonth?: number;
  birthDay?: number;
  gender?: string;
  postalCode?: string;
  location?: string;
  addressDetail?: string;
  email?: string;
  phone?: string;
  qualifications?: string[];
  qualificationIds?: number[];
  specializedSkills?: string[];
  specializedSkillIds?: number[];
  onEdit?: () => void;
}

export const ProfileBasics: React.FC<ProfileBasicsProps> = ({
  age,
  birthYear,
  birthMonth,
  birthDay,
  gender,
  postalCode,
  location,
  addressDetail,
  email,
  phone,
  qualifications,
  qualificationIds,
  specializedSkills,
  specializedSkillIds,
  onEdit,
}) => {
  const formatLocation = (value?: string) => {
    if (!value) return '';
    return value.trim();
  };

  const displayLocation = formatLocation(location);

  const formatBirthDate = () => {
    if (birthYear && birthMonth && birthDay) {
      const ageText = age !== undefined ? `（${age}歳）` : '';
      return `${birthYear}年${birthMonth}月${birthDay}日${ageText}`;
    }
    if (age !== undefined) {
      return `${age}歳`;
    }
    return '';
  };

  return (
    <Card title="基本プロフィール" className="section-card" onEdit={onEdit}>
      <div className="profile-basics-content">
        <div className="profile-basics-row">
          <ProfileRow label="生年月日" value={formatBirthDate()} />
          <ProfileRow label="性別" value={gender || ''} />
        </div>
        <div className="profile-basics-row profile-basics-row-single">
          <ProfileRow
            label="住所"
            value={[displayLocation, addressDetail].filter(Boolean).join(' ')}
          />
        </div>
        <div className="profile-basics-row">
          <ProfileRow label="メールアドレス" value={email || ''} />
          <ProfileRow label="電話番号" value={phone || '(非公開)'} />
        </div>
        <div className="profile-basics-row">
          <div className="profile-row profile-row-qualifications">
            <span className="profile-row-label">所有資格</span>
            <div className="profile-row-value profile-qualifications-value">
              {(() => {
                // qualificationIdsがあればそれを使用、なければqualificationsを使用
                const qualNames = qualificationIds && qualificationIds.length > 0
                  ? getQualificationNames(qualificationIds)
                  : qualifications || [];
                
                return qualNames.length > 0 ? (
                  <div className="qualification-badges">
                    {qualNames.map((qual, index) => (
                      <span key={index} className="qualification-badge">
                        {qual}
                      </span>
                    ))}
                  </div>
                ) : (
                  <span className="empty">未入力</span>
                );
              })()}
            </div>
          </div>
          <div className="profile-row profile-row-qualifications">
            <span className="profile-row-label">専門資格</span>
            <div className="profile-row-value profile-qualifications-value">
              {(() => {
                // specializedSkillIdsがあればそれを使用、なければspecializedSkillsを使用
                const skillNames = specializedSkillIds && specializedSkillIds.length > 0
                  ? getTagNames(specializedSkillIds)
                  : specializedSkills || [];
                
                return skillNames.length > 0 ? (
                  <div className="qualification-badges">
                    {skillNames.map((skill, index) => (
                      <span key={index} className="qualification-badge">
                        {skill}
                      </span>
                    ))}
                  </div>
                ) : (
                  <span className="empty">未入力</span>
                );
              })()}
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

const ProfileRow: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div className="profile-row">
    <span className="profile-row-label">{label}</span>
    <span className={`profile-row-value ${value ? '' : 'empty'}`}>{value || '未入力'}</span>
  </div>
);


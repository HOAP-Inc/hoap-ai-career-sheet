import React from 'react';
import { Card } from '../../components/Card';
import './ProfileBasics.css';

interface ProfileBasicsProps {
  age?: number;
  gender?: string;
  postalCode?: string;
  location?: string;
  addressDetail?: string;
  email?: string;
  phone?: string;
  qualifications?: string[];
}

export const ProfileBasics: React.FC<ProfileBasicsProps> = ({
  age,
  gender,
  postalCode,
  location,
  addressDetail,
  email,
  phone,
  qualifications,
}) => {
  const formatLocation = (value?: string) => {
    if (!value) return '';
    return value.trim();
  };

  const displayLocation = formatLocation(location);

  return (
    <Card title="基本プロフィール" className="section-card">
      <div className="profile-basics-content">
        <div className="profile-basics-row">
          <ProfileRow label="年齢" value={age !== undefined ? `${age}歳` : ''} />
          <ProfileRow label="性別" value={gender || ''} />
        </div>
        <div className="profile-basics-row profile-basics-row-single">
          <ProfileRow
            label="住所"
            value={[postalCode ? `〒${postalCode}` : null, displayLocation, addressDetail].filter(Boolean).join(' ')}
          />
        </div>
        <div className="profile-basics-row">
          <ProfileRow label="メールアドレス" value={email || ''} />
          <ProfileRow label="電話番号" value={phone || '(非公開)'} />
        </div>
        <div className="profile-basics-row profile-basics-row-single">
          <ProfileRow
            label="所有資格"
            value={qualifications && qualifications.length > 0 ? qualifications.join(' / ') : ''}
          />
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


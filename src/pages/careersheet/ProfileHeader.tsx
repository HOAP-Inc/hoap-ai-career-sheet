import React, { useRef } from 'react';
import './ProfileHeader.css';

interface ProfileHeaderProps {
  name: string
  photo?: string
  location?: string
  postalCode?: string
  addressDetail?: string
  age?: number
  gender?: string
  jobTitle?: string
  email?: string
  phone?: string
  personalWords?: string
  qualifications?: string[]
  memberId?: string
  onPhotoChange?: (file: File) => void
  onEdit?: () => void
}

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  name,
  photo,
  location,
  postalCode,
  addressDetail,
  age,
  gender,
  jobTitle,
  email,
  phone,
  personalWords,
  qualifications,
  memberId,
  onPhotoChange,
  onEdit,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handlePhotoClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file && onPhotoChange) {
      onPhotoChange(file)
    }
  }

  const formatLocation = (value?: string) => {
    if (!value) return ''
    return value.trim()
  }

  const displayLocation = formatLocation(location)

  return (
    <div className="profile-header">
      {onEdit && (
        <button className="profile-edit-button" onClick={onEdit}>
          編集
        </button>
      )}
      <div className="profile-main-content">
        <div className="profile-summary-column">
          <div className="profile-photo-wrapper" onClick={handlePhotoClick}>
            <div className="profile-photo-ring">
              {photo ? (
                <img src={photo} alt={name} className="profile-photo-round" />
              ) : (
                <div className="profile-photo-placeholder-round">
                  <svg
                    className="photo-icon-large"
                    width="64"
                    height="64"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <circle
                      cx="12"
                      cy="7"
                      r="4"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              )}
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              style={{ display: 'none' }}
            />
          </div>

          <div className="profile-summary-text">
            <h1 className="profile-name">{name}</h1>
            <p className="profile-id">ID：{memberId || '123456789'}</p>
          </div>
        </div>

        <div className="profile-personal-panel">
          <h3 className="profile-personal-title">私はこんな人</h3>
          <div className={`profile-personal-body ${personalWords ? '' : 'empty'}`}>
            {personalWords || '未入力です'}
          </div>
        </div>
      </div>

      <div className="profile-basics-section">
        <h4 className="profile-basics-heading">基本プロフィール</h4>
        <div className="profile-basics-grid">
          <ProfileRow label="年齢" value={age !== undefined ? `${age}歳` : ''} />
          <ProfileRow label="性別" value={gender || ''} />
          <ProfileRow
            label="住所"
            value={[displayLocation, addressDetail].filter(Boolean).join(' ')}
          />
          <ProfileRow label="電話番号" value={phone || '(非公開)'} />
          <ProfileRow label="メールアドレス" value={email || ''} />
          <ProfileRow label="現在の状況" value={jobTitle || ''} />
          <ProfileRow
            label="保有資格"
            value={qualifications && qualifications.length > 0 ? qualifications.join(' / ') : ''}
          />
        </div>
      </div>
    </div>
  )
}

const ProfileRow: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div className="profile-row">
    <span className="profile-row-label">{label}</span>
    <span className={`profile-row-value ${value ? '' : 'empty'}`}>{value || '未入力'}</span>
  </div>
)

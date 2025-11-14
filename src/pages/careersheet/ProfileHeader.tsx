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

  const detailItems: Array<{ label: string; value: string }> = []

  const ageGender: string[] = []
  if (age !== undefined) {
    ageGender.push(`${age}歳`)
  }
  if (gender) {
    ageGender.push(gender)
  }
  if (ageGender.length > 0) {
    detailItems.push({
      label: '年齢 / 性別',
      value: ageGender.join('・'),
    })
  }

  const locationParts = [
    postalCode ? `〒${postalCode}` : null,
    displayLocation || null,
    addressDetail || null,
  ].filter(Boolean)
  if (locationParts.length > 0) {
    detailItems.push({
      label: '所在地',
      value: locationParts.join('　'),
    })
  }

  const contactParts = [
    email ? `Mail: ${email}` : null,
    phone ? `Tel: ${phone}` : null,
  ].filter(Boolean)
  if (contactParts.length > 0) {
    detailItems.push({
      label: '連絡先',
      value: contactParts.join('　'),
    })
  }

  if (jobTitle) {
    detailItems.push({
      label: '職種',
      value: jobTitle,
    })
  }

  if (qualifications && qualifications.length > 0) {
    detailItems.push({
      label: '保有資格',
      value: qualifications.join(' / '),
    })
  }

  return (
    <div className="profile-header">
      {onEdit && (
        <button className="profile-edit-button" onClick={onEdit}>
          編集
        </button>
      )}
      <div className="profile-main-content">
      <div className="profile-photo-container" onClick={handlePhotoClick}>
        {photo ? (
          <img src={photo} alt={name} className="profile-photo" />
        ) : (
          <div className="profile-photo-placeholder">
            <svg
              className="photo-icon"
              width="48"
              height="48"
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
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          style={{ display: 'none' }}
        />
      </div>
      <div className="profile-info">
        <div className="profile-info-header">
          <h1 className="profile-name">{name}</h1>
          <div className="profile-personal-inline">
            <h3 className="profile-personal-inline-title">私はこんな人（自己分析）</h3>
            <div
              className={`profile-personal-inline-text ${
                personalWords ? '' : 'empty'
              }`}
            >
              {personalWords || '未入力です'}
            </div>
          </div>
        </div>
        </div>
      </div>
        {detailItems.length > 0 && (
          <div className="profile-details-grid">
            {detailItems.map((item) => (
              <div className="profile-detail-card" key={item.label}>
                <span className="profile-detail-label">{item.label}</span>
                <span className="profile-detail-value">{item.value}</span>
              </div>
            ))}
          </div>
        )}
    </div>
  )
}

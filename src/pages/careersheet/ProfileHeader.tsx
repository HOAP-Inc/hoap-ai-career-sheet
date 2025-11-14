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
    const match = value.match(/^(.*?[都道府県])\s*(.*?市|.*?区|.*?町|.*?村)/)
    if (match) {
      return `${match[1]} ${match[2]}`
    }
    const parts = value.split(/\s+/)
    return parts.slice(0, 2).join(' ') || value
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
        </div>
        {(age || gender) && (
          <div className="profile-meta-row">
            {age !== undefined && <span>年齢: {age}</span>}
            {gender && <span>性別: {gender}</span>}
          </div>
        )}
        {postalCode && (
          <div className="profile-postal">〒{postalCode}</div>
        )}
        {(displayLocation || addressDetail) && (
          <div className="profile-location-row">
            {displayLocation && (
              <div className="profile-location">{displayLocation}</div>
            )}
            {addressDetail && (
              <div className="profile-address-detail">{addressDetail}</div>
            )}
          </div>
        )}
        {(email || phone) && (
          <div className="profile-contact">
            {email && <span className="profile-contact-item">Mail: {email}</span>}
            {phone && <span className="profile-contact-item">Tel: {phone}</span>}
          </div>
        )}
        {jobTitle && (
          <div className="profile-job-title-box">
            <div className="profile-job-title-content">
              <span className="profile-job-title-text">{jobTitle}</span>
            </div>
          </div>
        )}
        {qualifications && qualifications.length > 0 && (
          <div className="profile-qualifications-section">
            <div className="profile-qualifications-list">
              {qualifications.map((qualification, index) => (
                <div key={index} className="profile-qualification-badge">
                  <span className="profile-qualification-text">{qualification}</span>
                </div>
              ))}
            </div>
          </div>
        )}
        </div>
      </div>
        {personalWords && (
          <div className="profile-personal-words-section">
            <div className="profile-personal-words-box">
              <div className="profile-personal-words-content">
                <h3 className="profile-personal-words-title">私はこんな人</h3>
                <div className="profile-personal-words-text">{personalWords}</div>
              </div>
            </div>
          </div>
        )}
    </div>
  )
}

import React, { useRef } from 'react';
import './ProfileHeader.css';

interface ProfileHeaderProps {
  name: string
  photo?: string
  personalWords?: string
  memberId?: string
  onPhotoChange?: (file: File) => void
  onEditPersonalWords?: () => void
}

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  name,
  photo,
  personalWords,
  memberId,
  onPhotoChange,
  onEditPersonalWords,
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

  return (
    <div className="profile-header-no-frame">
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
          <div className="profile-personal-header">
            <h3 className="profile-personal-title">私はこんな人（自己分析）</h3>
            {onEditPersonalWords && (
              <button className="card-edit-button" onClick={onEditPersonalWords}>
                編集
              </button>
            )}
          </div>
          <div className={`profile-personal-body ${personalWords ? '' : 'empty'}`}>
            {personalWords || '未入力です'}
          </div>
        </div>
      </div>
    </div>
  )
}

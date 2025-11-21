import React, { useState, useEffect, useRef } from 'react'
import type { ProfileData } from '../../types'
import './ProfileEditModal.css'

interface ProfileEditModalProps {
  data: ProfileData
  isOpen: boolean
  onClose: () => void
  onSave: (data: ProfileData) => void
}

const jobOptions = ['正看護師', '准看護師', '訪問看護師', 'ケアマネ', 'その他']
const genderOptions = ['男性', '女性', 'その他']
const ages = Array.from({ length: 71 }, (_, i) => i + 15)

export const ProfileEditModal: React.FC<ProfileEditModalProps> = ({
  data,
  isOpen,
  onClose,
  onSave,
}) => {
  const [formData, setFormData] = useState<ProfileData>(data)
  const [isFetchingAddress, setIsFetchingAddress] = useState(false)
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  useEffect(() => {
    setFormData(data)
  }, [data, isOpen])

  if (!isOpen) {
    return null
  }

  const handleChange = (field: keyof ProfileData, value: string | number | undefined) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handlePostalCodeLookup = async () => {
    const postalCode = formData.postalCode?.replace(/[^0-9]/g, '')
    if (!postalCode || postalCode.length !== 7) {
      return
    }
    try {
      setIsFetchingAddress(true)
      const response = await fetch(
        `https://zipcloud.ibsnet.co.jp/api/search?zipcode=${postalCode}`,
      )
      const json = await response.json()
      if (json?.results?.length) {
        const result = json.results[0]
        const fullAddress = `${result.address1}${result.address2}${result.address3}`
        handleChange('location', fullAddress)
      }
    } catch (error) {
      console.error(error)
    } finally {
      setIsFetchingAddress(false)
    }
  }

  const handlePhotoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onloadend = () => {
      handleChange('photo', reader.result as string)
    }
    reader.readAsDataURL(file)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name) {
      alert('氏名を入力してください')
      return
    }
    if (!formData.location) {
      alert('住所を入力してください')
      return
    }
    onSave(formData)
    onClose()
  }

  return (
    <div className="profile-edit-overlay" onClick={onClose}>
      <div className="profile-edit-content" onClick={(e) => e.stopPropagation()}>
        <div className="profile-edit-header">
          <h2 className="profile-edit-title">プロフィール編集</h2>
          <button className="profile-edit-close" onClick={onClose}>
            ×
          </button>
        </div>
        <form className="profile-edit-body" onSubmit={handleSubmit}>
          {formData.location && (
            <input type="hidden" value={formData.location} />
          )}
          <div className="profile-edit-group">
            <label>プロフィール写真</label>
            <div className="profile-photo-edit">
              {formData.photo ? (
                <img src={formData.photo} alt={formData.name} className="profile-photo-preview" />
              ) : (
                <div className="profile-photo-placeholder-sm">写真未設定</div>
              )}
              <button
                type="button"
                className="photo-upload-button"
                onClick={() => fileInputRef.current?.click()}
              >
                画像を編集
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handlePhotoChange}
                style={{ display: 'none' }}
              />
            </div>
          </div>
          <div className="profile-edit-group">
            <label>氏名</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              placeholder="氏名を入力"
            />
          </div>
          <div className="profile-edit-row">
            <div className="profile-edit-group">
              <label>年齢</label>
              <select
                value={formData.age ?? ''}
                onChange={(e) =>
                  handleChange('age', e.target.value ? parseInt(e.target.value) : undefined)
                }
              >
                <option value="">未設定</option>
                {ages.map((age) => (
                  <option key={age} value={age}>
                    {age}
                  </option>
                ))}
              </select>
            </div>
            <div className="profile-edit-group">
              <label>性別</label>
              <select
                value={formData.gender || ''}
                onChange={(e) => handleChange('gender', e.target.value)}
              >
                <option value="">未設定</option>
                {genderOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="profile-edit-group">
            <label>郵便番号</label>
            <div className="postal-row">
              <input
                type="text"
                value={formData.postalCode || ''}
                onChange={(e) => handleChange('postalCode', e.target.value)}
                onBlur={handlePostalCodeLookup}
                placeholder="ハイフン無しで入力"
              />
              <button
                type="button"
                className="btn-lookup"
                onClick={handlePostalCodeLookup}
                disabled={isFetchingAddress}
              >
                {isFetchingAddress ? '検索中…' : '住所検索'}
              </button>
            </div>
          </div>
          <div className="profile-edit-group">
            <label>住所（自動出力）</label>
            <div
              className={`profile-edit-address-display ${formData.location ? 'filled' : ''}`}
            >
              {formData.location || '郵便番号を入力して住所検索を行ってください'}
            </div>
            <span className="profile-edit-hint">都道府県・市区町村までが自動表示されます</span>
          </div>
          <div className="profile-edit-group">
            <label>番地・建物名など</label>
            <input
              type="text"
              value={formData.addressDetail || ''}
              onChange={(e) => handleChange('addressDetail', e.target.value)}
              placeholder="例：〇〇丁目〇番地〇〇マンション101号室"
            />
          </div>
          <div className="profile-edit-group">
            <label>メールアドレス</label>
            <input
              type="email"
              value={formData.email || ''}
              onChange={(e) => handleChange('email', e.target.value)}
              placeholder="メールアドレスを入力"
            />
          </div>
          <div className="profile-edit-group">
            <label>電話番号</label>
            <input
              type="tel"
              value={formData.phone || ''}
              onChange={(e) => handleChange('phone', e.target.value)}
              placeholder="電話番号を入力"
            />
          </div>
          <div className="profile-edit-group">
            <label>職種</label>
            <select
              value={formData.jobTitle || ''}
              onChange={(e) => handleChange('jobTitle', e.target.value)}
            >
              <option value="">選択してください</option>
              {jobOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
          <div className="profile-edit-group">
            <label>私はこんな人</label>
            <textarea
              value={formData.personalWords || ''}
              onChange={(e) => handleChange('personalWords', e.target.value)}
              placeholder="自己紹介を入力"
              rows={4}
            />
          </div>
          <div className="profile-edit-footer">
            <button type="button" className="btn-cancel" onClick={onClose}>
              キャンセル
            </button>
            <button type="submit" className="btn-save">
              保存
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

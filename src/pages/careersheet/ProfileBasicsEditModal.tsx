import React, { useState, useEffect } from 'react';
import type { ProfileData } from '../../types';
import './ProfileBasicsEditModal.css';

interface ProfileBasicsEditModalProps {
  data: ProfileData;
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Partial<ProfileData>) => void;
}

const genderOptions = ['男性', '女性', 'その他'];
const ages = Array.from({ length: 71 }, (_, i) => i + 15);

export const ProfileBasicsEditModal: React.FC<ProfileBasicsEditModalProps> = ({
  data,
  isOpen,
  onClose,
  onSave,
}) => {
  const [formData, setFormData] = useState<Partial<ProfileData>>({
    age: data.age,
    gender: data.gender,
    postalCode: data.postalCode,
    location: data.location,
    addressDetail: data.addressDetail,
    email: data.email,
    phone: data.phone,
    qualifications: data.qualifications,
  });
  const [isFetchingAddress, setIsFetchingAddress] = useState(false);

  useEffect(() => {
    setFormData({
      age: data.age,
      gender: data.gender,
      postalCode: data.postalCode,
      location: data.location,
      addressDetail: data.addressDetail,
      email: data.email,
      phone: data.phone,
      qualifications: data.qualifications,
    });
  }, [data, isOpen]);

  if (!isOpen) {
    return null;
  }

  const handleChange = (field: keyof ProfileData, value: string | number | string[] | undefined) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handlePostalCodeLookup = async () => {
    const postalCode = formData.postalCode?.replace(/[^0-9]/g, '');
    if (!postalCode || postalCode.length !== 7) {
      return;
    }
    try {
      setIsFetchingAddress(true);
      const response = await fetch(
        `https://zipcloud.ibsnet.co.jp/api/search?zipcode=${postalCode}`,
      );
      const json = await response.json();
      if (json?.results?.length) {
        const result = json.results[0];
        const fullAddress = `${result.address1}${result.address2}${result.address3}`;
        handleChange('location', fullAddress);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsFetchingAddress(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  return (
    <div className="profile-basics-edit-overlay" onClick={onClose}>
      <div className="profile-basics-edit-content" onClick={(e) => e.stopPropagation()}>
        <div className="profile-basics-edit-header">
          <h2 className="profile-basics-edit-title">基本プロフィール編集</h2>
          <button className="profile-basics-edit-close" onClick={onClose}>
            ×
          </button>
        </div>
        <form className="profile-basics-edit-body" onSubmit={handleSubmit}>
          <div className="profile-basics-edit-row">
            <div className="profile-basics-edit-group">
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
            <div className="profile-basics-edit-group">
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
          <div className="profile-basics-edit-group">
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
          <div className="profile-basics-edit-group">
            <label>住所（自動出力）</label>
            <div
              className={`profile-basics-edit-address-display ${formData.location ? 'filled' : ''}`}
            >
              {formData.location || '郵便番号を入力して住所検索を行ってください'}
            </div>
            <span className="profile-basics-edit-hint">都道府県・市区町村までが自動表示されます</span>
          </div>
          <div className="profile-basics-edit-group">
            <label>番地・建物名など</label>
            <input
              type="text"
              value={formData.addressDetail || ''}
              onChange={(e) => handleChange('addressDetail', e.target.value)}
              placeholder="例：〇〇丁目〇番地〇〇マンション101号室"
            />
          </div>
          <div className="profile-basics-edit-group">
            <label>メールアドレス</label>
            <input
              type="email"
              value={formData.email || ''}
              onChange={(e) => handleChange('email', e.target.value)}
              placeholder="メールアドレスを入力"
            />
          </div>
          <div className="profile-basics-edit-group">
            <label>電話番号</label>
            <input
              type="tel"
              value={formData.phone || ''}
              onChange={(e) => handleChange('phone', e.target.value)}
              placeholder="電話番号を入力"
            />
          </div>
          <div className="profile-basics-edit-group">
            <label>所有資格</label>
            <input
              type="text"
              value={formData.qualifications?.join(', ') || ''}
              onChange={(e) =>
                handleChange(
                  'qualifications',
                  e.target.value ? e.target.value.split(',').map((q) => q.trim()) : [],
                )
              }
              placeholder="カンマ区切りで入力（例：看護師, ケアマネ）"
            />
          </div>
          <div className="profile-basics-edit-footer">
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
  );
};


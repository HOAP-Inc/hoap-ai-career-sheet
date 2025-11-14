import React, { useState, useEffect } from 'react';
import type { ProfileData, CareerItem } from '../../types';
import { ProfileHeader } from './ProfileHeader';
import { Card } from '../../components/Card';
import { CareerGraph } from './CareerGraph';
import { ProfileBasics } from './ProfileBasics';
import { ProfileEditModal } from './ProfileEditModal';
import { SectionEditModal } from './SectionEditModal';
import './ProfileSheet.css';

interface ProfileSheetProps {
  data: ProfileData;
  onPhotoChange?: (file: File) => void;
  onDataUpdate?: (data: ProfileData) => void;
}

export const ProfileSheet: React.FC<ProfileSheetProps> = ({
  data,
  onPhotoChange,
  onDataUpdate,
}) => {
  const [profileData, setProfileData] = useState<ProfileData>(data);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editingSection, setEditingSection] = useState<{
    type: 'can' | 'will' | 'being' | 'doing' | 'must' | null;
    value: string;
  }>({ type: null, value: '' });

  useEffect(() => {
    setProfileData(data);
  }, [data]);

  const monthValue = (item: CareerItem) =>
    item.startYear * 12 + (item.startMonth ?? 1);

  const handleCareerUpdate = (index: number, item: CareerItem) => {
    const updatedCareerHistory = [...profileData.careerHistory];
    updatedCareerHistory[index] = item;
    updatedCareerHistory.sort((a, b) => monthValue(a) - monthValue(b));
    const updatedData = {
      ...profileData,
      careerHistory: updatedCareerHistory,
    };
    setProfileData(updatedData);
    if (onDataUpdate) {
      onDataUpdate(updatedData);
    }
  };

  const handleCareerAdd = (item: CareerItem) => {
    console.log('ProfileSheet - handleCareerAdd called with:', item)
    console.log('ProfileSheet - current careerHistory:', profileData.careerHistory)
    
    const updatedCareerHistory = [...profileData.careerHistory, item].sort(
      (a, b) => monthValue(a) - monthValue(b),
    );
    
    console.log('ProfileSheet - updated careerHistory:', updatedCareerHistory)
    
    const updatedData = {
      ...profileData,
      careerHistory: updatedCareerHistory,
    };
    setProfileData(updatedData);
    if (onDataUpdate) {
      onDataUpdate(updatedData);
    }
  };

  const handleCareerDelete = (index: number) => {
    const updatedCareerHistory = profileData.careerHistory.filter(
      (_, i) => i !== index,
    );
    const updatedData = {
      ...profileData,
      careerHistory: updatedCareerHistory,
    };
    setProfileData(updatedData);
    if (onDataUpdate) {
      onDataUpdate(updatedData);
    }
  };

  const handleProfileSave = (updated: ProfileData) => {
    setProfileData(updated);
    if (onDataUpdate) {
      onDataUpdate(updated);
    }
    setIsEditingProfile(false);
  };

  const handleSectionEdit = (type: 'can' | 'will' | 'being' | 'doing' | 'must') => {
    const value = profileData[type] || '';
    setEditingSection({ type, value });
  };

  const handleSectionSave = (value: string) => {
    if (editingSection.type) {
      const updatedData = {
        ...profileData,
        [editingSection.type]: value,
      };
      setProfileData(updatedData);
      if (onDataUpdate) {
        onDataUpdate(updatedData);
      }
    }
    setEditingSection({ type: null, value: '' });
  };

  return (
    <div className="profile-sheet">
      <div className="profile-sheet-container">
        <ProfileHeader
          name={profileData.name}
          photo={profileData.photo}
          personalWords={profileData.personalWords}
          memberId={profileData.memberId}
          onPhotoChange={onPhotoChange}
          onEdit={() => setIsEditingProfile(true)}
        />

        <div className="sheet-grid">
          <div className="sheet-row sheet-row-experience">
            <div className="sheet-col">
              <CareerGraph
                careerHistory={profileData.careerHistory}
                onCareerUpdate={handleCareerUpdate}
                onCareerAdd={handleCareerAdd}
                onCareerDelete={handleCareerDelete}
              />
            </div>
            <div className="sheet-col">
              <Card
                title="Can"
                className="section-card"
                onEdit={() => handleSectionEdit('can')}
              >
                <div className={profileData.can ? '' : 'empty'}>
                  {profileData.can || ''}
                </div>
              </Card>
            </div>
            <div className="sheet-col">
              <ProfileBasics
                age={profileData.age}
                gender={profileData.gender}
                postalCode={profileData.postalCode}
                location={profileData.location}
                addressDetail={profileData.addressDetail}
                email={profileData.email}
                phone={profileData.phone}
                qualifications={profileData.qualifications}
              />
            </div>
          </div>

          <div className="sheet-row three-columns">
            <div className="sheet-col">
              <Card
                title="Must"
                className="section-card"
                onEdit={() => handleSectionEdit('must')}
              >
                <div className={profileData.must ? '' : 'empty'}>
                  {profileData.must || ''}
                </div>
              </Card>
            </div>
            <div className="sheet-col">
              <Card
                title="Will"
                className="section-card"
                onEdit={() => handleSectionEdit('will')}
              >
                <div className={profileData.will ? '' : 'empty'}>
                  {profileData.will || ''}
                </div>
              </Card>
            </div>
          </div>

          <div className="sheet-row">
            <div className="sheet-col">
              <Card
                title="Being"
                subtitle="どんな存在でありたいか？／どんな価値観か？"
                className="section-card"
                onEdit={() => handleSectionEdit('being')}
              >
                <div className={profileData.being ? '' : 'empty'}>
                  {profileData.being || '未入力'}
                </div>
              </Card>
            </div>
            <div className="sheet-col">
              <Card
                title="Doing"
                subtitle="どんな行動パターンか？／どんな役割か？"
                className="section-card"
                onEdit={() => handleSectionEdit('doing')}
              >
                <div className={profileData.doing ? '' : 'empty'}>
                  {profileData.doing || '未入力'}
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
      <ProfileEditModal
        data={profileData}
        isOpen={isEditingProfile}
        onClose={() => setIsEditingProfile(false)}
        onSave={handleProfileSave}
      />
      {editingSection.type && (
        <SectionEditModal
          isOpen={true}
          title={
            editingSection.type === 'can'
              ? 'Can'
              : editingSection.type === 'will'
                ? 'Will'
              : editingSection.type === 'being'
                ? 'Being'
                : editingSection.type === 'doing'
                  ? 'Doing'
                  : 'Must'
          }
          subtitle={
            editingSection.type === 'being'
              ? 'どんな存在でありたいか？／どんな価値観か？'
              : editingSection.type === 'doing'
                ? 'どんな行動パターンか？／どんな役割か？'
                : undefined
          }
          value={editingSection.value}
          onClose={() => setEditingSection({ type: null, value: '' })}
          onSave={handleSectionSave}
        />
      )}
    </div>
  );
};

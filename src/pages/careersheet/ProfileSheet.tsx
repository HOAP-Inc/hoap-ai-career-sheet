import React, { useState, useEffect } from 'react';
import type { ProfileData, CareerItem } from '../../types';
import { ProfileHeader } from './ProfileHeader';
import { Card } from '../../components/Card';
import { CareerGraph } from './CareerGraph';
import { ProfileBasics } from './ProfileBasics';
import { ProfileEditModal } from './ProfileEditModal';
import { ProfileBasicsEditModal } from './ProfileBasicsEditModal';
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
  const [isEditingBasics, setIsEditingBasics] = useState(false);
  const [isEditingPersonalWords, setIsEditingPersonalWords] = useState(false);
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

  const handleBasicsSave = (updated: Partial<ProfileData>) => {
    const updatedData = { ...profileData, ...updated };
    setProfileData(updatedData);
    if (onDataUpdate) {
      onDataUpdate(updatedData);
    }
    setIsEditingBasics(false);
  };

  const handlePersonalWordsSave = (value: string) => {
    const updatedData = { ...profileData, personalWords: value };
    setProfileData(updatedData);
    if (onDataUpdate) {
      onDataUpdate(updatedData);
    }
    setIsEditingPersonalWords(false);
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
          onEditPersonalWords={() => setIsEditingPersonalWords(true)}
        />

        <div className="profile-basics-wrapper">
          <ProfileBasics
            age={profileData.age}
            gender={profileData.gender}
            postalCode={profileData.postalCode}
            location={profileData.location}
            addressDetail={profileData.addressDetail}
            email={profileData.email}
            phone={profileData.phone}
            qualifications={profileData.qualifications}
            onEdit={() => setIsEditingBasics(true)}
          />
        </div>

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
                titleDescription="今できること"
                className="section-card"
                onEdit={() => handleSectionEdit('can')}
              >
                <div className={profileData.can ? '' : 'empty'}>
                  {profileData.can || ''}
                </div>
              </Card>
            </div>
          </div>

          <div className="sheet-row three-columns">
            <div className="sheet-col">
              <Card
                title="Must"
                titleDescription="譲れない条件"
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
                titleDescription="やりたいこと"
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
                titleDescription="AI分析"
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
                titleDescription="AI分析"
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
      <ProfileBasicsEditModal
        data={profileData}
        isOpen={isEditingBasics}
        onClose={() => setIsEditingBasics(false)}
        onSave={handleBasicsSave}
      />
      {isEditingPersonalWords && (
        <SectionEditModal
          isOpen={true}
          title="私はこんな人（自己分析）"
          value={profileData.personalWords || ''}
          onClose={() => setIsEditingPersonalWords(false)}
          onSave={handlePersonalWordsSave}
        />
      )}
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

import { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import type { ProfileData } from './types';
import { ProfileSheet } from './pages/careersheet/ProfileSheet';
import { EmailRegister } from './pages/registration/EmailRegister';
import { EmailSent } from './pages/registration/EmailSent';
import { Verify } from './pages/registration/Verify';
import { ProfileRegister } from './pages/registration/ProfileRegister';
import { RegistrationComplete } from './pages/registration/RegistrationComplete';
import { Login } from './pages/registration/Login';
import './App.css';

function App() {
  // サンプルデータで初期化（デモ用）
  const sampleData: ProfileData = {
    name: 'ほーぷちゃん',
    photo: undefined,
    postalCode: '1040061',
    location: '東京都中央区銀座1-1-1',
    addressDetail: '銀座ビル 3F',
    email: 'hope@example.com',
    phone: '03-1234-5678',
    age: 32,
    gender: '女',
    jobTitle: '正看護師',
    can: '急性期看護、訪問看護、クリニックでの看護業務全般',
    will: '患者さんとじっくり向き合える環境で、質の高い看護を提供したい',
    must: 'ワークライフバランス、職場の人間関係、給与',
    personalWords: '看護は技術だけではなく、心で行うものだと思います。',
    doing: 'チームで誰よりも早く動く',
    being: '安心して過ごせる空気を守ることがやりがい',
    qualifications: ['正看護師'],
    careerHistory: [],
  };

  const [profileData, setProfileData] = useState<ProfileData>(sampleData);

  // ログイン時に渡されたプロフィールデータを反映
  useEffect(() => {
    const registrationData = localStorage.getItem('registration_data');
    if (registrationData) {
      try {
        const data = JSON.parse(registrationData);
        setProfileData(data);
      } catch (error) {
        console.error('Failed to parse registration data:', error);
      }
    }
  }, []);

  const handlePhotoChange = (file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      setProfileData({
        ...profileData,
        photo: reader.result as string,
      });
    };
    reader.readAsDataURL(file);
  };

  const handleDataUpdate = (data: ProfileData) => {
    setProfileData(data);
  };

  return (
    <div className="app">
      <Routes>
        {/* 登録フロー */}
        <Route path="/registration" element={<EmailRegister />} />
        <Route path="/registration/email-sent" element={<EmailSent />} />
        <Route path="/registration/verify" element={<Verify />} />
        <Route path="/registration/profile" element={<ProfileRegister />} />
        <Route path="/registration/complete" element={<RegistrationComplete />} />
        
        {/* ログイン */}
        <Route path="/login" element={<Login />} />
        
        {/* プロフィールシート */}
        <Route
          path="/careersheet"
          element={
            <ProfileSheetWrapper
              profileData={profileData}
              onPhotoChange={handlePhotoChange}
              onDataUpdate={handleDataUpdate}
            />
          }
        />
        
        {/* デフォルトルート */}
        <Route path="/" element={<Navigate to="/registration" replace />} />
        <Route path="*" element={<Navigate to="/registration" replace />} />
      </Routes>
    </div>
  );
}

// ProfileSheetWrapperコンポーネント（ログイン時に渡されたデータを反映）
function ProfileSheetWrapper({
  profileData: initialProfileData,
  onPhotoChange,
  onDataUpdate,
}: {
  profileData: ProfileData;
  onPhotoChange: (file: File) => void;
  onDataUpdate: (data: ProfileData) => void;
}) {
  const location = useLocation();
  const [profileData, setProfileData] = useState<ProfileData>(initialProfileData);

  useEffect(() => {
    // ログイン時に渡されたプロフィールデータを反映
    const state = location.state as { profileData?: ProfileData } | null;
    if (state?.profileData) {
      setProfileData(state.profileData);
      onDataUpdate(state.profileData);
    }
  }, [location, onDataUpdate]);

  const handleDataUpdate = (data: ProfileData) => {
    setProfileData(data);
    onDataUpdate(data);
  };

  return (
    <ProfileSheet
      data={profileData}
      onPhotoChange={onPhotoChange}
      onDataUpdate={handleDataUpdate}
    />
  );
}

export default App;

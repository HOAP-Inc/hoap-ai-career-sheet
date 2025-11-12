import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { registerUser } from '../../utils/api';
import './RegistrationForm.css';

export const ProfileRegister: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isVerified, setIsVerified] = useState(false);
  const [email, setEmail] = useState('');
  const [currentStep, setCurrentStep] = useState<number>(1);

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    birthYear: new Date().getFullYear() - 30,
    birthMonth: 1,
    birthDay: 1,
    gender: '',
    postalCode: '',
    location: '',
    addressDetail: '',
    password: '',
    passwordConfirm: '',
    privacyAgreed: false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isFetchingAddress, setIsFetchingAddress] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const TOTAL_STEPS = 6;

  useEffect(() => {
    // 認証済みかチェック
    const state = location.state as { verified?: boolean; email?: string } | null;
    if (state?.verified && state?.email) {
      setIsVerified(true);
      setEmail(state.email);
    } else {
      // 認証されていない場合はEmailRegisterへリダイレクト
      navigate('/registration', { replace: true });
    }
  }, [location, navigate]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentStep]);

  const handleChange = (field: keyof typeof formData, value: string | number | boolean) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    // エラーをクリア
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handlePostalCodeLookup = async () => {
    const postalCode = formData.postalCode.replace(/[^0-9]/g, '');
    if (!postalCode || postalCode.length !== 7) {
      setErrors({ postalCode: '7桁の郵便番号を入力してください' });
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
        setErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors.postalCode;
          return newErrors;
        });
      } else {
        setErrors({ postalCode: '郵便番号が見つかりませんでした' });
      }
    } catch (error) {
      console.error(error);
      setErrors({ postalCode: '住所の取得に失敗しました' });
    } finally {
      setIsFetchingAddress(false);
    }
  };

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};

    switch (step) {
      case 1:
        if (!formData.name.trim()) {
          newErrors.name = '氏名を入力してください';
        }
        break;
      case 2:
        if (!formData.phone.trim()) {
          newErrors.phone = '電話番号を入力してください';
        }
        break;
      case 3:
        if (!formData.gender) {
          newErrors.gender = '性別を選択してください';
        }
        break;
      case 4:
        if (!formData.location.trim()) {
          newErrors.location = '住所を入力してください';
        }
        break;
      case 5:
        if (!formData.password) {
          newErrors.password = 'パスワードを入力してください';
        } else if (formData.password.length < 8) {
          newErrors.password = 'パスワードは8文字以上で入力してください';
        }
        if (!formData.passwordConfirm) {
          newErrors.passwordConfirm = 'パスワード（確認）を入力してください';
        } else if (formData.password !== formData.passwordConfirm) {
          newErrors.passwordConfirm = 'パスワードが一致しません';
        }
        break;
      case 6:
        if (!formData.privacyAgreed) {
          newErrors.privacyAgreed = 'プライバシーポリシーに同意してください';
        }
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const calculateAge = (year: number, month: number, day: number): number => {
    const today = new Date();
    const birthDate = new Date(year, month - 1, day);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const handleNext = () => {
    if (!validateStep(currentStep)) {
      return;
    }

    if (currentStep < TOTAL_STEPS) {
      setCurrentStep(currentStep + 1);
    } else {
      handleSubmit();
    }
  };

  const handleSubmit = async () => {
    if (!validateStep(TOTAL_STEPS)) {
      return;
    }

    setIsSubmitting(true);

    try {
      const phoneWithoutHyphen = formData.phone.replace(/[-\s]/g, '');

      // API呼び出し（実際のバックエンドに送信）
      await registerUser({
        email: email,
        name: formData.name,
        phone: phoneWithoutHyphen,
        birthYear: formData.birthYear,
        birthMonth: formData.birthMonth,
        birthDay: formData.birthDay,
        gender: formData.gender,
        postalCode: formData.postalCode,
        location: formData.location,
        addressDetail: formData.addressDetail,
        password: formData.password,
        agreedToPrivacy: formData.privacyAgreed,
      });

      // 登録データをlocalStorageに保存（ログイン時に使用）
      const age = calculateAge(formData.birthYear, formData.birthMonth, formData.birthDay);
      const registrationData = {
        name: formData.name,
        email: email,
        phone: phoneWithoutHyphen,
        age: age,
        postalCode: formData.postalCode,
        location: formData.location,
        can: '',
        will: '',
        must: '',
        personalWords: '',
        doing: '',
        being: '',
        careerHistory: [],
      };
      localStorage.setItem('registration_data', JSON.stringify(registrationData));

      // 成功時はRegistrationCompleteへ遷移
      navigate('/registration/complete', { state: { email } });
    } catch (err) {
      setErrors({
        submit:
          err instanceof Error
            ? err.message
            : '登録に失敗しました。しばらくしてから再度お試しください。',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isVerified) {
    return null; // 認証チェック中
  }

  const years = Array.from({ length: 100 }, (_, i) => new Date().getFullYear() - i);
  const months = Array.from({ length: 12 }, (_, i) => i + 1);
  const days = Array.from({ length: 31 }, (_, i) => i + 1);

  const stepLabels = [
    '氏名',
    '電話番号',
    '生年月日',
    '住所',
    'パスワード',
    'プライバシーポリシー',
  ];

  const stepSubtitles = [
    '氏名を入力してください',
    'ハイフンなしで電話番号を入力してください',
    '生年月日を選択してください',
    '郵便番号から住所を検索してください',
    'パスワードを入力してください（8文字以上）',
    '利用規約を確認のうえ同意してください',
  ];

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="registration-form">
            <div className="form-field">
              <input
                type="text"
                placeholder="山田 太郎"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                className={`form-input single-input ${errors.name ? 'error' : ''}`}
                autoFocus
              />
              {errors.name && <div className="error-message">{errors.name}</div>}
            </div>
            <button
              type="button"
              onClick={handleNext}
              className="btn-next"
              disabled={!formData.name.trim()}
            >
              次へ
            </button>
          </div>
        );
      case 2:
        return (
          <div className="registration-form">
            <div className="form-field">
              <input
                type="tel"
                placeholder="09012345678"
                value={formData.phone}
                onChange={(e) => handleChange('phone', e.target.value.replace(/[^0-9]/g, ''))}
                className={`form-input single-input ${errors.phone ? 'error' : ''}`}
                inputMode="numeric"
                autoFocus
              />
              {errors.phone && <div className="error-message">{errors.phone}</div>}
            </div>
            <button
              type="button"
              onClick={handleNext}
              className="btn-next"
              disabled={!formData.phone.trim()}
            >
              次へ
            </button>
          </div>
        );
      case 3:
        return (
          <div className="registration-form">
            <div className="form-field">
              <div className="birth-date-selectors">
                <select
                  value={formData.birthYear}
                  onChange={(e) => handleChange('birthYear', parseInt(e.target.value))}
                  className="birth-select"
                >
                  {years.map((year) => (
                    <option key={year} value={year}>
                      {year}年
                    </option>
                  ))}
                </select>
                <select
                  value={formData.birthMonth}
                  onChange={(e) => handleChange('birthMonth', parseInt(e.target.value))}
                  className="birth-select"
                >
                  {months.map((month) => (
                    <option key={month} value={month}>
                      {month}月
                    </option>
                  ))}
                </select>
                <select
                  value={formData.birthDay}
                  onChange={(e) => handleChange('birthDay', parseInt(e.target.value))}
                  className="birth-select"
                >
                  {days.map((day) => (
                    <option key={day} value={day}>
                      {day}日
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-field" style={{ marginTop: '16px' }}>
                <select
                  value={formData.gender}
                  onChange={(e) => handleChange('gender', e.target.value)}
                  className={`form-input ${errors.gender ? 'error' : ''}`}
                  style={{ marginTop: '8px' }}
                >
                  <option value="">性別を選択してください</option>
                  <option value="男">男</option>
                  <option value="女">女</option>
                  <option value="その他">その他</option>
                </select>
                {errors.gender && <div className="error-message">{errors.gender}</div>}
              </div>
            </div>
            <button 
              type="button" 
              onClick={handleNext} 
              className="btn-next"
              disabled={!formData.gender}
            >
              次へ
            </button>
          </div>
        );
      case 4:
        return (
          <div className="registration-form">
            <div className="form-field">
              <div className="postal-code-row">
                <input
                  type="text"
                  placeholder="1234567"
                  value={formData.postalCode}
                  onChange={(e) =>
                    handleChange('postalCode', e.target.value.replace(/[^0-9]/g, ''))
                  }
                  className={`form-input postal-input ${errors.postalCode ? 'error' : ''}`}
                  maxLength={7}
                  inputMode="numeric"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={handlePostalCodeLookup}
                  disabled={isFetchingAddress}
                  className="postal-search-btn"
                >
                  {isFetchingAddress ? '検索中…' : '住所検索'}
                </button>
              </div>
              {errors.postalCode && <div className="error-message">{errors.postalCode}</div>}
              {formData.location && (
                <div className="address-display">{formData.location}</div>
              )}
              {errors.location && <div className="error-message">{errors.location}</div>}
              <input
                type="text"
                placeholder="建物名・部屋番号（任意）"
                value={formData.addressDetail}
                onChange={(e) => handleChange('addressDetail', e.target.value)}
                className="form-input"
                style={{ marginTop: '12px' }}
              />
            </div>
            <button
              type="button"
              onClick={handleNext}
              className="btn-next"
              disabled={!formData.location.trim()}
            >
              次へ
            </button>
          </div>
        );
      case 5:
        return (
          <div className="registration-form">
            <div className="form-field">
              <input
                type="password"
                placeholder="パスワードを入力"
                value={formData.password}
                onChange={(e) => handleChange('password', e.target.value)}
                className={`form-input single-input ${errors.password ? 'error' : ''}`}
                autoFocus
              />
              {errors.password && <div className="error-message">{errors.password}</div>}
              <input
                type="password"
                placeholder="パスワードを再入力"
                value={formData.passwordConfirm}
                onChange={(e) => handleChange('passwordConfirm', e.target.value)}
                className={`form-input single-input ${errors.passwordConfirm ? 'error' : ''}`}
                style={{ marginTop: '12px' }}
              />
              {errors.passwordConfirm && (
                <div className="error-message">{errors.passwordConfirm}</div>
              )}
            </div>
            <button
              type="button"
              onClick={handleNext}
              className="btn-next"
              disabled={
                !formData.password ||
                formData.password.length < 8 ||
                !formData.passwordConfirm ||
                formData.password !== formData.passwordConfirm
              }
            >
              次へ
            </button>
          </div>
        );
      case 6:
        return (
          <div className="registration-form">
            <div className="form-field privacy-field">
              <label className="privacy-checkbox-label">
                <input
                  type="checkbox"
                  checked={formData.privacyAgreed}
                  onChange={(e) => handleChange('privacyAgreed', e.target.checked)}
                  className="privacy-checkbox"
                />
                <span>
                  <a href="/privacy-policy" target="_blank" className="privacy-link">
                    プライバシーポリシー
                  </a>
                  <span className="privacy-separator">・</span>
                  <a href="/terms" target="_blank" className="privacy-link">
                    利用規約
                  </a>
                  に同意する。
                </span>
              </label>
              {errors.privacyAgreed && (
                <div className="error-message">{errors.privacyAgreed}</div>
              )}
            </div>
            {errors.submit && <div className="error-message">{errors.submit}</div>}
            <button
              type="button"
              onClick={handleNext}
              className="btn-next"
              disabled={!formData.privacyAgreed || isSubmitting}
            >
              {isSubmitting ? '登録中...' : '登録する'}
            </button>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="registration-container">
      <h1 className="registration-title">新規会員登録</h1>
      <div className="step-indicator">
        {stepLabels.map((label, index) => (
          <div
            key={index}
            className={`step-indicator-item ${
              index + 1 === currentStep
                ? 'active'
                : index + 1 < currentStep
                  ? 'completed'
                  : ''
            }`}
          >
            <div className="step-indicator-number">
              {index + 1 < currentStep ? '✓' : index + 1}
            </div>
            <div className="step-indicator-label">{label}</div>
          </div>
        ))}
      </div>
      <div className="registration-card">
        <div className="registration-header">
          <p className="registration-subtitle">{stepSubtitles[currentStep - 1]}</p>
        </div>
        {renderStepContent()}
      </div>
    </div>
  );
};

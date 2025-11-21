'use client'

import React, { useState, useRef, useEffect } from 'react';
import type { CareerItem } from '../../types';
import { CareerDetailModal } from './CareerDetailModal';
import { CareerAddForm } from './CareerAddForm';
import './CareerGraph.css';

interface CareerGraphProps {
  careerHistory: CareerItem[];
  onCareerUpdate?: (index: number, item: CareerItem) => void;
  onCareerAdd?: (item: CareerItem) => void;
  onCareerDelete?: (index: number) => void;
}

export const CareerGraph: React.FC<CareerGraphProps> = ({
  careerHistory,
  onCareerUpdate,
  onCareerAdd,
  onCareerDelete,
}) => {
  const [selectedCareerIndex, setSelectedCareerIndex] = useState<number | null>(
    null
  );
  const [showAddForm, setShowAddForm] = useState(false);

  const now = new Date()
  const currentYear = now.getFullYear()
  const currentMonth = now.getMonth() + 1

  const isMobileView =
    typeof window !== 'undefined' ? window.innerWidth <= 768 : false

  // careerHistoryが変更されるたびに再計算
  const calculatedValues = React.useMemo(() => {
    // ヘルパー関数をuseMemoの中に移動
  const toTotalMonths = (year: number, month: number) => year * 12 + (month - 1)
  const getStartMonth = (item: CareerItem) => item.startMonth ?? 1
  const getEndYear = (item: CareerItem) =>
    item.isCurrent ? currentYear : item.endYear ?? item.startYear
  const getEndMonth = (item: CareerItem) =>
    item.isCurrent ? currentMonth : item.endMonth ?? 1

    const earliestStartYear = careerHistory.length
      ? Math.min(...careerHistory.map((item) => item.startYear))
      : currentYear - 1
    const latestEndYear = careerHistory.length
      ? Math.max(
          ...careerHistory.map((item) => (item.isCurrent ? currentYear : item.endYear ?? item.startYear)),
        )
      : currentYear

  const allStartMonthValues = careerHistory.length
    ? careerHistory.map((item) =>
        toTotalMonths(item.startYear, getStartMonth(item)),
      )
      : [toTotalMonths(earliestStartYear, currentMonth)]
  const allEndMonthValues = careerHistory.length
    ? careerHistory.map((item) =>
        toTotalMonths(getEndYear(item), getEndMonth(item)),
      )
      : [toTotalMonths(latestEndYear, currentMonth)]

    const minTotalMonths = allStartMonthValues.length > 0 ? Math.min(...allStartMonthValues) : toTotalMonths(currentYear, currentMonth)
    const maxTotalMonths = allEndMonthValues.length > 0 ? Math.max(...allEndMonthValues) : toTotalMonths(currentYear, currentMonth)

    const minYear = earliestStartYear
    const maxYear = latestEndYear

  const generateYearLabels = () => {
    const years = [];
    for (let year = minYear; year <= maxYear; year += 2) {
      years.push(year);
    }
    if (years[years.length - 1] !== maxYear) {
      years.push(maxYear);
    }
    return years;
  };

  const yearLabels = generateYearLabels();

    console.log('useMemo内 - careerHistory.length:', careerHistory.length)
    console.log('useMemo内 - minTotalMonths:', minTotalMonths)
    console.log('useMemo内 - maxTotalMonths:', maxTotalMonths)

    return {
      minTotalMonths,
      maxTotalMonths,
      minYear,
      maxYear,
      yearLabels,
      toTotalMonths,
      getStartMonth,
      getEndYear,
      getEndMonth,
    }
  }, [careerHistory, currentYear, currentMonth])

  const { minTotalMonths, maxTotalMonths, yearLabels, toTotalMonths, getStartMonth, getEndYear, getEndMonth } = calculatedValues

  // デバッグ用: careerHistoryの状態を確認
  useEffect(() => {
    console.log('CareerGraph - careerHistory:', careerHistory)
    console.log('CareerGraph - careerHistory.length:', careerHistory.length)
    console.log('CareerGraph - minTotalMonths:', minTotalMonths)
    console.log('CareerGraph - maxTotalMonths:', maxTotalMonths)
    console.log('CareerGraph - yearLabels:', yearLabels)
  }, [careerHistory, minTotalMonths, maxTotalMonths, yearLabels])

  const calculateBarPosition = (item: CareerItem) => {
    const startTotal = toTotalMonths(item.startYear, getStartMonth(item))
    const endTotal = toTotalMonths(getEndYear(item), getEndMonth(item))
    
    // タイムラインの月数を計算（0除算を防ぐ）
    const timelineMonths = Math.max(maxTotalMonths - minTotalMonths + 1, 1)
    
    const leftOffset = ((startTotal - minTotalMonths) / timelineMonths) * 100
    const widthPercent =
      ((endTotal - startTotal + 1) / timelineMonths) * 100
    return {
      leftPercent: Math.max(leftOffset, 0),
      widthPercent: Math.max(widthPercent, 1),
      left: `${Math.max(leftOffset, 0)}%`,
      width: `${Math.max(widthPercent, 1)}%`,
    };
  };

  // 在籍期間をフォーマット
  const formatPeriod = (item: CareerItem) => {
    const startMonth = item.startMonth || 1;
    const endMonth = item.endMonth || 1;
    const startStr = `${item.startYear}年${startMonth}月`;
    const endStr = item.isCurrent
      ? '在籍中'
      : `${item.endYear}年${endMonth}月`;
    return `${startStr}〜${endStr}`;
  };

  const handleCareerClick = (index: number) => {
    setSelectedCareerIndex(index);
    setShowAddForm(false);
  };

  const handleSave = (item: CareerItem) => {
    if (selectedCareerIndex !== null && onCareerUpdate) {
      onCareerUpdate(selectedCareerIndex, item);
    }
    setSelectedCareerIndex(null);
  };

  const handleAdd = (item: CareerItem) => {
    console.log('CareerGraph - handleAdd called with:', item)
    if (onCareerAdd) {
      onCareerAdd(item);
      setShowAddForm(false);
      console.log('CareerGraph - showAddForm set to false')
    }
  };

  const handleClose = () => {
    setSelectedCareerIndex(null);
    setShowAddForm(false);
  };

  const handleDelete = (index: number) => {
    if (onCareerDelete) {
      onCareerDelete(index);
    }
    setSelectedCareerIndex(null);
  };

  return (
    <>
      <div className="career-graph">
        <div className="career-graph-header">
          <h3 className="career-graph-title">今までの経験</h3>
          {onCareerAdd && (
            <button
              className="career-add-button"
              onClick={() => {
                setShowAddForm(true);
                setSelectedCareerIndex(null);
              }}
            >
              追加
            </button>
          )}
        </div>

            <div className="career-timeline">
              {/* 年のタイムライン */}
              {careerHistory.length > 0 && (
                <div className="timeline-years">
                  {yearLabels.map((year, idx) => (
                    <div key={idx} className="timeline-year-mark">
                      <span className="timeline-year-text">{year}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* 職歴リストとバー */}
              {careerHistory.length === 0 ? (
                <div className="career-empty-message">
                  <p>キャリア履歴がありません。右上の「追加」ボタンから追加してください。</p>
                </div>
              ) : (
                <div className="career-items-container">
              {!isMobileView && (
                  <div className="career-items-list">
                    {careerHistory.map((_, index) => (
                      <div key={index} className="career-item-label">
                        職歴{index + 1}
                      </div>
                    ))}
                  </div>
              )}
                  <div
                    className="career-bars-container"
              ref={(el) => {
                if (el) {
                  const containerWidth = el.offsetWidth
                  // コンテナ幅を保存して後で使用
                  ;(el as any).__containerWidth = containerWidth
                }
              }}
              style={{ height: `${careerHistory.length * 90 + 40}px` }}
                  >
                    {careerHistory.map((item, index) => {
                      const position = calculateBarPosition(item)
                      const period = formatPeriod(item)
                      const widthPercent = position.widthPercent
                      
                  const isMobile = isMobileView

                  // 法人名と診療科名を結合
                  const orgText = `${item.organization}${item.serviceType ? `／${item.serviceType}` : ''}${item.medicalField ? `／${item.medicalField}` : ''}${item.department ? `／${item.department}` : ''}`
                  
                  // ラベルはバーの左端から配置
                  let labelLeftPercent = position.leftPercent
                  
                  // 右端から20pxの余白を確保
                  const rightMarginPx = 20

                      // 矢印ボタンは常にバーの内側右端に配置
                      const arrowLeft = `calc(${position.leftPercent}% + ${widthPercent}% - 28px)`

                  // ラベルは常に2行表示（法人名／診療科名 + 勤務期間）
                  const labelClass = 'career-bar-label right stacked'

                  // ラベルの垂直位置
                  const labelTop = isMobile ? 36 : 48

                      return (
                    <CareerBarLabel
                          key={index}
                      index={index}
                      orgText={orgText}
                      period={period}
                      labelLeftPercent={labelLeftPercent}
                      labelTop={labelTop}
                      rightMarginPx={rightMarginPx}
                      labelClass={labelClass}
                      position={position}
                      isMobile={isMobile}
                      arrowLeft={arrowLeft}
                      onCareerClick={() => handleCareerClick(index)}
                    />
                      )
                    })}
                  </div>
                </div>
              )}
            </div>
      </div>

      {showAddForm && onCareerAdd && (
        <CareerAddForm onAdd={handleAdd} onCancel={() => setShowAddForm(false)} />
      )}

      {selectedCareerIndex !== null && (
        <CareerDetailModal
          item={careerHistory[selectedCareerIndex]}
          index={selectedCareerIndex}
          isOpen={true}
          onClose={handleClose}
          onSave={handleSave}
          onDelete={handleDelete}
        />
      )}
    </>
  );
};

// キャリアバーラベルコンポーネント（テキスト幅を計算して位置を調整）
interface CareerBarLabelProps {
  index: number
  orgText: string
  period: string
  labelLeftPercent: number
  labelTop: number
  rightMarginPx: number
  labelClass: string
  position: { left: string; width: string; leftPercent: number; widthPercent: number }
  isMobile: boolean
  arrowLeft: string
  onCareerClick: () => void
}

const CareerBarLabel: React.FC<CareerBarLabelProps> = ({
  index,
  orgText,
  period,
  labelLeftPercent,
  labelTop,
  rightMarginPx,
  labelClass,
  position,
  isMobile,
  arrowLeft,
  onCareerClick,
}) => {
  const labelRef = useRef<HTMLDivElement>(null)
  const orgRef = useRef<HTMLSpanElement>(null)
  const periodRef = useRef<HTMLSpanElement>(null)
  const [adjustedLeft, setAdjustedLeft] = useState(labelLeftPercent)

  useEffect(() => {
    const calculatePosition = () => {
      if (!labelRef.current || !orgRef.current || !periodRef.current) return

      const container = labelRef.current.closest('.career-bars-container') as HTMLElement
      if (!container) return

      const containerWidth = container.offsetWidth
      const labelLeftPx = (labelLeftPercent / 100) * containerWidth
      const maxRightPx = containerWidth - rightMarginPx
      const availableWidth = maxRightPx - labelLeftPx

      // テキストの幅を計算（一時的に表示して測定）
      const orgStyle = window.getComputedStyle(orgRef.current)
      const tempOrg = document.createElement('span')
      tempOrg.style.fontSize = orgStyle.fontSize
      tempOrg.style.fontWeight = orgStyle.fontWeight
      tempOrg.style.fontFamily = orgStyle.fontFamily
      tempOrg.style.position = 'absolute'
      tempOrg.style.visibility = 'hidden'
      tempOrg.style.whiteSpace = 'nowrap'
      tempOrg.textContent = orgText
      document.body.appendChild(tempOrg)
      const orgWidth = tempOrg.offsetWidth
      document.body.removeChild(tempOrg)

      const periodStyle = window.getComputedStyle(periodRef.current)
      const tempPeriod = document.createElement('span')
      tempPeriod.style.fontSize = periodStyle.fontSize
      tempPeriod.style.fontWeight = periodStyle.fontWeight
      tempPeriod.style.fontFamily = periodStyle.fontFamily
      tempPeriod.style.position = 'absolute'
      tempPeriod.style.visibility = 'hidden'
      tempPeriod.style.whiteSpace = 'nowrap'
      tempPeriod.textContent = period
      document.body.appendChild(tempPeriod)
      const periodWidth = tempPeriod.offsetWidth
      document.body.removeChild(tempPeriod)

      const maxTextWidth = Math.max(orgWidth, periodWidth)

      // テキストが右端を超える場合は左にずらす
      if (maxTextWidth > availableWidth) {
        const overflow = maxTextWidth - availableWidth
        const shiftLeftPx = overflow
        const shiftLeftPercent = (shiftLeftPx / containerWidth) * 100
        const newLeftPercent = Math.max(0, labelLeftPercent - shiftLeftPercent)
        setAdjustedLeft(newLeftPercent)
      } else {
        setAdjustedLeft(labelLeftPercent)
      }
    }

    calculatePosition()

    // ウィンドウリサイズ時にも再計算
    window.addEventListener('resize', calculatePosition)
    return () => window.removeEventListener('resize', calculatePosition)
  }, [orgText, period, labelLeftPercent, rightMarginPx])

  const BAR_COLOR =
    'linear-gradient(90deg, rgba(240, 148, 51, 0.5) 0%, rgba(220, 39, 67, 0.5) 50%, rgba(188, 24, 136, 0.5) 100%)'
  const BAR_COLOR_HOVER =
    'linear-gradient(90deg, rgba(240, 148, 51, 0.65) 0%, rgba(220, 39, 67, 0.65) 50%, rgba(188, 24, 136, 0.65) 100%)'

  return (
    <div
      className="career-bar-wrapper"
      style={{ top: `${index * 90 + 10}px` }}
    >
      <div
        className="career-bar"
        style={{
          left: position.left,
          width: position.width,
          background: BAR_COLOR,
          maxWidth: isMobile ? `calc(100% - ${position.leftPercent}%)` : 'none',
        }}
        onClick={onCareerClick}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = BAR_COLOR_HOVER
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = BAR_COLOR
        }}
      />
      <button
        className="career-bar-arrow"
        style={{ left: arrowLeft }}
        onClick={onCareerClick}
      >
        ›
      </button>
      <div
        ref={labelRef}
        className={labelClass}
        style={{
          left: `${adjustedLeft}%`,
          top: `${labelTop}px`,
          maxWidth: `calc(100% - ${adjustedLeft}% - ${rightMarginPx}px)`,
        }}
      >
        <span ref={orgRef} className="career-bar-org">{orgText}</span>
        <span ref={periodRef} className="career-bar-period">{period}</span>
      </div>
    </div>
  )
}

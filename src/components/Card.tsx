import React from 'react';
import './Card.css';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  subtitle?: string;
  onEdit?: () => void;
}

export const Card: React.FC<CardProps> = ({ children, className = '', title, subtitle, onEdit }) => {
  return (
    <div className={`card ${className}`}>
      {title && (
        <div className="card-header">
          <h2 className="card-title">{title}</h2>
          {subtitle && <p className="card-subtitle">{subtitle}</p>}
          {onEdit && (
            <button className="card-edit-button" onClick={onEdit}>
              編集
            </button>
          )}
        </div>
      )}
      <div className="card-content">{children}</div>
    </div>
  );
};


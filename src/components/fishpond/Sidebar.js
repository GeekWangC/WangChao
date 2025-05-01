import React from 'react';
import { useTranslation } from 'react-i18next';
import '../styles/Sidebar.css';

const Sidebar = ({ activeMenu, onMenuChange }) => {
  const { t } = useTranslation();

  const menuItems = [
    { id: 'todo', label: t('todoList') },
    { id: 'diary', label: t('diary') },
    { id: 'gomoku', label: t('gomoku') },
    { id: '2048', label: t('game2048') },
    { id: 'snake', label: t('snake') },
    { id: 'tapme', label: t('tapMePlusOne') }
  ];

  return (
    <aside className="sidebar">
      <nav>
        <ul>
          {menuItems.map(item => (
            <li
              key={item.id}
              className={activeMenu === item.id ? 'active' : ''}
              onClick={() => onMenuChange(item.id)}
            >
              {item.label}
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar; 
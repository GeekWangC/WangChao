import React from 'react';
import '../../styles/fishpond.css';

const Sidebar = ({ activeMenu, onMenuChange }) => {
  const menuItems = [
    { id: 'todo', label: '每日待办', icon: '📝' },
    { id: 'notes', label: '笔记', icon: '📚' },
    { id: 'tasks', label: '任务', icon: '✅' },
    { id: 'calendar', label: '日历', icon: '📅' },
  ];

  return (
    <aside className="fishpond-sidebar">
      <nav className="sidebar-nav">
        {menuItems.map(item => (
          <button
            key={item.id}
            className={`sidebar-item ${activeMenu === item.id ? 'active' : ''}`}
            onClick={() => onMenuChange(item.id)}
          >
            <span className="sidebar-icon">{item.icon}</span>
            <span className="sidebar-label">{item.label}</span>
          </button>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar; 
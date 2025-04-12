import React from 'react';
import '../../styles/fishpond.css';

const Sidebar = ({ activeMenu, onMenuChange }) => {
  const menuItems = [
    { id: 'todo', label: '每日待办', icon: '📝' },
    { id: 'notes', label: '笔记', icon: '📚' },
    { id: 'tasks', label: '任务', icon: '✅' },
    { id: 'calendar', label: '日历', icon: '📅' },
    { 
      id: 'games', 
      label: '小游戏', 
      icon: '🎮',
      subItems: [
        { id: 'gomoku', label: '五子棋', icon: '⚫' }
      ]
    }
  ];

  return (
    <aside className="fishpond-sidebar">
      <nav className="sidebar-nav">
        {menuItems.map(item => (
          <div key={item.id} className="sidebar-item-container">
            <button
              className={`sidebar-item ${activeMenu === item.id ? 'active' : ''}`}
              onClick={() => onMenuChange(item.id)}
            >
              <span className="sidebar-icon">{item.icon}</span>
              <span className="sidebar-label">{item.label}</span>
            </button>
            {item.subItems && (
              <div className="sidebar-submenu">
                {item.subItems.map(subItem => (
                  <button
                    key={subItem.id}
                    className={`sidebar-subitem ${activeMenu === subItem.id ? 'active' : ''}`}
                    onClick={() => onMenuChange(subItem.id)}
                  >
                    <span className="sidebar-icon">{subItem.icon}</span>
                    <span className="sidebar-label">{subItem.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar; 
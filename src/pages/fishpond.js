import React, { useState } from 'react';
import Layout from '../components/Layout';
import Sidebar from '../components/fishpond/Sidebar';
import TodoList from '../components/fishpond/TodoList';
import '../styles/fishpond.css';

const FishpondPage = () => {
  const [activeMenu, setActiveMenu] = useState('todo');
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'calendar'

  const renderContent = () => {
    switch (activeMenu) {
      case 'todo':
        return <TodoList viewMode={viewMode} onViewModeChange={setViewMode} />;
      default:
        return <div>开发中...</div>;
    }
  };

  return (
    <Layout>
      <div className="fishpond-container">
        <Sidebar activeMenu={activeMenu} onMenuChange={setActiveMenu} />
        <main className="fishpond-content">
          {renderContent()}
        </main>
      </div>
    </Layout>
  );
};

export default FishpondPage; 
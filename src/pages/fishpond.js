import React, { useState } from 'react';
import Layout from '../components/Layout';
import Sidebar from '../components/fishpond/Sidebar';
import TodoList from '../components/fishpond/TodoList';
import Diary from '../components/fishpond/Diary';
import Gomoku from '../components/fishpond/Gomoku';
import Snake from '../components/fishpond/Snake';
import Game2048 from '../components/fishpond/Game2048';
import TapMePlusOne from '../components/fishpond/TapMePlusOne';
import Tools from '../components/fishpond/Tools';
import '../styles/fishpond.css';

const FishpondPage = () => {
  const [activeMenu, setActiveMenu] = useState('todo');
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'calendar'

  const renderContent = () => {
    switch (activeMenu) {
      case 'todo':
        return <TodoList viewMode={viewMode} onViewModeChange={setViewMode} />;
      case 'diary':
        return <Diary />;
      case 'gomoku':
        return <Gomoku />;
      case '2048':
        return <Game2048 />;
      case 'snake':
        return <Snake />;
      case 'tapme':
        return <TapMePlusOne />;
      case 'tools':
        return <Tools />;
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
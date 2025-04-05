import React from 'react';
import { motion } from 'framer-motion';
import Layout from '../components/Layout';
import Timeline from '../components/Timeline';
import SkillsRadar from '../components/SkillsRadar';
import '../styles/profile.css';

const ProfilePage = () => {
  // 示例数据
  const experiences = [
    {
      title: '高级前端开发工程师',
      company: '万得信息技术股份有限公司',
      date: '2023.12 - 至今',
      description: '在公司中，我主要负责主导核心产品的前端开发工作，熟练运用 React 与 C# 等先进技术栈，确保产品界面具备高响应性和优质的用户体验。同时，我积极投身于交易系统的工具开发，结合 Python 和 LangChain 框架，深度融合 AI 技术，实现了交易流程的自动化与智能化，有效提升了系统的效率和准确性。',
      skills: ['React', 'TypeScript', 'Node.js', 'GraphQL', 'C#', 'Python', 'LangChain'],
    },
    {
      title: '前端开发工程师',
      company: '某互联网公司',
      date: '2020 - 2022',
      description: '参与多个大型Web应用的开发，负责性能优化和组件库开发。',
      skills: ['Vue.js', 'JavaScript', 'Webpack', 'CSS3'],
    },
    // 添加更多经历...
  ];

  const skills = [
    { name: '前端开发', level: 90 },
    { name: '后端开发', level: 70 },
    { name: 'UI设计', level: 40 },
    { name: '项目管理', level: 80 },
    { name: '团队协作', level: 85 },
    { name: '问题解决', level: 88 },
  ];

  return (
    <Layout>
      <div className="profile-container">
        <motion.section
          className="profile-header"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1>王超</h1>
          <p className="profile-title">老前端</p>
          <p className="profile-description">
            热爱技术，专注于Web开发，擅长前端技术栈，对AI应用开发也有深入研究。
            喜欢探索新技术，乐于分享技术经验。
          </p>
        </motion.section>

        <motion.section
          className="skills-section"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <h2>技能概览</h2>
          <SkillsRadar skills={skills} />
        </motion.section>

        <Timeline experiences={experiences} />
      </div>
    </Layout>
  );
};

export default ProfilePage; 
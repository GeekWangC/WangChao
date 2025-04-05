import React from 'react';
import { motion } from 'framer-motion';
import Layout from '../components/Layout';
import Timeline from '../components/Timeline';
import SkillsRadar from '../components/SkillsRadar';
import SocialLinks from '../components/SocialLinks';
import Projects from '../components/Projects';
import Contact from '../components/Contact';
import '../styles/profile.css';

const ProfilePage = () => {
  // Example data - replace with your own
  const profileData = {
    name: '王超',
    title: '老前端',
    description: '热爱技术，专注于Web开发和人工智能应用。致力于创建优雅且实用的解决方案。',
    experiences: [
      {
        period: '2023.12 - 至今',
        title: '高级开发工程师',
        company: '万得信息技术股份有限公司',
        description: '在公司中，我主要负责主导核心产品的前端开发工作，熟练运用 React 与 C# 等先进技术栈，确保产品界面具备高响应性和优质的用户体验。同时，我积极投身于交易系统的工具开发，结合 Python 和 LangChain 框架，深度融合 AI 技术，实现了交易流程的自动化与智能化，有效提升了系统的效率和准确性。',
        skills: ['React', 'Node.js', 'Python', 'LangChain']
      },
      {
        period: '2021 - 2023',
        title: '开发工程师',
        company: '某互联网公司',
        description: '参与多个Web应用开发，负责前端架构设计和实现。',
        skills: ['JavaScript', 'Vue.js', 'Express', 'MongoDB']
      }
    ],
    skills: [
      { name: '前端开发', level: 90 },
      { name: '后端开发', level: 70 },
      { name: '项目管理', level: 80 },
      { name: '团队协作', level: 75 },
      { name: '人工智能', level: 70 },
      { name: '问题解决', level: 88 },
    ],
    socialLinks: [
      {
        name: 'GitHub',
        url: 'https://github.com/geekwangc',
        icon: '🔗'
      },
    //   {
    //     name: 'LinkedIn',
    //     url: 'https://linkedin.com/in/yourusername',
    //     icon: '💼'
    //   },
      {
        name: '博客',
        url: 'https://geekwangc.com',
        icon: '📝'
      }
    ],
    projects: [
      {
        title: '个人博客系统',
        description: '基于Gatsby和Netlify CMS构建的现代化博客系统，支持Markdown编辑和实时预览。',
        image: '/images/blog-project.jpg',
        technologies: ['Gatsby', 'React', 'Netlify CMS', 'GraphQL'],
        github: 'https://github.com/geekwangc/WangChao',
        demo: 'https://geekwangc.com'
      },
      {
        title: 'AI助手应用',
        description: '基于OpenAI API开发的智能助手应用，支持自然语言对话和任务处理。',
        image: '/images/ai-project.jpg',
        technologies: ['Python', 'React', 'OpenAI API', 'FastAPI'],
        github: 'https://github.com/geekwangc/WangChao',
        demo: 'https://ai-assistant.demo'
      }
    ],
    contactInfo: [
      {
        title: '邮箱',
        value: 'geekwangc@163.com',
        icon: '📧',
        link: 'mailto:geekwangc@163.com'
      },
      {
        title: '电话',
        value: '+86 17621335305',
        icon: '📱'
      },
      {
        title: '地址',
        value: '上海市松江区',
        icon: '📍'
      }
    ]
  };

  return (
    <Layout>
      <div className="profile-container">
        <motion.header
          className="profile-header"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1>{profileData.name}</h1>
          <h2>{profileData.title}</h2>
          <p className="profile-description">{profileData.description}</p>
        </motion.header>

        <SocialLinks links={profileData.socialLinks} />
        
        <section className="skills-section">
          <h2>技能概览</h2>
          <SkillsRadar skills={profileData.skills} />
        </section>

        <Timeline experiences={profileData.experiences} />
        
        <Projects projects={profileData.projects} />
        
        <Contact contactInfo={profileData.contactInfo} />
      </div>
    </Layout>
  );
};

export default ProfilePage; 
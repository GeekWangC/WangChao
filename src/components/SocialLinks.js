import React from 'react';
import { motion } from 'framer-motion';
import '../styles/social-links.css';

const SocialLinks = ({ links }) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
      },
    },
  };

  return (
    <motion.div
      className="social-links-container"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <h3>联系我</h3>
      <div className="social-links">
        {links.map((link, index) => (
          <motion.a
            key={index}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="social-link"
            variants={itemVariants}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="social-icon">{link.icon}</span>
            <span className="social-name">{link.name}</span>
          </motion.a>
        ))}
      </div>
    </motion.div>
  );
};

export default SocialLinks; 
import React from 'react';
import { motion } from 'framer-motion';
import '../styles/contact.css';

const Contact = ({ contactInfo }) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.5,
      },
    },
  };

  return (
    <motion.section
      className="contact-container"
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
    >
      <h2>联系方式</h2>
      <div className="contact-info">
        {contactInfo.map((item, index) => (
          <motion.div
            key={index}
            className="contact-item"
            variants={itemVariants}
          >
            <div className="contact-icon">
              {item.icon}
            </div>
            <div className="contact-details">
              <h3>{item.title}</h3>
              <p>{item.value}</p>
              {item.link && (
                <a
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="contact-link"
                >
                  查看详情
                </a>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
};

export default Contact; 
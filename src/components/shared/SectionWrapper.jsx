import React from 'react';
import { motion } from 'framer-motion';

const SectionWrapper = ({ id, children, className = '', alternate = false, border = true }) => {
  return (
    <motion.section
      id={id}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className={`${border ? 'border-t border-slate-800/50' : ''} ${alternate ? 'bg-slate-900/30' : ''} ${className}`}
    >
      <div className="max-w-6xl mx-auto px-6 py-20">
        {children}
      </div>
    </motion.section>
  );
};

export default SectionWrapper;

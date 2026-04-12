import React from 'react';
import SectionWrapper from '../shared/SectionWrapper';
import { stats } from '../../data/stats';

const StatsBar = () => {
  return (
    <SectionWrapper alternate>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
        {stats.map((stat, i) => (
          <div key={i} className="text-center">
            <p className="text-3xl md:text-4xl font-bold text-emerald-400">{stat.number}</p>
            <p className="text-sm text-slate-400 mt-2">{stat.label}</p>
          </div>
        ))}
      </div>
    </SectionWrapper>
  );
};

export default StatsBar;

import React from 'react';
import { ToolItem } from '../../types';
import { ToolBadgeGraphic } from './ToolBadgeGraphic';

interface ToolCardProps {
  tool: ToolItem;
  className?: string;
}

export const ToolCard: React.FC<ToolCardProps> = ({ tool, className = '' }) => {
  return (
    <a
      id={`tool-${tool.id}`}
      href={`?tool=${encodeURIComponent(tool.id)}`}
      target="_blank"
      rel="noopener noreferrer"
      className={`group bg-white rounded-2xl sm:rounded-3xl border border-slate-200/90 p-3.5 sm:p-5 lg:p-6 flex flex-col justify-start text-left transition-all duration-200 cursor-pointer relative hover:-translate-y-1 hover:border-slate-300 hover:shadow-lg block h-full ${className}`}
    >
      {/* Top-Left Visual Image / Badge */}
      <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-13 md:h-13 transition-transform duration-200 group-hover:scale-105 shrink-0">
        <ToolBadgeGraphic tool={tool} />
      </div>

      {/* Tool Title */}
      <h3 className="font-bold text-slate-900 text-xs sm:text-base lg:text-[17px] tracking-tight leading-snug mt-2.5 sm:mt-4 mb-1 sm:mb-1.5 group-hover:text-blue-600 transition-colors line-clamp-1 sm:line-clamp-2">
        {tool.name}
      </h3>

      {/* Tool Description */}
      <p className="text-[10px] sm:text-xs lg:text-[13px] text-slate-500 leading-snug sm:leading-relaxed line-clamp-2 sm:line-clamp-3">
        {tool.shortDesc || tool.description}
      </p>
    </a>
  );
};

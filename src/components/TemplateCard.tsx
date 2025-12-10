import React from 'react';
import { ArrowRight, Star } from 'lucide-react';
import { motion } from 'framer-motion';
interface TemplateCardProps {
  title: string;
  description: string;
  tags: string[];
  stars: number;
  color: string;
}
export function TemplateCard({
  title,
  description,
  tags,
  stars,
  color
}: TemplateCardProps) {
  return <motion.div whileHover={{
    scale: 1.01
  }} className="bg-charcoal-light border border-charcoal-lighter rounded-lg p-5 hover:border-gray-600 transition-all cursor-pointer group">
      <div className="flex justify-between items-start mb-4">
        <div className="w-10 h-10 rounded flex items-center justify-center mb-2" style={{
        backgroundColor: `${color}20`,
        color: color
      } as React.CSSProperties}>
          <div className="w-5 h-5 rounded-full"></div>
        </div>
        <div className="flex items-center gap-1 text-xs text-theme-muted font-mono">
          <Star size={12} className="text-terminal-yellow" fill="currentColor" />
          {stars}
        </div>
      </div>

      <h3 className="font-semibold text-theme-text mb-2 group-hover:text-theme-text">
        {title}
      </h3>
      <p className="text-sm text-theme-muted mb-4 line-clamp-2">{description}</p>

      <div className="flex flex-wrap gap-2 mb-4">
        {tags.map(tag => <span key={tag} className="px-2 py-0.5 rounded text-[10px] font-mono bg-charcoal-lighter text-theme-muted border border-charcoal-dark">
            {tag}
          </span>)}
      </div>

      <div className="flex items-center text-amber text-xs font-semibold opacity-0 group-hover:opacity-100 transition-opacity -translate-x-2 group-hover:translate-x-0 duration-300">
        Use Template <ArrowRight size={12} className="ml-1" />
      </div>
    </motion.div>;
}
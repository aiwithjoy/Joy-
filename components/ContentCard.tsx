import React from 'react';
import { ContentItem } from '../types';
import { MessageSquare, ThumbsUp, Eye, Heart, Zap, ExternalLink, Mail, ArrowUpRight } from 'lucide-react';

interface ContentCardProps {
  item: ContentItem;
  onToggleSave: (id: string) => void;
  onOpenHooks: (item: ContentItem) => void;
}

const ContentCard: React.FC<ContentCardProps> = ({ item, onToggleSave, onOpenHooks }) => {
  const isReddit = item.sourceType === 'reddit';

  return (
    <div className="group relative bg-white rounded-2xl border border-gray-100 p-5 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between h-full">
      {/* Source Badge */}
      <div className="flex justify-between items-start mb-3">
        <div className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
          isReddit ? 'bg-orange-50 text-orange-600' : 'bg-blue-50 text-blue-600'
        }`}>
          {isReddit ? (
            <ArrowUpRight className="w-3 h-3 mr-1" />
          ) : (
            <Mail className="w-3 h-3 mr-1" />
          )}
          {isReddit ? 'Reddit' : 'Newsletter'}
        </div>
        <span className="text-gray-400 text-xs font-medium">{item.publishedDate}</span>
      </div>

      {/* Content */}
      <div className="mb-6">
        <h3 className="text-lg font-bold text-gray-900 mb-2 leading-tight group-hover:text-brand-600 transition-colors">
          {item.title}
        </h3>
        <p className="text-gray-500 text-sm leading-relaxed line-clamp-3">
          {item.excerpt}
        </p>
      </div>

      {/* Footer Actions & Metrics */}
      <div className="mt-auto">
        <div className="flex items-center gap-3 text-gray-400 text-xs mb-4">
          {item.metrics.upvotes !== undefined && (
            <div className="flex items-center gap-1">
              <ThumbsUp className="w-3.5 h-3.5" />
              <span>{item.metrics.upvotes}</span>
            </div>
          )}
          {item.metrics.comments !== undefined && (
            <div className="flex items-center gap-1">
              <MessageSquare className="w-3.5 h-3.5" />
              <span>{item.metrics.comments}</span>
            </div>
          )}
          {item.metrics.reads !== undefined && (
            <div className="flex items-center gap-1">
              <Eye className="w-3.5 h-3.5" />
              <span>{item.metrics.reads}</span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 pt-4 border-t border-gray-50">
          <button
            onClick={(e) => { e.stopPropagation(); onToggleSave(item.id); }}
            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium transition-colors ${
              item.isSaved 
                ? 'bg-red-50 text-red-600 hover:bg-red-100' 
                : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
            }`}
          >
            <Heart className={`w-4 h-4 ${item.isSaved ? 'fill-current' : ''}`} />
            {item.isSaved ? 'Saved' : 'Save'}
          </button>
          
          <button
            onClick={(e) => { e.stopPropagation(); onOpenHooks(item); }}
            className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium bg-brand-50 text-brand-600 hover:bg-brand-100 transition-colors"
          >
            <Zap className="w-4 h-4" />
            Hooks
          </button>
        </div>
      </div>
    </div>
  );
};

export default ContentCard;
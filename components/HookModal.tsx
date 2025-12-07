import React, { useState, useEffect } from 'react';
import { ContentItem, Hook, HookType } from '../types';
import { X, Copy, Check, Wand2, Loader2, Save } from 'lucide-react';

interface HookModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: ContentItem | null;
  onGenerate: (itemId: string) => Promise<Hook[]>;
  onSaveHook: (hook: Hook) => void;
}

const HookModal: React.FC<HookModalProps> = ({ isOpen, onClose, item, onGenerate, onSaveHook }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedHooks, setGeneratedHooks] = useState<Hook[]>([]);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && item) {
      // If item already has hooks, show them, otherwise clear
      if (item.hooks && item.hooks.length > 0) {
        setGeneratedHooks(item.hooks);
      } else {
        setGeneratedHooks([]);
      }
    }
  }, [isOpen, item]);

  const handleGenerate = async () => {
    if (!item) return;
    setIsGenerating(true);
    try {
      const hooks = await onGenerate(item.id);
      setGeneratedHooks(hooks);
    } catch (e) {
      console.error("Failed to generate hooks", e);
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  if (!isOpen || !item) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-white sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <div className="bg-brand-50 p-2 rounded-lg text-brand-600">
              <Wand2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Hook Generator</h2>
              <p className="text-sm text-gray-500">Turn content into marketing gold</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-auto flex flex-col md:flex-row h-full">
          {/* Left Panel: Source Content */}
          <div className="w-full md:w-1/3 bg-gray-50 p-6 border-r border-gray-100">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">Source Content</h3>
            <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
              <span className="inline-block px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-600 mb-2">
                {item.sourceType === 'reddit' ? 'Reddit' : 'Newsletter'}
              </span>
              <h4 className="font-semibold text-gray-900 mb-3">{item.title}</h4>
              <p className="text-sm text-gray-600 leading-relaxed">{item.excerpt}</p>
            </div>
            
            <button
              onClick={handleGenerate}
              disabled={isGenerating}
              className="mt-6 w-full py-3 px-4 bg-brand-600 hover:bg-brand-700 disabled:opacity-70 text-white rounded-xl font-medium shadow-lg shadow-brand-500/20 flex items-center justify-center gap-2 transition-all active:scale-95"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Generating Magic...
                </>
              ) : (
                <>
                  <Wand2 className="w-5 h-5" />
                  Generate Variations
                </>
              )}
            </button>
          </div>

          {/* Right Panel: Generated Hooks */}
          <div className="flex-1 p-6 bg-white">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">
              {generatedHooks.length > 0 ? 'Generated Variations' : 'Ready to Create'}
            </h3>

            {generatedHooks.length === 0 && !isGenerating ? (
              <div className="h-64 flex flex-col items-center justify-center text-gray-400 border-2 border-dashed border-gray-200 rounded-xl">
                <Wand2 className="w-10 h-10 mb-3 opacity-20" />
                <p>Click "Generate" to create hooks</p>
              </div>
            ) : (
              <div className="space-y-4">
                {generatedHooks.map((hook) => (
                  <div key={hook.id} className="group relative bg-white border border-gray-200 hover:border-brand-300 rounded-xl p-5 transition-all shadow-sm hover:shadow-md">
                    <div className="flex justify-between items-start mb-2">
                      <span className={`text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded ${
                        hook.type === 'social' ? 'bg-blue-50 text-blue-600' :
                        hook.type === 'video' ? 'bg-purple-50 text-purple-600' :
                        hook.type === 'email' ? 'bg-yellow-50 text-yellow-600' :
                        'bg-gray-100 text-gray-600'
                      }`}>
                        {hook.type}
                      </span>
                      <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                         <button 
                          onClick={() => copyToClipboard(hook.text, hook.id)}
                          className="p-1.5 text-gray-400 hover:text-brand-600 hover:bg-brand-50 rounded-lg transition-colors"
                          title="Copy to clipboard"
                        >
                          {copiedId === hook.id ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                    <p className="text-gray-800 text-base font-medium leading-relaxed font-sans">{hook.text}</p>
                    <div className="mt-3 flex items-center justify-between text-xs text-gray-400">
                       <span>{hook.characterCount} chars</span>
                       <span className="text-green-600 font-medium">Ready to use</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HookModal;
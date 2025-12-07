import React, { useState, useEffect, useMemo } from 'react';
import Sidebar from './components/Sidebar';
import ContentCard from './components/ContentCard';
import HookModal from './components/HookModal';
import { ContentItem, Hook, FilterOption, SortOption } from './types';
import { INITIAL_CONTENT, MOCK_NEW_SCRAPES, GENERATED_HOOKS_DB } from './services/mockData';
import { triggerN8NScrape, saveToGoHighLevel } from './services/integrationService';
import { Search, Bell, Plus, Download, SlidersHorizontal, ArrowDown, RotateCw, CheckCircle2 } from 'lucide-react';

const App: React.FC = () => {
  // State
  const [items, setItems] = useState<ContentItem[]>(INITIAL_CONTENT);
  const [activeTab, setActiveTab] = useState<'feed' | 'saved'>('feed');
  const [isScraping, setIsScraping] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<FilterOption>('all');
  const [selectedItemForHooks, setSelectedItemForHooks] = useState<ContentItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  // Derived State
  const filteredItems = useMemo(() => {
    let result = items;

    // Tab Filter
    if (activeTab === 'saved') {
      result = result.filter(item => item.isSaved);
    }

    // Search Filter
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(item => 
        item.title.toLowerCase().includes(q) || 
        item.excerpt.toLowerCase().includes(q)
      );
    }

    // Type Filter
    if (filterType !== 'all') {
      result = result.filter(item => item.sourceType === filterType);
    }

    // Sort (Simulated - simply putting newest first for this demo)
    return result.sort((a, b) => new Date(b.publishedDate).getTime() - new Date(a.publishedDate).getTime());
  }, [items, activeTab, searchQuery, filterType]);

  const stats = useMemo(() => ({
    totalProjects: items.length,
    saved: items.filter(i => i.isSaved).length,
    pending: items.filter(i => !i.isSaved).length,
    hooks: items.reduce((acc, curr) => acc + curr.hooks.length, 0)
  }), [items]);

  // Handlers
  const handleScrape = async () => {
    if (isScraping) return;
    setIsScraping(true);
    
    try {
      // Simulate N8N Call
      const result = await triggerN8NScrape();
      
      if (result.status === 'success') {
        // Add mock new items
        setItems(prev => [...MOCK_NEW_SCRAPES, ...prev]);
        showNotification(`Successfully scraped ${result.itemsFound} new items!`);
      }
    } catch (error) {
      console.error("Scrape failed", error);
    } finally {
      setIsScraping(false);
    }
  };

  const handleToggleSave = async (id: string) => {
    setItems(prev => prev.map(item => {
      if (item.id === id) {
        const newSavedState = !item.isSaved;
        // Simulate GHL Sync if saving
        if (newSavedState) {
          saveToGoHighLevel(item);
        }
        return { 
          ...item, 
          isSaved: newSavedState,
          savedAt: newSavedState ? new Date().toISOString() : undefined
        };
      }
      return item;
    }));
  };

  const handleOpenHooks = (item: ContentItem) => {
    setSelectedItemForHooks(item);
    setIsModalOpen(true);
  };

  const handleGenerateHooks = async (itemId: string): Promise<Hook[]> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Get pre-defined hooks from mock DB or empty array
    const hooks = GENERATED_HOOKS_DB[itemId] || [];
    
    // Update local state
    setItems(prev => prev.map(item => {
      if (item.id === itemId) {
        return { ...item, hooks: hooks };
      }
      return item;
    }));
    
    return hooks;
  };

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  return (
    <div className="flex min-h-screen bg-gray-50 font-sans text-gray-900">
      <Sidebar 
        activeTab={activeTab} 
        onTabChange={setActiveTab} 
        savedCount={stats.saved}
      />

      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Header */}
        <header className="h-20 border-b border-gray-100 bg-white px-8 flex items-center justify-between shrink-0">
          <div className="relative w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input 
              type="text" 
              placeholder="Search tasks, content, or ideas..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-gray-50 border border-gray-100 pl-10 pr-4 py-2.5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all"
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
               <span className="text-[10px] text-gray-400 border border-gray-200 rounded px-1.5 py-0.5">⌘F</span>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <button className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-50 relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            <div className="flex items-center gap-3 pl-6 border-l border-gray-100">
              <img 
                src="https://picsum.photos/100/100" 
                alt="User" 
                className="w-10 h-10 rounded-full border-2 border-white shadow-sm"
              />
              <div className="hidden lg:block">
                <p className="text-sm font-semibold text-gray-900">Mike Plumber</p>
                <p className="text-xs text-gray-400">mike@plumbperfect.com</p>
              </div>
            </div>
          </div>
        </header>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-8">
          
          <div className="flex items-end justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {activeTab === 'feed' ? 'Content Dashboard' : 'Saved Content'}
              </h1>
              <p className="text-gray-500">
                {activeTab === 'feed' 
                  ? 'Discover, curate, and transform industry chatter into leads.' 
                  : 'Your curated collection of marketing gold.'}
              </p>
            </div>
            
            <div className="flex gap-3">
              <button 
                onClick={handleScrape}
                disabled={isScraping}
                className="flex items-center gap-2 bg-gray-900 text-white px-5 py-2.5 rounded-xl font-medium hover:bg-gray-800 disabled:opacity-70 transition-all shadow-lg shadow-gray-200"
              >
                {isScraping ? (
                  <>
                    <RotateCw className="w-4 h-4 animate-spin" />
                    Scraping...
                  </>
                ) : (
                  <>
                    <ArrowDown className="w-4 h-4" />
                    Import Data
                  </>
                )}
              </button>
              <button className="flex items-center gap-2 bg-brand-600 text-white px-5 py-2.5 rounded-xl font-medium hover:bg-brand-700 transition-all shadow-lg shadow-brand-500/30">
                <Plus className="w-4 h-4" />
                Add Project
              </button>
            </div>
          </div>

          {/* Stats Row */}
          {activeTab === 'feed' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
              <div className="bg-brand-900 rounded-2xl p-6 text-white relative overflow-hidden">
                <div className="relative z-10">
                  <div className="flex justify-between items-start mb-4">
                    <span className="text-brand-100 font-medium text-sm">Total Scraped</span>
                    <div className="bg-white/10 p-1.5 rounded-lg">
                      <ArrowDown className="w-4 h-4 -rotate-45" />
                    </div>
                  </div>
                  <div className="text-4xl font-bold mb-2">{stats.totalProjects}</div>
                  <div className="inline-flex items-center gap-1 bg-brand-800 px-2 py-0.5 rounded text-xs text-brand-100">
                    <span className="text-brand-300">▲ 5</span> from last scrape
                  </div>
                </div>
                {/* Decoration */}
                <div className="absolute -right-4 -bottom-4 w-32 h-32 bg-brand-500 rounded-full blur-3xl opacity-20"></div>
              </div>

              <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
                 <div className="flex justify-between items-start mb-4">
                    <span className="text-gray-500 font-medium text-sm">Saved Items</span>
                    <div className="bg-gray-50 p-1.5 rounded-lg">
                      <ArrowDown className="w-4 h-4 -rotate-45 text-gray-400" />
                    </div>
                  </div>
                  <div className="text-4xl font-bold text-gray-900 mb-2">{stats.saved}</div>
                  <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs text-gray-500">
                    <span className="text-green-600 font-semibold">▲ 2</span> new this week
                  </div>
              </div>

               <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
                 <div className="flex justify-between items-start mb-4">
                    <span className="text-gray-500 font-medium text-sm">Hooks Created</span>
                    <div className="bg-gray-50 p-1.5 rounded-lg">
                      <ArrowDown className="w-4 h-4 -rotate-45 text-gray-400" />
                    </div>
                  </div>
                  <div className="text-4xl font-bold text-gray-900 mb-2">{stats.hooks}</div>
                   <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs text-gray-500">
                    <span className="text-green-600 font-semibold">▲ 12</span> generated
                  </div>
              </div>

              <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
                 <div className="flex justify-between items-start mb-4">
                    <span className="text-gray-500 font-medium text-sm">Pending Review</span>
                    <div className="bg-gray-50 p-1.5 rounded-lg">
                      <ArrowDown className="w-4 h-4 -rotate-45 text-gray-400" />
                    </div>
                  </div>
                  <div className="text-4xl font-bold text-gray-900 mb-2">{stats.pending}</div>
                  <div className="text-xs text-gray-400">Items waiting for action</div>
              </div>
            </div>
          )}

          {/* Filters Bar */}
          <div className="flex items-center gap-4 mb-6">
            <button 
              onClick={() => setFilterType('all')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${filterType === 'all' ? 'bg-gray-900 text-white' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'}`}
            >
              All Sources
            </button>
            <button 
               onClick={() => setFilterType('reddit')}
               className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${filterType === 'reddit' ? 'bg-gray-900 text-white' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'}`}
            >
              Reddit
            </button>
            <button 
               onClick={() => setFilterType('newsletter')}
               className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${filterType === 'newsletter' ? 'bg-gray-900 text-white' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'}`}
            >
              Newsletters
            </button>

            <div className="ml-auto flex items-center gap-2">
               <span className="text-xs font-semibold text-gray-400 uppercase mr-2">Sort By:</span>
               <select className="bg-transparent text-sm font-medium text-gray-700 focus:outline-none cursor-pointer">
                 <option>Newest First</option>
                 <option>Most Engaging</option>
               </select>
            </div>
          </div>

          {/* Main Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-12">
            {filteredItems.length > 0 ? (
              filteredItems.map((item) => (
                <ContentCard 
                  key={item.id} 
                  item={item} 
                  onToggleSave={handleToggleSave}
                  onOpenHooks={handleOpenHooks}
                />
              ))
            ) : (
              <div className="col-span-full h-64 flex flex-col items-center justify-center text-gray-400">
                <p>No items found.</p>
              </div>
            )}
          </div>

        </div>
      </main>

      {/* Hook Generator Modal */}
      <HookModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        item={selectedItemForHooks}
        onGenerate={handleGenerateHooks}
        onSaveHook={(hook) => console.log('Saved hook', hook)}
      />

      {/* Toast Notification */}
      {notification && (
        <div className="fixed bottom-6 right-6 bg-gray-900 text-white px-6 py-3 rounded-xl shadow-2xl flex items-center gap-3 animate-in slide-in-from-bottom duration-300">
          <CheckCircle2 className="w-5 h-5 text-green-400" />
          <span className="font-medium">{notification}</span>
        </div>
      )}
    </div>
  );
};

export default App;
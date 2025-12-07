import { ContentItem, Hook } from '../types';

export const INITIAL_CONTENT: ContentItem[] = [
  {
    id: '1',
    sourceType: 'reddit',
    title: 'Homeowner put Drano in a completely clogged kitchen sink...',
    excerpt: 'Now the pipes are leaking at the joints. Why do people still buy this stuff? It eats through standard PVC if left too long. Here is a photo of the aftermath.',
    publishedDate: '2 hours ago',
    metrics: { upvotes: 452, comments: 89 },
    tags: ['Plumbing', 'Warning', 'Maintenance'],
    isSaved: false,
    hooks: []
  },
  {
    id: '2',
    sourceType: 'newsletter',
    title: 'The "Shoulder Season" Marketing Playbook',
    excerpt: 'How to keep your HVAC technicians busy during the mild weeks of spring and fall. Includes 3 email templates for tune-up specials.',
    publishedDate: '1 day ago',
    metrics: { reads: 1250 },
    tags: ['HVAC', 'Marketing', 'Business Growth'],
    isSaved: true,
    savedAt: new Date().toISOString(),
    hooks: []
  },
  {
    id: '3',
    sourceType: 'reddit',
    title: 'Customer asks: "Why does my breaker trip when I run the microwave and toaster?"',
    excerpt: 'Classic kitchen circuit overload. Explained the need for a dedicated circuit. They thought I was trying to upsell them. How do you handle skepticism?',
    publishedDate: '4 hours ago',
    metrics: { upvotes: 210, comments: 145 },
    tags: ['Electrical', 'Sales', 'Customer Service'],
    isSaved: false,
    hooks: []
  },
  {
    id: '4',
    sourceType: 'newsletter',
    title: 'Top 5 Landscape Trends for 2025',
    excerpt: 'Drought-tolerant xeriscaping is out-pacing traditional lawns by 40% in suburban areas. Here is how to price these projects profitably.',
    publishedDate: '3 days ago',
    metrics: { reads: 3400 },
    tags: ['Landscaping', 'Trends', 'Pricing'],
    isSaved: false,
    hooks: []
  },
  {
    id: '5',
    sourceType: 'reddit',
    title: 'Found a dead raccoon in the return vent today',
    excerpt: 'Not the worst thing I have found, but definitely top 10. Customer complained of a "sweet" smell. Always wear your PPE, guys.',
    publishedDate: '6 hours ago',
    metrics: { upvotes: 1200, comments: 302 },
    tags: ['HVAC', 'Horror Story', 'Safety'],
    isSaved: false,
    hooks: []
  }
];

export const MOCK_NEW_SCRAPES: ContentItem[] = [
  {
    id: 'new_1',
    sourceType: 'reddit',
    title: 'Is a tankless water heater actually worth it?',
    excerpt: 'Running the numbers on ROI for a tankless system in a 4-person household. The gas savings are real, but the install cost is the barrier.',
    publishedDate: 'Just now',
    metrics: { upvotes: 12, comments: 5 },
    tags: ['Plumbing', 'Product Review'],
    isSaved: false,
    hooks: []
  },
  {
    id: 'new_2',
    sourceType: 'newsletter',
    title: 'Google LSA prices are skyrocketing',
    excerpt: 'Local Service Ads for plumbers have gone up 30% in Q3. Here are alternative lead sources to diversify your marketing spend.',
    publishedDate: 'Just now',
    metrics: { reads: 45 },
    tags: ['Marketing', 'Ads'],
    isSaved: false,
    hooks: []
  }
];

export const GENERATED_HOOKS_DB: Record<string, Hook[]> = {
  '1': [
    { id: 'h1', contentId: '1', type: 'social', text: '🛑 STOP! Put the Drano down. You might be dissolving your pipes along with the clog. Here is why...', characterCount: 108, createdAt: new Date().toISOString() },
    { id: 'h2', contentId: '1', type: 'video', text: 'This $10 bottle of chemicals just caused $2,000 in damage. Let me show you what chemical drain cleaners actually do to your PVC pipes.', characterCount: 135, createdAt: new Date().toISOString() },
  ],
  '2': [
    { id: 'h3', contentId: '2', type: 'email', text: 'Subject: Is your business ready for the "Slow Season"?', characterCount: 52, createdAt: new Date().toISOString() },
    { id: 'h4', contentId: '2', type: 'ad', text: 'Keep your techs busy this spring. Download our free Shoulder Season Playbook.', characterCount: 78, createdAt: new Date().toISOString() },
  ],
  'new_1': [
    { id: 'h5', contentId: 'new_1', type: 'social', text: 'Thinking about going tankless? 🚿 Here is the real math on whether it saves you money.', characterCount: 86, createdAt: new Date().toISOString() },
  ]
};
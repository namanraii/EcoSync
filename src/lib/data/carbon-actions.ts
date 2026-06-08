/**
 * Curated Carbon Reduction Actions Database
 * Each action includes quantified impact, difficulty, and implementation steps
 */

import { CarbonAction } from '@/types';

export const CARBON_ACTIONS: CarbonAction[] = [
  // ==================== TRANSPORT ACTIONS ====================
  {
    id: 'action-bike-commute',
    title: 'Switch to Bike for Short Commutes',
    description:
      'Replace car trips under 5km with cycling. Improves health while eliminating transport emissions.',
    category: 'transport',
    difficulty: 'easy',
    impactScore: 450,
    estimatedCost: 'low',
    timeToImplement: '1 week',
    prerequisites: ['Access to bicycle', 'Safe cycling route'],
    steps: [
      'Map your regular short trips (< 5km)',
      'Test cycling routes on weekends',
      'Invest in basic cycling gear (helmet, lights, lock)',
      'Start with 2 days per week',
      'Gradually increase to daily short trips',
    ],
    resources: [
      {
        title: 'Cycling Route Planner',
        url: 'https://www.google.com/maps',
        type: 'tool',
      },
      {
        title: 'Urban Cycling Safety Guide',
        url: '#',
        type: 'article',
      },
    ],
    isCommitted: false,
    progress: 0,
  },
  {
    id: 'action-public-transit',
    title: 'Use Public Transit for Work Commute',
    description:
      'Switch from private vehicle to bus, train, or subway for daily commuting.',
    category: 'transport',
    difficulty: 'medium',
    impactScore: 1200,
    estimatedCost: 'low',
    timeToImplement: '2 weeks',
    prerequisites: ['Public transit access', 'Flexible schedule'],
    steps: [
      'Research transit routes to your workplace',
      'Calculate time and cost savings',
      'Purchase monthly transit pass',
      'Prepare backup plan for delays',
      'Track your carbon savings weekly',
    ],
    resources: [
      {
        title: 'Transit App',
        url: '#',
        type: 'tool',
      },
    ],
    isCommitted: false,
    progress: 0,
  },
  {
    id: 'action-flight-reduction',
    title: 'Reduce Business Flights by 50%',
    description:
      'Replace half of your flights with video conferencing or train travel for distances under 800km.',
    category: 'transport',
    difficulty: 'hard',
    impactScore: 2500,
    estimatedCost: 'free',
    timeToImplement: '1 month',
    prerequisites: ['Employer support', 'Video conferencing setup'],
    steps: [
      'Audit your flight history for the past year',
      'Identify flights replaceable with virtual meetings',
      'Set up professional video conferencing',
      'Propose virtual-first policy to employer',
      'For essential travel, choose trains for < 800km',
    ],
    resources: [
      {
        title: 'Virtual Meeting Best Practices',
        url: '#',
        type: 'article',
      },
    ],
    isCommitted: false,
    progress: 0,
  },
  {
    id: 'action-carpool',
    title: 'Start a Carpool Network',
    description:
      'Share rides with colleagues or neighbors for regular commutes.',
    category: 'transport',
    difficulty: 'easy',
    impactScore: 600,
    estimatedCost: 'free',
    timeToImplement: '1 week',
    prerequisites: ['Willing colleagues/neighbors', 'Similar schedules'],
    steps: [
      'Identify potential carpool partners',
      'Create shared schedule spreadsheet',
      'Test run for one week',
      'Establish cost-sharing agreement',
      'Set communication protocol for changes',
    ],
    resources: [
      {
        title: 'Carpool Calculator',
        url: '#',
        type: 'calculator',
      },
    ],
    isCommitted: false,
    progress: 0,
  },
  {
    id: 'action-ev-transition',
    title: 'Plan Transition to Electric Vehicle',
    description:
      'Research and budget for switching your primary vehicle to electric within 2 years.',
    category: 'transport',
    difficulty: 'hard',
    impactScore: 3500,
    estimatedCost: 'high',
    timeToImplement: '1-2 years',
    prerequisites: ['Parking with charging access', 'Budget planning'],
    steps: [
      'Research EV models in your budget range',
      'Calculate total cost of ownership vs current vehicle',
      'Check local charging infrastructure',
      'Explore government incentives and rebates',
      'Set savings target and timeline',
    ],
    resources: [
      {
        title: 'EV Comparison Tool',
        url: '#',
        type: 'tool',
      },
      {
        title: 'EV Incentive Database',
        url: '#',
        type: 'article',
      },
    ],
    isCommitted: false,
    progress: 0,
  },

  // ==================== DIET ACTIONS ====================
  {
    id: 'action-meatless-monday',
    title: 'Adopt Meatless Mondays',
    description:
      'Eliminate meat consumption one day per week. A simple entry point to plant-based eating.',
    category: 'diet',
    difficulty: 'easy',
    impactScore: 140,
    estimatedCost: 'free',
    timeToImplement: '1 week',
    prerequisites: ['Access to plant-based recipes'],
    steps: [
      'Plan 4 meatless Monday meals',
      'Stock pantry with plant-based proteins',
      'Prepare meals in advance on Sunday',
      'Share commitment with family/household',
      'Document favorite recipes for rotation',
    ],
    resources: [
      {
        title: 'Plant-Based Recipe Collection',
        url: '#',
        type: 'article',
      },
    ],
    isCommitted: false,
    progress: 0,
  },
  {
    id: 'action-local-food',
    title: 'Source 50% Food Locally',
    description:
      'Buy from farmers markets, local producers, and seasonal foods to cut transportation emissions.',
    category: 'diet',
    difficulty: 'medium',
    impactScore: 200,
    estimatedCost: 'medium',
    timeToImplement: '1 month',
    prerequisites: ['Local market access', 'Seasonal awareness'],
    steps: [
      'Identify local farmers markets and producers',
      'Learn seasonal produce calendar for your region',
      'Start with 2-3 local items per week',
      'Join community-supported agriculture (CSA)',
      'Preserve seasonal foods for off-season',
    ],
    resources: [
      {
        title: 'Local Food Directory',
        url: '#',
        type: 'tool',
      },
    ],
    isCommitted: false,
    progress: 0,
  },
  {
    id: 'action-reduce-food-waste',
    title: 'Eliminate Household Food Waste',
    description:
      'Implement meal planning, proper storage, and composting to reduce waste by 90%.',
    category: 'diet',
    difficulty: 'medium',
    impactScore: 350,
    estimatedCost: 'low',
    timeToImplement: '2 weeks',
    prerequisites: ['Composting option', 'Storage containers'],
    steps: [
      'Audit current food waste for one week',
      'Create weekly meal plan template',
      'Organize fridge with FIFO system',
      'Start composting organic waste',
      'Use "use first" bin for near-expiry items',
    ],
    resources: [
      {
        title: 'Meal Planning Template',
        url: '#',
        type: 'tool',
      },
    ],
    isCommitted: false,
    progress: 0,
  },
  {
    id: 'action-plant-based-transition',
    title: 'Transition to Plant-Based Diet',
    description:
      'Gradually replace animal products with plant-based alternatives over 3 months.',
    category: 'diet',
    difficulty: 'hard',
    impactScore: 1200,
    estimatedCost: 'medium',
    timeToImplement: '3 months',
    prerequisites: ['Nutrition knowledge', 'Cooking skills'],
    steps: [
      'Week 1-2: Replace dairy with plant alternatives',
      'Week 3-4: Eliminate red meat',
      'Week 5-8: Reduce poultry and fish to 2x/week',
      'Week 9-12: Fully plant-based with B12 supplement',
      'Consult nutritionist for balanced transition',
    ],
    resources: [
      {
        title: 'Plant-Based Nutrition Guide',
        url: '#',
        type: 'article',
      },
      {
        title: 'B12 Supplement Guide',
        url: '#',
        type: 'article',
      },
    ],
    isCommitted: false,
    progress: 0,
  },

  // ==================== ENERGY ACTIONS ====================
  {
    id: 'action-led-lighting',
    title: 'Switch to LED Lighting',
    description:
      'Replace all incandescent and CFL bulbs with LED alternatives.',
    category: 'energy',
    difficulty: 'easy',
    impactScore: 180,
    estimatedCost: 'medium',
    timeToImplement: '1 week',
    prerequisites: ['Budget for bulb replacement'],
    steps: [
      'Inventory all light fixtures and bulb types',
      'Calculate energy savings for each replacement',
      'Purchase LED bulbs (warm white for living areas)',
      'Replace bulbs room by room',
      'Properly dispose of CFLs (contain mercury)',
    ],
    resources: [
      {
        title: 'LED Savings Calculator',
        url: '#',
        type: 'calculator',
      },
    ],
    isCommitted: false,
    progress: 0,
  },
  {
    id: 'action-smart-thermostat',
    title: 'Install Smart Thermostat',
    description:
      'Optimize heating and cooling with programmable schedules and occupancy detection.',
    category: 'energy',
    difficulty: 'medium',
    impactScore: 450,
    estimatedCost: 'medium',
    timeToImplement: '1 week',
    prerequisites: ['HVAC compatibility', 'WiFi access'],
    steps: [
      'Check HVAC system compatibility',
      'Research smart thermostat models',
      'Professional installation or DIY if confident',
      'Program schedule based on occupancy',
      'Monitor energy bills for 3 months',
    ],
    resources: [
      {
        title: 'Thermostat Compatibility Checker',
        url: '#',
        type: 'tool',
      },
    ],
    isCommitted: false,
    progress: 0,
  },
  {
    id: 'action-renewable-energy',
    title: 'Switch to Renewable Energy Provider',
    description:
      'Choose a 100% renewable energy supplier or install rooftop solar panels.',
    category: 'energy',
    difficulty: 'medium',
    impactScore: 2000,
    estimatedCost: 'high',
    timeToImplement: '1-3 months',
    prerequisites: ['Home ownership or landlord approval'],
    steps: [
      'Research renewable energy providers in your area',
      'Compare green energy tariffs',
      'For solar: Get roof assessment and quotes',
      'Check government incentives and financing',
      'Monitor generation and grid export',
    ],
    resources: [
      {
        title: 'Solar Calculator',
        url: '#',
        type: 'calculator',
      },
    ],
    isCommitted: false,
    progress: 0,
  },
  {
    id: 'action-phantom-load',
    title: 'Eliminate Phantom Power Loads',
    description:
      'Unplug devices or use smart power strips to eliminate standby power consumption.',
    category: 'energy',
    difficulty: 'easy',
    impactScore: 120,
    estimatedCost: 'low',
    timeToImplement: '1 day',
    prerequisites: ['Smart power strips (optional)'],
    steps: [
      'Identify devices with standby lights (TV, computer, chargers)',
      'Group devices on smart power strips',
      'Set timers for non-essential devices',
      'Unplug chargers when not in use',
      'Use outlet testers to find hidden loads',
    ],
    resources: [
      {
        title: 'Phantom Load Detector',
        url: '#',
        type: 'tool',
      },
    ],
    isCommitted: false,
    progress: 0,
  },
  {
    id: 'action-home-insulation',
    title: 'Improve Home Insulation',
    description:
      'Seal air leaks, add insulation to attic and walls, and upgrade windows.',
    category: 'energy',
    difficulty: 'hard',
    impactScore: 800,
    estimatedCost: 'high',
    timeToImplement: '1-3 months',
    prerequisites: ['Home ownership', 'Professional assessment'],
    steps: [
      'Get professional energy audit',
      'Seal air leaks around doors and windows',
      'Add attic insulation to R-38 minimum',
      'Consider wall insulation if feasible',
      'Upgrade to double-pane windows if single-pane',
    ],
    resources: [
      {
        title: 'Energy Audit Guide',
        url: '#',
        type: 'article',
      },
    ],
    isCommitted: false,
    progress: 0,
  },

  // ==================== DIGITAL ACTIONS ====================
  {
    id: 'action-digital-cleanup',
    title: 'Digital Cleanup and Cloud Optimization',
    description:
      'Delete unused files, unsubscribe from unnecessary services, and optimize cloud storage.',
    category: 'digital',
    difficulty: 'easy',
    impactScore: 45,
    estimatedCost: 'free',
    timeToImplement: '1 week',
    prerequisites: ['Cloud storage audit access'],
    steps: [
      'Audit all cloud storage accounts',
      'Delete duplicate and unused files',
      'Unsubscribe from unused SaaS services',
      'Compress large media files',
      'Set up auto-delete for temporary files',
    ],
    resources: [
      {
        title: 'Duplicate File Finder',
        url: '#',
        type: 'tool',
      },
    ],
    isCommitted: false,
    progress: 0,
  },
  {
    id: 'action-streaming-quality',
    title: 'Reduce Streaming Quality When Not Needed',
    description:
      'Lower video resolution for background viewing and audio-only content.',
    category: 'digital',
    difficulty: 'easy',
    impactScore: 85,
    estimatedCost: 'free',
    timeToImplement: '1 day',
    prerequisites: ['Streaming service settings access'],
    steps: [
      'Set default streaming quality to 720p or lower',
      'Use audio-only mode for music and podcasts',
      'Download content on WiFi instead of streaming repeatedly',
      'Close unused browser tabs with auto-playing video',
      'Use "data saver" mode on mobile apps',
    ],
    resources: [
      {
        title: 'Streaming Carbon Impact Guide',
        url: '#',
        type: 'article',
      },
    ],
    isCommitted: false,
    progress: 0,
  },
  {
    id: 'action-device-longevity',
    title: 'Extend Device Lifespan to 5+ Years',
    description:
      'Maintain and repair devices instead of replacing them every 2-3 years.',
    category: 'digital',
    difficulty: 'medium',
    impactScore: 300,
    estimatedCost: 'low',
    timeToImplement: 'Ongoing',
    prerequisites: ['Repair services access', 'Technical skills (basic)'],
    steps: [
      'Use protective cases and screen protectors',
      'Keep software updated for security and performance',
      'Replace batteries instead of entire devices',
      'Learn basic repair skills (iFixit guides)',
      'Buy refurbished when replacement is necessary',
    ],
    resources: [
      {
        title: 'iFixit Repair Guides',
        url: 'https://www.ifixit.com',
        type: 'tool',
      },
    ],
    isCommitted: false,
    progress: 0,
  },

  // ==================== CONSUMPTION ACTIONS ====================
  {
    id: 'action-buy-less',
    title: 'Implement 30-Day Purchase Rule',
    description:
      'Wait 30 days before any non-essential purchase to reduce impulse buying.',
    category: 'consumption',
    difficulty: 'easy',
    impactScore: 250,
    estimatedCost: 'free',
    timeToImplement: '1 week',
    prerequisites: ['Self-discipline', 'Wishlist system'],
    steps: [
      'Create "want" list for all non-essential items',
      'Set 30-day timer for each item',
      'After 30 days, evaluate if still needed',
      'Research second-hand or sustainable alternatives',
      'Track money saved and carbon avoided',
    ],
    resources: [
      {
        title: 'Minimalist Living Guide',
        url: '#',
        type: 'article',
      },
    ],
    isCommitted: false,
    progress: 0,
  },
  {
    id: 'action-secondhand-first',
    title: 'Buy Secondhand Before New',
    description:
      'Prioritize thrift stores, refurbished electronics, and resale platforms.',
    category: 'consumption',
    difficulty: 'easy',
    impactScore: 400,
    estimatedCost: 'low',
    timeToImplement: '2 weeks',
    prerequisites: ['Local thrift stores or online platforms'],
    steps: [
      'Identify reliable secondhand sources in your area',
      'Set price alerts for needed items on resale apps',
      'Inspect quality standards for secondhand goods',
      'Sell your unused items to fund purchases',
      'Calculate carbon savings per secondhand purchase',
    ],
    resources: [
      {
        title: 'Secondhand Marketplace Guide',
        url: '#',
        type: 'article',
      },
    ],
    isCommitted: false,
    progress: 0,
  },
  {
    id: 'action-repair-culture',
    title: 'Repair Instead of Replace',
    description:
      'Fix clothing, electronics, and furniture before discarding them.',
    category: 'consumption',
    difficulty: 'medium',
    impactScore: 180,
    estimatedCost: 'low',
    timeToImplement: 'Ongoing',
    prerequisites: ['Basic repair tools', 'Local repair shops'],
    steps: [
      'Build a basic repair toolkit',
      'Learn sewing for clothing repairs',
      'Find reliable local repair services',
      'Join repair cafe community events',
      'Document repairs to build skills',
    ],
    resources: [
      {
        title: 'Repair Cafe Locator',
        url: 'https://repaircafe.org',
        type: 'tool',
      },
    ],
    isCommitted: false,
    progress: 0,
  },
  {
    id: 'action-zero-waste-kit',
    title: 'Build a Zero-Waste Shopping Kit',
    description:
      'Eliminate single-use packaging with reusable bags, containers, and bottles.',
    category: 'consumption',
    difficulty: 'easy',
    impactScore: 150,
    estimatedCost: 'low',
    timeToImplement: '1 week',
    prerequisites: ['Reusable containers investment'],
    steps: [
      'Assemble reusable shopping bag set',
      'Buy glass/metal food containers',
      'Get a reusable water bottle and coffee cup',
      'Find bulk stores in your area',
      'Refuse single-use items at checkout',
    ],
    resources: [
      {
        title: 'Zero Waste Starter Kit Guide',
        url: '#',
        type: 'article',
      },
    ],
    isCommitted: false,
    progress: 0,
  },
];

/**
 * Get actions by category
 */
export function getActionsByCategory(category: string): CarbonAction[] {
  return CARBON_ACTIONS.filter((action) => action.category === category);
}

/**
 * Get action by ID
 */
export function getActionById(id: string): CarbonAction | undefined {
  return CARBON_ACTIONS.find((action) => action.id === id);
}

/**
 * Get recommended actions based on user's highest emission categories
 */
export function getRecommendedActions(
  categoryBreakdown: Record<string, number>,
  limit: number = 5
): CarbonAction[] {
  const sortedCategories = Object.entries(categoryBreakdown)
    .sort(([, a], [, b]) => b - a)
    .map(([cat]) => cat);

  const recommendations: CarbonAction[] = [];

  for (const category of sortedCategories) {
    const categoryActions = getActionsByCategory(category)
      .filter((a) => !a.isCommitted)
      .sort((a, b) => b.impactScore - a.impactScore);

    recommendations.push(...categoryActions);
    if (recommendations.length >= limit) break;
  }

  return recommendations.slice(0, limit);
}

/**
 * Calculate total potential savings from all uncommitted actions
 */
export function calculateTotalPotentialSavings(actions: CarbonAction[]): number {
  return actions
    .filter((a) => !a.isCommitted)
    .reduce((sum, action) => sum + action.impactScore, 0);
}

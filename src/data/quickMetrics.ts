export const quickMetrics = [
  { label: 'Active wishlists', value: 12, helper: '+3 this week', variant: 'wishlist' },
  { label: 'Gifts in progress', value: 5, helper: '2 need attention', variant: 'inprogress' },
  { label: 'Average sentiment', value: '92%', helper: 'Based on 28 responses', variant: 'sentiment' },
];

export type QuickMetric = typeof quickMetrics[number];

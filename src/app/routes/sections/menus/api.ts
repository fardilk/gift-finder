import api from 'src/lib/api';

export type MenuItem = {
  id: string;
  key?: string; // Semantic key like "organizations", "dashboard", etc.
  name?: string;
  title?: string;
  url?: string;
  to?: string;
  icon?: string;
  order?: number;
  parentId?: string | null;
  children?: MenuItem[];
};

export type MenuAccessResponse = {
  menus: MenuItem[];
};

/**
 * Fetch menus by access ID
 * GET /menu/access/:id/menus
 */
export async function fetchMenusByAccessId(accessId: string): Promise<MenuItem[]> {
  const res = await api.get<MenuAccessResponse>(`/menu/access/${accessId}/menus`);
  // eslint-disable-next-line no-console
  console.log(`GET /menu/access/${accessId}/menus response:`, res.data);
  
  // Handle both direct array response and object with menus property
  if (Array.isArray(res.data)) {
    return res.data;
  }
  return res.data.menus || [];
}

/**
 * Fetch a specific menu by key with its children
 * GET /menu/access/:accessId/menus/:menuKey
 * 
 * Example: GET /menu/access/ac01/menus/organizations
 * Returns the organizations menu with all 8 children:
 * {
 *   "id": "uuid-org-menu",
 *   "key": "organizations",
 *   "title": "Organizations",
 *   "children": [
 *     { "id":"uuid-ov", "key":"organizations-overview", "url":"/organizations/overview", "title":"Overview" },
 *     ...
 *   ]
 * }
 */
export async function fetchMenuByKey(accessId: string, menuKey: string): Promise<MenuItem | null> {
  try {
    const res = await api.get<MenuItem>(`/menu/access/${accessId}/menus/${menuKey}`);
    // eslint-disable-next-line no-console
    console.log(`GET /menu/access/${accessId}/menus/${menuKey} response:`, res.data);
    return res.data || null;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(`Failed to fetch menu ${menuKey}:`, error);
    return null;
  }
}

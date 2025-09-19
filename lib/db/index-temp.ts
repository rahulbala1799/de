// Temporary database connection for initial deployment
// This will be replaced with actual database connection later

export const db = {
  // Mock database object for initial deployment
  select: () => ({ from: () => ({ limit: () => Promise.resolve([]) }) }),
  insert: () => ({ values: () => Promise.resolve() }),
  update: () => ({ set: () => ({ where: () => Promise.resolve() }) }),
  delete: () => ({ where: () => Promise.resolve() }),
};

// Mock schema exports
export const restaurants = { id: 'restaurant-1' };
export const users = { id: 'user-1' };
export const categories = { id: 'category-1' };
export const menuItems = { id: 'item-1' };
export const tables = { id: 'table-1' };
export const orders = { id: 'order-1' };
export const orderItems = { id: 'order-item-1' };

/**
 * Auth feature logic module for client-side authentication management.
 */

export const authFeature = {
  getCurrentSession: () => {
    return { authenticated: false, user: null };
  }
};

export const ProjectConstants = {
  stripe: {
    publishableKey: 'pk_test_51QF03TBXShxs23BwfYpSgskzYBp36C9gndpU2hEmSXebIS5ltx1IiC4JiV2GwYqzVuLNHKNvyn7RYKp1n8Z7aHMV00VasD4ea0',
    priceId: 'price_1QF08DBXShxs23Bw8nUstoAr'
  },
  backend: {
    ADMIN_USER_IDS: [
      '671d191ddff639d00bb44512',  // Main admin
      '6725273d2ff659e9671b2c5d',  // Secondary admin
    ] 
  }
} 

// Helper function to check if a user is an admin
export const isAdmin = (userId: string): boolean => {
  return ProjectConstants.backend.ADMIN_USER_IDS.includes(userId as any);
};
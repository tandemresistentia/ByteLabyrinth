export const ProjectConstants = {
  stripe: {
    testPublishableKey: 'pk_test_51QF03TBXShxs23BwfYpSgskzYBp36C9gndpU2hEmSXebIS5ltx1IiC4JiV2GwYqzVuLNHKNvyn7RYKp1n8Z7aHMV00VasD4ea0',
    livePublishableKey: 'pk_live_51QF03TBXShxs23BwmJgDjGq7QdB8sv1nE22LAXDFjp3OdhusV4CNk0nxBpe9LoPU9zST6O2VVQIH6TrnNVyGlZ1W00pwGzMHvX',
    priceId1: 'price_1QH7OkBXShxs23Bw3X9lxKPx',
    priceId2: 'price_1QH7OzBXShxs23BwOsC5VcgV',
    priceId3: 'price_1QH7PBBXShxs23BwLgXWcc6R',
  },
  backend: {
    ADMIN_USER_IDS: [
      '671d191ddff639d00bb44512',  // Main admin
      '6725273d2ff659e9671b2c5d',  // Secondary admin
    ] 
  },
  PRICE : {
    PRICE1 : 799,
    PRICE2 : 1499,
    PRICE3 : 2999
}
} 

// Helper function to check if a user is an admin
export const isAdmin = (userId: string): boolean => {
  return ProjectConstants.backend.ADMIN_USER_IDS.includes(userId as any);
};
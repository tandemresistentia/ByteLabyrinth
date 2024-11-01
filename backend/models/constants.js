// constants.js

const PROJECT_STATUSES = [
  'Pending',
  'Approved',
  'In Progress',
  'Under Review',
  'Completed',
  'On Hold'
];

const ADMIN_USER_IDS = [
  '671d191ddff639d00bb44512',  // Main admin
  '6725273d2ff659e9671b2c5d',  // Secondary admin
];

const isAdmin = (userId) => {
  return ADMIN_USER_IDS.includes(userId);
};

module.exports = {
  PROJECT_STATUSES,
  ADMIN_USER_IDS,
  isAdmin
};
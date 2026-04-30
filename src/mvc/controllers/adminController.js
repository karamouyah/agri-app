// File responsibility: Acts as the controller layer between React views and API/model service functions.
// Used by the React frontend or build tooling as part of the full-stack agriculture app.

export {
  getNationalStats,
  getUsers,
  getPendingUsers,
  approveUser,
  rejectUser,
  requestInfo,
  getAdminOrders,
  getCategories,
  addCategory,
  updateCategory,
  deleteCategory,
  getProducts,
  addProduct,
  updateProduct,
  deleteProduct,
  generateReport,
} from '../models/adminModel'

// File responsibility: Re-exports the data-access functions used by the MVC controllers.
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
} from '../../services/adminApi'

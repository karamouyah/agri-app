// File responsibility: Re-exports the data-access functions used by the MVC controllers.
// Used by the React frontend or build tooling as part of the full-stack agriculture app.

export {
  getFarmProfile,
  updateFarmProfile,
  getControlledProducts,
  getProducts,
  addProduct,
  updateProduct,
  deleteProduct,
  getOrders,
  acceptOrder,
  declineOrder,
  notifyTransporters,
  getRevenueData,
} from '../../services/mockApi'

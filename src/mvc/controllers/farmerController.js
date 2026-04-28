// File responsibility: Acts as the controller layer between React views and API/model service functions.
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
  getRevenueData,
} from '../models/farmerModel'

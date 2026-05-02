// File responsibility: Re-exports the data-access functions used by the MVC controllers.
// Used by the React frontend or build tooling as part of the full-stack agriculture app.

export {
  buyerFilterOptions,
  getBuyerFilterOptions,
  searchProducts,
  getProductById,
  getRelatedProducts,
  getCart,
  addToCart,
  updateCartQuantity,
  removeCartItem,
  clearCart,
  calculateCartTotals,
  getShippingProfile,
  getBuyerProfile,
  updateBuyerProfile,
  placeOrder,
  getBuyerOrders,
  getBuyerOrderById,
  getInvoices,
  getInvoiceById,
} from '../../services/buyerApi'

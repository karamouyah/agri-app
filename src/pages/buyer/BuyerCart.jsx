import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  calculateCartTotals,
  getCart,
  removeCartItem,
  updateCartQuantity,
} from '../../mvc/controllers/buyerController'

export default function BuyerCart() {
  const navigate = useNavigate()
  const [items, setItems] = useState([])

  const load = async () => {
    const cart = await getCart()
    setItems(cart)
  }

  useEffect(() => {
    load()
  }, [])

  const totals = calculateCartTotals(items)

  const handleQuantityChange = async (productId, quantity) => {
    await updateCartQuantity(productId, quantity)
    await load()
  }

  const handleRemove = async (productId) => {
    await removeCartItem(productId)
    await load()
  }

  return (
    <section className="space-y-4">
      <div className="rounded-lg border border-slate-200 bg-white p-5">
        <h2 className="text-xl font-semibold text-slate-800">Cart</h2>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1fr_320px]">
        <div className="rounded-lg border border-slate-200 bg-white p-4">
          {items.length === 0 ? (
            <div className="space-y-2 text-sm text-slate-600">
              <p>Your cart is empty.</p>
              <Link to="/buyer/search" className="font-medium text-emerald-700 hover:underline">
                Browse products
              </Link>
            </div>
          ) : (
            <table className="min-w-full text-left text-sm">
              <thead className="bg-slate-100 text-slate-600">
                <tr>
                  <th className="px-3 py-2">Product</th>
                  <th className="px-3 py-2">Quantity</th>
                  <th className="px-3 py-2">Unit Price</th>
                  <th className="px-3 py-2">Total</th>
                  <th className="px-3 py-2">Action</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item.productId} className="border-b border-slate-100">
                    <td className="px-3 py-2">{item.name}</td>
                    <td className="px-3 py-2">
                      <input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(event) => handleQuantityChange(item.productId, event.target.value)}
                        className="w-20 rounded-md border border-slate-300 px-2 py-1"
                      />
                    </td>
                    <td className="px-3 py-2">{item.unitPrice} MAD</td>
                    <td className="px-3 py-2">{item.unitPrice * item.quantity} MAD</td>
                    <td className="px-3 py-2">
                      <button
                        type="button"
                        onClick={() => handleRemove(item.productId)}
                        className="rounded-md border border-red-300 px-2 py-1 text-xs text-red-700 hover:bg-red-50"
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <aside className="h-fit rounded-lg border border-slate-200 bg-white p-4 text-sm">
          <h3 className="text-base font-semibold text-slate-800">Summary</h3>
          <div className="mt-3 space-y-2 text-slate-700">
            <p className="flex items-center justify-between">
              <span>Subtotal</span>
              <span>{totals.subtotal} MAD</span>
            </p>
            <p className="flex items-center justify-between">
              <span>Taxes (10%)</span>
              <span>{totals.taxes} MAD</span>
            </p>
            <p className="flex items-center justify-between border-t border-slate-200 pt-2 font-semibold">
              <span>Total</span>
              <span>{totals.total} MAD</span>
            </p>
          </div>

          <button
            type="button"
            disabled={items.length === 0}
            onClick={() => navigate('/buyer/checkout')}
            className="mt-4 w-full rounded-md bg-emerald-600 px-4 py-2 font-medium text-white hover:bg-emerald-700 disabled:opacity-60"
          >
            Proceed to Checkout
          </button>
        </aside>
      </div>
    </section>
  )
}

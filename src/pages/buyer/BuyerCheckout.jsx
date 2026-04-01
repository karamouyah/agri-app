import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  calculateCartTotals,
  getCart,
  getShippingProfile,
  placeOrder,
} from '../../mvc/controllers/buyerController'

const initialAddress = {
  fullName: '',
  phone: '',
  address: '',
  city: '',
  postalCode: '',
}

export default function BuyerCheckout() {
  const navigate = useNavigate()
  const [cartItems, setCartItems] = useState([])
  const [address, setAddress] = useState(initialAddress)
  const [paymentMethod, setPaymentMethod] = useState('cash_on_delivery')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const load = async () => {
      const [cart, profile] = await Promise.all([getCart(), getShippingProfile()])
      setCartItems(cart)
      setAddress(profile)
    }

    load()
  }, [])

  const totals = calculateCartTotals(cartItems)

  const handleAddressChange = (event) => {
    const { name, value } = event.target
    setAddress((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')

    if (cartItems.length === 0) {
      navigate('/buyer/cart')
      return
    }

    setLoading(true)

    try {
      const order = await placeOrder(cartItems, address, paymentMethod)
      navigate(`/buyer/confirmation/${order.id}`, { replace: true })
    } catch (submitError) {
      setError(submitError.message || 'Failed to place order. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="space-y-4">
      <div className="rounded-lg border border-slate-200 bg-white p-5">
        <h2 className="text-xl font-semibold text-slate-800">Place Order</h2>
      </div>

      <form onSubmit={handleSubmit} className="grid gap-4 lg:grid-cols-[1fr_320px]">
        <div className="space-y-4 rounded-lg border border-slate-200 bg-white p-5">
          <h3 className="text-base font-semibold text-slate-800">Shipping Address</h3>
          <div className="grid gap-3 md:grid-cols-2">
            <input
              name="fullName"
              required
              value={address.fullName}
              onChange={handleAddressChange}
              placeholder="Full name"
              className="rounded-md border border-slate-300 px-3 py-2"
            />
            <input
              name="phone"
              required
              value={address.phone}
              onChange={handleAddressChange}
              placeholder="Phone"
              className="rounded-md border border-slate-300 px-3 py-2"
            />
            <input
              name="address"
              required
              value={address.address}
              onChange={handleAddressChange}
              placeholder="Street address"
              className="md:col-span-2 rounded-md border border-slate-300 px-3 py-2"
            />
            <input
              name="city"
              required
              value={address.city}
              onChange={handleAddressChange}
              placeholder="City"
              className="rounded-md border border-slate-300 px-3 py-2"
            />
            <input
              name="postalCode"
              required
              value={address.postalCode}
              onChange={handleAddressChange}
              placeholder="Postal code"
              className="rounded-md border border-slate-300 px-3 py-2"
            />
          </div>

          <h3 className="text-base font-semibold text-slate-800">Payment Method</h3>
          <div className="space-y-2 text-sm text-slate-700">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="payment"
                value="cash_on_delivery"
                checked={paymentMethod === 'cash_on_delivery'}
                onChange={(event) => setPaymentMethod(event.target.value)}
              />
              Cash on Delivery
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="payment"
                value="card"
                checked={paymentMethod === 'card'}
                onChange={(event) => setPaymentMethod(event.target.value)}
              />
              Card
            </label>
          </div>
        </div>

        <aside className="h-fit rounded-lg border border-slate-200 bg-white p-4 text-sm">
          <h3 className="text-base font-semibold text-slate-800">Order Summary</h3>
          <div className="mt-3 space-y-2 text-slate-700">
            <p className="flex items-center justify-between">
              <span>Items</span>
              <span>{cartItems.length}</span>
            </p>
            <p className="flex items-center justify-between">
              <span>Subtotal</span>
              <span>{totals.subtotal} MAD</span>
            </p>
            <p className="flex items-center justify-between">
              <span>Taxes</span>
              <span>{totals.taxes} MAD</span>
            </p>
            <p className="flex items-center justify-between border-t border-slate-200 pt-2 font-semibold">
              <span>Total</span>
              <span>{totals.total} MAD</span>
            </p>
          </div>

          <button
            type="submit"
            disabled={loading || cartItems.length === 0}
            className="mt-4 w-full rounded-md bg-emerald-600 px-4 py-2 font-medium text-white hover:bg-emerald-700 disabled:opacity-60"
          >
            {loading ? 'Placing order...' : 'Place Order'}
          </button>
          {error && <p className="mt-3 text-xs text-red-600">{error}</p>}
        </aside>
      </form>
    </section>
  )
}

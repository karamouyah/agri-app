import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FiCreditCard, FiMapPin, FiTruck } from 'react-icons/fi'
import {
  calculateCartTotals,
  getCart,
  getShippingProfile,
  placeOrder,
} from '../../controllers/buyerController'
import { formatDzd } from '../../../utils/currency'
import AgriIllustration from '../../../components/AgriIllustration'
import Reveal from '../../../components/Reveal'

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
    <section className="agri-page space-y-5">
      <Reveal>
        <div className="grid gap-4 rounded-lg border border-slate-200 bg-white p-5 lg:grid-cols-[1.05fr_0.95fr]">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-700">Checkout</p>
            <h2 className="mt-2 text-3xl font-bold text-slate-900">Shipping and payment</h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              <div className="surface-muted p-3">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-700">Items</p>
                <p className="mt-1 text-2xl font-bold text-slate-900">{cartItems.length}</p>
              </div>
              <div className="surface-muted p-3">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-700">Delivery</p>
                <p className="mt-1 text-2xl font-bold text-slate-900">Ready</p>
              </div>
              <div className="surface-muted p-3">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-700">Total</p>
                <p className="mt-1 text-2xl font-bold text-emerald-700">{formatDzd(totals.total)}</p>
              </div>
            </div>
          </div>

          <div className="media-shell p-3">
            <AgriIllustration variant="transporter" className="h-48" />
          </div>
        </div>
      </Reveal>

      <form onSubmit={handleSubmit} className="grid gap-4 lg:grid-cols-[1fr_320px]">
        <Reveal delay={40}>
          <div className="space-y-4 rounded-lg border border-slate-200 bg-white p-5">
            <div className="flex items-center gap-2">
              <FiMapPin className="text-emerald-700" />
              <h3 className="text-base font-bold text-slate-900">Shipping</h3>
            </div>

            <div className="grid gap-3 md:grid-cols-2">
              <input name="fullName" required value={address.fullName} onChange={handleAddressChange} placeholder="Full name" className="field-control px-3 py-2" />
              <input name="phone" required value={address.phone} onChange={handleAddressChange} placeholder="Phone" className="field-control px-3 py-2" />
              <input name="address" required value={address.address} onChange={handleAddressChange} placeholder="Street" className="field-control md:col-span-2 px-3 py-2" />
              <input name="city" required value={address.city} onChange={handleAddressChange} placeholder="City" className="field-control px-3 py-2" />
              <input name="postalCode" required value={address.postalCode} onChange={handleAddressChange} placeholder="Postal code" className="field-control px-3 py-2" />
            </div>

            <div className="soft-divider" />

            <div className="flex items-center gap-2">
              <FiCreditCard className="text-emerald-700" />
              <h3 className="text-base font-bold text-slate-900">Payment</h3>
            </div>

            <div className="grid gap-3 md:grid-cols-2">
              <label className={`surface-muted flex cursor-pointer items-center gap-3 p-3 ${paymentMethod === 'cash_on_delivery' ? 'border border-emerald-300 bg-emerald-50' : ''}`}>
                <input
                  type="radio"
                  name="payment"
                  value="cash_on_delivery"
                  checked={paymentMethod === 'cash_on_delivery'}
                  onChange={(event) => setPaymentMethod(event.target.value)}
                />
                <span className="text-sm font-medium text-slate-800">Cash on delivery</span>
              </label>
              <label className={`surface-muted flex cursor-pointer items-center gap-3 p-3 ${paymentMethod === 'card' ? 'border border-emerald-300 bg-emerald-50' : ''}`}>
                <input
                  type="radio"
                  name="payment"
                  value="card"
                  checked={paymentMethod === 'card'}
                  onChange={(event) => setPaymentMethod(event.target.value)}
                />
                <span className="text-sm font-medium text-slate-800">Card</span>
              </label>
            </div>
          </div>
        </Reveal>

        <Reveal delay={90}>
          <aside className="h-fit rounded-lg border border-slate-200 bg-white p-4 text-sm">
            <div className="flex items-center gap-2">
              <FiTruck className="text-emerald-700" />
              <h3 className="text-base font-bold text-slate-900">Order summary</h3>
            </div>
            <div className="mt-3 space-y-2 text-slate-700">
              <p className="flex items-center justify-between">
                <span>Items</span>
                <span>{cartItems.length}</span>
              </p>
              <p className="flex items-center justify-between">
                <span>Subtotal</span>
                <span>{formatDzd(totals.subtotal)}</span>
              </p>
              <p className="flex items-center justify-between">
                <span>Taxes</span>
                <span>{formatDzd(totals.taxes)}</span>
              </p>
              <p className="flex items-center justify-between border-t border-slate-200 pt-2 font-semibold">
                <span>Total</span>
                <span>{formatDzd(totals.total)}</span>
              </p>
            </div>

            <button
              type="submit"
              disabled={loading || cartItems.length === 0}
              className="btn-primary mt-4 w-full px-4 py-3 text-sm disabled:opacity-60"
            >
              {loading ? 'Placing order...' : 'Place order'}
            </button>
            {error ? <p className="mt-3 text-xs font-medium text-red-600">{error}</p> : null}
          </aside>
        </Reveal>
      </form>
    </section>
  )
}

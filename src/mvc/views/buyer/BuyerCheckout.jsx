// File responsibility: Renders an application screen that is mounted from the React router for a specific user workflow.
// Used by the React frontend or build tooling as part of the full-stack agriculture app.

// Imports: bring in React, routing, UI components, services, and helpers used below.
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FiCreditCard, FiMapPin, FiTruck } from 'react-icons/fi'
import {
  calculateCartTotals,
  getCart,
  getShippingProfile,
  placeOrder,
} from '../../controllers/buyerController'
import { useLocations } from '../../../context/LocationContext'
import LocationFields from '../../../components/LocationFields'
import { formatDzd } from '../../../utils/currency'
import PageHero from '../../../components/PageHero'
import { Card } from '../../../components/ui'

const initialAddress = {
  fullName: '',
  phone: '',
  address: '',
  city: '',
  postalCode: '',
  wilayaId: '',
  communeId: '',
}

export default function BuyerCheckout() {
  const navigate = useNavigate()
  const { findCommune } = useLocations()
  // State: stores local UI data and is updated by event handlers or API responses.
  const [cartItems, setCartItems] = useState([])
  // State: stores local UI data and is updated by event handlers or API responses.
  const [address, setAddress] = useState(initialAddress)
  // State: stores local UI data and is updated by event handlers or API responses.
  const [paymentMethod, setPaymentMethod] = useState('cash_on_delivery')
  // State: stores local UI data and is updated by event handlers or API responses.
  const [loading, setLoading] = useState(false)
  // State: stores local UI data and is updated by event handlers or API responses.
  const [error, setError] = useState('')

  // Effect: runs after render to load data, sync storage, or react to dependency changes.
  useEffect(() => {
    // load handles this module workflow, using its parameters and returning JSX, data, or a service result.
    const load = async () => {
      const [cart, profile] = await Promise.all([getCart(), getShippingProfile()])
      setCartItems(cart)
      setAddress(profile)
    }

    load()
  }, [])

  const totals = calculateCartTotals(cartItems)
  const selectedCommune = findCommune(address.communeId)

// Form/event handling: validates input, updates state, or submits data when the user acts.
  // handleAddressChange handles this module workflow, using its parameters and returning JSX, data, or a service result.
  const handleAddressChange = (event) => {
    const { name, value } = event.target
    setAddress((prev) => ({
      ...prev,
      [name]: value,
      ...(name === 'wilayaId' ? { communeId: '' } : {}),
    }))
  }

// Form/event handling: validates input, updates state, or submits data when the user acts.
  // handleSubmit handles this module workflow, using its parameters and returning JSX, data, or a service result.
  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')

    if (cartItems.length === 0) {
      navigate('/buyer/cart')
      return
    }

    if (!address.wilayaId || !address.communeId) {
      setError('Wilaya and commune are required for checkout.')
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
    <section className="app-page">
      <PageHero
        eyebrow="Checkout"
        title="Shipping and payment"
        description="Confirm the delivery address, choose your payment method, and place the order with a clear DZD summary."
        variant="transporter"
        stats={[
          { label: 'Items', value: cartItems.length, help: 'Products moving into this order' },
          { label: 'Delivery', value: 'Ready', help: 'Shipping profile loaded and editable' },
          { label: 'Total', value: formatDzd(totals.total), help: 'Final order total in DZD' },
        ]}
      />

      // Form/event handling: validates input, updates state, or submits data when the user acts.
      <form onSubmit={handleSubmit} className="grid gap-4 lg:grid-cols-[1fr_320px]">
        <Card className="space-y-4 p-5">
          <div className="flex items-center gap-2">
            <FiMapPin className="text-emerald-700 dark:text-emerald-300" />
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">Shipping</h3>
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            // Form/event handling: validates input, updates state, or submits data when the user acts.
            <input name="fullName" required value={address.fullName} onChange={handleAddressChange} placeholder="Full name" className="field-control px-3 py-2" />
            // Form/event handling: validates input, updates state, or submits data when the user acts.
            <input name="phone" required value={address.phone} onChange={handleAddressChange} placeholder="Phone" className="field-control px-3 py-2" />
            // Form/event handling: validates input, updates state, or submits data when the user acts.
            <input name="address" required value={address.address} onChange={handleAddressChange} placeholder="Street" className="field-control md:col-span-2 px-3 py-2" />
            <div className="md:col-span-2">
              <LocationFields
                wilayaId={address.wilayaId}
                communeId={address.communeId}
                onChange={handleAddressChange}
                wilayaName="wilayaId"
                communeName="communeId"
                hint="Delivery commune must match the selected wilaya."
              />
            </div>
            // Form/event handling: validates input, updates state, or submits data when the user acts.
            <input name="city" value={selectedCommune?.name || address.city} onChange={handleAddressChange} placeholder="Commune display name" className="field-control px-3 py-2" readOnly />
            // Form/event handling: validates input, updates state, or submits data when the user acts.
            <input name="postalCode" required value={address.postalCode} onChange={handleAddressChange} placeholder="Postal code" className="field-control px-3 py-2" />
          </div>

          <div className="soft-divider" />

          <div className="flex items-center gap-2">
            <FiCreditCard className="text-emerald-700 dark:text-emerald-300" />
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">Payment</h3>
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            <label
              className={`surface-muted flex cursor-pointer items-center gap-3 p-3 ${
                paymentMethod === 'cash_on_delivery'
                  ? 'border border-emerald-300 bg-emerald-50 dark:border-emerald-800/60 dark:bg-emerald-950/30'
                  : ''
              }`}
            >
              <input
                type="radio"
                name="payment"
                value="cash_on_delivery"
                checked={paymentMethod === 'cash_on_delivery'}
                onChange={(event) => setPaymentMethod(event.target.value)}
              />
              <span className="text-sm font-medium text-slate-800 dark:text-slate-100">Cash on delivery</span>
            </label>
            <label
              className={`surface-muted flex cursor-pointer items-center gap-3 p-3 ${
                paymentMethod === 'card'
                  ? 'border border-emerald-300 bg-emerald-50 dark:border-emerald-800/60 dark:bg-emerald-950/30'
                  : ''
              }`}
            >
              <input
                type="radio"
                name="payment"
                value="card"
                checked={paymentMethod === 'card'}
                onChange={(event) => setPaymentMethod(event.target.value)}
              />
              <span className="text-sm font-medium text-slate-800 dark:text-slate-100">Card</span>
            </label>
          </div>
        </Card>

        <Card className="h-fit p-4 text-sm">
          <div className="flex items-center gap-2">
            <FiTruck className="text-emerald-700 dark:text-emerald-300" />
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">Order summary</h3>
          </div>
          <div className="mt-3 space-y-2 text-slate-700 dark:text-slate-300">
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
            <p className="flex items-center justify-between border-t border-slate-200 pt-2 font-semibold dark:border-slate-800">
              <span>Total</span>
              <span className="text-slate-900 dark:text-slate-100">{formatDzd(totals.total)}</span>
            </p>
          </div>

          <button
            type="submit"
            disabled={loading || cartItems.length === 0}
            className="btn-primary mt-4 w-full px-4 py-3 text-sm disabled:opacity-60"
          >
            {loading ? 'Placing order...' : 'Place order'}
          </button>
          {error ? <p className="mt-3 text-xs font-medium text-rose-600 dark:text-rose-300">{error}</p> : null}
        </Card>
      </form>
    </section>
  )
}

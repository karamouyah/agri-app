import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FiArrowRight, FiPackage, FiShoppingCart, FiTrash2 } from 'react-icons/fi'
import {
  calculateCartTotals,
  getCart,
  removeCartItem,
  updateCartQuantity,
} from '../../controllers/buyerController'
import { formatDzd } from '../../../utils/currency'
import PageHero from '../../../components/PageHero'
import { Card, buttonStyles, cn } from '../../../components/ui'

export default function BuyerCart() {
  const navigate = useNavigate()
  const [items, setItems] = useState([])

  const load = async () => {
    const cart = await getCart()
    setItems(cart)
  }

  useEffect(() => {
    const syncCart = async () => {
      const cart = await getCart()
      setItems(cart)
    }

    syncCart()
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
    <section className="app-page">
      <PageHero
        eyebrow="Buyer Cart"
        title="Review your selection"
        description="Confirm quantities, review totals in DZD, and move to checkout once your selected products and delivery plan are ready."
        variant="buyer"
        stats={[
          { label: 'Items', value: items.length, help: 'Products currently reserved in your cart' },
          { label: 'Subtotal', value: formatDzd(totals.subtotal), help: 'Before taxes and delivery adjustments' },
          { label: 'Total', value: formatDzd(totals.total), help: 'Final DZD amount shown before checkout' },
        ]}
      />

      <div className="grid gap-4 lg:grid-cols-[1fr_320px]">
        <Card className="p-4 sm:p-5">
          {items.length === 0 ? (
            <div className="empty-state space-y-3 px-5 py-8 text-center">
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">Cart is empty</h3>
              <p className="text-sm text-slate-600 dark:text-slate-300">
                No products added yet. Start by browsing approved agricultural products and add the items you want to order.
              </p>
              <Link to="/buyer/search" className={cn(buttonStyles.secondary, 'inline-flex px-4 py-2 text-sm')}>
                Browse products
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {items.map((item) => (
                <div key={item.productId} className="surface-muted lift-card flex flex-col gap-3 p-4 md:flex-row md:items-center md:justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300">
                      <FiPackage />
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900 dark:text-slate-100">{item.name}</p>
                      <p className="text-sm text-slate-500 dark:text-slate-400">{formatDzd(item.unitPrice)} each</p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(event) => handleQuantityChange(item.productId, event.target.value)}
                      className="field-control w-20 px-3 py-2 text-sm"
                    />
                    <span className="min-w-24 text-sm font-semibold text-slate-900 dark:text-slate-100">
                      {formatDzd(item.unitPrice * item.quantity)}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleRemove(item.productId)}
                      className={cn(
                        buttonStyles.secondary,
                        'px-3 py-2 text-sm text-rose-700 hover:bg-rose-50 dark:text-rose-300 dark:hover:bg-rose-950/30',
                      )}
                    >
                      <span className="inline-flex items-center gap-2">
                        <FiTrash2 />
                        Remove
                      </span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        <Card className="h-fit p-4 text-sm">
          <div className="flex items-center gap-2">
            <FiShoppingCart className="text-emerald-700 dark:text-emerald-300" />
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">Summary</h3>
          </div>
          <div className="mt-3 space-y-2 text-slate-700 dark:text-slate-300">
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
            type="button"
            disabled={items.length === 0}
            onClick={() => navigate('/buyer/checkout')}
            className="btn-primary mt-4 w-full px-4 py-3 text-sm disabled:opacity-60"
          >
            <span className="inline-flex items-center gap-2">
              <FiArrowRight />
              Checkout
            </span>
          </button>
        </Card>
      </div>
    </section>
  )
}

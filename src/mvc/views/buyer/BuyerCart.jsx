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
import AgriIllustration from '../../../components/AgriIllustration'
import Reveal from '../../../components/Reveal'

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
    <section className="agri-page space-y-5">
      <Reveal>
        <div className="grid gap-4 rounded-lg border border-slate-200 bg-white p-5 lg:grid-cols-[1.05fr_0.95fr]">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-700">Buyer Cart</p>
            <h2 className="mt-2 text-3xl font-bold text-slate-900">Review your selection</h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              <div className="surface-muted p-3">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-700">Items</p>
                <p className="mt-1 text-2xl font-bold text-slate-900">{items.length}</p>
              </div>
              <div className="surface-muted p-3">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-700">Subtotal</p>
                <p className="mt-1 text-2xl font-bold text-slate-900">{formatDzd(totals.subtotal)}</p>
              </div>
              <div className="surface-muted p-3">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-700">Total</p>
                <p className="mt-1 text-2xl font-bold text-emerald-700">{formatDzd(totals.total)}</p>
              </div>
            </div>
          </div>

          <div className="media-shell p-3">
            <AgriIllustration variant="buyer" className="h-48" />
          </div>
        </div>
      </Reveal>

      <div className="grid gap-4 lg:grid-cols-[1fr_320px]">
        <Reveal delay={40}>
          <div className="rounded-lg border border-slate-200 bg-white p-4">
            {items.length === 0 ? (
              <div className="empty-state space-y-3 px-5 py-8 text-center">
                <div className="mx-auto max-w-xs">
                  <AgriIllustration variant="empty" className="h-36" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">Cart is empty</h3>
                <Link to="/buyer/search" className="btn-secondary inline-flex px-4 py-2 text-sm">
                  Browse products
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {items.map((item) => (
                  <div key={item.productId} className="surface-muted lift-card flex flex-col gap-3 p-4 md:flex-row md:items-center md:justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
                        <FiPackage />
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900">{item.name}</p>
                        <p className="text-sm text-slate-500">{formatDzd(item.unitPrice)} each</p>
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
                      <span className="min-w-24 text-sm font-semibold text-slate-900">
                        {formatDzd(item.unitPrice * item.quantity)}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleRemove(item.productId)}
                        className="btn-secondary px-3 py-2 text-sm text-red-700"
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
          </div>
        </Reveal>

        <Reveal delay={90}>
          <aside className="h-fit rounded-lg border border-slate-200 bg-white p-4 text-sm">
            <div className="flex items-center gap-2">
              <FiShoppingCart className="text-emerald-700" />
              <h3 className="text-base font-bold text-slate-900">Summary</h3>
            </div>
            <div className="mt-3 space-y-2 text-slate-700">
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
          </aside>
        </Reveal>
      </div>
    </section>
  )
}

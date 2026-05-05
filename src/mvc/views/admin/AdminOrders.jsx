// File responsibility: Renders the Ministry/Admin order and transaction tracking screen.
// Used by the React frontend or build tooling as part of the full-stack agriculture app.

import { useEffect, useMemo, useState } from 'react'
import { FiClipboard, FiSearch, FiTruck } from 'react-icons/fi'
import { getAdminOrders } from '../../controllers/adminController'
import { formatDzd } from '../../../utils/currency'
import {
  Card,
  EmptyState,
  Input,
  PageHeader,
  Select,
  SkeletonBlock,
  StatusBadge,
  buttonStyles,
  cn,
} from '../../../components/ui'

const missingText = 'Not provided'
const notAssignedText = 'Not assigned'

const fallback = (value, emptyLabel = missingText) => {
  if (value === null || value === undefined) return emptyLabel
  const text = String(value).trim()
  return text || emptyLabel
}

const formatDate = (value) => {
  if (!value) return missingText
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return missingText
  return date.toLocaleString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

const locationLabel = (location) => {
  const parts = [location?.address, location?.commune, location?.wilaya]
    .map((item) => String(item || '').trim())
    .filter(Boolean)
  return parts.length > 0 ? parts.join(', ') : missingText
}

const productSummary = (items = []) => {
  if (!items.length) return missingText
  if (items.length === 1) return fallback(items[0]?.name)
  return `${fallback(items[0]?.name)} +${items.length - 1} more`
}

const totalQuantity = (items = []) => items.reduce((sum, item) => sum + Number(item?.quantity || 0), 0)

const searchTextForOrder = (order) =>
  [
    order?.id,
    order?.orderStatus,
    order?.shipment?.status,
    order?.payment?.status,
    order?.buyer?.name,
    order?.buyer?.email,
    order?.farmer?.name,
    order?.farmer?.email,
    order?.transporter?.name,
    order?.transporter?.email,
    order?.pickupLocation?.label,
    order?.deliveryLocation?.label,
    ...(order?.items || []).map((item) => item?.name),
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase()

function DetailRow({ label, value }) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">{label}</p>
      <p className="mt-1 text-sm text-slate-800 dark:text-slate-100">{value}</p>
    </div>
  )
}

function AdminOrderDetailsModal({ order, onClose }) {
  if (!order) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/65 px-4 py-6 backdrop-blur-sm">
      <Card className="max-h-[92vh] w-full max-w-5xl overflow-y-auto">
        <div className="border-b border-slate-200 px-5 py-4 dark:border-slate-800 md:px-6">
          <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700 dark:text-emerald-300">
                Order #{fallback(order?.id)}
              </p>
              <h3 className="mt-1 text-xl font-semibold text-slate-900 dark:text-slate-100">
                {productSummary(order?.items)}
              </h3>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                {fallback(order?.farmer?.name)} to {fallback(order?.buyer?.name)}
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <StatusBadge status={fallback(order?.orderStatus)} />
              <StatusBadge status={fallback(order?.shipment?.status, 'No shipment')} />
            </div>
          </div>
        </div>

        <div className="grid gap-5 p-5 md:p-6 xl:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-5">
            <section>
              <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Products</h4>
              <div className="mt-3 overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-800">
                <table className="table-base">
                  <thead>
                    <tr>
                      <th>Product</th>
                      <th>Category</th>
                      <th>Quantity</th>
                      <th>Unit Price</th>
                      <th>Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(order?.items || []).map((item, index) => (
                      <tr key={`${item?.productId || item?.name || 'item'}-${index}`}>
                        <td className="font-semibold text-slate-900 dark:text-slate-100">{fallback(item?.name)}</td>
                        <td>{fallback(item?.category)}</td>
                        <td>
                          {Number(item?.quantity || 0)} {fallback(item?.unit)}
                        </td>
                        <td>{formatDzd(item?.unitPrice || 0)}</td>
                        <td>{formatDzd(item?.total || 0)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            <section className="grid gap-4 md:grid-cols-2">
              <div className="rounded-lg border border-slate-200 p-4 dark:border-slate-800">
                <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Pickup</h4>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{locationLabel(order?.pickupLocation)}</p>
              </div>
              <div className="rounded-lg border border-slate-200 p-4 dark:border-slate-800">
                <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Delivery</h4>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{locationLabel(order?.deliveryLocation)}</p>
              </div>
            </section>
          </div>

          <div className="space-y-4">
            <div className="grid gap-4 rounded-lg border border-slate-200 p-4 dark:border-slate-800">
              <DetailRow label="Buyer" value={fallback(order?.buyer?.name)} />
              <DetailRow label="Farmer" value={fallback(order?.farmer?.name)} />
              <DetailRow label="Transporter" value={fallback(order?.transporter?.name, notAssignedText)} />
              <DetailRow label="Total" value={formatDzd(order?.totalAmount || 0)} />
            </div>

            <div className="grid gap-4 rounded-lg border border-slate-200 p-4 dark:border-slate-800">
              <DetailRow label="Payment Status" value={fallback(order?.payment?.status, missingText)} />
              <DetailRow label="Payment Method" value={fallback(order?.payment?.method)} />
              <DetailRow label="Payment Date" value={formatDate(order?.payment?.transactionDate)} />
              <DetailRow label="Payment Amount" value={order?.payment ? formatDzd(order.payment.amount || 0) : missingText} />
            </div>

            <div className="grid gap-4 rounded-lg border border-slate-200 p-4 dark:border-slate-800">
              <DetailRow label="Tracking Number" value={fallback(order?.shipment?.trackingNumber, missingText)} />
              <DetailRow label="Delivery Status" value={fallback(order?.shipment?.status, missingText)} />
              <DetailRow label="Shipping Fee" value={order?.shipment ? formatDzd(order.shipment.shippingFee || 0) : missingText} />
              <DetailRow label="Estimated Delivery" value={formatDate(order?.shipment?.estimatedDeliveryDate)} />
              <DetailRow label="Delivered At" value={formatDate(order?.shipment?.actualDeliveryDate)} />
            </div>

            <div className="grid gap-4 rounded-lg border border-slate-200 p-4 dark:border-slate-800">
              <DetailRow label="Created" value={formatDate(order?.createdAt)} />
              <DetailRow label="Updated" value={formatDate(order?.updatedAt)} />
            </div>
          </div>
        </div>

        <div className="flex justify-end border-t border-slate-200 px-5 py-4 dark:border-slate-800 md:px-6">
          <button type="button" onClick={onClose} className={buttonStyles.secondary}>
            Close
          </button>
        </div>
      </Card>
    </div>
  )
}

export default function AdminOrders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [orderStatus, setOrderStatus] = useState('')
  const [deliveryStatus, setDeliveryStatus] = useState('')
  const [paymentStatus, setPaymentStatus] = useState('')
  const [selectedOrder, setSelectedOrder] = useState(null)

  const loadOrders = async () => {
    setLoading(true)
    setError('')
    try {
      const list = await getAdminOrders()
      setOrders(list)
    } catch (loadError) {
      setError(loadError.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadOrders()
  }, [])

  const orderStatuses = useMemo(
    () => Array.from(new Set(orders.map((order) => order?.orderStatus).filter(Boolean))).sort(),
    [orders],
  )

  const deliveryStatuses = useMemo(
    () =>
      Array.from(new Set(orders.map((order) => order?.shipment?.status || 'not assigned').filter(Boolean))).sort(),
    [orders],
  )

  const paymentStatuses = useMemo(
    () => Array.from(new Set(orders.map((order) => order?.payment?.status || 'not provided').filter(Boolean))).sort(),
    [orders],
  )

  const filteredOrders = useMemo(() => {
    const query = search.trim().toLowerCase()
    return orders.filter((order) => {
      const matchesSearch = !query || searchTextForOrder(order).includes(query)
      const matchesOrderStatus = !orderStatus || order?.orderStatus === orderStatus
      const currentDeliveryStatus = order?.shipment?.status || 'not assigned'
      const matchesDeliveryStatus = !deliveryStatus || currentDeliveryStatus === deliveryStatus
      const currentPaymentStatus = order?.payment?.status || 'not provided'
      const matchesPaymentStatus = !paymentStatus || currentPaymentStatus === paymentStatus
      return matchesSearch && matchesOrderStatus && matchesDeliveryStatus && matchesPaymentStatus
    })
  }, [orders, search, orderStatus, deliveryStatus, paymentStatus])

  const totals = useMemo(
    () => ({
      orders: orders.length,
      visible: filteredOrders.length,
      revenue: filteredOrders.reduce((sum, order) => sum + Number(order?.totalAmount || 0), 0),
    }),
    [orders, filteredOrders],
  )

  return (
    <section className="app-page">
      <PageHeader
        title="Orders and transactions"
        meta={[
          { label: 'Total orders', value: totals.orders },
          { label: 'Visible', value: totals.visible },
          { label: 'Visible value', value: formatDzd(totals.revenue) },
        ]}
      />

      <Card className="p-5 md:p-6">
        <div className="grid gap-3 lg:grid-cols-[1.4fr_1fr_1fr_1fr_auto]">
          <label className="relative block">
            <FiSearch className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <Input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search order, product, farmer, buyer, transporter..."
              className="pl-11"
            />
          </label>

          <Select value={orderStatus} onChange={(event) => setOrderStatus(event.target.value)}>
            <option value="">All order statuses</option>
            {orderStatuses.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </Select>

          <Select value={deliveryStatus} onChange={(event) => setDeliveryStatus(event.target.value)}>
            <option value="">All delivery statuses</option>
            {deliveryStatuses.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </Select>

          <Select value={paymentStatus} onChange={(event) => setPaymentStatus(event.target.value)}>
            <option value="">All payment statuses</option>
            {paymentStatuses.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </Select>

          <button
            type="button"
            onClick={() => {
              setSearch('')
              setOrderStatus('')
              setDeliveryStatus('')
              setPaymentStatus('')
            }}
            className={buttonStyles.secondary}
          >
            Clear
          </button>
        </div>

        {error ? (
          <p className="mt-4 rounded-lg border border-rose-100 bg-rose-50 px-4 py-3 text-sm text-rose-700 dark:border-rose-900/40 dark:bg-rose-950/30 dark:text-rose-300">
            {error}
          </p>
        ) : null}
      </Card>

      {loading ? (
        <div className="grid gap-4">
          <SkeletonBlock className="h-24" />
          <SkeletonBlock className="h-80" />
        </div>
      ) : filteredOrders.length === 0 ? (
        <EmptyState
          icon={FiClipboard}
          title="No orders found"
          description="No order matches the current search or filters. Clear filters or refresh the page to review all available orders."
          action={{ label: 'Refresh orders', onClick: loadOrders }}
        />
      ) : (
        <Card className="overflow-hidden">
          <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-4 md:px-6">
            <div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                {filteredOrders.length} matching orders
              </h3>
            </div>
            <button type="button" onClick={loadOrders} className={buttonStyles.secondary}>
              Refresh
            </button>
          </div>

          <div className="table-shell mx-5 mb-5 hidden md:mx-6 md:mb-6 md:block">
            <div className="overflow-x-auto">
              <table className="table-base">
                <thead>
                  <tr>
                    <th>Order</th>
                    <th>Product</th>
                    <th>Buyer</th>
                    <th>Farmer</th>
                    <th>Transporter</th>
                    <th>Pickup</th>
                    <th>Destination</th>
                    <th>Status</th>
                    <th>Payment</th>
                    <th>Total</th>
                    <th>Created</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.map((order) => (
                    <tr key={order?.id || `${order?.createdAt}-${order?.totalAmount}`}>
                      <td className="font-semibold text-slate-900 dark:text-slate-100">#{fallback(order?.id)}</td>
                      <td>
                        <div className="min-w-44">
                          <p className="font-medium text-slate-900 dark:text-slate-100">{productSummary(order?.items)}</p>
                          <p className="text-xs text-slate-500 dark:text-slate-400">
                            {totalQuantity(order?.items)} units
                          </p>
                        </div>
                      </td>
                      <td>{fallback(order?.buyer?.name)}</td>
                      <td>{fallback(order?.farmer?.name)}</td>
                      <td>{fallback(order?.transporter?.name, notAssignedText)}</td>
                      <td className="min-w-48">{locationLabel(order?.pickupLocation)}</td>
                      <td className="min-w-48">{locationLabel(order?.deliveryLocation)}</td>
                      <td>
                        <div className="flex min-w-32 flex-col gap-2">
                          <StatusBadge status={fallback(order?.orderStatus)} />
                          <StatusBadge status={fallback(order?.shipment?.status, 'No shipment')} />
                        </div>
                      </td>
                      <td>
                        <StatusBadge status={fallback(order?.payment?.status, 'Not provided')} />
                        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                          {fallback(order?.payment?.method)}
                        </p>
                      </td>
                      <td className="font-semibold text-slate-900 dark:text-slate-100">
                        {formatDzd(order?.totalAmount || 0)}
                      </td>
                      <td>{formatDate(order?.createdAt)}</td>
                      <td>
                        <button
                          type="button"
                          onClick={() => setSelectedOrder(order)}
                          className={cn(buttonStyles.secondary, 'px-3 py-2 text-xs')}
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="grid gap-3 px-5 pb-5 md:hidden">
            {filteredOrders.map((order) => (
              <button
                key={`card-${order?.id || order?.createdAt}`}
                type="button"
                onClick={() => setSelectedOrder(order)}
                className="rounded-lg border border-slate-200 p-4 text-left dark:border-slate-800"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Order #{fallback(order?.id)}</p>
                    <p className="mt-1 font-semibold text-slate-900 dark:text-slate-100">{productSummary(order?.items)}</p>
                  </div>
                  <FiTruck className="text-slate-400" />
                </div>
                <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">
                  {fallback(order?.farmer?.name)} to {fallback(order?.buyer?.name)}
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <StatusBadge status={fallback(order?.orderStatus)} />
                  <StatusBadge status={fallback(order?.shipment?.status, 'No shipment')} />
                </div>
              </button>
            ))}
          </div>
        </Card>
      )}

      <AdminOrderDetailsModal order={selectedOrder} onClose={() => setSelectedOrder(null)} />
    </section>
  )
}

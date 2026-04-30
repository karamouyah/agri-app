// File responsibility: Renders an application screen that is mounted from the React router for a specific user workflow.
// Used by the React frontend or build tooling as part of the full-stack agriculture app.

// Imports: bring in React, routing, UI components, services, and helpers used below.
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { FiFlag } from 'react-icons/fi'
import { addToCart, buyerFilterOptions, searchProducts } from '../../controllers/buyerController'
import { formatDzdPerUnit } from '../../../utils/currency'
import LocationFields from '../../../components/LocationFields'
import { Card, Input, PageHeader, Select, buttonStyles, cn } from '../../../components/ui'

import { getProductDisplayImage } from '../../../utils/productImages'
import ReportModal from '../../../components/ReportModal'

const initialFilters = {
  category: '',
  minPrice: '',
  maxPrice: '',
  location: '',
  wilaya: '',
  commune: '',
  quality: '',
}

export default function BuyerSearch() {
  // State: stores local UI data and is updated by event handlers or API responses.
  const [query, setQuery] = useState('')
  // State: stores local UI data and is updated by event handlers or API responses.
  const [filters, setFilters] = useState(initialFilters)
  // State: stores local UI data and is updated by event handlers or API responses.
  const [page, setPage] = useState(1)
  // State: stores local UI data and is updated by event handlers or API responses.
  const [data, setData] = useState({ items: [], total: 0, totalPages: 1 })
  // State: stores local UI data and is updated by event handlers or API responses.
  const [message, setMessage] = useState('')
  // State: stores local UI data and is updated by event handlers or API responses.
  const [loading, setLoading] = useState(false)
  // State: stores local UI data and is updated by event handlers or API responses.
  const [error, setError] = useState('')
  const [reportTarget, setReportTarget] = useState(null)

  // load handles this module workflow, using its parameters and returning JSX, data, or a service result.
  const load = async (nextPage = 1, nextQuery = query, nextFilters = filters) => {
    setLoading(true)
    setError('')

    try {
      const response = await searchProducts(nextQuery, nextFilters, nextPage, 6)
      setData(response)
      setPage(response.page)
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'Unable to load catalog products right now.')
    } finally {
      setLoading(false)
    }
  }

  // Effect: runs after render to load data, sync storage, or react to dependency changes.
  useEffect(() => {
    // syncResults handles this module workflow, using its parameters and returning JSX, data, or a service result.
    const syncResults = async () => {
      await load(1, '', initialFilters)
    }

    syncResults()
    // Initial browse view should load the first catalog page once.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  // handleFilterChange handles this module workflow, using its parameters and returning JSX, data, or a service result.
  const handleFilterChange = (event) => {
    const { name, value } = event.target
    setFilters((prev) => ({
      ...prev,
      [name]: value,
      ...(name === 'wilaya' ? { commune: '' } : {}),
    }))
  }
  // handleSearch handles this module workflow, using its parameters and returning JSX, data, or a service result.
  const handleSearch = async (event) => {
    event.preventDefault()
    await load(1, query, filters)
  }
  // handlePage handles this module workflow, using its parameters and returning JSX, data, or a service result.
  const handlePage = async (nextPage) => {
    await load(nextPage, query, filters)
  }
  // handleAddToCart handles this module workflow, using its parameters and returning JSX, data, or a service result.
  const handleAddToCart = async (product) => {
    await addToCart(product, 1)
    setMessage(`${product.name} added to cart.`)

    setTimeout(() => {
      setMessage('')
    }, 2000)
  }

  return (
    <section className="app-page">
      <PageHeader
        eyebrow="Product Search"
        title="Browse approved produce listings"
        description="Search the catalog by product, price, quality, and origin to find suitable listings."
        meta={[
          { label: 'Results', value: data.total },
          { label: 'Pages', value: data.totalPages },
          { label: 'Catalog', value: 'Approved only' },
        ]}
      />

      <Card className="p-5">
        <form onSubmit={handleSearch} className="mt-1 flex flex-col gap-2 sm:flex-row">
          <Input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search products, farmers, keywords..."
          />
          <button
            type="submit"
            disabled={loading}
            className="btn-primary px-4 py-2.5 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? 'Searching...' : 'Search'}
          </button>
        </form>
        {error ? (
          <p className="mt-3 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700 dark:border-rose-900/40 dark:bg-rose-950/30 dark:text-rose-300">
            {error}
          </p>
        ) : null}
        {message ? (
          <p className="mt-3 rounded-lg border border-emerald-100 bg-emerald-50 dark:bg-emerald-900/20 px-3 py-2 text-sm text-emerald-700 dark:border-emerald-900/40 dark:bg-emerald-900/20 dark:text-emerald-300">
            {message}
          </p>
        ) : null}
      </Card>

      <div className="grid gap-4 lg:grid-cols-[260px_1fr]">
        <Card className="p-4">
          <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-100">Filters</h3>
          <div className="mt-3 space-y-3 text-sm">
            <div>
              <label htmlFor="category" className="mb-1 block text-slate-600 dark:text-slate-300">
                Category
              </label>
              <Select
                id="category"
                name="category"
                value={filters.category}
                onChange={handleFilterChange}
                className="px-3 py-2"
              >
                <option value="">All</option>
                {buyerFilterOptions.categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </Select>
            </div>

            <div>
              <label htmlFor="minPrice" className="mb-1 block text-slate-600 dark:text-slate-300">
                Min Price (DZD)
              </label>
              <Input
                id="minPrice"
                name="minPrice"
                type="number"
                min="0"
                value={filters.minPrice}
                onChange={handleFilterChange}
                className="px-3 py-2"
              />
            </div>

            <div>
              <label htmlFor="maxPrice" className="mb-1 block text-slate-600 dark:text-slate-300">
                Max Price (DZD)
              </label>
              <Input
                id="maxPrice"
                name="maxPrice"
                type="number"
                min="0"
                value={filters.maxPrice}
                onChange={handleFilterChange}
                className="px-3 py-2"
              />
            </div>

            <LocationFields
              wilayaId={filters.wilaya}
              communeId={filters.commune}
              onChange={handleFilterChange}
              wilayaName="wilaya"
              communeName="commune"
              hint="Filter listings by the farmer's Algeria wilaya and commune."
              required={false}
            />

            <div>
              <label htmlFor="quality" className="mb-1 block text-slate-600 dark:text-slate-300">
                Quality
              </label>
              <Select
                id="quality"
                name="quality"
                value={filters.quality}
                onChange={handleFilterChange}
                className="px-3 py-2"
              >
                <option value="">All</option>
                {buyerFilterOptions.qualities.map((quality) => (
                  <option key={quality} value={quality}>
                    {quality}
                  </option>
                ))}
              </Select>
            </div>

            <button
              type="button"
              onClick={async () => {
                setFilters(initialFilters)
                setQuery('')
                await load(1, '', initialFilters)
              }}
              disabled={loading}
              className="btn-secondary w-full px-3 py-2 disabled:cursor-not-allowed disabled:opacity-60"
            >
              Clear Filters
            </button>
          </div>

          <Card className="mt-4 p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700">Tips</p>
            <div className="mt-3 space-y-2 text-sm text-slate-600 dark:text-slate-300">
              <p>Use wilaya and commune filters when you want products from a specific origin.</p>
              <p>Set a price range before ordering when you need to compare suppliers quickly.</p>
              <p>Open product details to review the farmer, unit, and product information before checkout.</p>
            </div>
          </Card>
        </Card>

        <div className="space-y-4">
          {loading && !data.items.length ? (
            <div className="empty-state px-6 py-10 text-center">
              <h3 className="mt-3 text-lg font-semibold text-slate-900 dark:text-slate-100">Loading approved products</h3>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                Fetching the latest catalog listings for this buyer workspace.
              </p>
            </div>
          ) : data.items.length ? (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {data.items.map((product) => (
                <Card key={product.id} className="lift-card overflow-hidden">
                  <div className="h-40 w-full overflow-hidden bg-slate-100">
                    <img 
                      src={getProductDisplayImage(product)}
                      alt={product.name}
                      className="h-full w-full object-cover object-center transition-transform hover:scale-105"
                    />
                  </div>
                  <div className="p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="text-base font-semibold text-slate-800 dark:text-slate-100">{product.name}</h3>
                        <p className="mt-1 text-xs uppercase tracking-[0.16em] text-emerald-700 dark:text-emerald-300">{product.category}</p>
                      </div>
                      <span className="badge-soft px-2.5 py-1 text-[11px]">{product.unit}</span>
                    </div>
                    <p className="mt-3 text-base font-bold text-slate-900 dark:text-slate-100">{formatDzdPerUnit(product.price, product.unit)}</p>
                    <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">Farmer: {product.farmerName}</p>
                    <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">Location: {product.farmerRegion || 'Unknown'}</p>
                    <div className="mt-4 flex flex-wrap items-center gap-2">
                      <Link to={`/buyer/product/${product.id}`} className={cn(buttonStyles.secondary, 'px-3 py-1.5 text-xs')}>
                        Details
                      </Link>
                      <button
                        type="button"
                        onClick={() => handleAddToCart(product)}
                        className="btn-primary px-3 py-1.5 text-xs font-medium text-white"
                      >
                        Add to Cart
                      </button>
                      <button
                        type="button"
                        onClick={() => setReportTarget(product)}
                        className={cn(buttonStyles.secondary, 'px-3 py-1.5 text-xs')}
                      >
                        <FiFlag />
                        Report
                      </button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <div className="empty-state px-6 py-10 text-center">
              <h3 className="mt-3 text-lg font-semibold text-slate-900 dark:text-slate-100">No products matched your filters</h3>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                Try a broader search, remove a few filters, or choose another wilaya to see more approved products.
              </p>
            </div>
          )}

          <Card className="flex items-center justify-between px-4 py-3 text-sm">
            <span>
              Showing page {page} of {data.totalPages} ({data.total} products)
            </span>
            <div className="flex gap-2">
              <button
                type="button"
                disabled={page <= 1}
                onClick={() => handlePage(page - 1)}
                className="btn-secondary px-3 py-1 disabled:opacity-50"
              >
                Previous
              </button>
              <button
                type="button"
                disabled={loading || page >= data.totalPages}
                onClick={() => handlePage(page + 1)}
                className="btn-secondary px-3 py-1 disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </Card>
        </div>
      </div>
      <ReportModal
        open={Boolean(reportTarget)}
        onClose={() => setReportTarget(null)}
        title="Report product listing"
        target={{
          category: 'product',
          relatedProductListingId: reportTarget?.id,
          label: reportTarget ? `${reportTarget?.name || 'Product'} from ${reportTarget?.farmerName || 'Not provided'}` : '',
        }}
      />
    </section>
  )
}

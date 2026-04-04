import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { addToCart, buyerFilterOptions, searchProducts } from '../../controllers/buyerController'
import { formatDzdPerUnit } from '../../../utils/currency'
import PageHero from '../../../components/PageHero'
import AgriIllustration from '../../../components/AgriIllustration'

const initialFilters = {
  category: '',
  minPrice: '',
  maxPrice: '',
  location: '',
  quality: '',
}

export default function BuyerSearch() {
  const [query, setQuery] = useState('')
  const [filters, setFilters] = useState(initialFilters)
  const [page, setPage] = useState(1)
  const [data, setData] = useState({ items: [], total: 0, totalPages: 1 })
  const [message, setMessage] = useState('')

  const load = async (nextPage = 1) => {
    const response = await searchProducts(query, filters, nextPage, 6)
    setData(response)
    setPage(response.page)
  }

  useEffect(() => {
    load(1)
  }, [])

  const handleFilterChange = (event) => {
    const { name, value } = event.target
    setFilters((prev) => ({ ...prev, [name]: value }))
  }

  const handleSearch = async (event) => {
    event.preventDefault()
    await load(1)
  }

  const handlePage = async (nextPage) => {
    await load(nextPage)
  }

  const handleAddToCart = async (product) => {
    await addToCart(product, 1)
    setMessage(`${product.name} added to cart.`)

    setTimeout(() => {
      setMessage('')
    }, 2000)
  }

  return (
    <section className="agri-page space-y-5">
      <PageHero
        eyebrow="Fresh Marketplace"
        title="Browse approved produce listings"
        description="Filter by category, price, quality, and region in a brighter, more visual product search experience."
        variant="buyer"
        badge="Live approved catalog"
        stats={[
          { label: 'Results', value: data.total, help: 'Products matched right now' },
          { label: 'Pages', value: data.totalPages, help: 'Responsive browsing with pagination' },
          { label: 'Quality', value: 'Verified', help: 'Controlled catalog with visible pricing' },
        ]}
      />

      <div className="section-shell rounded-lg border border-slate-200 bg-white p-5">
        <form onSubmit={handleSearch} className="mt-1 flex flex-col gap-2 sm:flex-row">
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search products, farmers, keywords..."
            className="w-full rounded-md border border-slate-300 px-3 py-2.5 outline-none focus:border-emerald-500"
          />
          <button type="submit" className="btn-primary px-4 py-2.5 text-sm font-medium text-white">
            Search
          </button>
        </form>
        {message ? (
          <p className="mt-3 rounded-2xl border border-emerald-100 bg-gradient-to-r from-emerald-50 to-amber-50 px-3 py-2 text-sm text-emerald-700">
            {message}
          </p>
        ) : null}
      </div>

      <div className="grid gap-4 lg:grid-cols-[260px_1fr]">
        <aside className="section-shell rounded-lg border border-slate-200 bg-white p-4">
          <h3 className="text-sm font-semibold text-slate-800">Filters</h3>
          <div className="mt-3 space-y-3 text-sm">
            <div>
              <label htmlFor="category" className="mb-1 block text-slate-600">
                Category
              </label>
              <select
                id="category"
                name="category"
                value={filters.category}
                onChange={handleFilterChange}
                className="w-full rounded-md border border-slate-300 px-2 py-1.5"
              >
                <option value="">All</option>
                {buyerFilterOptions.categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="minPrice" className="mb-1 block text-slate-600">
                Min Price (DZD)
              </label>
              <input
                id="minPrice"
                name="minPrice"
                type="number"
                min="0"
                value={filters.minPrice}
                onChange={handleFilterChange}
                className="w-full rounded-md border border-slate-300 px-2 py-1.5"
              />
            </div>

            <div>
              <label htmlFor="maxPrice" className="mb-1 block text-slate-600">
                Max Price (DZD)
              </label>
              <input
                id="maxPrice"
                name="maxPrice"
                type="number"
                min="0"
                value={filters.maxPrice}
                onChange={handleFilterChange}
                className="w-full rounded-md border border-slate-300 px-2 py-1.5"
              />
            </div>

            <div>
              <label htmlFor="location" className="mb-1 block text-slate-600">
                Farmer Region
              </label>
              <select
                id="location"
                name="location"
                value={filters.location}
                onChange={handleFilterChange}
                className="w-full rounded-md border border-slate-300 px-2 py-1.5"
              >
                <option value="">All</option>
                {buyerFilterOptions.locations.map((location) => (
                  <option key={location} value={location}>
                    {location}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="quality" className="mb-1 block text-slate-600">
                Quality
              </label>
              <select
                id="quality"
                name="quality"
                value={filters.quality}
                onChange={handleFilterChange}
                className="w-full rounded-md border border-slate-300 px-2 py-1.5"
              >
                <option value="">All</option>
                {buyerFilterOptions.qualities.map((quality) => (
                  <option key={quality} value={quality}>
                    {quality}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="button"
              onClick={async () => {
                setFilters(initialFilters)
                setQuery('')
                const response = await searchProducts('', initialFilters, 1, 6)
                setData(response)
                setPage(response.page)
              }}
              className="btn-secondary w-full px-3 py-2"
            >
              Clear Filters
            </button>
          </div>

          <div className="media-shell mt-4 p-2">
            <AgriIllustration variant="hero" className="h-48" />
          </div>
        </aside>

        <div className="space-y-4">
          {data.items.length ? (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {data.items.map((product) => (
                <article
                  key={product.id}
                  className="section-shell lift-card rounded-lg border border-slate-200 bg-white p-4 transition hover:-translate-y-1"
                >
                  <div className="media-shell mb-3 p-2">
                    <AgriIllustration variant="hero" className="h-28" />
                  </div>
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="text-base font-semibold text-slate-800">{product.name}</h3>
                      <p className="mt-1 text-xs uppercase tracking-[0.16em] text-emerald-700">{product.category}</p>
                    </div>
                    <span className="badge-soft px-2.5 py-1 text-[11px]">{product.unit}</span>
                  </div>
                  <p className="mt-3 text-base font-bold text-slate-900">{formatDzdPerUnit(product.price, product.unit)}</p>
                  <p className="mt-1 text-xs text-slate-500">Farmer: {product.farmerName}</p>
                  <div className="mt-4 flex items-center gap-2">
                    <Link to={`/buyer/product/${product.id}`} className="btn-secondary px-3 py-1.5 text-xs">
                      Details
                    </Link>
                    <button
                      type="button"
                      onClick={() => handleAddToCart(product)}
                      className="btn-primary px-3 py-1.5 text-xs font-medium text-white"
                    >
                      Add to Cart
                    </button>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="empty-state px-6 py-10 text-center">
              <div className="mx-auto max-w-sm">
                <AgriIllustration variant="empty" className="mx-auto h-44" />
              </div>
              <h3 className="mt-3 text-lg font-semibold text-slate-900">No products matched your filters</h3>
              <p className="mt-2 text-sm text-slate-600">
                Try a broader search, remove a few filters, or explore another region.
              </p>
            </div>
          )}

          <div className="flex items-center justify-between rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm">
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
                disabled={page >= data.totalPages}
                onClick={() => handlePage(page + 1)}
                className="btn-secondary px-3 py-1 disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { addToCart, buyerFilterOptions, searchProducts } from '../../controllers/buyerController'

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
      <div className="rounded-lg border border-slate-200 bg-white p-5">
        <h2 className="text-xl font-semibold text-slate-800">Product Search</h2>
        <form onSubmit={handleSearch} className="mt-4 flex gap-2">
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search products, farmers, keywords..."
            className="w-full rounded-md border border-slate-300 px-3 py-2 outline-none focus:border-emerald-500"
          />
          <button
            type="submit"
            className="rounded-md bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700"
          >
            Search
          </button>
        </form>
        {message && <p className="mt-2 text-sm text-emerald-700">{message}</p>}
      </div>

      <div className="grid gap-4 lg:grid-cols-[260px_1fr]">
        <aside className="rounded-lg border border-slate-200 bg-white p-4">
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
                Min Price
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
                Max Price
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
              className="w-full rounded-md border border-slate-300 px-3 py-2 hover:bg-slate-100"
            >
              Clear Filters
            </button>
          </div>
        </aside>

        <div className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {data.items.map((product) => (
              <article key={product.id} className="rounded-lg border border-slate-200 bg-white p-4">
                <div className="mb-3 flex h-36 items-center justify-center rounded-md bg-slate-100 text-xs text-slate-400">
                  Product Image
                </div>
                <h3 className="text-base font-semibold text-slate-800">{product.name}</h3>
                <p className="mt-1 text-sm text-slate-600">{product.price} MAD / unit</p>
                <p className="mt-1 text-xs text-slate-500">Farmer: {product.farmerName}</p>
                <div className="mt-3 flex items-center gap-2">
                  <Link
                    to={`/buyer/product/${product.id}`}
                    className="rounded-md border border-slate-300 px-3 py-1.5 text-xs hover:bg-slate-100"
                  >
                    Details
                  </Link>
                  <button
                    type="button"
                    onClick={() => handleAddToCart(product)}
                    className="rounded-md bg-emerald-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-emerald-700"
                  >
                    Add to Cart
                  </button>
                </div>
              </article>
            ))}
          </div>

          <div className="flex items-center justify-between rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm">
            <span>
              Showing page {page} of {data.totalPages} ({data.total} products)
            </span>
            <div className="flex gap-2">
              <button
                type="button"
                disabled={page <= 1}
                onClick={() => handlePage(page - 1)}
                className="rounded-md border border-slate-300 px-3 py-1 disabled:opacity-50"
              >
                Previous
              </button>
              <button
                type="button"
                disabled={page >= data.totalPages}
                onClick={() => handlePage(page + 1)}
                className="rounded-md border border-slate-300 px-3 py-1 disabled:opacity-50"
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



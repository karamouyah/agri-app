import { useEffect, useMemo, useState } from 'react'
import {
  addProduct,
  deleteProduct,
  getControlledProducts,
  getProducts,
  updateProduct,
} from '../../controllers/farmerController'
import { formatDzd, formatDzdRange } from '../../../utils/currency'
import AgriIllustration from '../../../components/AgriIllustration'
import Reveal from '../../../components/Reveal'

const initialForm = {
  id: null,
  productId: '',
  price: '',
  quantity: '',
}

const categoryOptions = ['All', 'Vegetables', 'Fruits', 'Herbs', 'Dry products']

export default function FarmerProducts() {
  const [products, setProducts] = useState([])
  const [catalog, setCatalog] = useState([])
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [formData, setFormData] = useState(initialForm)
  const [catalogSearch, setCatalogSearch] = useState('')
  const [catalogCategory, setCatalogCategory] = useState('All')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const [pageError, setPageError] = useState('')

  const editing = useMemo(() => Boolean(formData.id), [formData.id])

  const filteredCatalog = useMemo(() => {
    const normalizedQuery = catalogSearch.trim().toLowerCase()

    return catalog.filter((item) => {
      const matchesCategory = catalogCategory === 'All' || item.category === catalogCategory
      const matchesQuery = !normalizedQuery || item.name.toLowerCase().includes(normalizedQuery)
      return item.isActive !== false && matchesCategory && matchesQuery
    })
  }, [catalog, catalogCategory, catalogSearch])

  const selectedProduct = useMemo(
    () => catalog.find((item) => String(item.id) === String(formData.productId)),
    [catalog, formData.productId],
  )

  const loadData = async () => {
    setIsLoading(true)
    setPageError('')

    const [productsResult, catalogResult] = await Promise.allSettled([
      getProducts(),
      getControlledProducts(),
    ])

    if (productsResult.status === 'fulfilled') {
      setProducts(productsResult.value)
    } else {
      setProducts([])
      setPageError(productsResult.reason?.message || 'Unable to load your current product listings.')
    }

    if (catalogResult.status === 'fulfilled') {
      setCatalog(catalogResult.value.filter((item) => item.isActive !== false))
    } else {
      setCatalog([])
      setPageError((current) => current || 'Unable to load the approved product catalog.')
    }

    setIsLoading(false)
  }

  useEffect(() => {
    loadData()
  }, [])

  const resetSelectorFilters = () => {
    setCatalogSearch('')
    setCatalogCategory('All')
  }

  const openCreateModal = () => {
    resetSelectorFilters()
    setSubmitError('')
    setFormData({
      ...initialForm,
      productId: catalog[0]?.id ? String(catalog[0].id) : '',
    })
    setIsOpen(true)
  }

  const openEditModal = (product) => {
    setCatalogSearch('')
    setCatalogCategory(product.category || 'All')
    setSubmitError('')
    setFormData({
      id: product.id,
      productId: String(product.productId),
      price: String(product.price),
      quantity: String(product.quantity),
    })
    setIsOpen(true)
  }

  const closeModal = () => {
    setIsOpen(false)
    setSubmitError('')
    setFormData(initialForm)
  }

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectProduct = (productId) => {
    setSubmitError('')
    setFormData((prev) => ({
      ...prev,
      productId: String(productId),
    }))
  }

  const validateForm = () => {
    if (!selectedProduct) {
      return 'You must choose a valid product from the approved catalog.'
    }

    const price = Number(formData.price)
    const quantity = Number(formData.quantity)

    if (!Number.isInteger(price) || price < 0) {
      return 'Price must be a valid non-negative integer in DZD.'
    }

    if (price < selectedProduct.minPrice || price > selectedProduct.maxPrice) {
      return `Price must be between ${selectedProduct.minPrice} and ${selectedProduct.maxPrice} DZD.`
    }

    if (!Number.isInteger(quantity) || quantity < 0) {
      return 'Quantity must be a valid non-negative integer.'
    }

    return ''
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    const validationError = validateForm()
    if (validationError) {
      setSubmitError(validationError)
      return
    }

    const payload = {
      ...formData,
      productId: Number(formData.productId),
      price: Number(formData.price),
      quantity: Number(formData.quantity),
    }

    try {
      setIsSubmitting(true)
      setSubmitError('')

      if (editing) {
        await updateProduct(payload)
      } else {
        await addProduct(payload)
      }

      closeModal()
      await loadData()
    } catch (error) {
      setSubmitError(error?.message || 'Unable to save this listing right now.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async (id) => {
    const confirmed = window.confirm('Delete this product listing?')
    if (!confirmed) return

    await deleteProduct(id)
    await loadData()
  }

  return (
    <section className="space-y-4">
      <Reveal>
        <div className="grid gap-4 rounded-lg border border-slate-200 bg-white p-5 lg:grid-cols-[1fr_280px]">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-700">Listings</p>
              <h2 className="text-2xl font-semibold text-slate-800">Approved products only</h2>
            </div>
            <button
              type="button"
              onClick={openCreateModal}
              className="btn-primary px-4 py-2 text-sm disabled:cursor-not-allowed disabled:bg-slate-300"
              disabled={catalog.length === 0}
            >
              Add Product
            </button>
          </div>
          <div className="media-shell p-2">
            <AgriIllustration variant="farmer" className="h-36" />
          </div>
        </div>
      </Reveal>

      {pageError && (
        <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          {pageError}
        </div>
      )}

      <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white p-4">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-slate-100 text-slate-600">
            <tr>
              <th className="px-3 py-2">Product</th>
              <th className="px-3 py-2">Category</th>
              <th className="px-3 py-2">Allowed Range</th>
              <th className="px-3 py-2">Your Price</th>
              <th className="px-3 py-2">Quantity</th>
              <th className="px-3 py-2">Status</th>
              <th className="px-3 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan="7" className="px-3 py-8 text-center text-slate-500">
                  Loading approved products and your listings...
                </td>
              </tr>
            ) : products.length === 0 ? (
              <tr>
                <td colSpan="7" className="px-3 py-8 text-center text-slate-500">
                  No product listings yet.
                </td>
              </tr>
            ) : (
              products.map((product) => (
                <tr key={product.id} className="border-b border-slate-100">
                  <td className="px-3 py-2">{product.name}</td>
                  <td className="px-3 py-2">{product.category}</td>
                  <td className="px-3 py-2">
                    {formatDzdRange(product.minPrice, product.maxPrice, product.unit)}
                  </td>
                  <td className="px-3 py-2">{formatDzd(product.price)}</td>
                  <td className="px-3 py-2">
                    {product.quantity} {product.unit}
                  </td>
                  <td className="px-3 py-2 capitalize">{product.status}</td>
                  <td className="px-3 py-2">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => openEditModal(product)}
                        className="rounded-md border border-slate-300 px-2 py-1 text-xs hover:bg-slate-100"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(product.id)}
                        className="rounded-md border border-red-300 px-2 py-1 text-xs text-red-700 hover:bg-red-50"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 px-4">
          <div className="w-full max-w-3xl rounded-lg border border-slate-200 bg-white p-5">
            <h3 className="text-lg font-semibold text-slate-800">
              {editing ? 'Edit Product Listing' : 'Add Product Listing'}
            </h3>

            {catalog.length === 0 ? (
              <div className="mt-4 space-y-4">
                <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-5 text-sm text-slate-700">
                  No approved products available yet.
                </div>
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="rounded-md border border-slate-300 px-4 py-2 text-sm hover:bg-slate-100"
                  >
                    Close
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="mt-4 space-y-4">
                {submitError && (
                  <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                    {submitError}
                  </p>
                )}

                <div className="grid gap-3 md:grid-cols-[2fr_1fr]">
                  <div>
                    <label htmlFor="catalogSearch" className="mb-1 block text-sm font-medium text-slate-700">
                      Search product
                    </label>
                    <input
                      id="catalogSearch"
                      type="text"
                      value={catalogSearch}
                      onChange={(event) => setCatalogSearch(event.target.value)}
                      placeholder="Search approved vegetables, fruits, herbs..."
                      className="w-full rounded-md border border-slate-300 px-3 py-2 outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label htmlFor="catalogCategory" className="mb-1 block text-sm font-medium text-slate-700">
                      Category
                    </label>
                    <select
                      id="catalogCategory"
                      value={catalogCategory}
                      onChange={(event) => setCatalogCategory(event.target.value)}
                      className="w-full rounded-md border border-slate-300 px-3 py-2 outline-none focus:border-emerald-500"
                    >
                      {categoryOptions.map((category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <p className="mb-2 text-sm font-medium text-slate-700">Approved products</p>
                  <div className="max-h-72 space-y-2 overflow-y-auto rounded-lg border border-slate-200 p-3">
                    {filteredCatalog.length === 0 ? (
                      <div className="rounded-md border border-slate-200 bg-slate-50 px-4 py-5 text-sm text-slate-600">
                        No approved products available yet.
                      </div>
                    ) : (
                      filteredCatalog.map((item) => {
                        const isSelected = String(item.id) === String(formData.productId)

                        return (
                          <button
                            key={item.id}
                            type="button"
                            onClick={() => handleSelectProduct(item.id)}
                            className={`w-full rounded-lg border px-4 py-3 text-left transition ${
                              isSelected
                                ? 'border-emerald-500 bg-emerald-50'
                                : 'border-slate-200 bg-white hover:border-emerald-300'
                            }`}
                          >
                            <div className="flex items-start justify-between gap-3">
                              <div>
                                <p className="font-medium text-slate-800">{item.name}</p>
                                <p className="text-sm text-slate-500">{item.category}</p>
                              </div>
                              <p className="text-sm font-medium text-slate-700">
                                {formatDzdRange(item.minPrice, item.maxPrice)}
                              </p>
                            </div>
                          </button>
                        )
                      })
                    )}
                  </div>
                </div>

                <div className="rounded-lg border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm text-emerald-900">
                  {selectedProduct ? (
                    <>
                      <strong>{selectedProduct.name}</strong> in <strong>{selectedProduct.category}</strong>
                      {` `}must be priced between {formatDzd(selectedProduct.minPrice)} and{' '}
                      {formatDzd(selectedProduct.maxPrice)} per {selectedProduct.unit}.
                    </>
                  ) : (
                    'No approved products available yet.'
                  )}
                </div>

                <div className="grid gap-3 md:grid-cols-2">
                  <div>
                    <label htmlFor="price" className="mb-1 block text-sm font-medium text-slate-700">
                      Price (DZD)
                    </label>
                    <input
                      id="price"
                      name="price"
                      type="number"
                      min={selectedProduct?.minPrice ?? 0}
                      max={selectedProduct?.maxPrice ?? undefined}
                      step="1"
                      value={formData.price}
                      onChange={handleChange}
                      required
                      className="w-full rounded-md border border-slate-300 px-3 py-2 outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label htmlFor="quantity" className="mb-1 block text-sm font-medium text-slate-700">
                      Quantity ({selectedProduct?.unit || 'kg'})
                    </label>
                    <input
                      id="quantity"
                      name="quantity"
                      type="number"
                      min="0"
                      step="1"
                      value={formData.quantity}
                      onChange={handleChange}
                      required
                      className="w-full rounded-md border border-slate-300 px-3 py-2 outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="rounded-md border border-slate-300 px-4 py-2 text-sm hover:bg-slate-100"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting || !selectedProduct}
                    className="rounded-md bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-slate-300"
                  >
                    {isSubmitting ? 'Saving...' : editing ? 'Save Listing' : 'Create Listing'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </section>
  )
}

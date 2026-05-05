// File responsibility: Renders an application screen that is mounted from the React router for a specific user workflow.
// Used by the React frontend or build tooling as part of the full-stack agriculture app.

// Imports: bring in React, routing, UI components, services, and helpers used below.
import { useEffect, useMemo, useState } from 'react'
import {
  addProduct,
  deleteProduct,
  getControlledProducts,
  getProducts,
  updateProduct,
} from '../../controllers/farmerController'
import PageHero from '../../../components/PageHero'
import { Card, Input, Select, StatusBadge, buttonStyles, cn } from '../../../components/ui'
import { formatDzd, formatDzdRange } from '../../../utils/currency'
import { getProductDisplayImage } from '../../../utils/productImages'

const initialForm = {
  id: null,
  productId: '',
  price: '',
  quantity: '',
}

const categoryOptions = ['All', 'Vegetables', 'Fruits', 'Herbs', 'Dry products']

export default function FarmerProducts() {
  // State: stores local UI data and is updated by event handlers or API responses.
  const [products, setProducts] = useState([])
  // State: stores local UI data and is updated by event handlers or API responses.
  const [catalog, setCatalog] = useState([])
  // State: stores local UI data and is updated by event handlers or API responses.
  const [isOpen, setIsOpen] = useState(false)
  // State: stores local UI data and is updated by event handlers or API responses.
  const [isLoading, setIsLoading] = useState(true)
  // State: stores local UI data and is updated by event handlers or API responses.
  const [formData, setFormData] = useState(initialForm)
  // State: stores local UI data and is updated by event handlers or API responses.
  const [catalogSearch, setCatalogSearch] = useState('')
  // State: stores local UI data and is updated by event handlers or API responses.
  const [catalogCategory, setCatalogCategory] = useState('All')
  // State: stores local UI data and is updated by event handlers or API responses.
  const [isSubmitting, setIsSubmitting] = useState(false)
  // State: stores local UI data and is updated by event handlers or API responses.
  const [submitError, setSubmitError] = useState('')
  // State: stores local UI data and is updated by event handlers or API responses.
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

  // loadData handles this module workflow, using its parameters and returning JSX, data, or a service result.
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

  // Effect: runs after render to load data, sync storage, or react to dependency changes.
  useEffect(() => {
    loadData()
  }, [])

  // resetSelectorFilters handles this module workflow, using its parameters and returning JSX, data, or a service result.
  const resetSelectorFilters = () => {
    setCatalogSearch('')
    setCatalogCategory('All')
  }

  // openCreateModal handles this module workflow, using its parameters and returning JSX, data, or a service result.
  const openCreateModal = () => {
    resetSelectorFilters()
    setSubmitError('')
    setFormData({
      ...initialForm,
      productId: catalog[0]?.id ? String(catalog[0].id) : '',
    })
    setIsOpen(true)
  }

  // openEditModal handles this module workflow, using its parameters and returning JSX, data, or a service result.
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

  // closeModal handles this module workflow, using its parameters and returning JSX, data, or a service result.
  const closeModal = () => {
    setIsOpen(false)
    setSubmitError('')
    setFormData(initialForm)
  }
  // handleChange handles this module workflow, using its parameters and returning JSX, data, or a service result.
  const handleChange = (event) => {
    const { name, value } = event.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }
  // handleSelectProduct handles this module workflow, using its parameters and returning JSX, data, or a service result.
  const handleSelectProduct = (productId) => {
    setSubmitError('')
    setFormData((prev) => ({
      ...prev,
      productId: String(productId),
    }))
  }

  // validateForm handles this module workflow, using its parameters and returning JSX, data, or a service result.
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
  // handleSubmit handles this module workflow, using its parameters and returning JSX, data, or a service result.
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
  // handleDelete handles this module workflow, using its parameters and returning JSX, data, or a service result.
  const handleDelete = async (id) => {
    const confirmed = window.confirm('Delete this product listing?')
    if (!confirmed) return

    await deleteProduct(id)
    await loadData()
  }

  return (
    <section className="space-y-4">
      <PageHero
        eyebrow="Listings"
        title="Approved products only"
        description="Choose from the approved catalog, keep prices inside the DZD range, and manage the live listings buyers can order from."
        variant="farmer"
        actions={[
          {
            label: 'Add Product',
            onClick: openCreateModal,
            disabled: catalog.length === 0,
          },
        ]}
        stats={[
          {
            label: 'Your listings',
            value: products.length,
            help: 'Farmer offers currently visible in the marketplace.',
          },
          {
            label: 'Approved catalog',
            value: catalog.length,
            help: 'Products already validated for farmer selection.',
          },
          {
            label: 'Pricing rule',
            value: 'DZD',
            help: 'Every listing is checked against the approved DZD range.',
          },
        ]}
      />

      {pageError && (
        <Card className="border-amber-200/90 bg-amber-50/90 px-4 py-3 text-sm text-amber-800 dark:border-amber-900/40 dark:bg-amber-950/30 dark:text-amber-200">
          {pageError}
        </Card>
      )}

      <Card className="overflow-hidden p-4 sm:p-5">
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
              Your approved product listings
            </h3>
          </div>
          <StatusBadge status={products.length > 0 ? 'Active' : 'No listings'} />
        </div>

        {isLoading ? (
          <div className="rounded-lg border border-dashed border-slate-300 px-4 py-12 text-center text-sm text-slate-500 dark:border-slate-700 dark:text-slate-400">
            Loading approved products and your listings...
          </div>
        ) : products.length === 0 ? (
          <div className="rounded-lg border border-dashed border-slate-300 px-4 py-12 text-center dark:border-slate-700">
            <h4 className="text-lg font-semibold text-slate-900 dark:text-slate-100">No product listings yet</h4>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
              Add your first approved product to start receiving buyer orders.
            </p>
            <button
              type="button"
              onClick={openCreateModal}
              className={cn(buttonStyles.primary, 'mt-5')}
              disabled={catalog.length === 0}
            >
              Add Product
            </button>
          </div>
        ) : (
          <div className="table-shell">
            <table className="table-base min-w-full text-left text-sm">
              <thead>
                <tr>
                  <th className="w-12 px-4 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
                    Photo
                  </th>
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
                    Product
                  </th>
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
                    Category
                  </th>
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
                    Allowed Range
                  </th>
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
                    Your Price
                  </th>
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
                    Quantity
                  </th>
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
                    Status
                  </th>
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {products.map((product) => (
                  <tr key={product.id} className="transition hover:bg-slate-50/80 dark:hover:bg-slate-800/50">
                    <td className="px-4 py-3">
                      <div className="h-10 w-10 overflow-hidden rounded-[4px] bg-slate-100 ring-1 ring-slate-200">
                        <img src={getProductDisplayImage(product)} alt="" className="h-full w-full object-cover" />
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div>
                        <p className="font-semibold text-slate-900 dark:text-slate-100">{product.name}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">Approved catalog item</p>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-slate-700 dark:text-slate-300">{product.category}</td>
                    <td className="px-4 py-3 text-slate-700 dark:text-slate-300">
                      {formatDzdRange(product.minPrice, product.maxPrice, product.unit)}
                    </td>
                    <td className="px-4 py-3 font-semibold text-emerald-700 dark:text-emerald-300">
                      {formatDzd(product.price)}
                    </td>
                    <td className="px-4 py-3 text-slate-700 dark:text-slate-300">
                      {product.quantity} {product.unit}
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={product.status} />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap items-center gap-2">
                        <button
                          type="button"
                          onClick={() => openEditModal(product)}
                          className={cn(buttonStyles.secondary, 'px-3 py-2 text-xs')}
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(product.id)}
                          className={cn(
                            buttonStyles.secondary,
                            'border-rose-200 text-rose-700 hover:border-rose-300 hover:bg-rose-50 dark:border-rose-900/40 dark:text-rose-300 dark:hover:border-rose-800 dark:hover:bg-rose-950/30',
                            'px-3 py-2 text-xs',
                          )}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/65 px-4 py-4 backdrop-blur-sm sm:py-6">
          <div className="flex min-h-full items-start justify-center sm:items-center">
          <Card className="my-auto w-full max-w-3xl max-h-[calc(100vh-2rem)] overflow-y-auto p-5 sm:max-h-[calc(100vh-3rem)] sm:p-6">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
              {editing ? 'Edit Product Listing' : 'Add Product Listing'}
            </h3>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
              Pick one approved catalog product, then set the quantity and DZD price inside the allowed range.
            </p>

            {catalog.length === 0 ? (
              <div className="mt-4 space-y-4">
                <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-5 text-sm text-slate-700 dark:border-slate-800 dark:bg-slate-950/40 dark:text-slate-300">
                  No approved products available yet.
                </div>
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={closeModal}
                    className={buttonStyles.secondary}
                  >
                    Close
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="mt-4 space-y-4">
                {submitError && (
                  <p className="rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700 dark:border-rose-900/40 dark:bg-rose-950/30 dark:text-rose-300">
                    {submitError}
                  </p>
                )}

                <div className="grid gap-3 md:grid-cols-[2fr_1fr]">
                  <div>
                    <label htmlFor="catalogSearch" className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">
                      Search product
                    </label>
                    <Input
                      id="catalogSearch"
                      type="text"
                      value={catalogSearch}
                      onChange={(event) => setCatalogSearch(event.target.value)}
                      placeholder="Search approved vegetables, fruits, herbs..."
                    />
                  </div>

                  <div>
                    <label htmlFor="catalogCategory" className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">
                      Category
                    </label>
                    <Select
                      id="catalogCategory"
                      value={catalogCategory}
                      onChange={(event) => setCatalogCategory(event.target.value)}
                    >
                      {categoryOptions.map((category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </Select>
                  </div>
                </div>

                <div>
                  <p className="mb-2 text-sm font-medium text-slate-700 dark:text-slate-200">Approved products</p>
                  <div className="max-h-72 space-y-2 overflow-y-auto rounded-lg border border-slate-200/90 bg-slate-50/70 p-3 dark:border-slate-800 dark:bg-slate-950/30">
                    {filteredCatalog.length === 0 ? (
                      <div className="rounded-lg border border-slate-200 bg-white px-4 py-5 text-sm text-slate-600 dark:border-slate-800 dark:bg-slate-900/90 dark:text-slate-300">
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
                            className={cn(
                              'w-full rounded-lg border px-4 py-3 text-left transition duration-200',
                              isSelected
                                ? 'border-emerald-500 bg-emerald-50 text-slate-900 shadow-sm dark:bg-emerald-950/35 dark:text-slate-100'
                                : 'border-slate-200 bg-white hover:border-emerald-300 hover:bg-emerald-50/50 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-emerald-500/40 dark:hover:bg-slate-800',
                            )}
                          >
                            <div className="flex items-start justify-between gap-3">
                              <div>
                                <p className="font-medium text-slate-800 dark:text-slate-100">{item.name}</p>
                                <p className="text-sm text-slate-500 dark:text-slate-400">{item.category}</p>
                              </div>
                              <p className="text-sm font-medium text-slate-700 dark:text-slate-200">
                                {formatDzdRange(item.minPrice, item.maxPrice, item.unit)}
                              </p>
                            </div>
                          </button>
                        )
                      })
                    )}
                  </div>
                </div>

                <div className="rounded-lg border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm text-emerald-900 dark:border-emerald-900/40 dark:bg-emerald-950/30 dark:text-emerald-200">
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
                    <label htmlFor="price" className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">
                      Price (DZD)
                    </label>
                    <Input
                      id="price"
                      name="price"
                      type="number"
                      min={selectedProduct?.minPrice ?? 0}
                      max={selectedProduct?.maxPrice ?? undefined}
                      step="1"
                      value={formData.price}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="quantity" className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">
                      Quantity ({selectedProduct?.unit || 'kg'})
                    </label>
                    <Input
                      id="quantity"
                      name="quantity"
                      type="number"
                      min="0"
                      step="1"
                      value={formData.quantity}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={closeModal}
                    className={buttonStyles.secondary}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting || !selectedProduct}
                    className={buttonStyles.primary}
                  >
                    {isSubmitting ? 'Saving...' : editing ? 'Save Listing' : 'Create Listing'}
                  </button>
                </div>
              </form>
            )}
          </Card>
          </div>
        </div>
      )}
    </section>
  )
}

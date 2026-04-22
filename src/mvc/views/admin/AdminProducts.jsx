import { useEffect, useMemo, useState } from 'react'
import {
  addCategory,
  addProduct,
  deleteCategory,
  deleteProduct,
  getCategories,
  getProducts,
  updateCategory,
  updateProduct,
} from '../../controllers/adminController'
import { Card, Input, PageHeader, SectionHeader, Select, buttonStyles, cn } from '../../../components/ui'
import { formatDzd } from '../../../utils/currency'

const initialProductForm = {
  id: null,
  name: '',
  categoryId: '',
  minPrice: '',
  maxPrice: '',
  suggestedPrice: '',
}

const PRODUCTS_PER_PAGE = 8

export default function AdminProducts() {
  const [categories, setCategories] = useState([])
  const [products, setProducts] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [pageError, setPageError] = useState('')
  const [categoryError, setCategoryError] = useState('')
  const [productError, setProductError] = useState('')
  const [newCategory, setNewCategory] = useState('')
  const [editingCategory, setEditingCategory] = useState(null)
  const [editName, setEditName] = useState('')
  const [productForm, setProductForm] = useState(initialProductForm)
  const [isSavingProduct, setIsSavingProduct] = useState(false)
  const [productSearch, setProductSearch] = useState('')
  const [currentPage, setCurrentPage] = useState(1)

  const isEditingProduct = useMemo(() => Boolean(productForm.id), [productForm.id])
  const filteredProducts = useMemo(() => {
    const normalizedQuery = productSearch.trim().toLowerCase()

    if (!normalizedQuery) return products

    return products.filter(
      (product) =>
        product.name.toLowerCase().includes(normalizedQuery) ||
        product.categoryName.toLowerCase().includes(normalizedQuery),
    )
  }, [products, productSearch])
  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE))
  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * PRODUCTS_PER_PAGE
    return filteredProducts.slice(startIndex, startIndex + PRODUCTS_PER_PAGE)
  }, [currentPage, filteredProducts])

  const resetProductForm = (nextCategories = categories) => {
    setProductError('')
    setProductForm({
      ...initialProductForm,
      categoryId: nextCategories[0]?.id ? String(nextCategories[0].id) : '',
    })
  }

  const loadData = async () => {
    setIsLoading(true)
    setPageError('')

    const [categoriesResult, productsResult] = await Promise.allSettled([getCategories(), getProducts()])

    if (categoriesResult.status === 'fulfilled') {
      setCategories(categoriesResult.value)
      setProductForm((current) => {
        if (current.categoryId || current.id) return current
        return {
          ...current,
          categoryId: categoriesResult.value[0]?.id ? String(categoriesResult.value[0].id) : '',
        }
      })
    } else {
      setCategories([])
      setPageError(categoriesResult.reason?.message || 'Unable to load categories right now.')
    }

    if (productsResult.status === 'fulfilled') {
      setProducts(productsResult.value)
    } else {
      setProducts([])
      setPageError((current) => current || productsResult.reason?.message || 'Unable to load products right now.')
    }

    setIsLoading(false)
  }

  useEffect(() => {
    loadData()
  }, [])

  useEffect(() => {
    setCurrentPage(1)
  }, [productSearch])

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages)
    }
  }, [currentPage, totalPages])

  const handleAddCategory = async (event) => {
    event.preventDefault()
    if (!newCategory.trim()) return

    try {
      setCategoryError('')
      await addCategory(newCategory.trim())
      setNewCategory('')
      await loadData()
    } catch (error) {
      setCategoryError(error?.message || 'Unable to add this category right now.')
    }
  }

  const handleDeleteCategory = async (id) => {
    const confirmed = window.confirm('Delete this category?')
    if (!confirmed) return

    try {
      setCategoryError('')
      await deleteCategory(id)
      await loadData()
    } catch (error) {
      setCategoryError(error?.message || 'Unable to delete this category right now.')
    }
  }

  const handleSaveCategory = async () => {
    if (!editingCategory || !editName.trim()) return

    try {
      setCategoryError('')
      await updateCategory(editingCategory.id, editName.trim())
      setEditingCategory(null)
      setEditName('')
      await loadData()
    } catch (error) {
      setCategoryError(error?.message || 'Unable to save this category right now.')
    }
  }

  const handleProductChange = (event) => {
    const { name, value } = event.target
    setProductError('')
    setProductForm((prev) => ({ ...prev, [name]: value }))
  }

  const startProductEdit = (product) => {
    setProductError('')
    setProductForm({
      id: product.id,
      name: product.name,
      categoryId: String(product.categoryId),
      minPrice: String(product.minPrice),
      maxPrice: String(product.maxPrice),
      suggestedPrice: product.suggestedPrice === null ? '' : String(product.suggestedPrice),
    })
  }

  const validateProductForm = () => {
    const name = productForm.name.trim()
    if (!name) return 'Product name is required.'
    if (!productForm.categoryId) return 'Category is required.'

    const minPrice = Number(productForm.minPrice)
    const maxPrice = Number(productForm.maxPrice)

    if (!Number.isFinite(minPrice) || minPrice < 0) return 'Minimum price must be 0 or higher.'
    if (!Number.isFinite(maxPrice) || maxPrice < minPrice) {
      return 'Maximum price must be greater than or equal to the minimum price.'
    }

    if (productForm.suggestedPrice !== '') {
      const suggestedPrice = Number(productForm.suggestedPrice)
      if (!Number.isFinite(suggestedPrice) || suggestedPrice < minPrice || suggestedPrice > maxPrice) {
        return 'Suggested price must stay between the minimum and maximum prices.'
      }
    }

    return ''
  }

  const handleProductSubmit = async (event) => {
    event.preventDefault()
    const validationError = validateProductForm()
    if (validationError) {
      setProductError(validationError)
      return
    }

    try {
      setIsSavingProduct(true)
      setProductError('')

      if (isEditingProduct) {
        await updateProduct(productForm.id, productForm)
      } else {
        await addProduct(productForm)
      }

      const freshProducts = await getProducts()
      setProducts(freshProducts)
      resetProductForm()
    } catch (error) {
      setProductError(error?.message || 'Unable to save this product right now.')
    } finally {
      setIsSavingProduct(false)
    }
  }

  const handleDeleteProduct = async (productId) => {
    const confirmed = window.confirm('Delete this product?')
    if (!confirmed) return

    try {
      setProductError('')
      await deleteProduct(productId)
      const freshProducts = await getProducts()
      setProducts(freshProducts)
      if (productForm.id === productId) {
        resetProductForm()
      }
    } catch (error) {
      setProductError(error?.message || 'Unable to delete this product right now.')
    }
  }

  return (
    <section className="app-page space-y-4">
      <PageHeader
        eyebrow="Catalog Governance"
        title="Manage categories and approved products"
        description="Maintain the product catalog, category structure, and DZD pricing ranges used across the marketplace."
        meta={[
          { label: 'Categories', value: categories.length },
          { label: 'Products', value: products.length },
          { label: 'Pricing', value: 'Min / Max / Suggested' },
        ]}
      />

      {pageError && (
        <Card className="border-amber-200/90 bg-amber-50/90 px-4 py-3 text-sm text-amber-800 dark:border-amber-900/40 dark:bg-amber-950/30 dark:text-amber-200">
          {pageError}
        </Card>
      )}

      <div className="grid gap-4 xl:grid-cols-[0.95fr_1.05fr]">
        <Card className="p-5 md:p-6">
          <SectionHeader
            eyebrow="Categories"
            title="Organize approved product groups"
            description="Add, rename, and maintain the top-level categories used across the marketplace."
          />

          <form onSubmit={handleAddCategory} className="mt-5 flex gap-3">
            <Input
              value={newCategory}
              onChange={(event) => setNewCategory(event.target.value)}
              placeholder="Add new category"
            />
            <button type="submit" className={buttonStyles.primary}>
              Add
            </button>
          </form>

          {categoryError && (
            <p className="mt-4 rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700 dark:border-rose-900/40 dark:bg-rose-950/30 dark:text-rose-300">
              {categoryError}
            </p>
          )}

          <div className="mt-5 space-y-3">
            {categories.map((category) => (
              <div
                key={category.id}
                className="surface-muted flex flex-col gap-3 p-4 md:flex-row md:items-center md:justify-between"
              >
                <div className="min-w-0 flex-1">
                  {editingCategory?.id === category.id ? (
                    <Input value={editName} onChange={(event) => setEditName(event.target.value)} />
                  ) : (
                    <p className="font-semibold text-slate-900 dark:text-slate-100">{category.name}</p>
                  )}
                </div>

                <div className="flex flex-wrap gap-2">
                  {editingCategory?.id === category.id ? (
                    <button type="button" onClick={handleSaveCategory} className={buttonStyles.primary}>
                      Save
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => {
                        setEditingCategory(category)
                        setEditName(category.name)
                      }}
                      className={buttonStyles.secondary}
                    >
                      Edit
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => handleDeleteCategory(category.id)}
                    className={cn(
                      buttonStyles.secondary,
                      'border-rose-200 text-rose-700 hover:border-rose-300 hover:bg-rose-50 dark:border-rose-900/40 dark:text-rose-300 dark:hover:bg-rose-950/30',
                    )}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-5 md:p-6">
          <SectionHeader
            eyebrow="Products"
            title={isEditingProduct ? 'Edit approved product' : 'Add approved product'}
            description="Create and maintain products linked to existing categories, with minimum, maximum, and optional suggested DZD prices."
          />

          {categories.length === 0 ? (
            <div className="mt-5 rounded-lg border border-dashed border-slate-300 px-4 py-12 text-center text-sm text-slate-500 dark:border-slate-700 dark:text-slate-400">
              Add at least one category before creating products.
            </div>
          ) : (
            <form onSubmit={handleProductSubmit} className="mt-5 space-y-4">
              {productError && (
                <p className="rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700 dark:border-rose-900/40 dark:bg-rose-950/30 dark:text-rose-300">
                  {productError}
                </p>
              )}

              <div>
                <label htmlFor="name" className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">
                  Product name
                </label>
                <Input
                  id="name"
                  name="name"
                  value={productForm.name}
                  onChange={handleProductChange}
                  placeholder="Enter product name"
                  required
                />
              </div>

              <div>
                <label htmlFor="categoryId" className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">
                  Category
                </label>
                <Select
                  id="categoryId"
                  name="categoryId"
                  value={productForm.categoryId}
                  onChange={handleProductChange}
                  required
                >
                  <option value="">Select a category</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </Select>
              </div>

              <div className="grid gap-3 md:grid-cols-2">
                <div>
                  <label htmlFor="minPrice" className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">
                    Min price (DZD)
                  </label>
                  <Input
                    id="minPrice"
                    name="minPrice"
                    type="number"
                    min="0"
                    step="1"
                    value={productForm.minPrice}
                    onChange={handleProductChange}
                    required
                  />
                </div>

                <div>
                  <label htmlFor="maxPrice" className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">
                    Max price (DZD)
                  </label>
                  <Input
                    id="maxPrice"
                    name="maxPrice"
                    type="number"
                    min="0"
                    step="1"
                    value={productForm.maxPrice}
                    onChange={handleProductChange}
                    required
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="suggestedPrice"
                  className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200"
                >
                  Suggested price (optional)
                </label>
                <Input
                  id="suggestedPrice"
                  name="suggestedPrice"
                  type="number"
                  min="0"
                  step="1"
                  value={productForm.suggestedPrice}
                  onChange={handleProductChange}
                  placeholder="Optional suggested price"
                />
              </div>

              <div className="flex flex-wrap justify-end gap-2">
                {isEditingProduct ? (
                  <button type="button" onClick={() => resetProductForm()} className={buttonStyles.secondary}>
                    Cancel
                  </button>
                ) : null}
                <button type="submit" disabled={isSavingProduct} className={buttonStyles.primary}>
                  {isSavingProduct ? 'Saving...' : 'Save'}
                </button>
              </div>
            </form>
          )}
        </Card>
      </div>

      <Card className="overflow-hidden">
        <div className="px-5 py-5 md:px-6">
          <SectionHeader
            eyebrow="Product List"
            title="View and manage all approved products"
            description="Review every product in the catalog, inspect its category and prices, and edit or delete it from the same admin page."
          />
          <div className="mt-4 max-w-xs">
            <Input
              value={productSearch}
              onChange={(event) => setProductSearch(event.target.value)}
              placeholder="Search products"
              aria-label="Search products"
              className="py-2.5"
            />
          </div>
        </div>

        <div className="table-shell mx-5 mb-6 mt-0 md:mx-6">
          {isLoading ? (
            <div className="rounded-lg border border-dashed border-slate-300 px-4 py-12 text-center text-sm text-slate-500 dark:border-slate-700 dark:text-slate-400">
              Loading products...
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="rounded-lg border border-dashed border-slate-300 px-4 py-12 text-center text-sm text-slate-500 dark:border-slate-700 dark:text-slate-400">
              {products.length === 0 ? 'No products available yet.' : 'No products match your search.'}
            </div>
          ) : (
            <div className="space-y-4">
              <div className="overflow-x-auto">
                <table className="table-base">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Category</th>
                      <th>Prices</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedProducts.map((product) => (
                      <tr key={product.id}>
                        <td>
                          <div className="font-semibold text-slate-900 dark:text-slate-100">{product.name}</div>
                        </td>
                        <td className="text-slate-700 dark:text-slate-300">{product.categoryName}</td>
                        <td>
                          <div className="space-y-1 text-sm text-slate-600 dark:text-slate-300">
                            <div>
                              Min: <span className="font-medium">{formatDzd(product.minPrice)}</span>
                            </div>
                            <div>
                              Max: <span className="font-medium">{formatDzd(product.maxPrice)}</span>
                            </div>
                            <div>
                              Suggested:{' '}
                              <span className="font-medium">
                                {product.suggestedPrice === null ? 'Not set' : formatDzd(product.suggestedPrice)}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td>
                          <div className="flex flex-wrap gap-2">
                            <button
                              type="button"
                              onClick={() => startProductEdit(product)}
                              className={cn(buttonStyles.secondary, 'px-3 py-2 text-xs')}
                            >
                              Edit
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteProduct(product.id)}
                              className={cn(
                                buttonStyles.secondary,
                                'border-rose-200 px-3 py-2 text-xs text-rose-700 hover:border-rose-300 hover:bg-rose-50 dark:border-rose-900/40 dark:text-rose-300 dark:hover:bg-rose-950/30',
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

              <div className="flex flex-col gap-3 border-t border-slate-200 pt-4 text-sm text-slate-600 dark:border-slate-800 dark:text-slate-300 sm:flex-row sm:items-center sm:justify-between">
                <p>
                  Showing {(currentPage - 1) * PRODUCTS_PER_PAGE + 1}-
                  {Math.min(currentPage * PRODUCTS_PER_PAGE, filteredProducts.length)} of {filteredProducts.length}
                </p>
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
                    disabled={currentPage === 1}
                    className={cn(buttonStyles.secondary, 'px-3 py-2 text-xs')}
                  >
                    Previous
                  </button>
                  <span className="px-2 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
                    Page {currentPage} / {totalPages}
                  </span>
                  <button
                    type="button"
                    onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}
                    disabled={currentPage === totalPages}
                    className={cn(buttonStyles.secondary, 'px-3 py-2 text-xs')}
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </Card>
    </section>
  )
}


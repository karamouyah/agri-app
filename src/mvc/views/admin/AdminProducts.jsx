// File responsibility: Renders an application screen that is mounted from the React router for a specific user workflow.
// Used by the React frontend or build tooling as part of the full-stack agriculture app.

// Imports: bring in React, routing, UI components, services, and helpers used below.
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
import { getProductImage } from '../../../utils/productImages'

const initialProductForm = {
  id: null,
  name: '',
  categoryId: '',
  minPrice: '',
  maxPrice: '',
  suggestedPrice: '',
  imageFile: null,
  imagePreview: '',
  imageDataUrl: '',
  imageUrl: '',
}

const PRODUCTS_PER_PAGE = 8

export default function AdminProducts() {
  // State: stores local UI data and is updated by event handlers or API responses.
  const [categories, setCategories] = useState([])
  // State: stores local UI data and is updated by event handlers or API responses.
  const [products, setProducts] = useState([])
  // State: stores local UI data and is updated by event handlers or API responses.
  const [isLoading, setIsLoading] = useState(true)
  // State: stores local UI data and is updated by event handlers or API responses.
  const [pageError, setPageError] = useState('')
  // State: stores local UI data and is updated by event handlers or API responses.
  const [categoryError, setCategoryError] = useState('')
  // State: stores local UI data and is updated by event handlers or API responses.
  const [productError, setProductError] = useState('')
  // State: stores local UI data and is updated by event handlers or API responses.
  const [newCategory, setNewCategory] = useState('')
  // State: stores local UI data and is updated by event handlers or API responses.
  const [editingCategory, setEditingCategory] = useState(null)
  // State: stores local UI data and is updated by event handlers or API responses.
  const [editName, setEditName] = useState('')
  // State: stores local UI data and is updated by event handlers or API responses.
  const [addForm, setAddForm] = useState(initialProductForm)
  // State: stores local UI data and is updated by event handlers or API responses.
  const [editModal, setEditModal] = useState(null)
  // State: stores local UI data and is updated by event handlers or API responses.
  const [isSavingProduct, setIsSavingProduct] = useState(false)
  // State: stores local UI data and is updated by event handlers or API responses.
  const [productSearch, setProductSearch] = useState('')
  // State: stores local UI data and is updated by event handlers or API responses.
  const [currentPage, setCurrentPage] = useState(1)
  // State: stores local UI data and is updated by event handlers or API responses.
  const [successMsg, setSuccessMsg] = useState('')
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

  // resetAddForm handles this module workflow, using its parameters and returning JSX, data, or a service result.
  const resetAddForm = (nextCategories = categories) => {
    setProductError('')
    setAddForm({
      ...initialProductForm,
      categoryId: nextCategories[0]?.id ? String(nextCategories[0].id) : '',
    })
  }

  // loadData handles this module workflow, using its parameters and returning JSX, data, or a service result.
  const loadData = async () => {
    setIsLoading(true)
    setPageError('')

    const [categoriesResult, productsResult] = await Promise.allSettled([getCategories(), getProducts()])

    if (categoriesResult.status === 'fulfilled') {
      setCategories(categoriesResult.value)
      setAddForm((current) => {
        if (current.categoryId) return current
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

  // Effect: runs after render to load data, sync storage, or react to dependency changes.
  useEffect(() => {
    loadData()
  }, [])

  // Effect: runs after render to load data, sync storage, or react to dependency changes.
  useEffect(() => {
    setCurrentPage(1)
  }, [productSearch])

  // Effect: runs after render to load data, sync storage, or react to dependency changes.
  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages)
    }
  }, [currentPage, totalPages])
  // handleAddCategory handles this module workflow, using its parameters and returning JSX, data, or a service result.
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
  // handleDeleteCategory handles this module workflow, using its parameters and returning JSX, data, or a service result.
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
  // handleSaveCategory handles this module workflow, using its parameters and returning JSX, data, or a service result.
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
  // handleAddChange handles this module workflow, using its parameters and returning JSX, data, or a service result.
  const handleAddChange = (event) => {
    const { name, value } = event.target
    setProductError('')
    setAddForm((prev) => ({ ...prev, [name]: value }))
  }

  // handleEditChange handles this module workflow, using its parameters and returning JSX, data, or a service result.
  const handleEditChange = (event) => {
    const { name, value } = event.target
    setProductError('')
    setEditModal((prev) => ({ ...prev, [name]: value }))
  }

  const readProductImage = (file, onLoad) => {
    if (!file) {
      return
    }

    if (!file.type.startsWith('image/')) {
      setProductError('Product picture must be an image file.')
      return
    }

    if (file.size > 1.5 * 1024 * 1024) {
      setProductError('Product picture must be 1.5 MB or smaller.')
      return
    }

    const reader = new FileReader()
    reader.onload = () => {
      const dataUrl = typeof reader.result === 'string' ? reader.result : ''
      onLoad(dataUrl)
    }
    reader.readAsDataURL(file)
  }

  // handleAddImageChange stores a local image preview and sends the file with the next save.
  const handleAddImageChange = (event) => {
    const file = event.target.files?.[0] || null
    setProductError('')

    if (!file) {
      setAddForm((prev) => ({ ...prev, imageFile: null, imagePreview: '', imageDataUrl: '' }))
      return
    }

    readProductImage(file, (dataUrl) => {
      setAddForm((prev) => ({
        ...prev,
        imageFile: file,
        imagePreview: dataUrl,
        imageDataUrl: dataUrl,
      }))
    })
  }

  // handleEditImageChange stores a local image preview and sends the file with the next save.
  const handleEditImageChange = (event) => {
    const file = event.target.files?.[0] || null
    setProductError('')

    if (!file) {
      setEditModal((prev) => ({ ...prev, imageFile: null, imagePreview: '', imageDataUrl: '' }))
      return
    }

    readProductImage(file, (dataUrl) => {
      setEditModal((prev) => ({
        ...prev,
        imageFile: file,
        imagePreview: dataUrl,
        imageDataUrl: dataUrl,
      }))
    })
  }

  // openEditModal handles this module workflow, using its parameters and returning JSX, data, or a service result.
  const openEditModal = (product) => {
    setProductError('')
    setEditModal({
      id: product.id,
      name: product.name,
      categoryId: String(product.categoryId),
      minPrice: String(product.minPrice),
      maxPrice: String(product.maxPrice),
      suggestedPrice: product.suggestedPrice === null ? '' : String(product.suggestedPrice),
      imageFile: null,
      imagePreview: '',
      imageDataUrl: '',
      imageUrl: product.imageUrl || '',
    })
  }

  // closeEditModal handles this module workflow, using its parameters and returning JSX, data, or a service result.
  const closeEditModal = () => {
    setEditModal(null)
    setProductError('')
  }

  const handleProductTableImageChange = (product, event) => {
    const file = event.target.files?.[0] || null
    event.target.value = ''
    setProductError('')

    if (!file) return

    readProductImage(file, async (dataUrl) => {
      try {
        setIsSavingProduct(true)
        await updateProduct(product.id, {
          id: product.id,
          name: product.name,
          categoryId: product.categoryId,
          minPrice: product.minPrice,
          maxPrice: product.maxPrice,
          suggestedPrice: product.suggestedPrice ?? '',
          imageDataUrl: dataUrl,
        })
        const freshProducts = await getProducts()
        setProducts(freshProducts)
      } catch (error) {
        setProductError(error?.message || 'Unable to save this product picture right now.')
      } finally {
        setIsSavingProduct(false)
      }
    })
  }

  // validateProductForm handles this module workflow, using its parameters and returning JSX, data, or a service result.
  const validateProductForm = (form) => {
    const name = form.name.trim()
    if (!name) return 'Product name is required.'
    if (!form.categoryId) return 'Category is required.'

    const minPrice = Number(form.minPrice)
    const maxPrice = Number(form.maxPrice)

    if (!Number.isFinite(minPrice) || minPrice < 0) return 'Minimum price must be 0 or higher.'
    if (!Number.isFinite(maxPrice) || maxPrice < minPrice) {
      return 'Maximum price must be greater than or equal to the minimum price.'
    }

    if (form.suggestedPrice !== '') {
      const suggestedPrice = Number(form.suggestedPrice)
      if (!Number.isFinite(suggestedPrice) || suggestedPrice < minPrice || suggestedPrice > maxPrice) {
        return 'Suggested price must stay between the minimum and maximum prices.'
      }
    }

    return ''
  }
  // handleAddSubmit handles this module workflow, using its parameters and returning JSX, data, or a service result.
  const handleAddSubmit = async (event) => {
    event.preventDefault()
    const validationError = validateProductForm(addForm)
    if (validationError) {
      setProductError(validationError)
      return
    }

    try {
      setIsSavingProduct(true)
      setProductError('')
      await addProduct(addForm)
      const freshProducts = await getProducts()
      setProducts(freshProducts)
      resetAddForm()
      setSuccessMsg('Product added successfully!')
      setTimeout(() => setSuccessMsg(''), 3000)
    } catch (error) {
      setProductError(error?.message || 'Unable to add this product right now.')
    } finally {
      setIsSavingProduct(false)
    }
  }

  // handleEditSubmit handles this module workflow, using its parameters and returning JSX, data, or a service result.
  const handleEditSubmit = async (event) => {
    event.preventDefault()
    const validationError = validateProductForm(editModal)
    if (validationError) {
      setProductError(validationError)
      return
    }

    try {
      setIsSavingProduct(true)
      setProductError('')
      await updateProduct(editModal.id, editModal)
      const freshProducts = await getProducts()
      setProducts(freshProducts)
      closeEditModal()
      setSuccessMsg('Product updated successfully!')
      setTimeout(() => setSuccessMsg(''), 3000)
    } catch (error) {
      setProductError(error?.message || 'Unable to update this product right now.')
    } finally {
      setIsSavingProduct(false)
    }
  }
  // handleDeleteProduct handles this module workflow, using its parameters and returning JSX, data, or a service result.
  const handleDeleteProduct = async (productId) => {
    const confirmed = window.confirm('Delete this product permanently?')
    if (!confirmed) return

    try {
      setProductError('')
      await deleteProduct(productId)
      const freshProducts = await getProducts()
      setProducts(freshProducts)
      setSuccessMsg('Product deleted successfully!')
      setTimeout(() => setSuccessMsg(''), 3000)
    } catch (error) {
      const msg = error?.message || 'Unable to delete this product.'
      if (msg.includes('orders')) {
        setProductError('Cannot delete: Product is linked to existing orders.')
      } else if (msg.includes('permission') || msg.includes('403')) {
        setProductError('Permission denied: Only ministry users can delete products.')
      } else {
        setProductError(msg)
      }
    }
  }

  const getDisplayImage = (product) => product.imageUrl || getProductImage(product.name)
  const addImagePreview = addForm.imagePreview || addForm.imageUrl || getProductImage(addForm.name)
  const editImagePreview = editModal ? (editModal.imagePreview || editModal.imageUrl || getProductImage(editModal.name)) : ''

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

      {successMsg && (
        <Card className="border-emerald-200/90 bg-emerald-50/90 px-4 py-3 text-sm text-emerald-800 dark:border-emerald-900/40 dark:bg-emerald-950/30 dark:text-emerald-200">
          {successMsg}
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

        <Card id="product-form" className="p-5 md:p-6">
          <SectionHeader
            eyebrow="Products"
            title="Add approved product"
            description="Create new products linked to existing categories, with minimum, maximum, and optional suggested DZD prices."
          />

          {categories.length === 0 ? (
            <div className="mt-5 rounded-lg border border-dashed border-slate-300 px-4 py-12 text-center text-sm text-slate-500 dark:border-slate-700 dark:text-slate-400">
              Add at least one category before creating products.
            </div>
          ) : (
            <form onSubmit={handleAddSubmit} className="mt-5 space-y-4">
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
                  value={addForm.name}
                  onChange={handleAddChange}
                  placeholder="Enter product name"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="productImage"
                  className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200"
                >
                  Product picture
                </label>
                <div className="flex flex-col gap-3 rounded-lg border border-slate-200 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-950/40 sm:flex-row sm:items-center">
                  <div className="h-20 w-20 shrink-0 overflow-hidden rounded-[6px] bg-slate-100 ring-1 ring-slate-200 dark:bg-slate-900 dark:ring-slate-700">
                    <img src={addImagePreview} alt="" className="h-full w-full object-cover" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <Input
                      id="productImage"
                      name="productImage"
                      type="file"
                      accept="image/*"
                      onChange={handleAddImageChange}
                      className="py-2"
                    />
                    <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                      {addForm.imageFile ? addForm.imageFile.name : 'Choose a new image from your computer.'}
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <label htmlFor="categoryId" className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">
                  Category
                </label>
                <Select
                  id="categoryId"
                  name="categoryId"
                  value={addForm.categoryId}
                  onChange={handleAddChange}
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
                    value={addForm.minPrice}
                    onChange={handleAddChange}
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
                    value={addForm.maxPrice}
                    onChange={handleAddChange}
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
                  value={addForm.suggestedPrice}
                  onChange={handleAddChange}
                  placeholder="Optional suggested price"
                />
              </div>

              <div className="flex flex-wrap justify-end gap-2">
                <button type="submit" disabled={isSavingProduct} className={buttonStyles.primary}>
                  {isSavingProduct ? 'Adding...' : 'Add Product'}
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
                      <th className="w-12">Photo</th>
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
                          <div className="h-10 w-10 overflow-hidden rounded-[4px] bg-slate-100 ring-1 ring-slate-200">
                            <img src={getDisplayImage(product)} alt="" className="h-full w-full object-cover" />
                          </div>
                        </td>
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
                            <label className={cn(buttonStyles.secondary, 'cursor-pointer px-3 py-2 text-xs')}>
                              Picture
                              <input
                                type="file"
                                accept="image/*"
                                onChange={(event) => handleProductTableImageChange(product, event)}
                                className="sr-only"
                              />
                            </label>
                            <button
                              type="button"
                              onClick={() => openEditModal(product)}
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

      {editModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={closeEditModal}>
          <Card className="max-h-[90vh] w-full max-w-2xl overflow-y-auto p-5 md:p-6" onClick={(e) => e.stopPropagation()}>
            <SectionHeader
              eyebrow="Edit Product"
              title="Update product details"
              description="Modify product information, pricing, and image."
            />

            <form onSubmit={handleEditSubmit} className="mt-5 space-y-4">
              {productError && (
                <p className="rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700 dark:border-rose-900/40 dark:bg-rose-950/30 dark:text-rose-300">
                  {productError}
                </p>
              )}

              <div>
                <label htmlFor="edit-name" className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">
                  Product name
                </label>
                <Input
                  id="edit-name"
                  name="name"
                  value={editModal.name}
                  onChange={handleEditChange}
                  placeholder="Enter product name"
                  required
                />
              </div>

              <div>
                <label htmlFor="edit-image" className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">
                  Product picture
                </label>
                <div className="flex flex-col gap-3 rounded-lg border border-slate-200 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-950/40 sm:flex-row sm:items-center">
                  <div className="h-20 w-20 shrink-0 overflow-hidden rounded-[6px] bg-slate-100 ring-1 ring-slate-200 dark:bg-slate-900 dark:ring-slate-700">
                    <img src={editImagePreview} alt="" className="h-full w-full object-cover" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <Input
                      id="edit-image"
                      name="productImage"
                      type="file"
                      accept="image/*"
                      onChange={handleEditImageChange}
                      className="py-2"
                    />
                    <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                      {editModal.imageFile ? editModal.imageFile.name : 'Choose a new image to replace current.'}
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <label htmlFor="edit-category" className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">
                  Category
                </label>
                <Select
                  id="edit-category"
                  name="categoryId"
                  value={editModal.categoryId}
                  onChange={handleEditChange}
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
                  <label htmlFor="edit-minPrice" className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">
                    Min price (DZD)
                  </label>
                  <Input
                    id="edit-minPrice"
                    name="minPrice"
                    type="number"
                    min="0"
                    step="1"
                    value={editModal.minPrice}
                    onChange={handleEditChange}
                    required
                  />
                </div>

                <div>
                  <label htmlFor="edit-maxPrice" className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">
                    Max price (DZD)
                  </label>
                  <Input
                    id="edit-maxPrice"
                    name="maxPrice"
                    type="number"
                    min="0"
                    step="1"
                    value={editModal.maxPrice}
                    onChange={handleEditChange}
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="edit-suggestedPrice" className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">
                  Suggested price (optional)
                </label>
                <Input
                  id="edit-suggestedPrice"
                  name="suggestedPrice"
                  type="number"
                  min="0"
                  step="1"
                  value={editModal.suggestedPrice}
                  onChange={handleEditChange}
                  placeholder="Optional suggested price"
                />
              </div>

              <div className="flex flex-wrap justify-end gap-2">
                <button type="button" onClick={closeEditModal} className={buttonStyles.secondary}>
                  Cancel
                </button>
                <button type="submit" disabled={isSavingProduct} className={buttonStyles.primary}>
                  {isSavingProduct ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </section>
  )
}

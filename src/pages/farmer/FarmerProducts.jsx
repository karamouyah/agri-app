import { useEffect, useMemo, useState } from 'react'
import {
  addProduct,
  deleteProduct,
  getProducts,
  updateProduct,
} from '../../mvc/controllers/farmerController'

const categories = ['Vegetables', 'Fruits', 'Cereals', 'Legumes', 'Herbs', 'Other']

const initialForm = {
  id: null,
  name: '',
  category: 'Vegetables',
  price: '',
  quantity: '',
  description: '',
  imageUrl: '',
}

export default function FarmerProducts() {
  const [products, setProducts] = useState([])
  const [isOpen, setIsOpen] = useState(false)
  const [formData, setFormData] = useState(initialForm)

  const editing = useMemo(() => Boolean(formData.id), [formData.id])

  const loadProducts = async () => {
    const data = await getProducts()
    setProducts(data)
  }

  useEffect(() => {
    loadProducts()
  }, [])

  const openCreateModal = () => {
    setFormData(initialForm)
    setIsOpen(true)
  }

  const openEditModal = (product) => {
    setFormData({
      ...product,
      price: String(product.price),
      quantity: String(product.quantity),
    })
    setIsOpen(true)
  }

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    const payload = {
      ...formData,
      price: Number(formData.price),
      quantity: Number(formData.quantity),
    }

    if (editing) {
      await updateProduct(payload)
    } else {
      await addProduct(payload)
    }

    setIsOpen(false)
    setFormData(initialForm)
    await loadProducts()
  }

  const handleDelete = async (id) => {
    const confirmed = window.confirm('Delete this product?')
    if (!confirmed) return

    await deleteProduct(id)
    await loadProducts()
  }

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between rounded-lg border border-slate-200 bg-white p-5">
        <div>
          <h2 className="text-xl font-semibold text-slate-800">Product Management</h2>
          <p className="text-sm text-slate-600">Add, edit, and remove farm products.</p>
        </div>
        <button
          type="button"
          onClick={openCreateModal}
          className="rounded-md bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700"
        >
          Add Product
        </button>
      </div>

      <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white p-4">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-slate-100 text-slate-600">
            <tr>
              <th className="px-3 py-2">Name</th>
              <th className="px-3 py-2">Category</th>
              <th className="px-3 py-2">Price</th>
              <th className="px-3 py-2">Quantity</th>
              <th className="px-3 py-2">Status</th>
              <th className="px-3 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id} className="border-b border-slate-100">
                <td className="px-3 py-2">{product.name}</td>
                <td className="px-3 py-2">{product.category}</td>
                <td className="px-3 py-2">{product.price} MAD</td>
                <td className="px-3 py-2">{product.quantity}</td>
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
            ))}
          </tbody>
        </table>
      </div>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 px-4">
          <div className="w-full max-w-lg rounded-lg border border-slate-200 bg-white p-5">
            <h3 className="text-lg font-semibold text-slate-800">
              {editing ? 'Edit Product' : 'Add Product'}
            </h3>

            <form onSubmit={handleSubmit} className="mt-4 grid gap-3 md:grid-cols-2">
              <div>
                <label htmlFor="name" className="mb-1 block text-sm font-medium text-slate-700">
                  Name
                </label>
                <input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full rounded-md border border-slate-300 px-3 py-2 outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label htmlFor="category" className="mb-1 block text-sm font-medium text-slate-700">
                  Category
                </label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full rounded-md border border-slate-300 px-3 py-2 outline-none focus:border-emerald-500"
                >
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="price" className="mb-1 block text-sm font-medium text-slate-700">
                  Price (MAD)
                </label>
                <input
                  id="price"
                  name="price"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.price}
                  onChange={handleChange}
                  required
                  className="w-full rounded-md border border-slate-300 px-3 py-2 outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label htmlFor="quantity" className="mb-1 block text-sm font-medium text-slate-700">
                  Quantity
                </label>
                <input
                  id="quantity"
                  name="quantity"
                  type="number"
                  min="0"
                  value={formData.quantity}
                  onChange={handleChange}
                  required
                  className="w-full rounded-md border border-slate-300 px-3 py-2 outline-none focus:border-emerald-500"
                />
              </div>

              <div className="md:col-span-2">
                <label htmlFor="description" className="mb-1 block text-sm font-medium text-slate-700">
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows={3}
                  value={formData.description}
                  onChange={handleChange}
                  required
                  className="w-full rounded-md border border-slate-300 px-3 py-2 outline-none focus:border-emerald-500"
                />
              </div>

              <div className="md:col-span-2">
                <label htmlFor="imageUrl" className="mb-1 block text-sm font-medium text-slate-700">
                  Image URL (optional)
                </label>
                <input
                  id="imageUrl"
                  name="imageUrl"
                  type="url"
                  value={formData.imageUrl}
                  onChange={handleChange}
                  className="w-full rounded-md border border-slate-300 px-3 py-2 outline-none focus:border-emerald-500"
                />
              </div>

              <div className="md:col-span-2 mt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="rounded-md border border-slate-300 px-4 py-2 text-sm hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-md bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700"
                >
                  {editing ? 'Save Changes' : 'Create Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  )
}

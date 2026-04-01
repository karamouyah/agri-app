import { useEffect, useState } from 'react'
import {
  addCategory,
  deleteCategory,
  getCategories,
  getOfficialPrices,
  setOfficialPrice,
  updateCategory,
} from '../../mvc/controllers/adminController'

const emptyPrice = { min: '', max: '', suggested: '' }

export default function AdminProducts() {
  const [categories, setCategories] = useState([])
  const [prices, setPrices] = useState([])
  const [newCategory, setNewCategory] = useState('')
  const [editingCategory, setEditingCategory] = useState(null)
  const [editName, setEditName] = useState('')
  const [priceDrafts, setPriceDrafts] = useState({})

  const load = async () => {
    const [categoryData, priceData] = await Promise.all([getCategories(), getOfficialPrices()])
    setCategories(categoryData)
    setPrices(priceData)

    const drafts = {}
    priceData.forEach((item) => {
      drafts[item.categoryId] = {
        min: String(item.min),
        max: String(item.max),
        suggested: String(item.suggested),
      }
    })
    setPriceDrafts(drafts)
  }

  useEffect(() => {
    load()
  }, [])

  const handleAddCategory = async (event) => {
    event.preventDefault()
    if (!newCategory.trim()) return

    await addCategory(newCategory.trim())
    setNewCategory('')
    await load()
  }

  const handleDeleteCategory = async (id) => {
    const confirmed = window.confirm('Delete this category?')
    if (!confirmed) return

    await deleteCategory(id)
    await load()
  }

  const handleSaveCategory = async () => {
    if (!editingCategory || !editName.trim()) return

    await updateCategory(editingCategory.id, editName.trim())
    setEditingCategory(null)
    setEditName('')
    await load()
  }

  const handlePriceChange = (categoryId, field, value) => {
    setPriceDrafts((prev) => ({
      ...prev,
      [categoryId]: {
        ...(prev[categoryId] || emptyPrice),
        [field]: value,
      },
    }))
  }

  const handleSavePrice = async (categoryId) => {
    const draft = priceDrafts[categoryId] || emptyPrice
    await setOfficialPrice(categoryId, {
      min: Number(draft.min || 0),
      max: Number(draft.max || 0),
      suggested: Number(draft.suggested || 0),
    })
    await load()
  }

  const getPriceByCategory = (categoryId) =>
    prices.find((price) => price.categoryId === categoryId) || { min: 0, max: 0, suggested: 0 }

  return (
    <section className="space-y-4">
      <div className="rounded-lg border border-slate-200 bg-white p-5">
        <h2 className="text-xl font-semibold text-slate-800">Product Management</h2>
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <div className="rounded-lg border border-slate-200 bg-white p-5">
          <h3 className="text-base font-semibold text-slate-800">Categories</h3>
          <form onSubmit={handleAddCategory} className="mt-3 flex gap-2">
            <input
              value={newCategory}
              onChange={(event) => setNewCategory(event.target.value)}
              placeholder="Add new category"
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
            />
            <button
              type="submit"
              className="rounded-md bg-emerald-600 px-3 py-2 text-sm font-medium text-white hover:bg-emerald-700"
            >
              Add
            </button>
          </form>

          <ul className="mt-4 space-y-2 text-sm">
            {categories.map((category) => (
              <li
                key={category.id}
                className="flex items-center justify-between rounded-md border border-slate-200 px-3 py-2"
              >
                {editingCategory?.id === category.id ? (
                  <input
                    value={editName}
                    onChange={(event) => setEditName(event.target.value)}
                    className="mr-2 w-full rounded-md border border-slate-300 px-2 py-1"
                  />
                ) : (
                  <span>{category.name}</span>
                )}

                <div className="flex gap-2">
                  {editingCategory?.id === category.id ? (
                    <button
                      type="button"
                      onClick={handleSaveCategory}
                      className="rounded-md border border-emerald-300 px-2 py-1 text-xs text-emerald-700"
                    >
                      Save
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => {
                        setEditingCategory(category)
                        setEditName(category.name)
                      }}
                      className="rounded-md border border-slate-300 px-2 py-1 text-xs"
                    >
                      Edit
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => handleDeleteCategory(category.id)}
                    className="rounded-md border border-red-300 px-2 py-1 text-xs text-red-700"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-lg border border-slate-200 bg-white p-5">
          <h3 className="text-base font-semibold text-slate-800">Official Prices</h3>
          <div className="mt-3 overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-slate-100 text-slate-600">
                <tr>
                  <th className="px-3 py-2">Category</th>
                  <th className="px-3 py-2">Min</th>
                  <th className="px-3 py-2">Max</th>
                  <th className="px-3 py-2">Suggested</th>
                  <th className="px-3 py-2">Action</th>
                </tr>
              </thead>
              <tbody>
                {categories.map((category) => {
                  const current = getPriceByCategory(category.id)
                  const draft = priceDrafts[category.id] || {
                    min: String(current.min),
                    max: String(current.max),
                    suggested: String(current.suggested),
                  }

                  return (
                    <tr key={category.id} className="border-b border-slate-100">
                      <td className="px-3 py-2">{category.name}</td>
                      <td className="px-3 py-2">
                        <input
                          type="number"
                          min="0"
                          value={draft.min}
                          onChange={(event) => handlePriceChange(category.id, 'min', event.target.value)}
                          className="w-20 rounded-md border border-slate-300 px-2 py-1"
                        />
                      </td>
                      <td className="px-3 py-2">
                        <input
                          type="number"
                          min="0"
                          value={draft.max}
                          onChange={(event) => handlePriceChange(category.id, 'max', event.target.value)}
                          className="w-20 rounded-md border border-slate-300 px-2 py-1"
                        />
                      </td>
                      <td className="px-3 py-2">
                        <input
                          type="number"
                          min="0"
                          value={draft.suggested}
                          onChange={(event) =>
                            handlePriceChange(category.id, 'suggested', event.target.value)
                          }
                          className="w-24 rounded-md border border-slate-300 px-2 py-1"
                        />
                      </td>
                      <td className="px-3 py-2">
                        <button
                          type="button"
                          onClick={() => handleSavePrice(category.id)}
                          className="rounded-md border border-emerald-300 px-2 py-1 text-xs text-emerald-700"
                        >
                          Save
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  )
}

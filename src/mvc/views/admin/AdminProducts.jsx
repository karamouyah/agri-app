import { useEffect, useState } from 'react'
import {
  addCategory,
  deleteCategory,
  getCategories,
  getOfficialPrices,
  setOfficialPrice,
  updateCategory,
} from '../../controllers/adminController'
import { formatDzd } from '../../../utils/currency'
import PageHero from '../../../components/PageHero'
import { Card, Input, SectionHeader, buttonStyles, cn } from '../../../components/ui'

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
    <section className="app-page">
      <PageHero
        eyebrow="Catalog Governance"
        title="Manage categories and official price guidance"
        description="Update marketplace categories and keep official DZD pricing ranges aligned across the controlled catalog."
        variant="admin"
        stats={[
          { label: 'Categories', value: categories.length, help: 'Active catalog groupings' },
          { label: 'Price Sheets', value: prices.length, help: 'Official pricing records' },
          { label: 'Currency', value: 'DZD', help: 'Single marketplace currency standard' },
        ]}
      />

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

        <Card className="overflow-hidden">
          <div className="px-5 py-5 md:px-6">
            <SectionHeader
              eyebrow="Official Pricing"
              title="Maintain pricing ranges in DZD"
              description="Review each category range, then save updated minimum, maximum, and suggested values."
            />
          </div>

          <div className="table-shell mx-5 mb-6 mt-0 md:mx-6">
            <div className="overflow-x-auto">
              <table className="table-base">
                <thead>
                  <tr>
                    <th>Category</th>
                    <th>Min (DZD)</th>
                    <th>Max (DZD)</th>
                    <th>Suggested (DZD)</th>
                    <th>Action</th>
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
                      <tr key={category.id}>
                        <td>
                          <div className="font-semibold text-slate-900 dark:text-slate-100">{category.name}</div>
                          <div className="text-xs text-slate-500 dark:text-slate-400">
                            Current range: {formatDzd(current.min)} - {formatDzd(current.max)}
                          </div>
                        </td>
                        <td>
                          <Input
                            type="number"
                            min="0"
                            value={draft.min}
                            onChange={(event) => handlePriceChange(category.id, 'min', event.target.value)}
                            className="w-24 px-3 py-2"
                          />
                        </td>
                        <td>
                          <Input
                            type="number"
                            min="0"
                            value={draft.max}
                            onChange={(event) => handlePriceChange(category.id, 'max', event.target.value)}
                            className="w-24 px-3 py-2"
                          />
                        </td>
                        <td>
                          <Input
                            type="number"
                            min="0"
                            value={draft.suggested}
                            onChange={(event) => handlePriceChange(category.id, 'suggested', event.target.value)}
                            className="w-28 px-3 py-2"
                          />
                        </td>
                        <td>
                          <button
                            type="button"
                            onClick={() => handleSavePrice(category.id)}
                            className={cn(buttonStyles.primary, 'px-3 py-2 text-xs')}
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
        </Card>
      </div>
    </section>
  )
}

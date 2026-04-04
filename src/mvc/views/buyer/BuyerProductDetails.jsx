import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { FiMapPin, FiPackage, FiPlus, FiShield, FiUser } from 'react-icons/fi'
import { addToCart, getProductById, getRelatedProducts } from '../../controllers/buyerController'
import { formatDzd, formatDzdPerUnit } from '../../../utils/currency'
import AgriIllustration from '../../../components/AgriIllustration'
import Reveal from '../../../components/Reveal'

export default function BuyerProductDetails() {
  const { id } = useParams()
  const [product, setProduct] = useState(null)
  const [related, setRelated] = useState([])
  const [quantity, setQuantity] = useState(1)
  const [message, setMessage] = useState('')

  useEffect(() => {
    const load = async () => {
      const found = await getProductById(id)
      setProduct(found)

      if (found) {
        const relatedProducts = await getRelatedProducts(found.id, found.category)
        setRelated(relatedProducts)
      }
    }

    load()
  }, [id])

  if (!product) {
    return <p className="text-sm text-slate-600">Product not found.</p>
  }

  const handleAddToCart = async () => {
    await addToCart(product, quantity)
    setMessage('Added to cart.')
    setTimeout(() => setMessage(''), 2000)
  }

  return (
    <section className="agri-page space-y-5">
      <Reveal>
        <div className="grid gap-4 rounded-lg border border-slate-200 bg-white p-5 md:grid-cols-[1.1fr_0.9fr]">
          <div className="media-shell p-3">
            <AgriIllustration variant="hero" className="h-72" />
          </div>

          <div className="space-y-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-700">{product.category}</p>
              <h2 className="mt-2 text-3xl font-bold text-slate-900">{product.name}</h2>
              <p className="mt-2 text-lg font-bold text-emerald-700">{formatDzdPerUnit(product.price, product.unit)}</p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="surface-muted p-3 text-sm">
                <p className="inline-flex items-center gap-2 font-semibold text-slate-800">
                  <FiPackage />
                  Stock
                </p>
                <p className="mt-1 text-slate-600">{product.quantityAvailable} {product.unit}</p>
              </div>
              <div className="surface-muted p-3 text-sm">
                <p className="inline-flex items-center gap-2 font-semibold text-slate-800">
                  <FiShield />
                  Quality
                </p>
                <p className="mt-1 text-slate-600">{product.quality}</p>
              </div>
              <div className="surface-muted p-3 text-sm">
                <p className="inline-flex items-center gap-2 font-semibold text-slate-800">
                  <FiUser />
                  Farmer
                </p>
                <p className="mt-1 text-slate-600">{product.farmerName}</p>
              </div>
              <div className="surface-muted p-3 text-sm">
                <p className="inline-flex items-center gap-2 font-semibold text-slate-800">
                  <FiMapPin />
                  Region
                </p>
                <p className="mt-1 text-slate-600">{product.farmerRegion}</p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <label htmlFor="quantity" className="text-sm font-medium text-slate-700">
                Qty
              </label>
              <input
                id="quantity"
                type="number"
                min="1"
                max={product.quantityAvailable}
                value={quantity}
                onChange={(event) => setQuantity(Number(event.target.value))}
                className="field-control w-24 px-3 py-2"
              />
              <button type="button" onClick={handleAddToCart} className="btn-primary px-4 py-2 text-sm">
                <span className="inline-flex items-center gap-2">
                  <FiPlus />
                  Add to Cart
                </span>
              </button>
            </div>

            {message ? <p className="text-sm font-semibold text-emerald-700">{message}</p> : null}
          </div>
        </div>
      </Reveal>

      <Reveal delay={80}>
        <div className="rounded-lg border border-slate-200 bg-white p-5">
          <div className="mb-4 flex items-center justify-between gap-3">
            <h3 className="text-lg font-bold text-slate-900">Related</h3>
            <span className="badge-soft px-3 py-1 text-xs">Same category</span>
          </div>

          <div className="grid gap-3 md:grid-cols-3">
            {related.map((item) => (
              <Link
                key={item.id}
                to={`/buyer/product/${item.id}`}
                className="surface-muted lift-card overflow-hidden p-3"
              >
                <div className="media-shell mb-3 p-2">
                  <AgriIllustration variant="buyer" className="h-24" />
                </div>
                <p className="font-semibold text-slate-800">{item.name}</p>
                <p className="mt-1 text-sm text-emerald-700">{formatDzd(item.price)}</p>
              </Link>
            ))}
          </div>
        </div>
      </Reveal>
    </section>
  )
}

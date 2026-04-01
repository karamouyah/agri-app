import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { addToCart, getProductById, getRelatedProducts } from '../../mvc/controllers/buyerController'

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
    setMessage('Product added to cart.')
    setTimeout(() => setMessage(''), 2000)
  }

  return (
    <section className="space-y-4">
      <div className="grid gap-4 rounded-lg border border-slate-200 bg-white p-5 md:grid-cols-2">
        <div className="flex h-64 items-center justify-center rounded-md bg-slate-100 text-slate-400">
          Product Image
        </div>

        <div>
          <h2 className="text-2xl font-semibold text-slate-800">{product.name}</h2>
          <p className="mt-2 text-sm text-slate-600">{product.description}</p>

          <div className="mt-4 space-y-1 text-sm text-slate-700">
            <p>
              <span className="font-medium">Price:</span> {product.price} MAD / unit
            </p>
            <p>
              <span className="font-medium">Available Quantity:</span> {product.quantityAvailable}
            </p>
            <p>
              <span className="font-medium">Farmer:</span> {product.farmerName}
            </p>
            <p>
              <span className="font-medium">Region:</span> {product.farmerRegion}
            </p>
            <p>
              <span className="font-medium">Quality:</span> {product.quality}
            </p>
          </div>

          <div className="mt-4 flex items-center gap-2">
            <label htmlFor="quantity" className="text-sm text-slate-700">
              Quantity
            </label>
            <input
              id="quantity"
              type="number"
              min="1"
              max={product.quantityAvailable}
              value={quantity}
              onChange={(event) => setQuantity(Number(event.target.value))}
              className="w-24 rounded-md border border-slate-300 px-2 py-1"
            />
            <button
              type="button"
              onClick={handleAddToCart}
              className="rounded-md bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700"
            >
              Add to Cart
            </button>
          </div>

          {message && <p className="mt-2 text-sm text-emerald-700">{message}</p>}
        </div>
      </div>

      <div className="rounded-lg border border-slate-200 bg-white p-5">
        <h3 className="text-lg font-semibold text-slate-800">Related Products</h3>
        <div className="mt-3 grid gap-3 md:grid-cols-3">
          {related.map((item) => (
            <Link
              key={item.id}
              to={`/buyer/product/${item.id}`}
              className="rounded-md border border-slate-200 p-3 hover:bg-slate-50"
            >
              <p className="font-medium text-slate-800">{item.name}</p>
              <p className="text-sm text-slate-600">{item.price} MAD</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

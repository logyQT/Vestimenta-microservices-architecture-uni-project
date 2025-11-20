import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Minus, Plus, ArrowLeft } from "lucide-react";
import { api } from "../../services/api";
import { Product } from "../../types";
import { useCart } from "../context/CartContext";
import { ImageWithFallback } from "../components/shared/ImageWithFallback";

export function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [mainImage, setMainImage] = useState<string>("");

  useEffect(() => {
    const loadProduct = async () => {
      if (!id) return;
      setLoading(true);
      const data = await api.products.getById(parseInt(id));
      if (data) {
        setProduct(data);
        setMainImage(data.image);
        if (data.sizes && data.sizes.length > 0) {
          setSelectedSize(data.sizes[0]);
        }
      } else {
        navigate("/shop");
      }
      setLoading(false);
    };
    loadProduct();
  }, [id, navigate]);

  if (loading || !product)
    return (
      <div className="min-h-screen bg-dark-900 pt-32 flex justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-gold-500 border-t-transparent rounded-full"></div>
      </div>
    );

  return (
    <section className="min-h-screen bg-dark-900 pt-32 pb-16 px-6">
      <div className="max-w-6xl mx-auto">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-zinc-500 hover:text-white mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back
        </button>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Images */}
          <div className="space-y-4">
            <div className="aspect-[3/4] w-full bg-zinc-900 overflow-hidden border border-zinc-800">
              <ImageWithFallback src={mainImage} className="w-full h-full object-cover" />
            </div>
            {product.images && (
              <div className="grid grid-cols-4 gap-4">
                <div className={`aspect-square cursor-pointer border ${mainImage === product.image ? "border-gold-500" : "border-transparent"}`} onClick={() => setMainImage(product.image)}>
                  <ImageWithFallback src={product.image} className="w-full h-full object-cover" />
                </div>
                {product.images.map((img, idx) => (
                  <div key={idx} className={`aspect-square cursor-pointer border ${mainImage === img ? "border-gold-500" : "border-transparent"}`} onClick={() => setMainImage(img)}>
                    <ImageWithFallback src={img} className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex flex-col h-full">
            <div className="border-b border-zinc-800 pb-6 mb-6">
              <h1 className="text-4xl font-serif text-white mb-2">{product.name}</h1>
              <p className="text-2xl text-gold-500">${product.price}</p>
            </div>

            <p className="text-zinc-400 leading-relaxed mb-8">{product.description}</p>

            <div className="mb-8">
              <h3 className="text-white text-sm mb-3 uppercase tracking-widest">Select Size</h3>
              <div className="flex flex-wrap gap-3">
                {product.sizes?.map((size) => (
                  <button key={size} onClick={() => setSelectedSize(size)} className={`w-12 h-12 flex items-center justify-center border text-sm transition-all ${selectedSize === size ? "bg-gold-500 border-gold-500 text-black" : "border-zinc-700 text-zinc-400 hover:border-white"}`}>
                    {size}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-auto">
              <button onClick={() => addToCart(product, selectedSize)} className="w-full bg-white text-black py-4 font-medium uppercase tracking-widest hover:bg-gold-500 transition-colors duration-300">
                Add to Bag
              </button>
              <p className="text-zinc-500 text-xs text-center mt-4">Free shipping on orders over $1000. 30-day returns.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

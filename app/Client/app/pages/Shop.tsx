import { useState, useEffect } from "react";
import { Filter, ChevronDown, LayoutGrid, Grid3x3 } from "lucide-react";
import { ImageWithFallback } from "../components/shared/ImageWithFallback";
import { api } from "../services/api";
import { Product } from "../types";
import { useNavigate, useSearchParams } from "react-router-dom";

export function Shop() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const categoryParam = searchParams.get("category");

  const [selectedCategory, setSelectedCategory] = useState(categoryParam || "All");
  const [sortBy, setSortBy] = useState("featured");
  const [gridCols, setGridCols] = useState(3);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      const data = await api.products.getAll();
      setProducts(data);
      setLoading(false);
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    if (categoryParam) setSelectedCategory(categoryParam);
  }, [categoryParam]);

  const categories = ["All", "For Her", "For Him", "Accessories"];

  const filteredProducts = products.filter((product) => {
    return selectedCategory === "All" || product.category === selectedCategory;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === "price-low") return a.price - b.price;
    if (sortBy === "price-high") return b.price - a.price;
    if (sortBy === "name") return a.name.localeCompare(b.name);
    return 0;
  });

  return (
    <section className="min-h-screen pt-28 pb-16 px-6 bg-dark-900 relative">
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="mb-12 text-center md:text-left">
          <h1 className="text-4xl md:text-6xl font-serif text-white mb-4">
            The <span className="text-gold-500">Collection</span>
          </h1>
          <p className="text-zinc-500">Discover our curated selection of premium fashion.</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="w-full lg:w-64 flex-shrink-0">
            <div className="bg-zinc-900/30 border border-zinc-800 p-6 sticky top-24">
              <h3 className="text-white mb-6 flex items-center gap-2 font-serif">
                <Filter className="w-4 h-4 text-gold-500" /> Filters
              </h3>
              <div className="space-y-2">
                {categories.map((cat) => (
                  <button key={cat} onClick={() => setSelectedCategory(cat)} className={`w-full text-left px-4 py-2 text-sm transition-colors ${selectedCategory === cat ? "text-gold-500 border-l border-gold-500 pl-3" : "text-zinc-500 hover:text-white"}`}>
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Grid */}
          <div className="flex-1">
            {/* Toolbar */}
            <div className="flex justify-between items-center mb-8 border-b border-zinc-800 pb-4">
              <span className="text-zinc-500 text-sm">{sortedProducts.length} Items</span>
              <div className="flex items-center gap-4">
                <div className="hidden md:flex gap-2 text-zinc-600">
                  <button onClick={() => setGridCols(2)} className={gridCols === 2 ? "text-gold-500" : "hover:text-white"}>
                    <LayoutGrid className="w-5 h-5" />
                  </button>
                  <button onClick={() => setGridCols(3)} className={gridCols === 3 ? "text-gold-500" : "hover:text-white"}>
                    <Grid3x3 className="w-5 h-5" />
                  </button>
                </div>
                <div className="relative">
                  <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="bg-zinc-900 border border-zinc-800 text-white text-sm px-4 py-2 pr-8 appearance-none focus:border-gold-500 outline-none">
                    <option value="featured">Featured</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                  </select>
                  <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 pointer-events-none" />
                </div>
              </div>
            </div>

            {loading ? (
              <div className="flex justify-center py-20">
                <div className="w-8 h-8 border-2 border-gold-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : (
              <div className={`grid gap-6 ${gridCols === 2 ? "grid-cols-1 sm:grid-cols-2" : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"}`}>
                {sortedProducts.map((product) => (
                  <div key={product.id} className="group cursor-pointer" onClick={() => navigate(`/shop/${product.id}`)}>
                    <div className="relative aspect-[3/4] overflow-hidden bg-zinc-900 mb-4">
                      <ImageWithFallback src={product.image} alt={product.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                      {product.isNew && <div className="absolute top-3 right-3 bg-gold-500 text-black text-[10px] font-bold px-2 py-1 tracking-wider">NEW</div>}
                      <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </div>
                    <div>
                      <div className="text-gold-500/70 text-xs tracking-widest mb-1 uppercase">{product.category}</div>
                      <h3 className="text-white font-serif text-lg group-hover:text-gold-500 transition-colors">{product.name}</h3>
                      <p className="text-zinc-400 mt-1">${product.price}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

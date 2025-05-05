
import React, { useState, useEffect } from "react";
import { Search, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import MobileLayout from "@/components/layout/MobileLayout";
import { useSearchProducts } from "@/hooks/use-products";
import { Input } from "@/components/ui/input";

const SearchPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const results = useSearchProducts(searchTerm);
  const navigate = useNavigate();
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [inputFocus, setInputFocus] = useState(false);
  
  useEffect(() => {
    const savedSearches = localStorage.getItem('recentSearches');
    if (savedSearches) {
      setRecentSearches(JSON.parse(savedSearches));
    }
  }, []);
  
  const saveSearch = (term: string) => {
    if (!term.trim()) return;
    
    const updatedSearches = [
      term,
      ...recentSearches.filter(s => s !== term)
    ].slice(0, 5);
    
    setRecentSearches(updatedSearches);
    localStorage.setItem('recentSearches', JSON.stringify(updatedSearches));
  };
  
  const handleProductClick = (id: string) => {
    saveSearch(searchTerm);
    navigate(`/product/${id}`);
  };
  
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };
  
  const handleUseRecentSearch = (term: string) => {
    setSearchTerm(term);
  };
  
  const handleClearRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem('recentSearches');
  };
  
  return (
    <MobileLayout>
      {/* Search Bar */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-200 p-3">
        <div className="flex items-center bg-gray-100 rounded-full px-3 py-2">
          <button 
            onClick={() => navigate(-1)}
            className="mr-2"
          >
            <ArrowLeft size={20} color="#666" />
          </button>
          <Search size={18} color="#666" className="mr-2" />
          <Input
            type="text"
            placeholder="Search for medicines..."
            value={searchTerm}
            onChange={handleSearchChange}
            onFocus={() => setInputFocus(true)}
            onBlur={() => setTimeout(() => setInputFocus(false), 100)}
            className="flex-1 bg-transparent border-none h-8 focus-visible:ring-0 focus-visible:ring-offset-0 px-0"
          />
        </div>
      </div>
      
      {/* Search content */}
      <div className="p-4">
        {/* Recent searches */}
        {!searchTerm && recentSearches.length > 0 && (
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-medium text-sm text-gray-700">Recent Searches</h3>
              <button
                onClick={handleClearRecentSearches}
                className="text-xs text-primary"
              >
                Clear all
              </button>
            </div>
            <div className="space-y-2">
              {recentSearches.map(term => (
                <button
                  key={term}
                  className="flex items-center w-full p-2 hover:bg-gray-50 rounded-md"
                  onClick={() => handleUseRecentSearch(term)}
                >
                  <Search size={16} className="text-gray-400 mr-3" />
                  <span className="text-sm">{term}</span>
                </button>
              ))}
            </div>
          </div>
        )}
        
        {/* Search results */}
        {searchTerm && (
          <div>
            <h3 className="font-medium mb-3">
              {results.length === 0 
                ? "No results found" 
                : `Results for "${searchTerm}"`}
            </h3>
            <div className="space-y-3">
              {results.map(product => (
                <div 
                  key={product.id}
                  className="flex items-center p-3 border border-gray-200 rounded-lg"
                  onClick={() => handleProductClick(product.id)}
                >
                  <div className="w-16 h-16 bg-gray-100 rounded-md flex items-center justify-center mr-3">
                    {product.image ? (
                      <img 
                        src={product.image} 
                        alt={product.name}
                        className="w-full h-full object-cover rounded-md"
                      />
                    ) : (
                      <div className="text-xl">💊</div>
                    )}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-sm">{product.name}</h4>
                    <p className="text-xs text-gray-500 line-clamp-1">{product.description}</p>
                    <p className="font-medium text-sm mt-1">
                      ${(product.discountPrice || product.price).toFixed(2)}
                      {product.discountPrice && (
                        <span className="text-xs text-gray-500 line-through ml-1">
                          ${product.price.toFixed(2)}
                        </span>
                      )}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Popular searches */}
        {!searchTerm && recentSearches.length === 0 && (
          <div>
            <h3 className="font-medium mb-3 text-sm text-gray-700">Popular Searches</h3>
            <div className="flex flex-wrap gap-2">
              {["Pain Relief", "Cold & Flu", "Allergy", "Vitamins", "First Aid"].map(term => (
                <button
                  key={term}
                  className="px-3 py-1 bg-gray-100 rounded-full text-sm"
                  onClick={() => handleUseRecentSearch(term)}
                >
                  {term}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </MobileLayout>
  );
};

export default SearchPage;

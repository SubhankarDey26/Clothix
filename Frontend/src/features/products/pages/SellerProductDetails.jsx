import React, { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { 
  ArrowLeft, Save, Plus, Trash2, ImagePlus, X, Package, 
  Settings2, AlertCircle, UploadCloud, Upload 
} from 'lucide-react';
import { useProduct } from "../hook/useProduct.js";

const CURRENCIES = [
  { code: 'INR', symbol: '₹' },
  { code: 'USD', symbol: '$' },
  { code: 'EUR', symbol: '€' },
  { code: 'GBP', symbol: '£' },
];

const MAX_BASE_IMAGES = 7;
const MAX_VARIANT_IMAGES = 7;

const SellerProductDetails = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const { handleProductDetailsById, handleAddProductVariant, handleUpdateProduct, loading } = useProduct();

  // --- Local State ---
  const baseFileInputRef = useRef(null);

  // Basic Product State
  const [productData, setProductData] = useState({
    title: '',
    description: '',
    priceAmount: '',
    priceCurrency: 'INR',
  });
  
  const [baseImages, setBaseImages] = useState([]);
  const [variants, setVariants] = useState([]);

  // Fetch Existing Data
  useEffect(() => {
    if (productId) {
      loadProduct();
    }
  }, [productId]);

  const loadProduct = async () => {
    try {
      const p = await handleProductDetailsById(productId);
      if (p) {
        setProductData({
          title: p.title || '',
          description: p.description || '',
          priceAmount: p.price?.amount || '',
          priceCurrency: p.price?.currency || 'INR',
        });
        
        if (p.image) {
          setBaseImages(p.image.map(img => ({ url: img.url, isExisting: true })));
        }

        if (p.variants) {
          const formattedVariants = p.variants.map(v => {
            // Convert Map/Object attributes back to array of {key, value}
            const attrArray = v.attributes 
              ? Object.entries(v.attributes).map(([key, value]) => ({ key, value }))
              : [{ key: '', value: '' }];

            return {
              id: v._id, // Use actual mongo _id to distinguish existing variants
              isNew: false,
              stock: v.stock || 0,
              attributes: attrArray.length ? attrArray : [{ key: '', value: '' }],
              priceAmount: v.price?.amount || '',
              priceCurrency: v.price?.currency || 'INR',
              images: v.images ? v.images.map(img => ({ url: img.url, isExisting: true })) : []
            };
          });
          setVariants(formattedVariants);
        }
      }
    } catch (err) {
      console.error("Failed to load product details", err);
    }
  };

  // --- Handlers: Basic Info ---
  const handleProductChange = (e) => {
    const { name, value } = e.target;
    setProductData(prev => ({ ...prev, [name]: value }));
  };

  const handleBaseImageUpload = (e) => {
    const files = Array.from(e.target.files);
    if (baseImages.length + files.length > MAX_BASE_IMAGES) {
      alert(`You can only upload up to ${MAX_BASE_IMAGES} images.`);
      return;
    }
    const newImages = files.map(file => ({
      file,
      url: URL.createObjectURL(file),
      isNew: true
    }));
    setBaseImages(prev => [...prev, ...newImages]);
    e.target.value = '';
  };

  const removeBaseImage = (index) => {
    setBaseImages(prev => prev.filter((_, i) => i !== index));
  };

  // --- Handlers: Variants ---
  const handleAddVariant = () => {
    setVariants([
      ...variants, 
      {
        id: Date.now().toString(),
        isNew: true, // Flag to show "Publish Variant" button
        attributes: [{ key: '', value: '' }],
        stock: 0,
        priceAmount: '',
        priceCurrency: 'INR',
        images: []
      }
    ]);
  };

  const handleVariantChange = (id, field, value) => {
    setVariants(variants.map(v => v.id === id ? { ...v, [field]: value } : v));
  };

  const handleRemoveVariant = (id) => {
    setVariants(variants.filter(v => v.id !== id));
  };

  const handleAddAttribute = (variantId) => {
    setVariants(variants.map(v => {
      if (v.id === variantId) {
        return { ...v, attributes: [...v.attributes, { key: '', value: '' }] };
      }
      return v;
    }));
  };

  const handleAttributeChange = (variantId, attrIndex, field, value) => {
    setVariants(variants.map(v => {
      if (v.id === variantId) {
        const newAttrs = [...v.attributes];
        newAttrs[attrIndex] = { ...newAttrs[attrIndex], [field]: value };
        return { ...v, attributes: newAttrs };
      }
      return v;
    }));
  };

  const handleRemoveAttribute = (variantId, attrIndex) => {
    setVariants(variants.map(v => {
      if (v.id === variantId) {
        if (v.attributes.length <= 1) {
          alert('A variant must have at least one attribute.');
          return v;
        }
        return { ...v, attributes: v.attributes.filter((_, i) => i !== attrIndex) };
      }
      return v;
    }));
  };

  const handleVariantImageUpload = (variantId, e) => {
    const files = Array.from(e.target.files);
    setVariants(variants.map(v => {
      if (v.id === variantId) {
        if (v.images.length + files.length > MAX_VARIANT_IMAGES) {
          alert(`You can only upload up to ${MAX_VARIANT_IMAGES} images per variant.`);
          return v;
        }
        const newImages = files.map(file => ({
          file,
          url: URL.createObjectURL(file),
          isNew: true
        }));
        return { ...v, images: [...v.images, ...newImages] };
      }
      return v;
    }));
    e.target.value = '';
  };

  const removeVariantImage = (variantId, imageIndex) => {
    setVariants(variants.map(v => {
      if (v.id === variantId) {
        return { ...v, images: v.images.filter((_, i) => i !== imageIndex) };
      }
      return v;
    }));
  };

  // --- Submission ---
  const handleSaveProductInfo = async () => {
    if (!productData.title || !productData.priceAmount) {
      alert("Title and Base Price are required");
      return;
    }

    const retainedImages = baseImages.filter(img => img.isExisting).map(img => ({ url: img.url }));
    const newImages = baseImages.filter(img => img.isNew).map(img => img.file);

    const payload = {
      title: productData.title,
      description: productData.description,
      priceAmount: productData.priceAmount,
      priceCurrency: productData.priceCurrency,
      retainedImages,
      newImages
    };

    try {
      await handleUpdateProduct(productId, payload);
      // Navigate back to seller dashboard silently without popup
      navigate('/seller');
    } catch (err) {
      console.error("Failed to update product:", err);
      alert("Failed to update product: " + err.message);
    }
  };

  const handlePublishVariant = async (variantId) => {
    const variantToPublish = variants.find(v => v.id === variantId);
    if (!variantToPublish) return;

    // Validate attributes
    const attrMap = {};
    variantToPublish.attributes.forEach(attr => {
      if (attr.key.trim() && attr.value.trim()) {
        attrMap[attr.key.trim()] = attr.value.trim();
      }
    });

    if (Object.keys(attrMap).length === 0) {
      alert("At least one valid attribute (Key and Value) is required.");
      return;
    }

    const payload = {
      variant: {
        stock: Number(variantToPublish.stock),
        attributes: attrMap,
        priceAmount: variantToPublish.priceAmount ? Number(variantToPublish.priceAmount) : undefined,
        priceCurrency: variantToPublish.priceCurrency,
        images: variantToPublish.images.filter(img => img.isNew).map(img => img.file)
      }
    };

    try {
      await handleAddProductVariant(productId, payload);
      alert("Variant published successfully!");
      // Reload product to get the new variant with its actual _id from MongoDB
      loadProduct(); 
    } catch (err) {
      alert("Failed to publish variant: " + err.message);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-200 font-sans pb-24">
      
      {/* ═══ Header ═══ */}
      <div className="sticky top-0 z-50 bg-neutral-950/80 backdrop-blur-xl border-b border-neutral-800/50">
        <div className="w-full max-w-[1400px] mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate('/seller')}
              className="p-2 bg-neutral-900 border border-neutral-800 rounded-full hover:bg-neutral-800 hover:text-white transition"
            >
              <ArrowLeft size={20} />
            </button>
            <div>
              <h1 className="text-xl font-bold text-white">Edit Product</h1>
              <p className="text-xs text-neutral-500">Product ID: {productId}</p>
            </div>
          </div>
          <button 
            onClick={handleSaveProductInfo}
            className="flex items-center gap-2 px-5 py-2 bg-neutral-800 text-white font-medium rounded-xl hover:bg-neutral-700 transition"
          >
            <Save size={18} />
            Save Basic Info
          </button>
        </div>
      </div>

      <div className="w-full max-w-[1400px] mx-auto px-6 mt-10">
        
        {loading && <div className="text-yellow-500 mb-4 animate-pulse">Processing...</div>}

        <div className="flex flex-col lg:flex-row gap-8 items-start">
          
          {/* ═══ LEFT COLUMN: Basic Information ═══ */}
          <div className="w-full lg:w-[400px] xl:w-[450px] flex-shrink-0 space-y-6 sticky top-28">
            <div className="bg-neutral-900/40 border border-neutral-800/60 rounded-3xl p-6 lg:p-8">
              <div className="flex items-center gap-3 mb-6">
                <Package className="text-yellow-500" size={24} />
                <h2 className="text-xl font-bold text-white">Basic Details</h2>
              </div>

              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-neutral-400">Product Title *</label>
                  <input
                    type="text"
                    name="title"
                    value={productData.title}
                    onChange={handleProductChange}
                    className="w-full bg-neutral-950/50 border border-neutral-800 text-white rounded-xl px-4 py-3 focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 transition outline-none"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-neutral-400">Base Price *</label>
                  <div className="flex relative">
                    <select
                      name="priceCurrency"
                      value={productData.priceCurrency}
                      onChange={handleProductChange}
                      className="absolute inset-y-0 left-0 bg-neutral-900 border-r border-neutral-800 text-neutral-300 rounded-l-xl px-3 py-3 outline-none cursor-pointer"
                    >
                      {CURRENCIES.map(c => <option key={c.code} value={c.code}>{c.code}</option>)}
                    </select>
                    <input
                      type="number"
                      name="priceAmount"
                      value={productData.priceAmount}
                      onChange={handleProductChange}
                      className="w-full bg-neutral-950/50 border border-neutral-800 text-white rounded-xl pl-[80px] pr-4 py-3 focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 transition outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-neutral-400">Description *</label>
                  <textarea
                    name="description"
                    value={productData.description}
                    onChange={handleProductChange}
                    rows={4}
                    className="w-full bg-neutral-950/50 border border-neutral-800 text-white rounded-xl px-4 py-3 focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 transition outline-none resize-none"
                  />
                </div>

                <div className="space-y-3 pt-4 border-t border-neutral-800/50">
                  <label className="text-sm font-medium text-neutral-400 flex justify-between">
                    <span>Base Images</span>
                    <span>{baseImages.length} / {MAX_BASE_IMAGES}</span>
                  </label>
                  
                  <div className="flex flex-wrap gap-3">
                    {baseImages.map((img, idx) => (
                      <div key={idx} className="relative group w-20 h-20 rounded-xl border border-neutral-700 overflow-hidden bg-neutral-900">
                        <img src={img.url} alt="Preview" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                          <button onClick={() => removeBaseImage(idx)} className="p-1.5 bg-red-500 rounded-full text-white hover:bg-red-600 transition">
                            <X size={14} />
                          </button>
                        </div>
                      </div>
                    ))}

                    {baseImages.length < MAX_BASE_IMAGES && (
                      <button 
                        onClick={() => baseFileInputRef.current?.click()}
                        className="w-20 h-20 rounded-xl border-2 border-dashed border-neutral-700 hover:border-yellow-500 bg-neutral-900/50 flex flex-col items-center justify-center gap-1 text-neutral-500 hover:text-yellow-500 transition group"
                      >
                        <UploadCloud size={20} />
                        <span className="text-[9px] font-medium uppercase">Add</span>
                      </button>
                    )}
                    <input 
                      type="file" 
                      ref={baseFileInputRef} 
                      onChange={handleBaseImageUpload} 
                      multiple accept="image/*" 
                      className="hidden" 
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ═══ RIGHT COLUMN: Variants Management ═══ */}
          <div className="w-full flex-grow space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Settings2 className="text-yellow-500" size={24} />
                <h2 className="text-2xl font-bold text-white">Product Variants</h2>
              </div>
              <button 
                onClick={handleAddVariant}
                className="flex items-center gap-2 px-4 py-2 bg-neutral-800 text-white text-sm font-medium rounded-lg hover:bg-neutral-700 hover:text-yellow-500 transition border border-neutral-700 shadow-sm"
              >
                <Plus size={16} /> Add Variant
              </button>
            </div>

            {variants.length === 0 ? (
              <div className="bg-neutral-900/30 border border-dashed border-neutral-800 rounded-3xl p-16 text-center flex flex-col items-center justify-center">
                <div className="w-20 h-20 bg-neutral-900 border border-neutral-800 rounded-full flex items-center justify-center mb-6">
                  <Settings2 size={32} className="text-neutral-600" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">No Variants Yet</h3>
                <p className="text-neutral-500 max-w-md mx-auto mb-8">
                  Add variants to offer different colors, sizes, storage capacities, or any dynamic attributes.
                </p>
                <button 
                  onClick={handleAddVariant}
                  className="px-8 py-3 bg-yellow-500/10 text-yellow-500 border border-yellow-500/20 font-bold rounded-xl hover:bg-yellow-500/20 transition"
                >
                  Create First Variant
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                {variants.map((variant, index) => (
                  <div key={variant.id} className={`border rounded-2xl p-6 lg:p-8 relative group shadow-sm transition-all duration-300
                    ${variant.isNew ? 'bg-yellow-500/5 border-yellow-500/30' : 'bg-neutral-900/60 border-neutral-800'}
                  `}>
                    
                    <div className="flex items-center justify-between mb-6 pb-4 border-b border-neutral-800/60">
                      <div className="flex items-center gap-3">
                        <h3 className="text-lg font-bold text-white">Variant #{index + 1}</h3>
                        {variant.isNew && (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-yellow-500 text-neutral-950">
                            Unsaved
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        {variant.isNew && (
                          <button 
                            onClick={() => handlePublishVariant(variant.id)}
                            className="flex items-center gap-2 px-3 py-1.5 bg-yellow-500 text-neutral-950 text-xs font-bold rounded-lg hover:bg-yellow-400 transition"
                          >
                            <Upload size={14} /> Publish Variant
                          </button>
                        )}
                        <button 
                          onClick={() => handleRemoveVariant(variant.id)}
                          className="text-neutral-500 hover:text-red-500 transition p-2 hover:bg-red-500/10 rounded-lg"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>

                    {/* Wide Layout inside Variant Card */}
                    <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
                      
                      {/* Attributes */}
                      <div className="xl:col-span-5 space-y-4">
                        <div className="flex justify-between items-center">
                          <label className="text-sm font-bold text-neutral-300">Attributes *</label>
                          <button 
                            onClick={() => handleAddAttribute(variant.id)}
                            className="text-xs font-medium text-yellow-500 hover:text-yellow-400 flex items-center gap-1 bg-yellow-500/10 px-2 py-1 rounded-md"
                          >
                            <Plus size={12} /> Add
                          </button>
                        </div>
                        
                        <div className="space-y-2">
                          {variant.attributes.map((attr, attrIdx) => (
                            <div key={attrIdx} className="flex gap-2">
                              <input
                                type="text"
                                placeholder="Key (e.g. Size)"
                                value={attr.key}
                                onChange={(e) => handleAttributeChange(variant.id, attrIdx, 'key', e.target.value)}
                                className="w-[45%] bg-neutral-950 border border-neutral-800 text-white rounded-lg px-3 py-2 text-sm focus:border-yellow-500 outline-none"
                              />
                              <input
                                type="text"
                                placeholder="Value (e.g. XL)"
                                value={attr.value}
                                onChange={(e) => handleAttributeChange(variant.id, attrIdx, 'value', e.target.value)}
                                className="w-[45%] bg-neutral-950 border border-neutral-800 text-white rounded-lg px-3 py-2 text-sm focus:border-yellow-500 outline-none"
                              />
                              <button 
                                onClick={() => handleRemoveAttribute(variant.id, attrIdx)}
                                className="w-[10%] flex items-center justify-center text-neutral-500 hover:text-red-400 hover:bg-neutral-800 rounded-lg transition"
                              >
                                <X size={16} />
                              </button>
                            </div>
                          ))}
                        </div>
                        <p className="text-[11px] text-neutral-600 flex items-center gap-1">
                          <AlertCircle size={12} /> At least one required.
                        </p>
                      </div>

                      {/* Stock, Price & Images */}
                      <div className="xl:col-span-7 space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <label className="text-sm font-bold text-neutral-300">Stock</label>
                            <input
                              type="number"
                              min="0"
                              value={variant.stock}
                              onChange={(e) => handleVariantChange(variant.id, 'stock', e.target.value)}
                              className="w-full bg-neutral-950 border border-neutral-800 text-white rounded-lg px-3 py-2 text-sm focus:border-yellow-500 outline-none"
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <label className="text-sm font-bold text-neutral-300">Override Price</label>
                            <div className="flex">
                              <select
                                value={variant.priceCurrency}
                                onChange={(e) => handleVariantChange(variant.id, 'priceCurrency', e.target.value)}
                                className="bg-neutral-900 border-y border-l border-neutral-800 text-neutral-400 text-xs rounded-l-lg px-2 outline-none cursor-pointer"
                              >
                                {CURRENCIES.map(c => <option key={c.code} value={c.code}>{c.code}</option>)}
                              </select>
                              <input
                                type="number"
                                placeholder="Optional"
                                value={variant.priceAmount}
                                onChange={(e) => handleVariantChange(variant.id, 'priceAmount', e.target.value)}
                                className="w-full bg-neutral-950 border border-neutral-800 text-white rounded-r-lg px-3 py-2 text-sm focus:border-yellow-500 outline-none"
                              />
                            </div>
                          </div>
                        </div>

                        <div className="space-y-3">
                          <label className="text-sm font-bold text-neutral-300 flex justify-between">
                            <span>Variant Images</span>
                            <span className="text-neutral-500 font-normal">{variant.images.length} / {MAX_VARIANT_IMAGES}</span>
                          </label>
                          
                          <div className="bg-neutral-950/50 border border-neutral-800 rounded-xl p-3 min-h-[100px] flex gap-3 overflow-x-auto items-center">
                            {variant.images.map((img, imgIdx) => (
                              <div key={imgIdx} className="relative group flex-shrink-0 w-16 h-16 rounded-lg border border-neutral-700 overflow-hidden bg-neutral-900">
                                <img src={img.url} alt="Variant Preview" className="w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                  <button onClick={() => removeVariantImage(variant.id, imgIdx)} className="p-1 bg-red-500 rounded-md text-white hover:bg-red-600 transition">
                                    <X size={12} />
                                  </button>
                                </div>
                              </div>
                            ))}

                            {variant.images.length < MAX_VARIANT_IMAGES && (
                              <label className="flex-shrink-0 w-16 h-16 rounded-lg border-2 border-dashed border-neutral-700 hover:border-yellow-500 bg-neutral-900/50 flex flex-col items-center justify-center gap-1 text-neutral-500 hover:text-yellow-500 transition cursor-pointer">
                                <ImagePlus size={16} />
                                <input 
                                  type="file" 
                                  onChange={(e) => handleVariantImageUpload(variant.id, e)} 
                                  multiple accept="image/*" 
                                  className="hidden" 
                                />
                              </label>
                            )}
                            
                            {variant.images.length === 0 && (
                              <p className="text-[11px] text-neutral-600 italic absolute left-1/2 -translate-x-1/2 pointer-events-none whitespace-nowrap">
                                No images uploaded
                              </p>
                            )}
                          </div>
                        </div>

                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default SellerProductDetails;
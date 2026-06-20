import { useState, useRef } from 'react';
import { useProduct } from "../hook/useProduct.js";
import { ImagePlus, X, Package, Upload, Settings2, Plus, Trash2, AlertCircle, UploadCloud } from 'lucide-react';

const MAX_BASE_IMAGES = 7;
const MAX_VARIANT_IMAGES = 7;

const CURRENCIES = [
  { code: 'INR', symbol: '₹', label: 'INR (₹)' },
  { code: 'USD', symbol: '$', label: 'USD ($)' },
  { code: 'EUR', symbol: '€', label: 'EUR (€)' },
  { code: 'GBP', symbol: '£', label: 'GBP (£)' },
];

const CreateProduct = ({ onSuccess }) => {
  const { handleCreateProduct } = useProduct();
  const fileInputRef = useRef(null);

  // --- Base Form State ---
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priceAmount: '',
    priceCurrency: 'INR',
  });

  const [images, setImages] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [dragActive, setDragActive] = useState(false);

  // --- Variants State ---
  const [variants, setVariants] = useState([]);

  // --- Handlers: Basic Info ---
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const processFiles = (files) => {
    const incoming = Array.from(files).filter((f) => f.type.startsWith('image/'));
    const available = MAX_BASE_IMAGES - images.length;
    const toAdd = incoming.slice(0, available);

    const newPreviews = toAdd.map((file) => URL.createObjectURL(file));
    setImages((prev) => [...prev, ...toAdd]);
    setPreviews((prev) => [...prev, ...newPreviews]);
  };

  const handleImageChange = (e) => {
    if (e.target.files) processFiles(e.target.files);
    e.target.value = '';
  };

  const removeImage = (index) => {
    URL.revokeObjectURL(previews[index]);
    setImages((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') setDragActive(true);
    else if (e.type === 'dragleave') setDragActive(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files) processFiles(e.dataTransfer.files);
  };

  // --- Handlers: Variants ---
  const handleAddVariant = () => {
    setVariants([
      ...variants, 
      {
        id: Date.now().toString(),
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
          url: URL.createObjectURL(file)
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
  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      title: formData.title,
      description: formData.description,
      priceAmount: Number(formData.priceAmount),
      priceCurrency: formData.priceCurrency,
      images,
      variants: variants.map(v => {
        const attrMap = {};
        v.attributes.forEach(attr => {
          if (attr.key.trim() && attr.value.trim()) {
            attrMap[attr.key.trim()] = attr.value.trim();
          }
        });

        return {
          stock: Number(v.stock),
          attributes: attrMap,
          images: v.images.map(img => img.file), 
          price: v.priceAmount ? {
            amount: Number(v.priceAmount),
            currency: v.priceCurrency
          } : undefined
        };
      })
    };

    console.log("Creating Product Payload:", payload);
    try {
      await handleCreateProduct(payload);
      alert("Product created successfully! Check console for payload.");
      
      setFormData({ title: '', description: '', priceAmount: '', priceCurrency: 'INR' });
      previews.forEach((url) => URL.revokeObjectURL(url));
      setImages([]);
      setPreviews([]);
      setVariants([]);
      if (onSuccess) onSuccess();
    } catch (err) {
      alert("Error creating product: " + err.message);
    }
  };

  const selectedCurrency = CURRENCIES.find((c) => c.code === formData.priceCurrency);

  return (
    <div className="bg-neutral-900/80 backdrop-blur-xl rounded-3xl p-6 lg:p-10 shadow-2xl border border-neutral-800/50">

      {/* Header */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-yellow-500/10 border border-yellow-500/20 mb-4">
          <Package className="text-yellow-500" size={26} />
        </div>
        <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight mb-2">List a Product</h1>
        <p className="text-neutral-400 text-sm md:text-base font-light">Add a new product with multiple variations to your store.</p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col lg:flex-row gap-8 items-start">
        
        {/* ═══ LEFT COLUMN: Basic Information ═══ */}
        <div className="w-full lg:w-[400px] xl:w-[450px] flex-shrink-0 space-y-6 lg:sticky lg:top-28">
          <div className="bg-neutral-950/40 border border-neutral-800/60 rounded-3xl p-6 lg:p-8">
            <div className="flex items-center gap-3 border-b border-neutral-800/60 pb-3 mb-6">
              <h2 className="text-xl font-bold text-white">Basic Details</h2>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-neutral-300 ml-1">Product Title *</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="e.g. Shadow Oversized Tee"
                  className="w-full bg-neutral-900 border border-neutral-800 text-neutral-100 rounded-xl px-4 py-3 focus:outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 transition duration-300 placeholder-neutral-600"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-neutral-300 ml-1">Base Price *</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500 font-medium">
                    {selectedCurrency?.symbol}
                  </span>
                  <input
                    type="number"
                    name="priceAmount"
                    value={formData.priceAmount}
                    onChange={handleChange}
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                    className="w-full bg-neutral-900 border border-neutral-800 text-neutral-100 rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 transition duration-300 placeholder-neutral-600"
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-neutral-300 ml-1">Currency</label>
                <select
                  name="priceCurrency"
                  value={formData.priceCurrency}
                  onChange={handleChange}
                  className="w-full bg-neutral-900 border border-neutral-800 text-neutral-100 rounded-xl px-4 py-3 focus:outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 transition duration-300 appearance-none cursor-pointer"
                >
                  {CURRENCIES.map((c) => (
                    <option key={c.code} value={c.code} className="bg-neutral-950 text-neutral-100">
                      {c.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-neutral-300 ml-1">Description *</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Describe your product — material, fit, care instructions…"
                  rows={4}
                  className="w-full bg-neutral-900 border border-neutral-800 text-neutral-100 rounded-xl px-4 py-3 focus:outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 transition duration-300 placeholder-neutral-600 resize-none"
                  required
                />
              </div>

              {/* Image Upload */}
              <div className="space-y-3 pt-4 border-t border-neutral-800/60">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-neutral-300 ml-1">Base Images</label>
                  <span className="text-xs text-neutral-500">{images.length} / {MAX_BASE_IMAGES}</span>
                </div>

                {images.length < MAX_BASE_IMAGES && (
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    onDragEnter={handleDrag}
                    onDragOver={handleDrag}
                    onDragLeave={handleDrag}
                    onDrop={handleDrop}
                    className={`relative flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed py-8 cursor-pointer transition-all duration-300
                      ${dragActive
                        ? 'border-yellow-500 bg-yellow-500/5'
                        : 'border-neutral-700 bg-neutral-900 hover:border-neutral-600'
                      }`}
                  >
                    <UploadCloud size={20} className={dragActive ? 'text-yellow-500' : 'text-neutral-500'} />
                    <p className="text-xs text-neutral-400">Drag & drop or <span className="text-yellow-500">browse</span></p>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </div>
                )}

                {previews.length > 0 && (
                  <div className="grid grid-cols-4 gap-2 mt-3">
                    {previews.map((src, index) => (
                      <div key={index} className="relative group aspect-square rounded-lg overflow-hidden border border-neutral-700 bg-neutral-900">
                        <img src={src} alt={`Preview ${index + 1}`} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-neutral-950/60 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                          <button type="button" onClick={() => removeImage(index)} className="p-1 bg-red-500/90 rounded-md text-white hover:bg-red-400 transition">
                            <X size={12} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Submit Button inside left column to stick with primary form */}
              <button
                type="submit"
                className="w-full bg-yellow-500 text-neutral-950 font-bold text-lg rounded-xl px-4 py-4 mt-6 hover:bg-yellow-400 hover:shadow-[0_0_20px_rgba(234,179,8,0.3)] focus:outline-none focus:ring-4 focus:ring-yellow-500/50 transition-all duration-300 transform active:scale-[0.98]"
              >
                Publish Product
              </button>
            </div>
          </div>
        </div>

        {/* ═══ RIGHT COLUMN: Variants Management ═══ */}
        <div className="w-full flex-grow space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Settings2 className="text-yellow-500" size={24} />
              <h2 className="text-xl font-bold text-white">Product Variants</h2>
            </div>
            <button 
              type="button"
              onClick={handleAddVariant}
              className="flex items-center gap-2 px-4 py-2 bg-neutral-950 text-white text-sm font-medium rounded-lg hover:bg-neutral-900 hover:text-yellow-500 transition border border-neutral-700 shadow-sm"
            >
              <Plus size={16} /> Add Variant
            </button>
          </div>

          {variants.length === 0 ? (
            <div className="bg-neutral-950/30 border border-dashed border-neutral-800 rounded-3xl p-16 text-center flex flex-col items-center justify-center">
              <div className="w-20 h-20 bg-neutral-900 border border-neutral-800 rounded-full flex items-center justify-center mb-6">
                <Settings2 size={32} className="text-neutral-600" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">No Variants Added</h3>
              <p className="text-neutral-500 max-w-sm mx-auto mb-8 text-sm">
                Add variants if this product comes in different colors, sizes, or other specifications.
              </p>
              <button 
                type="button"
                onClick={handleAddVariant}
                className="px-6 py-2.5 bg-yellow-500/10 text-yellow-500 border border-yellow-500/20 text-sm font-medium rounded-xl hover:bg-yellow-500/20 transition"
              >
                Create First Variant
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {variants.map((variant, index) => (
                <div key={variant.id} className="bg-neutral-950/60 border border-neutral-800 rounded-2xl p-6 lg:p-8 relative group shadow-sm">
                  
                  <div className="flex items-center justify-between mb-6 pb-4 border-b border-neutral-800/60">
                    <h3 className="text-lg font-bold text-white">Variant #{index + 1}</h3>
                    <button 
                      type="button"
                      onClick={() => handleRemoveVariant(variant.id)}
                      className="text-neutral-500 hover:text-red-500 transition p-2 hover:bg-red-500/10 rounded-lg"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
                    
                    {/* Attributes */}
                    <div className="xl:col-span-5 space-y-4">
                      <div className="flex justify-between items-center">
                        <label className="text-sm font-bold text-neutral-300">Attributes *</label>
                        <button 
                          type="button"
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
                              className="w-[45%] bg-neutral-900 border border-neutral-800 text-white rounded-lg px-3 py-2 text-sm focus:border-yellow-500 outline-none"
                            />
                            <input
                              type="text"
                              placeholder="Value (e.g. XL)"
                              value={attr.value}
                              onChange={(e) => handleAttributeChange(variant.id, attrIdx, 'value', e.target.value)}
                              className="w-[45%] bg-neutral-900 border border-neutral-800 text-white rounded-lg px-3 py-2 text-sm focus:border-yellow-500 outline-none"
                            />
                            <button 
                              type="button"
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
                            className="w-full bg-neutral-900 border border-neutral-800 text-white rounded-lg px-3 py-2 text-sm focus:border-yellow-500 outline-none"
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <label className="text-sm font-bold text-neutral-300">Override Price</label>
                          <div className="flex">
                            <select
                              value={variant.priceCurrency}
                              onChange={(e) => handleVariantChange(variant.id, 'priceCurrency', e.target.value)}
                              className="bg-neutral-800 border-y border-l border-neutral-700 text-neutral-400 text-xs rounded-l-lg px-2 outline-none cursor-pointer"
                            >
                              {CURRENCIES.map(c => <option key={c.code} value={c.code}>{c.code}</option>)}
                            </select>
                            <input
                              type="number"
                              placeholder="Optional"
                              value={variant.priceAmount}
                              onChange={(e) => handleVariantChange(variant.id, 'priceAmount', e.target.value)}
                              className="w-full bg-neutral-900 border border-neutral-800 text-white rounded-r-lg px-3 py-2 text-sm focus:border-yellow-500 outline-none"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <label className="text-sm font-bold text-neutral-300 flex justify-between">
                          <span>Variant Images</span>
                          <span className="text-neutral-500 font-normal">{variant.images.length} / {MAX_VARIANT_IMAGES}</span>
                        </label>
                        
                        <div className="bg-neutral-900/50 border border-neutral-800 rounded-xl p-3 min-h-[100px] flex gap-3 overflow-x-auto items-center">
                          {variant.images.map((img, imgIdx) => (
                            <div key={imgIdx} className="relative group flex-shrink-0 w-16 h-16 rounded-lg border border-neutral-700 overflow-hidden bg-neutral-900">
                              <img src={img.url} alt="Variant Preview" className="w-full h-full object-cover" />
                              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                <button type="button" onClick={() => removeVariantImage(variant.id, imgIdx)} className="p-1 bg-red-500 rounded-md text-white hover:bg-red-600 transition">
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
                            <p className="text-[11px] text-neutral-600 italic absolute left-1.5 -translate-x-1/2 pointer-events-none whitespace-nowrap">
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
      </form>
    </div>
  );
};

export default CreateProduct;
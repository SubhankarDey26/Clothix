import { useState, useRef } from 'react';
import { useProduct } from "../hook/useProduct.js";
import { ImagePlus, X, Package, Upload } from 'lucide-react';

const MAX_IMAGES = 7;

const CURRENCIES = [
  { code: 'INR', symbol: '₹', label: 'INR (₹)' },
  { code: 'USD', symbol: '$', label: 'USD ($)' },
  { code: 'EUR', symbol: '€', label: 'EUR (€)' },
  { code: 'GBP', symbol: '£', label: 'GBP (£)' },
];

const CreateProduct = ({ onSuccess }) => {
  const { handleCreateProduct } = useProduct();
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priceAmount: '',
    priceCurrency: 'INR',
  });

  const [images, setImages] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [dragActive, setDragActive] = useState(false);

  /* ─── Handlers ─── */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const processFiles = (files) => {
    const incoming = Array.from(files).filter((f) => f.type.startsWith('image/'));
    const available = MAX_IMAGES - images.length;
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

  /* Drag & Drop */
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    await handleCreateProduct({
      title: formData.title,
      description: formData.description,
      priceAmount: Number(formData.priceAmount),
      priceCurrency: formData.priceCurrency,
      images,
    });
    // Reset form
    setFormData({ title: '', description: '', priceAmount: '', priceCurrency: 'INR' });
    previews.forEach((url) => URL.revokeObjectURL(url));
    setImages([]);
    setPreviews([]);
    // Notify parent
    if (onSuccess) onSuccess();
  };

  const selectedCurrency = CURRENCIES.find((c) => c.code === formData.priceCurrency);

  return (
    <div className="bg-neutral-900/80 backdrop-blur-xl rounded-3xl p-8 md:p-12 shadow-2xl border border-neutral-800/50">

      {/* Header */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-yellow-500/10 border border-yellow-500/20 mb-5">
          <Package className="text-yellow-500" size={26} />
        </div>
        <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight mb-2">List a Product</h1>
        <p className="text-neutral-400 text-sm md:text-base font-light">Add a new product to your CLOTHIX store.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">

        {/* ── Title ── */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-neutral-300 ml-1">Product Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="e.g. Shadow Oversized Tee"
            className="w-full bg-neutral-950/50 border border-neutral-800 text-neutral-100 rounded-2xl px-5 py-4 focus:outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 transition duration-300 placeholder-neutral-600"
            required
          />
        </div>

        {/* ── Description ── */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-neutral-300 ml-1">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Describe your product — material, fit, care instructions…"
            rows={4}
            className="w-full bg-neutral-950/50 border border-neutral-800 text-neutral-100 rounded-2xl px-5 py-4 focus:outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 transition duration-300 placeholder-neutral-600 resize-none"
            required
          />
        </div>

        {/* ── Price Row ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {/* Price Amount */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-neutral-300 ml-1">Price</label>
            <div className="relative">
              <span className="absolute left-5 top-1/2 -translate-y-1/2 text-neutral-500 font-medium">
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
                className="w-full bg-neutral-950/50 border border-neutral-800 text-neutral-100 rounded-2xl pl-10 pr-5 py-4 focus:outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 transition duration-300 placeholder-neutral-600"
                required
              />
            </div>
          </div>

          {/* Currency */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-neutral-300 ml-1">Currency</label>
            <select
              name="priceCurrency"
              value={formData.priceCurrency}
              onChange={handleChange}
              className="w-full bg-neutral-950/50 border border-neutral-800 text-neutral-100 rounded-2xl px-5 py-4 focus:outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 transition duration-300 appearance-none cursor-pointer"
            >
              {CURRENCIES.map((c) => (
                <option key={c.code} value={c.code} className="bg-neutral-900 text-neutral-100">
                  {c.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* ── Image Upload ── */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-neutral-300 ml-1">Product Images</label>
            <span className="text-xs text-neutral-500">{images.length} / {MAX_IMAGES}</span>
          </div>

          {/* Drop Zone */}
          {images.length < MAX_IMAGES && (
            <div
              onClick={() => fileInputRef.current?.click()}
              onDragEnter={handleDrag}
              onDragOver={handleDrag}
              onDragLeave={handleDrag}
              onDrop={handleDrop}
              className={`relative flex flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed py-10 cursor-pointer transition-all duration-300
                ${dragActive
                  ? 'border-yellow-500 bg-yellow-500/5'
                  : 'border-neutral-800 bg-neutral-950/30 hover:border-neutral-700 hover:bg-neutral-950/50'
                }`}
            >
              <div className={`p-3 rounded-xl transition ${dragActive ? 'bg-yellow-500/10' : 'bg-neutral-800/50'}`}>
                <Upload size={24} className={`transition ${dragActive ? 'text-yellow-500' : 'text-neutral-500'}`} />
              </div>
              <div className="text-center">
                <p className="text-sm text-neutral-300">
                  <span className="text-yellow-500 font-medium">Click to upload</span> or drag & drop
                </p>
                <p className="text-xs text-neutral-600 mt-1">PNG, JPG, WEBP — up to {MAX_IMAGES} images</p>
              </div>
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

          {/* Preview Grid */}
          {previews.length > 0 && (
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 mt-4">
              {previews.map((src, index) => (
                <div key={index} className="relative group aspect-square rounded-xl overflow-hidden border border-neutral-800/50">
                  <img src={src} alt={`Preview ${index + 1}`} className="w-full h-full object-cover" />
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-neutral-950/60 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="p-2 bg-red-500/90 rounded-full text-white hover:bg-red-400 transition"
                    >
                      <X size={14} />
                    </button>
                  </div>
                  {/* Index badge */}
                  <span className="absolute top-2 left-2 text-[10px] font-bold bg-neutral-950/70 text-neutral-300 px-2 py-0.5 rounded-full">
                    {index + 1}
                  </span>
                </div>
              ))}

              {/* Add More Slot */}
              {images.length < MAX_IMAGES && (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="aspect-square rounded-xl border-2 border-dashed border-neutral-800 hover:border-yellow-500/50 bg-neutral-950/30 flex flex-col items-center justify-center gap-1 transition-all group"
                >
                  <ImagePlus size={20} className="text-neutral-600 group-hover:text-yellow-500 transition" />
                  <span className="text-[10px] text-neutral-600 group-hover:text-yellow-500 transition">Add</span>
                </button>
              )}
            </div>
          )}
        </div>

        {/* ── Submit ── */}
        <button
          type="submit"
          className="w-full bg-yellow-500 text-neutral-950 font-bold text-lg rounded-2xl px-4 py-4 mt-4 hover:bg-yellow-400 hover:shadow-[0_0_20px_rgba(234,179,8,0.3)] focus:outline-none focus:ring-4 focus:ring-yellow-500/50 transition-all duration-300 transform active:scale-[0.98]"
        >
          Publish Product
        </button>
      </form>
    </div>
  );
};

export default CreateProduct;
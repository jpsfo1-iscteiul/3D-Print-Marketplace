import { useState } from "react";
import { useLanguage } from "../context/LanguageContext";

// Real data will come from the blockchain
const designs = [];
const manufacturers = [];

export default function ExploreDesigns() {
  const { t } = useLanguage();
  const [search, setSearch] = useState("");
  const [manufacturer, setManufacturer] = useState("");
  const [rating, setRating] = useState(0);
  const [price, setPrice] = useState([0, 100]);
  const [available, setAvailable] = useState([0, 100]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  // Filter logic
  const filtered = designs.filter((d) => {
    return (
      d.name.toLowerCase().includes(search.toLowerCase()) &&
      (!manufacturer || d.manufacturer === manufacturer) &&
      (rating === 0 || d.rating === rating) &&
      d.price >= price[0] && d.price <= price[1] &&
      d.available >= available[0] && d.available <= available[1]
    );
  });

  // Paginação
  const totalPages = Math.ceil(filtered.length / pageSize);
  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);

  return (
    <div className="p-6">
      {/* Search Bar */}
      <input
        className="w-full mb-4 p-2 border rounded"
        placeholder={t.explore.searchPlaceholder}
        value={search}
        onChange={e => { setSearch(e.target.value); setPage(1); }}
      />
      {/* Filtros */}
      <div className="flex gap-4 mb-6">
        {/* Manufacturer Dropdown */}
        <select
          className="p-2 border rounded"
          value={manufacturer}
          onChange={e => setManufacturer(e.target.value)}
        >
          <option value="">{t.explore.manufacturer}</option>
          {manufacturers.map(m => (
            <option key={m} value={m}>{m}</option>
          ))}
        </select>
        {/* Rating Dropdown */}
        <select
          className="p-2 border rounded"
          value={rating}
          onChange={e => setRating(Number(e.target.value))}
        >
          <option value={0}>{t.explore.rating}</option>
          {[1,2,3,4,5].map(r => (
            <option key={r} value={r}>{"★".repeat(r)}</option>
          ))}
        </select>
        {/* Price Range */}
        <div className="flex items-center gap-2">
          <span>{t.explore.price}</span>
          <input
            type="number"
            className="w-16 p-1 border rounded"
            min={0}
            max={price[1]}
            value={price[0]}
            onChange={e => setPrice([Number(e.target.value), price[1]])}
          />
          <span>-</span>
          <input
            type="number"
            className="w-16 p-1 border rounded"
            min={price[0]}
            max={1000}
            value={price[1]}
            onChange={e => setPrice([price[0], Number(e.target.value)])}
          />
        </div>
        {/* Disponibilidade Range */}
        <div className="flex items-center gap-2">
          <span>{t.explore.availability}</span>
          <input
            type="number"
            className="w-16 p-1 border rounded"
            min={0}
            max={available[1]}
            value={available[0]}
            onChange={e => setAvailable([Number(e.target.value), available[1]])}
          />
          <span>-</span>
          <input
            type="number"
            className="w-16 p-1 border rounded"
            min={available[0]}
            max={1000}
            value={available[1]}
            onChange={e => setAvailable([available[0], Number(e.target.value)])}
          />
        </div>
      </div>

      {/* Galeria */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {paginated.map(d => (
          <div key={d.id} className="border rounded shadow p-2 flex flex-col items-center">
            <img src={d.image} alt={d.name} className="w-full h-40 object-cover mb-2 rounded" />
            <div className="font-bold mb-1">{d.name}</div>
            <div className="text-sm text-gray-500 mb-1">{d.manufacturer}</div>
            <div className="mb-1">{"★".repeat(d.rating)}{"☆".repeat(5-d.rating)}</div>
            <div className="mb-1">{t.explore.price} €{d.price}</div>
            <div className="mb-1">{t.explore.availability} {d.available}</div>
          </div>
        ))}        {paginated.length === 0 && (
          <div className="col-span-4 flex flex-col items-center justify-center p-12 text-center">
            <svg
              className="w-32 h-32 text-gray-300 mb-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
              />
            </svg>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              {t.explore.noDesigns}
            </h3>
            <p className="text-gray-500 mb-6 max-w-md">
              {t.explore.noDesignsDescription || "Be the first to submit a design to our marketplace. Your creations could be the next big thing!"}
            </p>
            <button
              onClick={() => window.location.href = '/submit-design'}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              {t.explore.submitDesign || "Submit a Design"}
            </button>
          </div>
        )}
      </div>
      {/* Paginação */}
      <div className="flex justify-between items-center mt-6">
        <div />
        <div className="flex items-center gap-2">
          <button
            className="px-3 py-1 border rounded disabled:opacity-50"
            onClick={() => setPage(page - 1)}
            disabled={page === 1}
          >{t.explore.previous}</button>
          <span>{t.explore.page} {page} {t.explore.of} {totalPages}</span>
          <button
            className="px-3 py-1 border rounded disabled:opacity-50"
            onClick={() => setPage(page + 1)}
            disabled={page === totalPages}
          >{t.explore.next}</button>
          <span className="ml-4">{t.explore.perPage}</span>
          <select
            className="p-1 border rounded"
            value={pageSize}
            onChange={e => { setPageSize(Number(e.target.value)); setPage(1); }}
          >
            {[10, 20, 30].map(size => (
              <option key={size} value={size}>{size}</option>
            ))}
          </select>
          <span>{t.explore.perPage}</span>
        </div>
      </div>
    </div>
  );
}

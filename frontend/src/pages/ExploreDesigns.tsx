import { useState } from "react";
import { useLanguage } from "../context/LanguageContext";

// Mock data for demonstration
const mockDesigns = Array.from({ length: 20 }, (_, i) => ({
  id: i + 1,
  name: `Design ${i + 1}`,
  manufacturer: `Manufacturer ${((i % 4) + 1)}`,
  rating: Math.ceil(Math.random() * 5),
  price: Math.floor(Math.random() * 100) + 10,
  available: Math.floor(Math.random() * 100),
  // Imagens mock reais
  image: [
    "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=400&q=80",
    "https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=400&q=80",
    "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80",
    "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=400&q=80"
  ][i % 4],
}));

const manufacturers = [
  "Manufacturer 1",
  "Manufacturer 2",
  "Manufacturer 3",
  "Manufacturer 4",
];

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
  const filtered = mockDesigns.filter((d) => {
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
        ))}
        {paginated.length === 0 && (
          <div className="col-span-4 text-center text-gray-400">{t.explore.noDesigns}</div>
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

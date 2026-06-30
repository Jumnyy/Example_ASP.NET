/*import React from 'react';

export default function ShopHeader({ productCount, searchQuery, setSearchQuery, sortBy, setSortBy }) {
    return (
        <div className="w-full flex flex-col md:flex-row justify-between items-center gap-4 text-[#433422]" style={{ fontFamily: '"Courier New", Courier, Georgia, serif' }}>

            {*//* Ô ngắm nghía nhanh *//*}
            <div className="relative w-full md:w-80">
                <input
                    type="text"
                    placeholder="Tìm món đồ bạn thương..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full px-4 py-2.5 border-2 border-[#433422] rounded-sm text-sm focus:outline-none bg-[#fbf9f4] font-bold placeholder-[#433422]/50 shadow-[inner_2px_2px_0px_rgba(0,0,0,0.05)]"
                />
                <span className="absolute right-3 top-3 opacity-60">🔍</span>
            </div>

            {*//* Đếm & Sắp xếp *//*}
            <div className="flex flex-col sm:flex-row items-center justify-between md:justify-end w-full md:w-auto gap-4 text-sm font-bold uppercase tracking-wider">
                <span className="text-center sm:text-left">
                    Tiệm đang bày: <span className="text-[#a64b3d] bg-[#fbf9f4] border border-[#433422]/20 px-2 py-0.5 rounded">{productCount}</span> món ngon
                </span>

                <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full sm:w-auto border-2 border-[#433422] rounded-sm p-2 bg-[#fbf9f4] focus:outline-none cursor-pointer text-xs font-black shadow-[2px_2px_0px_#433422]"
                >
                    <option value="default">✨ Sắp xếp ngẫu nhiên</option>
                    <option value="price-asc">📉 Giá: Thấp lên Cao</option>
                    <option value="price-desc">📈 Giá: Cao xuống Thấp</option>
                </select>
            </div>
        </div>
    );
}*/
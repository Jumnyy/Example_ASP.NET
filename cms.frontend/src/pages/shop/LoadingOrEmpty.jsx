/*import React from 'react';

export default function LoadingOrEmpty({ loading, isEmpty, children }) {
    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-24 text-center">
                { Hiệu ứng xoay tròn tiệm Solisz }
                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 mb-4"
                    style={{ borderColor: '#a64b3d' }}></div>
                <p style={{ color: '#7a685c' }}>Tiệm đang soạn sửa đồ lên kệ, đợi một xíu nha...</p>
            </div>
        );
    }

    if (isEmpty) {
        return (
            <div className="text-center py-20 rounded-lg border-2 border-dashed"
                style={{ backgroundColor: '#fcfaf7', borderColor: '#d3c4b1' }}>
                <i className="fa-regular fa-folder-open text-3xl mb-3 opacity-60" style={{ color: '#a64b3d' }}></i>
                <h4 className="text-lg font-bold mb-1">Hôm nay món này vắng kệ mất rồi!</h4>
                <p className="text-sm opacity-80">Bạn thử ngắm sang phân loại khác hoặc chỉnh lại khoảng giá xem sao nhé.</p>
            </div>
        );
    }

    return children;
}*/
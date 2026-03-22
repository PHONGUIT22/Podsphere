import uvicorn
from fastapi import FastAPI
import traceback

app = FastAPI()

@app.get("/")
def home():
    return {"message": "✅ API Tử Vi Python - Đã móc ruột thành công!"}

@app.get("/api/lap-la-so")
def lap_la_so(nam: int, thang: int, ngay: int, gio: int, gioi_tinh: int):
    """
    gioi_tinh: 1 (Nam), -1 (Nữ)
    gio: 1 (Tý), 2 (Sửu), 3 (Dần)... 12 (Hợi) -> LƯU Ý: Đừng truyền 0 nhé!
    """
    try:
        # Import đúng chỗ theo cấu trúc của lão Đoàn Nguyên
        from lasotuvi.App import lapDiaBan
        from lasotuvi.DiaBan import diaBan
        from lasotuvi.ThienBan import lapThienBan

        # 1. Lập Địa Bàn (12 Cung và 108 Sao)
        # Lão tác giả yêu cầu truyền Class `diaBan` vào hàm `lapDiaBan`
        # Tham số: class_diaBan, ngay, thang, nam, gio, gioi_tinh, la_duong_lich (True), timezone (7)
        db = lapDiaBan(diaBan, ngay, thang, nam, gio, gioi_tinh, True, 7)

        # 2. Lập Thiên Bàn (Trung tâm lá số: Mệnh, Cục, Cân lượng...)
        tb = lapThienBan(ngay, thang, nam, gio, gioi_tinh, "Ẩn Danh", db, True, 7)

        # 3. Chuyển đổi toàn bộ Object thành JSON cực đẹp để Node.js đọc
        laso_json = {
            "thong_tin": {
                "duong_lich": f"{tb.ngayDuong}/{tb.thangDuong}/{tb.namDuong}",
                "am_lich": f"{tb.ngayAm}/{tb.thangAm}/{tb.namAm} (Tháng nhuận: {tb.thangNhuan})",
                "gio_sinh": tb.gioSinh,
                "ban_menh": tb.banMenh,       # VD: Kiếm Phong Kim
                "cuc": tb.tenCuc,             # VD: Thủy Nhị Cục
                "am_duong": tb.amDuongMenh,   # VD: Âm dương nghịch lý
                "sinh_khac": tb.sinhKhac,     # VD: Bản mệnh sinh cục
                "menh_chu": tb.menhChu,
                "than_chu": tb.thanChu
            },
            "cac_cung": []
        }

        # Lão thiết kế mảng 13 phần tử (Index 0 bỏ không), nên tao duyệt từ 1 đến 12
        for i in range(1, 13):
            cung = db.thapNhiCung[i]
            
            # Phân loại Chính Tinh và Phụ Tinh
            chinh_tinh = []
            phu_tinh = []
            
            for sao in cung.cungSao:
                sao_info = {
                    "ten_sao": sao["saoTen"],
                    "dac_tinh": sao.get("saoDacTinh", ""), # M, V, D, B, H
                    "loai": sao["saoLoai"]
                }
                # saoLoai = 1 là Chính Tinh, còn lại là Phụ tinh
                if sao["saoLoai"] == 1:
                    chinh_tinh.append(sao_info)
                else:
                    phu_tinh.append(sao_info)

            # Extract an toàn bằng getattr (vì lão đéo tạo sẵn biến tuanTrung, trietLo)
            cung_data = {
                "id_cung": cung.cungSo,               # 1 -> 12
                "chi_cung": cung.cungTen,             # Tý, Sửu, Dần...
                "ten_cung": getattr(cung, "cungChu", ""), # Mệnh, Tài Bạch...
                "cung_than": getattr(cung, "cungThan", False),
                "dai_han": getattr(cung, "cungDaiHan", -1),
                "tieu_han": getattr(cung, "cungTieuHan", ""),
                "tuan_trung": getattr(cung, "tuanTrung", False),
                "triet_lo": getattr(cung, "trietLo", False),
                "chinh_tinh": chinh_tinh,
                "phu_tinh": phu_tinh
            }
            laso_json["cac_cung"].append(cung_data)

        return {"status": "success", "data": laso_json}

    except Exception as e:
        return {"status": "error", "message": str(e), "detail": traceback.format_exc()}
if __name__ == "__main__":
    uvicorn.run("server:app", host="127.0.0.1", port=8000, reload=True)
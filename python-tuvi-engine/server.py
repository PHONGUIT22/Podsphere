import uvicorn
from fastapi import FastAPI
import traceback
from datetime import datetime

app = FastAPI()

# HÀM TỰ AN ĐẦY ĐỦ 9 SAO LƯU QUAN TRỌNG (THEO CHUẨN)
def an_sao_luu(db, nam_xem):
    # Can: 0:Giáp, 1:Ất, 2:Bính, 3:Đinh, 4:Mậu, 5:Kỷ, 6:Canh, 7:Tân, 8:Nhâm, 9:Quý
    can_index = (nam_xem - 4) % 10
    # Chi: 0:Tý, 1:Sửu, 2:Dần, 3:Mão, 4:Thìn, 5:Tỵ, 6:Ngọ, 7:Mùi, 8:Thân, 9:Dậu, 10:Tuất, 11:Hợi
    chi_index = (nam_xem - 4) % 12

    # --- 1. L.THÁI TUẾ ---
    # Tại cung có Chi trùng với Chi của năm xem
    cung_lt_tuế = chi_index + 1
    
    # --- 2. L.LỘC TỒN (Theo Thiên Can năm xem) ---
    loc_ton_map = {0:3, 1:4, 2:6, 3:7, 4:6, 5:7, 6:9, 7:10, 8:12, 9:1}
    cung_l_lộc = loc_ton_map[can_index]

    # --- 3. L.KÌNH DƯƠNG (Tiến 1), L.ĐÀ LA (Lùi 1) từ Lộc Tồn ---
    cung_l_kình = (cung_l_lộc % 12) + 1
    cung_l_đà = cung_l_lộc - 1 if cung_l_lộc > 1 else 12

    # --- 4. L.THIÊN MÃ (Theo Chi năm xem) ---
    ma_map = {2:9, 6:9, 10:9, 8:3, 0:3, 4:3, 5:12, 9:12, 1:12, 11:6, 3:6, 7:6}
    cung_l_mã = ma_map[chi_index]

    # --- 5. L.TANG MÔN ---
    # Tiến 2 cung từ L.Thái Tuế (VD: Tỵ -> Mùi là sai, Tỵ -> Thân là đúng)
    # Công thức chuẩn: Tý tại Dần (3), Sửu tại Mão (4)...
    cung_l_tang = (chi_index + 2) % 12 + 1

    # --- 6. L.BẠCH HỔ ---
    # Đối cung với L.Tang Môn
    cung_l_hổ = (cung_l_tang + 5) % 12 + 1

    # --- 7. L.THIÊN KHỐC (Khởi Ngọ đếm ngược) ---
    # Bắt đầu tại Ngọ (7), đếm ngược chi_index bước
    cung_l_khốc = (6 - chi_index + 12) % 12 + 1

    # --- 8. L.THIÊN HƯ (Khởi Ngọ đếm xuôi) ---
    # Bắt đầu tại Ngọ (7), đếm xuôi chi_index bước
    cung_l_hư = (6 + chi_index) % 12 + 1

    # Gom danh sách sao để add vào Địa Bàn
    sao_luu = [
        (cung_lt_tuế, "L.Thái Tuế"),
        (cung_l_lộc, "L.Lộc Tồn"),
        (cung_l_kình, "L.Kình Dương"),
        (cung_l_đà, "L.Đà La"),
        (cung_l_mã, "L.Thiên Mã"),
        (cung_l_tang, "L.Tang Môn"),
        (cung_l_hổ, "L.Bạch Hổ"),
        (cung_l_khốc, "L.Thiên Khốc"),
        (cung_l_hư, "L.Thiên Hư")
    ]

    for cung_id, ten_sao in sao_luu:
        db.thapNhiCung[cung_id].cungSao.append({
            "saoTen": ten_sao,
            "saoLoai": 2, # Phụ tinh
            "saoDacTinh": ""
        })

@app.get("/api/lap-la-so")
def lap_la_so(nam: int, thang: int, ngay: int, gio: int, gioi_tinh: int, nam_xem: int = 2025):
    try:
        from lasotuvi.App import lapDiaBan
        from lasotuvi.DiaBan import diaBan
        from lasotuvi.ThienBan import lapThienBan

        # 1. Lập Địa Bàn cơ bản
        db = lapDiaBan(diaBan, ngay, thang, nam, gio, gioi_tinh, True, 7)

        # 2. An thêm bộ 9 sao lưu vào Địa Bàn
        an_sao_luu(db, nam_xem)

        # 3. Lập Thiên Bàn
        tb = lapThienBan(ngay, thang, nam, gio, gioi_tinh, "Ẩn Danh", db, True, 7)

        laso_json = {
            "thong_tin": {
                "duong_lich": f"{tb.ngayDuong}/{tb.thangDuong}/{tb.namDuong}",
                "am_lich": f"{tb.ngayAm}/{tb.thangAm}/{tb.namAm}",
                "gio_sinh": tb.gioSinh,
                "ban_menh": tb.banMenh,
                "cuc": tb.tenCuc,
                "am_duong": tb.amDuongMenh,
                "sinh_khac": tb.sinhKhac,
                "menh_chu": tb.menhChu,
                "than_chu": tb.thanChu,
                "nam_xem": nam_xem
            },
            "cac_cung": []
        }

        for i in range(1, 13):
            cung = db.thapNhiCung[i]
            chinh_tinh = []
            phu_tinh = []
            
            for sao in cung.cungSao:
                sao_info = {
                    "ten_sao": sao["saoTen"],
                    "dac_tinh": sao.get("saoDacTinh", ""),
                    "loai": sao["saoLoai"]
                }
                if sao["saoLoai"] == 1:
                    chinh_tinh.append(sao_info)
                else:
                    phu_tinh.append(sao_info)

            laso_json["cac_cung"].append({
                "id_cung": cung.cungSo,
                "chi_cung": cung.cungTen,
                "ten_cung": getattr(cung, "cungChu", ""),
                "cung_than": getattr(cung, "cungThan", False),
                "dai_han": getattr(cung, "cungDaiHan", -1),
                "tieu_han": cung.cungTieuHan,
                "tuan_trung": getattr(cung, "tuanTrung", False),
                "triet_lo": getattr(cung, "trietLo", False),
                "chinh_tinh": chinh_tinh,
                "phu_tinh": phu_tinh
            })

        return {"status": "success", "data": laso_json}

    except Exception as e:
        return {"status": "error", "message": str(e), "detail": traceback.format_exc()}

if __name__ == "__main__":
    uvicorn.run("server:app", host="127.0.0.1", port=8000, reload=True)
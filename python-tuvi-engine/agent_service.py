import os
import json
import traceback
import uvicorn
import requests  # Import thêm thư viện requests
from fastapi import FastAPI
from pydantic import BaseModel
from crewai import Agent, Task, Crew, Process, LLM
from fastapi.middleware.cors import CORSMiddleware 
os.environ["OPENAI_API_KEY"] = "NA"

app = FastAPI()

# --- CHÈN ĐOẠN NÀY VÀO ĐỂ SỬA LỖI ---
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],  
    allow_headers=["*"],  
)
# 🚀 1. CẤU HÌNH FIREBASE (Dán link Realtime Database của bạn vào đây)
# Ví dụ: https://my-bazi-ai-default-rtdb.asia-southeast1.firebasedatabase.app/
FIREBASE_DB_URL = "https://my-bazi-ai-default-rtdb.asia-southeast1.firebasedatabase.app/"

def get_latest_colab_url():
    """Hàm tự động lấy link tunnel mới nhất từ 'hộp thư' Firebase"""
    try:
        # Thêm .json vào cuối link Firebase để gọi API
        response = requests.get(f"{FIREBASE_DB_URL}/config.json", timeout=10)
        if response.status_code == 200:
            data = response.json()
            if data and "colab_url" in data:
                return data.get("colab_url")
        print("⚠️ Không tìm thấy link trong Firebase hoặc database trống.")
    except Exception as e:
        print(f"❌ Lỗi khi lấy link từ Firebase: {e}")
    return None

class BaziAnalysisRequest(BaseModel):
    bazi_json: str
    persona: str = "traditional"
    health_condition: str = ""

@app.post("/api/ai-reading")
async def generate_ai_reading(request: BaziAnalysisRequest):
    try:
        # 🟢 BƯỚC A: LẤY LINK AI MỚI NHẤT
        current_ai_url = get_latest_colab_url()
        if not current_ai_url:
            return {"status": "error", "message": "Không lấy được link AI từ Firebase. Hãy kiểm tra Colab đã chạy chưa."}
        
        print(f"--- ĐANG KẾT NỐI AI TẠI: {current_ai_url} | PERSONA: {request.persona} ---")

        # 🟢 BƯỚC B: KHỞI TẠO LLM VỚI LINK VỪA LẤY
        remote_llm = LLM(
            model="ollama/qwen2.5:7b",
            base_url=current_ai_url,
            api_key="NA",
            temperature=0.7 # Độ sáng tạo cao để luận giải bay bổng
        )

        # 🟢 BƯỚC C: PARSE DỮ LIỆU BÁT TỰ
        full_data = json.loads(request.bazi_json)
        bazi_info = full_data.get("data", full_data)
        full_name = bazi_info.get("fullName", "Đương số")
        analysis = bazi_info.get("analysis", {})
        strength = analysis.get("strength", "Không rõ")
        percentages = analysis.get("percentages", {})
        
        sorted_elements = sorted(percentages.items(), key=lambda item: item[1], reverse=True)
        thong_tin_morm = f"- Chủ nhân: {full_name}\n- Nhật Chủ: {strength}\n- Phân bổ: " + ", ".join([f"{k} {v}%" for k, v in sorted_elements])
        cao_nhat = sorted_elements[0][0] if sorted_elements else "Không rõ"
        thap_nhat = sorted_elements[-1][0] if sorted_elements else "Không rõ"

        # 🟢 BƯỚC D: THIẾT LẬP PERSONA & PROMPT (THEO CHUẨN GEMINI)
        if request.persona == "genz":
            agent_role = 'Thầy Mệnh Mèo GenZ 🐱✨'
            agent_backstory = "Bạn là chuyên gia Tứ Trụ hệ tấu hài, nói chuyện kiểu dân TikTok, mặn mòi, dùng từ lóng GenZ nhưng luận mệnh cực chuẩn."
            
            prompt_content = f"""
Bạn là 'Thầy Mệnh Mèo GenZ' 🐱✨ — chuyên gia giải mã lá số hệ 'vibe' và 'aura'.
DỮ LIỆU LÁ SỐ: {thong_tin_morm}

YÊU CẦU LUẬN GIẢI (FORMAT BẮT BUỘC):
# 🐱 Thầy Mệnh Mèo GenZ luận cho Đằng ấy

## ⚖️ Thân Mệnh (Pin yếu hay Pin khỏe?)
- Dựa vào trạng thái {strength}, giải thích theo kiểu 'mana' hoặc 'phần trăm pin'.

## 🔋 Buff Mana & Bug Hệ Thống
- Buff (Dụng thần - Yếu tố cần): Dựa vào {thap_nhat}, đằng ấy cần thêm gì để đời bớt 'xà lơ'?
- Bug (Kỵ thần - Yếu tố dư): {cao_nhat} đang quá vượng, làm sao để né 'red flag' này?

## 💼 Sự Nghiệp & Flexing
- Với bộ sao này thì nên đi làm công sở 'chill chill' hay khởi nghiệp 'flexing'?

## 💰 Tài Lộc & Ví Tiền
- Khả năng hút tiền là 'đỉnh nóc kịch trần' hay đang bị 'thao túng tâm lý'?

## 🧠 Lời khuyên chốt hạ
- Ngắn gọn, thực tế, đúng 'hệ tư tưởng'.

🚨 QUY TẮC: Trả lời bằng tiếng Việt, dùng từ lóng (flex, ổn lòi lìa, sướng rần rần...), kèm emoji. Độ dài 400-700 từ.
Kết thúc bằng: 👉 'Nghe tui, đừng cãi, mệnh nó thế 😼'
"""
        else:
            agent_role = 'Huyền Cơ Lão Sư'
            agent_backstory = "Bạn là một bậc tinh thông Tử Bình, điềm đạm, uyên bác, dùng văn phong cổ phong nhưng dễ hiểu để khai thị cho hậu thế."
            
            prompt_content = f"""
Bạn là 'Huyền Cơ Lão Sư' — bậc thầy luận mệnh bằng sự từ bi và trí tuệ thâm sâu.
DỮ LIỆU LÁ SỐ: {thong_tin_morm}

📜 TRÌNH TỰ LUẬN GIẢI (FORMAT BẮT BUỘC):
# 📜 Thầy luận mệnh cho Con

## 🔹 Nhật Chủ & Ngũ Hành Bản Mệnh
- Phân tích sâu về trạng thái {strength}. Thế cục ngũ hành đang tương sinh hay tương khắc?

## 🔹 Cách Cục & Dụng Thần
- Dựa vào {cao_nhat} và {thap_nhat}, xác định Dụng thần để cân bằng chân mệnh.

## 🔹 Luận Giải Vận Mệnh
### 📌 Tính Cách & Nội Tâm: Ưu và nhược điểm từ trong cốt tủy.
### 📌 Sự Nghiệp & Công Danh: Định hướng nghề nghiệp theo thiên mệnh.
### 📌 Tài Lộc & Gia Đạo: Sự hưng suy của tiền tài và tình cảm.

## 🔹 Lời Khuyên Tu Dưỡng
- Các hành động thực tế để cải vận, tu tâm tích đức.

🚨 QUY TẮC: Viết theo phong cách trang trọng, điềm tĩnh, dùng từ Hán-Việt tinh tế. KHÔNG dùng chữ Hán. Độ dài 500-900 từ.
Kết thúc bằng: 👉 'Mệnh do thiên định, nhưng đức do tâm sinh.'
"""

        # 🟢 BƯỚC E: THỰC THI CREWAI
        expert_advisor = Agent(
            role=agent_role,
            goal='Luận giải lá số Bát Tự chi tiết và sâu sắc theo đúng nhân vật.',
            backstory=agent_backstory,
            llm=remote_llm,
            allow_delegation=False
        )

        unified_task = Task(
            description=prompt_content,
            agent=expert_advisor,
            expected_output="Bài luận giải Bát tự chi tiết, đúng format và phong cách yêu cầu."
        )

        crew = Crew(agents=[expert_advisor], tasks=[unified_task], process=Process.sequential)
        result = crew.kickoff()
        
        print("--- LUẬN GIẢI HOÀN TẤT ---")
        return {"status": "success", "ai_reading": str(result)}

    except Exception as e:
        print("--- LỖI XẢY RA ---")
        print(traceback.format_exc())
        return {"status": "error", "message": str(e)}
# ====================================================================
# PHẦN 2: API LUẬN GIẢI TỬ VI
# ====================================================================

class TuViAnalysisRequest(BaseModel):
    tuvi_json: str
    persona: str = "traditional"
@app.post("/api/tuvi-reading")
async def generate_tuvi_reading(request: TuViAnalysisRequest):
    try:
        current_ai_url = get_latest_colab_url()
        if not current_ai_url: return {"status": "error", "message": "AI Server Offline"}

        remote_llm = LLM(
            model="ollama/qwen2.5:7b",
            base_url=current_ai_url,
            api_key="ollama",
            temperature=0.7 
        )

        data = json.loads(request.tuvi_json)
        laso = data.get("laso", {})
        thong_tin = laso.get("thong_tin", {})
        cac_cung = laso.get("cac_cung", [])

        # 1. HÀM CHIẾT XUẤT DỮ LIỆU CHI TIẾT HƠN
        def get_cung_detail(ten_cung_target):
            cung = next((c for c in cac_cung if c.get("ten_cung", "").lower() == ten_cung_target.lower()), None)
            if not cung: return "Cung này trống hoặc không tìm thấy."
            
            chinh_tinh = []
            for s in cung.get("chinh_tinh", []):
                dt = s.get("dac_tinh", "")
                status = "Sáng sủa (Miếu/Vượng/Đắc)" if any(x in dt for x in ["M", "V", "Đ"]) else "Tối tăm (Hãm địa)"
                chinh_tinh.append(f"{s['ten_sao']} [{status}]")
            
            sao_tot = [s["ten_sao"] for s in cung.get("phu_tinh", []) if s["ten_sao"] in ["Hóa Lộc", "Hóa Quyền", "Hóa Khoa", "Thiên Khôi", "Thiên Việt", "Tả Phù", "Hữu Bật", "Văn Xương", "Văn Khúc"]]
            sao_xau = [s["ten_sao"] for s in cung.get("phu_tinh", []) if s["ten_sao"] in ["Địa Không", "Địa Kiếp", "Kình Dương", "Đà La", "Hỏa Tinh", "Linh Tinh", "Hóa Kỵ", "Thiên Hình"]]
            
            an_ngu = []
            if cung.get("tuan_trung"): an_ngu.append("Tuần")
            if cung.get("triet_lo"): an_ngu.append("Triệt")

            res = f"- Chính tinh: {', '.join(chinh_tinh) if chinh_tinh else 'Vô Chính Diệu'}\n"
            if sao_tot: res += f"- Cát tinh hội tụ: {', '.join(sao_tot)}\n"
            if sao_xau: res += f"- Sát tinh xâm phạm: {', '.join(sao_xau)}\n"
            if an_ngu: res += f"- Bị {', '.join(an_ngu)} án ngữ.\n"
            return res

        thong_tin_morm = f"""
CHỦ NHÂN: {thong_tin.get('am_duong')} | Mệnh: {thong_tin.get('ban_menh')} | Cục: {thong_tin.get('cuc')}
1. CUNG MỆNH:
{get_cung_detail('Mệnh')}
2. CUNG QUAN LỘC:
{get_cung_detail('Quan lộc')}
3. CUNG TÀI BẠCH:
{get_cung_detail('Tài Bạch')}
4. CUNG THÂN (Hậu vận):
{get_cung_detail('Thân') if any(c.get('cung_than') for c in cac_cung) else 'Chưa xác định'}
"""

        # 2. PROMPT "SIÊU CẤP" ÉP AI KHÔNG ĐƯỢC NGÁO
        if request.persona == "genz":
            instruction = "Dùng ngôn ngữ GenZ, mặn mòi, tấu hài nhưng phân tích sâu vào thực tế đời sống."
        else:
            instruction = "Dùng phong cách uyên bác, trang trọng, luận giải thâm trầm kiểu bậc thầy lý số."

        prompt_content = f"""
Bạn là một chuyên gia bậc thầy về Tử Vi Đẩu Số. Hãy luận giải lá số dựa trên dữ liệu thật dưới đây.

🎯 KIẾN THỨC BẮT BUỘC (TUÂN THỦ TUYỆT ĐỐI):
1. Thái Dương (Mặt trời), Thái Âm (Mặt trăng) là NHẬT - NGUYỆT, là QUÝ TINH, không bao giờ là tà tinh. 
2. Tuần/Triệt án ngữ tại cung nào thì cung đó bị đảo ngược tính chất hoặc gây vất vả thời trẻ.
3. Vô Chính Diệu (không có chính tinh) thì phải nhìn cung đối diện để luận.
4. Không được viết sơ sài. Mỗi phần phải phân tích ít nhất 150 chữ.

DỮ LIỆU LÁ SỐ:
{thong_tin_morm}

🎯 NHIỆM VỤ: Hãy viết bài luận chi tiết theo cấu trúc Markdown sau:

# 📜 BẢN LUẬN GIẢI TỬ VI CHI TIẾT
(Viết lời dẫn nhập về bản mệnh {thong_tin.get('ban_menh')})

## 1. Bản Thể & Tính Cách (Cung Mệnh)
- Phân tích kỹ các chính tinh và sát tinh tại Mệnh. Ảnh hưởng của Tuần/Triệt (nếu có). 
- Đưa ra nhận xét về tư duy và hành động của đương số.

## 2. Sự Nghiệp & Công Danh (Cung Quan Lộc)
- Tư vấn định hướng nghề nghiệp. Đương số hợp làm chủ hay làm thuê? Những khó khăn cần vượt qua.

## 3. Tiền Bạc & Tài Lộc (Cung Tài Bạch)
- Cách thức kiếm tiền, giữ tiền. Những đại hạn về tài chính cần lưu ý.

## 4. Hậu Vận & Lời Khuyên Cải Mệnh
- Luận giải về cung Thân và đưa ra lời khuyên thực tế để cuộc sống tốt đẹp hơn.

Yêu cầu phong cách: {instruction}
"""

        expert_advisor = Agent(role='Bậc Thầy Tử Vi', goal='Luận giải chuyên sâu', backstory='Bạn là cố vấn lý số hàng đầu.', llm=remote_llm)
        unified_task = Task(description=prompt_content, agent=expert_advisor, expected_output="Bài luận Tử Vi chuyên sâu.")
        crew = Crew(agents=[expert_advisor], tasks=[unified_task], process=Process.sequential)
        
        result = crew.kickoff()
        return {"status": "success", "ai_reading": str(result)}

    except Exception as e:
        return {"status": "error", "message": str(e)}
    try:
        # Lấy link AI mới nhất từ Firebase (Dùng lại hàm đã viết ở code trước)
        current_ai_url = get_latest_colab_url()
        if not current_ai_url:
            return {"status": "error", "message": "Không kết nối được AI Server."}

        remote_llm = LLM(
            model="ollama/qwen2.5:7b",
            base_url=current_ai_url,
            api_key="NA",
            temperature=0.7 # Cho phép AI sáng tạo văn phong
        )

        # 1. PARSE JSON TỬ VI
        data = json.loads(request.tuvi_json)
        laso = data.get("laso", {})
        thong_tin = laso.get("thong_tin", {})
        cac_cung = laso.get("cac_cung", [])

        # 2. RÚT GỌN DỮ LIỆU CỐT LÕI (Chỉ lấy Mệnh, Tài, Quan, Thân)
        def get_cung_info(ten_cung_can_tim):
            cung = next((c for c in cac_cung if c.get("ten_cung", "").lower() == ten_cung_can_tim.lower()), None)
            if not cung: return "Không rõ"
            
            chinh_tinh = [s["ten_sao"] + ("(Đắc)" if "Vượng" in s.get("dac_tinh","") or "Đắc" in s.get("dac_tinh","") or "Miếu" in s.get("dac_tinh","") else "(Hãm)") for s in cung.get("chinh_tinh", [])]
            if not chinh_tinh: chinh_tinh = ["Vô Chính Diệu"]
            
            # Chỉ lấy các sao xấu/sát tinh quan trọng để mớm cho AI
            sat_tinh_list = ["Kình Dương", "Đà La", "Hỏa Tinh", "Linh Tinh", "Địa Không", "Địa Kiếp", "Hóa Kỵ"]
            sat_tinh_co_mat = [s["ten_sao"] for s in cung.get("phu_tinh", []) if s["ten_sao"] in sat_tinh_list]
            
            tuan_triet = []
            if cung.get("tuan_trung"): tuan_triet.append("Tuần")
            if cung.get("triet_lo"): tuan_triet.append("Triệt")

            info = f"Chính tinh: {', '.join(chinh_tinh)}."
            if sat_tinh_co_mat: info += f" Gặp sát tinh: {', '.join(sat_tinh_co_mat)}."
            if tuan_triet: info += f" Bị án ngữ bởi: {' và '.join(tuan_triet)}."
            return info

        thong_tin_menh = get_cung_info("Mệnh")
        thong_tin_tai = get_cung_info("Tài Bạch")
        thong_tin_quan = get_cung_info("Quan lộc")
        cung_than = next((c for c in cac_cung if c.get("cung_than") == True), None)
        thong_tin_than = f"Cung Thân cư tại {cung_than.get('ten_cung')} ({get_cung_info(cung_than.get('ten_cung'))})" if cung_than else "Không rõ"

        thong_tin_morm = f"""
- Bản mệnh: {thong_tin.get('ban_menh')} | Cục: {thong_tin.get('cuc')} | {thong_tin.get('am_duong')}
- CUNG MỆNH: {thong_tin_menh}
- CUNG TÀI BẠCH: {thong_tin_tai}
- CUNG QUAN LỘC: {thong_tin_quan}
- CUNG THÂN (Hậu vận): {thong_tin_than}
"""

        # 3. CHỌN PERSONA VÀ PROMPT
        if request.persona == "genz":
            agent_role = 'Cô Đồng Tử Vi GenZ 💅🔮'
            agent_backstory = "Bạn là chuyên gia Tử Vi cực kỳ mặn mòi, nói chuyện kiểu TikToker, dùng từ lóng GenZ (flex, xà lơ, red flag, overthinking) nhưng luận cực chuẩn."
            prompt_content = f"""
ĐÂY LÀ DỮ LIỆU TAM PHƯƠNG TỨ CHÍNH LÁ SỐ TỬ VI CỦA KHÁCH:
{thong_tin_morm}

NHIỆM VỤ CỦA BẠN: Viết bài luận giải theo format sau (dùng 100% tiếng Việt mạng xã hội):

# 💅 Cô Đồng GenZ coi bói cho Đằng ấy

## 🔮 Vibe Bản Thể (Cung Mệnh)
- Đánh giá vibe của khách dựa vào cung Mệnh (Vô Chính Diệu thì nói là dễ bị overthinking/gió chiều nào che chiều nấy). Có sát tinh thì tính nóng như kem. Có Tuần Triệt thì trắc trở ban đầu.

## 💼 Con đường Flexing (Cung Quan Lộc)
- Hợp làm sếp, làm công ăn lương hay khởi nghiệp?

## 💰 Hệ Tự Tự Do Tài Chính (Cung Tài Bạch)
- Kiếm tiền mượt không? Có bị rách ví (sát tinh) hay bị Tuần/Triệt cản trở không?

## 🌅 Hậu Vận (Cung Thân)
- Nửa đời sau sướng hay khổ? (Dựa vào Cung Thân).

🚨 Chú ý: Trả lời hài hước, dùng từ lóng, tuyệt đối không bịa thêm sao ngoài dữ liệu cung cấp. Độ dài 400-600 từ.
"""
        else:
            agent_role = 'Thiên Nhai Cư Sĩ'
            agent_backstory = "Bạn là một bậc thầy Tử Vi Đẩu Số điềm đạm, dùng từ ngữ cổ phong, thâm trầm, phân tích logic theo Tam Phương Tứ Chính."
            prompt_content = f"""
ĐÂY LÀ DỮ LIỆU TAM PHƯƠNG TỨ CHÍNH CỦA ĐƯƠNG SỐ:
{thong_tin_morm}

KIẾN THỨC BẮT BUỘC:
- Vô Chính Diệu: Thông minh, uyển chuyển nhưng thiếu kiên định, cần mượn sao đối cung.
- Có Tuần/Triệt ở Mệnh/Tài/Quan: Tuổi trẻ gian truân, lận đận lập nghiệp, hậu vận mới thành.
- Có Địa Không, Địa Kiếp, Kình, Đà, Hỏa, Linh: Gian nan, tính cách quyết liệt, dễ bạo phát bạo tàn.

NHIỆM VỤ: Lập bài luận giải theo format:

# 📜 Lời Bình Tử Vi Tam Phương Tứ Chính

## 🔹 Cung Mệnh (Tiên Thiên Cơ Bản)
- Luận giải tính cách, năng lực bẩm sinh dựa vào các sao ở Mệnh.

## 🔹 Cung Quan Lộc (Đường Công Danh)
- Định hướng nghề nghiệp, khả năng thăng tiến hay trắc trở.

## 🔹 Cung Tài Bạch (Phương Thức Kiếm Tiền)
- Năng lực tụ tài hay tán tài.

## 🔹 Cung Thân (Hậu Vận Cuộc Đời)
- Đánh giá giai đoạn sau 30 tuổi dựa vào nơi Cung Thân cư ngụ.

🚨 Chú ý: Dùng giọng văn điềm đạm, cổ phong, không bịa sao. Độ dài 500-800 từ.
"""

        # 4. CHẠY AI
        expert_advisor = Agent(role=agent_role, goal='Luận giải Tử Vi chính xác', backstory=agent_backstory, llm=remote_llm)
        unified_task = Task(description=prompt_content, agent=expert_advisor, expected_output="Bài luận Tử Vi.")
        crew = Crew(agents=[expert_advisor], tasks=[unified_task], process=Process.sequential)
        
        result = crew.kickoff()
        return {"status": "success", "ai_reading": str(result)}

    except Exception as e:
        print(traceback.format_exc())
        return {"status": "error", "message": str(e)}
if __name__ == "__main__":
    # Chạy trên port 8001
    uvicorn.run(app, host="127.0.0.1", port=8001)
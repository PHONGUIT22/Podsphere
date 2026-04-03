import uvicorn
from fastapi import FastAPI
from pydantic import BaseModel
from crewai import Agent, Task, Crew, Process, LLM # <--- Thêm LLM vào đây
import os
import json
import traceback

app = FastAPI()

# 🚀 1. DÁN LINK GOOGLE COLAB CỦA BẠN VÀO ĐÂY
# Lưu ý: Xóa dấu gạch chéo '/' ở cuối link nếu có
COLAB_AI_URL = "https://nickname-eclipse-recording-income.trycloudflare.com"

# 🚀 2. KHỞI TẠO ĐỐI TƯỢNG LLM (Cách này chuẩn cho CrewAI)
# Định dạng model cho Ollama là "ollama/tên-model"
remote_llm = LLM(
    model="ollama/llama3.1:8b",
    base_url=COLAB_AI_URL
)

class BaziAnalysisRequest(BaseModel):
    bazi_json: str
    persona: str = "podcast_host"

@app.post("/api/ai-reading")
async def generate_ai_reading(request: BaziAnalysisRequest):
    try:
        print(f"--- ĐANG GỌI AI TRÊN GOOGLE COLAB: {COLAB_AI_URL} ---")
        
        full_data = json.loads(request.bazi_json)
        bazi_info = full_data.get("data", full_data)

        # Định nghĩa các Agent dùng remote_llm
        astrologer = Agent(
            role='Bậc thầy Bát tự',
            goal='Luận giải lá số huyền học chi tiết.',
            backstory='Bạn là chuyên gia huyền học số 1, am hiểu sâu sắc về vận mệnh.',
            llm=remote_llm, # <--- Dùng object LLM mới
            verbose=True,
            allow_delegation=False
        )
        
        health_advisor = Agent(
            role='Bác sĩ Gan mật',
            goal='Tư vấn sức khỏe dựa trên ngũ hành.',
            backstory='Bạn là bác sĩ chuyên khoa, hiểu rõ mối liên hệ giữa tạng phủ và ngũ hành.',
            llm=remote_llm,
            verbose=True,
            allow_delegation=False
        )

        # Nhiệm vụ
        task1 = Task(
            description=f"Dựa trên dữ liệu: {json.dumps(bazi_info)}, hãy luận giải chi tiết về Nhật chủ và Ngũ hành.",
            agent=astrologer,
            expected_output="Bản luận giải Bát tự chi tiết."
        )
        
        task2 = Task(
            description="Đưa ra lời khuyên y khoa cụ thể để cải thiện sức khỏe gan dựa trên lá số này.",
            agent=health_advisor,
            expected_output="3 lời khuyên sức khỏe thực tế."
        )

        # Khởi chạy Crew
        crew = Crew(
            agents=[astrologer, health_advisor],
            tasks=[task1, task2],
            process=Process.sequential
        )

        result = crew.kickoff()
        
        print("--- LUẬN GIẢI HOÀN TẤT ---")
        return {"status": "success", "ai_reading": str(result)}

    except Exception as e:
        print("--- LỖI XẢY RA ---")
        print(traceback.format_exc())
        return {"status": "error", "message": str(e)}

if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=8001)
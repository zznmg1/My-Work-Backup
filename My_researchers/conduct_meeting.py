import asyncio
import re
from server import list_researchers, assign_task

async def main():
    print("📢 [Antigravity]: AI 연구원 팀 접속 중... (Connecting via MCP)")
    
    # 1. 연구원 소집 (Roll Call)
    try:
        researchers_text = await list_researchers()
    except Exception as e:
        print(f"❌ 접속 실패: {e}")
        return

    print(f"\n👥 [참석한 연구원 명단]\n{researchers_text}")
    
    # ID와 이름 파싱
    # Format: "- [ID: {nb.id}] {nb.title}"
    researchers = re.findall(r"- \[ID: ([\w-]+)\] (.*)", researchers_text)
    
    if not researchers:
        print("⚠️ 연구원(노트북)이 없습니다. NotebookLM에서 노트북을 먼저 만들어주세요.")
        return

    # 2. 토론 주제 전달
    topic = "현재 우리가 보유한 자료를 바탕으로, 향후 프로젝트 진행 방향에 대한 핵심 제언을 3가지로 요약해서 제시해줘."
    print(f"\n💬 [토론 주제]: {topic}")
    print("-" * 50)

    # 3. 의견 청취 (Round 1)
    for r_id, name in researchers:
        print(f"\n🎤 ['{name}' 연구원의 발언]")
        try:
            response = await assign_task(r_id, topic)
            print(f"{response}")
        except Exception as e:
            print(f"⚠️ 응답 오류: {e}")

    print("\n" + "-" * 50)
    print("✅ 회의 종료 (Meeting Adjourned)")

if __name__ == "__main__":
    asyncio.run(main())

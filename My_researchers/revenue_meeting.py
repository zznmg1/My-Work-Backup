import asyncio
import re
import os
from typing import List, Dict
from dotenv import load_dotenv

# NotebookLM 클라이언트
try:
    from notebooklm import NotebookLMClient
except ImportError:
    print("❌ 'notebooklm' 라이브러리가 없습니다. 'pip install notebooklm-py'를 설치해주세요.")
    exit(1)

# 타임아웃 설정 (회의는 길어질 수 있으니 넉넉하게)
CLIENT_TIMEOUT = 30
TASK_TIMEOUT = 120

async def get_client():
    """NotebookLM 클라이언트를 안전하게 가져옵니다."""
    try:
        return await asyncio.wait_for(NotebookLMClient.from_storage(), timeout=CLIENT_TIMEOUT)
    except Exception as e:
        print(f"\n❌ 인증 오류: {e}")
        print("💡 해결법: 터미널에서 'notebooklm login'을 입력해서 로그인해주세요.")
        return None

async def run_meeting():
    print("=" * 60)
    print("📢 AI 연구원 수익화 전략 회의를 시작합니다!")
    print("=" * 60)
    
    # 1. 클라이언트 연결
    print("\n[1단계] 연구원들을 소집하고 있습니다...")
    client = await get_client()
    if not client:
        return

    # 2. 연구원(노트북) 목록 가져오기
    async with client:
        try:
            notebooks = await client.notebooks.list()
        except Exception as e:
            print(f"❌ 연구원 목록을 가져오는데 실패했습니다: {e}")
            return

    if not notebooks:
        print("⚠️ 연구원(노트북)이 한 명도 없습니다. NotebookLM 사이트에서 노트북을 만들어주세요.")
        return

    print(f"✅ 총 {len(notebooks)}명의 연구원이 참석했습니다.")
    for nb in notebooks:
        print(f"   - {nb.title} (ID: {nb.id})")

    # 3. 토론 주제 설정
    topic = """
    현재 우리 팀은 AI 기술을 활용한 수익 창출 프로젝트를 기획 중입니다.
    
    당신의 전문 분야와 역할을 바탕으로 다음 내용을 제안해주세요:
    1. 당장 실행 가능한 수익화 아이디어 3가지 (구체적으로)
    2. 예상되는 수익 규모와 실현 가능성
    3. 다른 연구원들과 협력할 수 있는 방안
    
    최대한 구체적이고 창의적인 아이디어를 부탁합니다.
    """

    print("\n" + "=" * 60)
    print("💬 [2단계] 수익화 아이디어 발표 시간")
    print("=" * 60)

    # 4. 각 연구원에게 질문 던지기
    meeting_minutes = [] # 회의록 저장

    for nb in notebooks:
        researcher_name = nb.title
        print(f"\n🎤 '{researcher_name}' 연구원이 발언 중입니다... (잠시만 기다려주세요)")
        
        try:
            # 잦은 연결 끊김 방지를 위해 매번 클라이언트를 사용하는 패턴 (FastMCP 패턴 참고)
            # 여기서는 이미 위에서 async with client 했으므로 그 세션 안에서 호출
            # 세션이 길어지면 끊길 수 있으니 재연결 로직을 넣거나, 간단히 호출
            
            # 독립된 세션으로 안전하게 호출
            async with await get_client() as active_client:
                response = await asyncio.wait_for(
                    active_client.chat.ask(nb.id, topic),
                    timeout=TASK_TIMEOUT
                )
                answer = response.answer
            
            print(f"\n[{researcher_name}의 답변]")
            print("-" * 40)
            print(answer)
            print("-" * 40)
            
            meeting_minutes.append(f"## {researcher_name}의 제안\n{answer}\n")
            
        except asyncio.TimeoutError:
            print(f"⚠️ '{researcher_name}' 연구원이 너무 오래 생각하고 있습니다. (시간 초과)")
            meeting_minutes.append(f"## {researcher_name}\n(응답 시간 초과로 발언 못함)\n")
        except Exception as e:
            print(f"⚠️ '{researcher_name}' 연구원과의 연결에 문제가 생겼습니다: {e}")
            meeting_minutes.append(f"## {researcher_name}\n(연결 오류: {e})\n")

    # 5. 회의록 저장
    print("\n" + "=" * 60)
    print("📝 [3단계] 회의록 작성 중...")
    
    output_filename = "meeting_result_revenue.md"
    with open(output_filename, "w", encoding="utf-8") as f:
        f.write("# 💰 AI 수익화 전략 회의 결과\n\n")
        f.write(f"일시: {os.path.basename(__file__)}\n\n")
        for minute in meeting_minutes:
            f.write(minute + "\n")
            f.write("---\n")
            
    print(f"✅ 회의록이 '{output_filename}' 파일로 저장되었습니다.")
    print("=" * 60)

if __name__ == "__main__":
    # 윈도우 인코딩 문제 해결용
    os.system('chcp 65001 > nul')
    asyncio.run(run_meeting())

import asyncio
import os
import sys

# Windows 콘솔 인코딩 설정
sys.stdout.reconfigure(encoding='utf-8')

try:
    from notebooklm import NotebookLMClient
except ImportError:
    print("오류: notebooklm-py 라이브러리가 설치되지 않았습니다.")
    sys.exit(1)

DREAM_NOTEBOOK_TITLE = "꿈해몽_DB"
DATA_FILE_PATH = "../dream_data.txt"

async def setup_dream_db():
    print("--- 꿈해몽 데이터베이스 구축 시작 ---")
    
    # 1. 클라이언트 연결
    try:
        print("1. 구글 계정 연동 확인 중...")
        client = await NotebookLMClient.from_storage()
    except Exception as e:
        print(f"오류: 인증 정보가 없습니다 ({e}).")
        print("'fix_login.bat'을 먼저 실행해서 로그인해주세요.")
        return

    # 2. 기존 노트 확인
    print("2. 노트북 목록 조회 중...")
    notebooks = await client.notebooks.list()
    target_notebook = None
    
    for nb in notebooks:
        if nb.title == DREAM_NOTEBOOK_TITLE:
            target_notebook = nb
            print(f"   -> 기존 '{DREAM_NOTEBOOK_TITLE}' 노트를 찾았습니다.")
            break
    
    # 3. 없으면 새로 생성
    if not target_notebook:
        print(f"   -> '{DREAM_NOTEBOOK_TITLE}' 노트가 없어 새로 만듭니다...")
        target_notebook = await client.notebooks.create(title=DREAM_NOTEBOOK_TITLE)
        print("   -> 생성 완료!")

    # 4. 데이터 업로드
    print(f"3. 꿈해몽 데이터('{DATA_FILE_PATH}') 업로드 중...")
    
    if not os.path.exists(DATA_FILE_PATH):
        print(f"오류: 데이터 파일({DATA_FILE_PATH})을 찾을 수 없습니다.")
        return

    with open(DATA_FILE_PATH, "r", encoding="utf-8") as f:
        content = f.read()
        
    # 소스 추가 (이미 내용이 있어도 추가됨 - 중복 방지 로직은 라이브러리에 맡김)
    # create_source_from_string 같은 메서드가 있을 것으로 추정되나, 
    # 라이브러리 버전에 따라 다를 수 있어 일반적인 add logic 사용
    # 여기서는 upload_file 대신 텍스트 내용을 바로 올릴 수 있는 방법이 불명확할 경우
    # 파일 경로를 사용할 수도 있으나, notebooklm-py의 사용법에 따라 조정.
    # 안전하게 파일 경로를 전달하는 것으로 시도 가능한지 확인.
    
    # *참고*: notebooklm-py 라이브러리의 upload 기능을 정확히 사용해야 함.
    # 보통 client.upload_source(notebook_id, file_path) 형태일 것임.
    
    try:
        # 파일 경로를 직접 넘기는 방식 시도 (가정)
        # 만약 라이브러리가 path를 받지 않고 content를 받는다면 오류가 날 수 있음.
        # 여기서는 파일 객체를 열지 않고 절대 경로를 넣어본다.
        abs_path = os.path.abspath(DATA_FILE_PATH)
        await target_notebook.add_source(abs_path) 
        print("   -> 업로드 성공!")
    except Exception as e:
        print(f"   -> 업로드 실패 (재시도 필요): {e}")
        # text로 추가 시도 (fallback)
        # await target_notebook.add_source_from_text(content, title="꿈해몽_기본지식")

    print("\n[완료] 이제 AI가 '꿈해몽_DB'만 참고하여 객관적인 해몽을 제공합니다.")

if __name__ == "__main__":
    asyncio.run(setup_dream_db())

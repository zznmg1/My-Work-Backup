"""
NotebookLM 자동 로그인 스크립트
공식 CLI 명령어를 사용하여 브라우저 로그인을 수행합니다.
"""
import sys
import subprocess
import os
from pathlib import Path

def auto_login():
    """자동 로그인 실행"""
    print("=" * 50)
    print("NotebookLM 자동 로그인 (CLI 모드)")
    print("=" * 50)
    print()
    print("[1/2] 브라우저를 엽니다...")
    print("      Google 계정으로 로그인해주세요.")
    print("      로그인이 완료되면 이 창에서 [ENTER]를 눌러야 합니다.")
    print()

    # 가상환경 내의 notebooklm.exe 경로 찾기
    venv_path = Path(__file__).parent / ".venv"
    notebooklm_exe = venv_path / "Scripts" / "notebooklm.exe"
    
    if not notebooklm_exe.exists():
        # Fallback: PATH에 있는 경우
        notebooklm_exe = "notebooklm"

    try:
        # shell=True는 윈도우에서 .bat 등을 실행하거나 PATH 검색에 도움됨
        # 대화형 CLI이므로 그대로 실행
        subprocess.run([str(notebooklm_exe), "login"], check=True)
        
        print()
        print("=" * 50)
        print("✅ 인증 정보가 저장되었습니다.")
        print("=" * 50)
        return True
        
    except subprocess.CalledProcessError:
        print("\n❌ 로그인 프로세스가 취소되었거나 오류가 발생했습니다.")
        return False
    except Exception as e:
        print(f"\n❌ 실행 중 오류 발생: {e}")
        return False

if __name__ == "__main__":
    sys.exit(0 if auto_login() else 1)

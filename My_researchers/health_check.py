"""
NotebookLM 연결 상태 확인 스크립트
무한로딩 문제 진단 및 인증 상태 검증용
"""
import asyncio
import os
import sys

# 타임아웃 설정 (빠른 실패를 위해 짧게)
HEALTH_CHECK_TIMEOUT = 10


async def check_auth():
    """인증 상태 확인"""
    print("[1/3] 인증 상태 확인 중...")
    
    try:
        from notebooklm import NotebookLMClient
    except ImportError:
        print("    ❌ notebooklm 라이브러리가 설치되지 않았습니다.")
        print("    해결: pip install notebooklm-py")
        return False
    
    try:
        client = await asyncio.wait_for(
            NotebookLMClient.from_storage(),
            timeout=HEALTH_CHECK_TIMEOUT
        )
        print("    ✅ 인증 정보를 찾았습니다.")
        return client
    except asyncio.TimeoutError:
        print(f"    ❌ 인증 확인 타임아웃 ({HEALTH_CHECK_TIMEOUT}초)")
        print("    해결: 'notebooklm login' 명령을 다시 실행하세요.")
        return False
    except FileNotFoundError:
        print("    ❌ 저장된 인증 정보가 없습니다.")
        print("    해결: 'notebooklm login' 명령으로 로그인하세요.")
        return False
    except Exception as e:
        print(f"    ❌ 인증 확인 실패: {e}")
        return False


async def check_connection(client):
    """NotebookLM 연결 테스트"""
    print("[2/3] NotebookLM 연결 테스트 중...")
    
    try:
        async with client:
            notebooks = await asyncio.wait_for(
                client.notebooks.list(),
                timeout=HEALTH_CHECK_TIMEOUT
            )
        print(f"    ✅ 연결 성공! {len(notebooks)}개의 노트북을 찾았습니다.")
        return True
    except asyncio.TimeoutError:
        print(f"    ❌ 연결 테스트 타임아웃 ({HEALTH_CHECK_TIMEOUT}초)")
        print("    원인: 네트워크 연결이 느리거나 NotebookLM 서버에 접근할 수 없습니다.")
        return False
    except Exception as e:
        print(f"    ❌ 연결 테스트 실패: {e}")
        return False


def check_env():
    """환경 설정 확인"""
    print("[3/3] 환경 설정 확인 중...")
    
    env_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), '.env')
    if os.path.exists(env_path):
        print("    ✅ .env 파일이 존재합니다.")
    else:
        print("    ⚠️ .env 파일이 없습니다 (선택사항).")
    
    return True


async def main():
    print("=" * 50)
    print("NotebookLM MCP 서버 헬스체크")
    print("=" * 50)
    print()
    
    # 환경 확인
    check_env()
    print()
    
    # 인증 확인
    client = await check_auth()
    print()
    
    if client:
        # 연결 테스트
        connection_ok = await check_connection(client)
        print()
        
        if connection_ok:
            print("=" * 50)
            print("✅ 모든 검사를 통과했습니다! MCP 서버가 정상 작동해야 합니다.")
            print("=" * 50)
            return 0
    
    print("=" * 50)
    print("❌ 일부 검사가 실패했습니다. 위의 해결 방법을 따라주세요.")
    print("=" * 50)
    return 1


if __name__ == "__main__":
    exit_code = asyncio.run(main())
    sys.exit(exit_code)

import os
import asyncio
import json
from typing import List, Optional
from mcp.server.fastmcp import FastMCP
from dotenv import load_dotenv

# NotebookLM 클라이언트 및 타입 가져오기
try:
    from notebooklm import NotebookLMClient
    from notebooklm.types import (
        AudioFormat, AudioLength, VideoFormat, VideoStyle,
        InfographicOrientation, InfographicDetail, SlideDeckFormat, SlideDeckLength,
        QuizQuantity, QuizDifficulty
    )
except ImportError:
    raise ImportError("notebooklm 라이브러리를 찾을 수 없습니다. 'pip install notebooklm-py'를 실행해주세요.")

# 환경 변수 로드
load_dotenv(os.path.join(os.path.dirname(__file__), '.env'))

# FastMCP 초기화
mcp = FastMCP("NotebookLM Full Service")

# 타임아웃 설정
CLIENT_TIMEOUT = 30
OPERATION_TIMEOUT = 120
MAX_RETRIES = 3

async def get_client_with_timeout():
    """타임아웃이 적용된 NotebookLM 클라이언트 생성"""
    try:
        client = await asyncio.wait_for(
            NotebookLMClient.from_storage(),
            timeout=CLIENT_TIMEOUT
        )
        return client
    except asyncio.TimeoutError:
        raise ConnectionError("클라이언트 연결 타임아웃. 'notebooklm login'을 실행해주세요.")
    except Exception as e:
        raise ConnectionError(f"클라이언트 연결 실패: {str(e)}")

async def execute_with_retry(operation, operation_name: str):
    """재시도 로직이 적용된 작업 실행"""
    last_error = None
    for attempt in range(MAX_RETRIES):
        try:
            return await asyncio.wait_for(operation(), timeout=OPERATION_TIMEOUT)
        except Exception as e:
            last_error = e
            if attempt < MAX_RETRIES - 1:
                await asyncio.sleep(2 ** attempt)
            continue
    return f"오류 ({operation_name}): {str(last_error)}"

# --- Notebook Tools ---

@mcp.tool()
async def notebook_list() -> str:
    """Lists all available notebooks."""
    async def _op():
        client = await get_client_with_timeout()
        async with client:
            notebooks = await client.notebooks.list()
            if not notebooks: return "노트북이 없습니다."
            return "\n".join([f"- [{nb.id}] {nb.title} (Owner: {nb.is_owner})" for nb in notebooks])
    return await execute_with_retry(_op, "notebook_list")

@mcp.tool()
async def notebook_create(title: str) -> str:
    """Creates a new notebook."""
    async def _op():
        client = await get_client_with_timeout()
        async with client:
            nb = await client.notebooks.create(title)
            return f"노트북 생성 완료: {nb.title} (ID: {nb.id})"
    return await execute_with_retry(_op, "notebook_create")

@mcp.tool()
async def notebook_get(notebook_id: str) -> str:
    """Gets detailed information about a notebook including its sources."""
    async def _op():
        client = await get_client_with_timeout()
        async with client:
            nb = await client.notebooks.get(notebook_id)
            sources = await client.sources.list(notebook_id)
            
            info = [f"Notebook: {nb.title} ({nb.id})", "Sources:"]
            if sources:
                for src in sources:
                    info.append(f"  - [{src.id}] {src.title} ({src.type.name}) - Status: {src.status_text}")
            else:
                info.append("  (No sources)")
            return "\n".join(info)
    return await execute_with_retry(_op, "notebook_get")

@mcp.tool()
async def notebook_describe(notebook_id: str) -> str:
    """Generates an AI summary/description of the notebook contents."""
    async def _op():
        client = await get_client_with_timeout()
        async with client:
            desc = await client.notebooks.get_description(notebook_id)
            result = [f"Summary: {desc.summary}", "\nSuggested Topics:"]
            for topic in desc.suggested_topics:
                result.append(f"  - {topic.question}")
            return "\n".join(result)
    return await execute_with_retry(_op, "notebook_describe")

@mcp.tool()
async def notebook_rename(notebook_id: str, new_title: str) -> str:
    """Renames a notebook."""
    async def _op():
        client = await get_client_with_timeout()
        async with client:
            await client.notebooks.rename(notebook_id, new_title)
            return f"노트북 이름 변경 완료: {new_title}"
    return await execute_with_retry(_op, "notebook_rename")

@mcp.tool()
async def notebook_delete(notebook_id: str) -> str:
    """Deletes a notebook (Permanent)."""
    async def _op():
        client = await get_client_with_timeout()
        async with client:
            await client.notebooks.delete(notebook_id)
            return "노트북 삭제 완료."
    return await execute_with_retry(_op, "notebook_delete")

# --- Source Tools ---

@mcp.tool()
async def notebook_add_url(notebook_id: str, url: str) -> str:
    """Adds a URL or YouTube video as a source."""
    async def _op():
        client = await get_client_with_timeout()
        async with client:
            source = await client.sources.add_url(notebook_id, url, wait=True)
            return f"소스 추가 완료: {source.title} (ID: {source.id})"
    return await execute_with_retry(_op, "notebook_add_url")

@mcp.tool()
async def notebook_add_text(notebook_id: str, title: str, content: str) -> str:
    """Adds raw text as a source."""
    async def _op():
        client = await get_client_with_timeout()
        async with client:
            source = await client.sources.add_text(notebook_id, title, content, wait=True)
            return f"텍스트 소스 추가 완료: {source.title} (ID: {source.id})"
    return await execute_with_retry(_op, "notebook_add_text")

@mcp.tool()
async def notebook_add_drive(notebook_id: str, file_id: str, title: str) -> str:
    """Adds a Google Drive file as a source (requires File ID)."""
    async def _op():
        client = await get_client_with_timeout()
        async with client:
            source = await client.sources.add_drive(notebook_id, file_id, title, wait=True)
            return f"드라이브 소스 추가 완료: {source.title} (ID: {source.id})"
    return await execute_with_retry(_op, "notebook_add_drive")

@mcp.tool()
async def source_describe(notebook_id: str, source_id: str) -> str:
    """Gets the AI 'Source Guide' (summary and keywords) for a source."""
    async def _op():
        client = await get_client_with_timeout()
        async with client:
            guide = await client.sources.get_guide(notebook_id, source_id)
            return json.dumps(guide, indent=2, ensure_ascii=False) # JSON for structure
    return await execute_with_retry(_op, "source_describe")

@mcp.tool()
async def source_get_content(notebook_id: str, source_id: str) -> str:
    """Gets the full indexed text content of a source."""
    async def _op():
        client = await get_client_with_timeout()
        async with client:
            fulltext = await client.sources.get_fulltext(notebook_id, source_id)
            return fulltext.content
    return await execute_with_retry(_op, "source_get_content")

@mcp.tool()
async def source_list(notebook_id: str) -> str:
    """Lists all sources in a notebook."""
    async def _op():
        client = await get_client_with_timeout()
        async with client:
            sources = await client.sources.list(notebook_id)
            return "\n".join([f"- [{s.id}] {s.title} ({s.status_text})" for s in sources])
    return await execute_with_retry(_op, "source_list")

@mcp.tool()
async def source_sync_drive(notebook_id: str, source_id: str) -> str:
    """Refreshes a Drive/URL source to sync latest content."""
    async def _op():
        client = await get_client_with_timeout()
        async with client:
            await client.sources.refresh(notebook_id, source_id)
            return "소스 동기화 요청 완료."
    return await execute_with_retry(_op, "source_sync_drive")

@mcp.tool()
async def source_delete(notebook_id: str, source_id: str) -> str:
    """Deletes a source from a notebook."""
    async def _op():
        client = await get_client_with_timeout()
        async with client:
            await client.sources.delete(notebook_id, source_id)
            return "소스 삭제 완료."
    return await execute_with_retry(_op, "source_delete")

# --- Chat Tools ---

@mcp.tool()
async def notebook_query(notebook_id: str, query: str) -> str:
    """Asks a question to the notebook AI."""
    async def _op():
        client = await get_client_with_timeout()
        async with client:
            result = await client.chat.ask(notebook_id, query)
            response = [f"Answer: {result.answer}", "\nCitations:"]
            for ref in result.references:
                response.append(f"[{ref.citation_number}] {ref.cited_text[:50]}...")
            return "\n".join(response)
    return await execute_with_retry(_op, "notebook_query")

@mcp.tool()
async def chat_configure(notebook_id: str, instruction: str) -> str:
    """Configures the chat persona/instruction (e.g., 'Act as a critique')."""
    async def _op():
        client = await get_client_with_timeout()
        async with client:
            # Simplification: using CUSTOM goal with provided instruction
            from notebooklm.types import ChatGoal
            await client.chat.configure(
                notebook_id, 
                goal=ChatGoal.CUSTOM, 
                custom_prompt=instruction
            )
            return "채팅 설정(Custom Persona) 완료."
    return await execute_with_retry(_op, "chat_configure")

# --- Research Tools ---

@mcp.tool()
async def research_start(notebook_id: str, query: str, deep: bool = False) -> str:
    """Starts a web research task."""
    async def _op():
        client = await get_client_with_timeout()
        async with client:
            mode = "deep" if deep else "fast"
            task = await client.research.start(notebook_id, query, mode=mode)
            return f"리서치 시작됨: Task ID {task['task_id']} ({mode})"
    return await execute_with_retry(_op, "research_start")

@mcp.tool()
async def research_status(notebook_id: str) -> str:
    """Checks the status of the current research task."""
    async def _op():
        client = await get_client_with_timeout()
        async with client:
            status = await client.research.poll(notebook_id)
            return f"Status: {status.get('status')}\nSummary: {status.get('summary', '')}\nTask ID: {status.get('task_id')}"
    return await execute_with_retry(_op, "research_status")

@mcp.tool()
async def research_import(notebook_id: str, task_id: str) -> str:
    """Imports all found sources from a research task into the notebook."""
    async def _op():
        client = await get_client_with_timeout()
        async with client:
            # First poll to get the sources
            status = await client.research.poll(notebook_id)
            if not status.get("sources"):
                return "가져올 결과(Source)가 없습니다."
            
            # Import them
            imported = await client.research.import_sources(
                notebook_id, 
                task_id, 
                status.get("sources", [])
            )
            return f"총 {len(imported)}개의 웹 소스가 연구 노트에 추가되었습니다."
    return await execute_with_retry(_op, "research_import")

# --- Artifact/Studio Tools ---

@mcp.tool()
async def audio_overview_create(notebook_id: str) -> str:
    """Generates a standard Audio Overview (Deep Dive)."""
    async def _op():
        client = await get_client_with_timeout()
        async with client:
            status = await client.artifacts.generate_audio(notebook_id)
            return f"오디오 생성 시작됨: Task ID {status.task_id}"
    return await execute_with_retry(_op, "audio_overview_create")

@mcp.tool()
async def studio_status(notebook_id: str) -> str:
    """Lists all created artifacts (Audio, Video, FAQ, etc.)."""
    async def _op():
        client = await get_client_with_timeout()
        async with client:
            artifacts = await client.artifacts.list(notebook_id)
            if not artifacts: return "생성된 아티팩트가 없습니다."
            return "\n".join([f"- [{a.id}] {a.title} ({a.kind})" for a in artifacts])
    return await execute_with_retry(_op, "studio_status")

if __name__ == "__main__":
    mcp.run()

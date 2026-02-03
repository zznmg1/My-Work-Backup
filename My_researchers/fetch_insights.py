import asyncio
import os
import sys

# Add current directory to path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from server import list_researchers, assign_task

async def fetch_insights():
    print("Starting insight fetch...", flush=True)
    
    try:
        # 1. Get Researchers
        print("Listing researchers...", flush=True)
        researchers_text = await list_researchers()
        print(f"Researchers found:\n{researchers_text}", flush=True)
        
        # Parse basic IDs (simple parsing)
        import re
        ids = re.findall(r"\[ID: ([\w-]+)\]", researchers_text)
        
        if not ids:
            print("No researcher IDs found to query.", flush=True)
            return

        # 2. Ask for summary
        topic = "내가 올린 자료들을 바탕으로, 핵심 내용과 향후 방향성을 3줄로 요약해줘."
        
        for r_id in ids:
            print(f"Querying researcher {r_id}...", flush=True)
            try:
                # Use a smaller query to ensure speed
                response = await assign_task(r_id, topic)
                print(f"--- Response from {r_id} ---")
                print(response)
                print("-----------------------------")
            except Exception as e:
                print(f"Error querying {r_id}: {e}", flush=True)
                
    except Exception as e:
        print(f"Critical Error: {e}", flush=True)

if __name__ == "__main__":
    asyncio.run(fetch_insights())

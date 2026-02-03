import asyncio
from server import list_researchers

async def test():
    print("Testing list_researchers()...")
    result = await list_researchers()
    print("Result:")
    print(result)

if __name__ == "__main__":
    asyncio.run(test())

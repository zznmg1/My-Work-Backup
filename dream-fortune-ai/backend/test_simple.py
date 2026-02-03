print("Testing Python Execution")
import sys
print(f"Python Version: {sys.version}")
try:
    import google.generativeai as genai
    print(f"GenerativeAI Version: {genai.__version__}")
except ImportError:
    print("GenerativeAI not found")

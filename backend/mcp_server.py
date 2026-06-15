import sys, json
from app.services.transcribe_audio_speech import WhisperService
def main():
    while True:
        try:
            line = sys.stdin.readline()
            if not line: break
            msg = json.loads(line)
            mid = msg.get("id")
            if msg.get("method") == "initialize":
                sys.stdout.write(json.dumps({"jsonrpc": "2.0", "id": mid, "result": {"protocolVersion": "2024-11-05"}}) + "\n")
            elif msg.get("method") == "tools/list":
                sys.stdout.write(json.dumps({"jsonrpc": "2.0", "id": mid, "result": {"tools": [{"name": "transcribe_audio_speech"}]}}) + "\n")
            elif msg.get("method") == "tools/call":
                sys.stdout.write(json.dumps({"jsonrpc": "2.0", "id": mid, "result": {"content": [{"type": "text", "text": json.dumps(WhisperService().execute())}]}}) + "\n")
            sys.stdout.flush()
        except: break
if __name__ == '__main__': main()
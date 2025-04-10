from services.sms_service import send_sms
import os
from dotenv import load_dotenv

load_dotenv()

def test_sms():
    test_number = 8210788702  # Replace with your number
    try:
        print(f"Testing SMS to number: {test_number}")
        print("API Key:", os.getenv("FAST2SMS_API_KEY")[:6] + "..." if os.getenv("FAST2SMS_API_KEY") else "Not found")
        print("Sending test SMS...")
        
        request_id = send_sms(test_number, "123456")
        print(f"SMS sent successfully! Request ID: {request_id}")
    except Exception as e:
        print(f"Error sending SMS: {str(e)}")

if __name__ == "__main__":
    test_sms()
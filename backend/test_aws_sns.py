from services.aws_sms_service import AWSSMSService
import os
from dotenv import load_dotenv

load_dotenv()

def test_aws_sns():
    sms_service = AWSSMSService()
    test_number = 8210788702  # Your number
    
    print("\nAWS Configuration:")
    print(f"Access Key: {os.getenv('AWS_ACCESS_KEY')[:6]}...")
    print(f"Region: {os.getenv('AWS_REGION')}")
    print(f"Testing number: +91{test_number}")
    
    try:
        result = sms_service.send_sms(test_number, "123456")
        print(f"\nSuccess! Details:")
        print(f"Message ID: {result.get('message_id')}")
    except Exception as e:
        print(f"\nError: {str(e)}")

if __name__ == "__main__":
    test_aws_sns()
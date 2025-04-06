from services.aws_sms_service import AWSSMSService

def test_aws_sms():
    sms_service = AWSSMSService()
    test_number = 8210788702  # Replace with your number
    
    try:
        result = sms_service.send_sms(test_number, "123456")
        print(f"SMS sent successfully! Message ID: {result['message_id']}")
    except Exception as e:
        print(f"Error sending SMS: {str(e)}")

if __name__ == "__main__":
    test_aws_sms()
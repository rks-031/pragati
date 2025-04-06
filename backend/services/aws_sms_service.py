import boto3
from botocore.exceptions import ClientError
from config.config import AWS_ACCESS_KEY, AWS_SECRET_KEY, AWS_REGION

class AWSSMSService:
    def __init__(self):
        # Print debug info
        print(f"Initializing AWS SMS Service with region: {AWS_REGION}")
        print(f"Access Key starts with: {AWS_ACCESS_KEY[:6] if AWS_ACCESS_KEY else 'None'}")
        
        if not all([AWS_ACCESS_KEY, AWS_SECRET_KEY, AWS_REGION]):
            raise Exception("AWS credentials not properly configured")
            
        self.client = boto3.client(
            "sns",
            aws_access_key_id=AWS_ACCESS_KEY,
            aws_secret_access_key=AWS_SECRET_KEY,
            region_name=AWS_REGION
        )

    def format_phone_number(self, phone: int) -> str:
        """Format phone number to E.164 format"""
        phone_str = str(phone)
        if len(phone_str) != 10:
            raise ValueError("Phone number must be 10 digits")
        return f"+91{phone_str}"

    def send_sms(self, phone: int, otp: str) -> dict:
        """Send SMS using AWS SNS"""
        try:
            phone_number = self.format_phone_number(phone)
            message = f"Your OTP is {otp}. It is valid for 5 minutes."
            
            print(f"Attempting to send SMS to: {phone_number}")
            
            response = self.client.publish(
                PhoneNumber=phone_number,
                Message=message,
                MessageAttributes={
                    'AWS.SNS.SMS.SMSType': {
                        'DataType': 'String',
                        'StringValue': 'Transactional'
                    }
                }
            )
            
            print(f"AWS Response: {response}")
            
            if 'MessageId' in response:
                return {
                    'success': True,
                    'message_id': response['MessageId']
                }
            else:
                raise Exception('No MessageId in response')
                
        except ClientError as e:
            print(f"AWS Client Error: {str(e)}")
            raise Exception(f"AWS SMS Error: {str(e)}")
        except Exception as e:
            print(f"General Error: {str(e)}")
            raise Exception(f"Failed to send SMS: {str(e)}")
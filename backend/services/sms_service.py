
from twilio.rest import Client

# Load Twilio credentials from environment variables
from config.config import TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_PHONE_NUMBER




# Initialize the Twilio Client
twilio_client = Client(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN)

def send_sms(phone: str, otp: str) -> str:
    """
    Send an SMS with the OTP to the given phone number.
    Returns the message SID if successful.
    """
    try:
        message = twilio_client.messages.create(
            body=f"Your OTP is {otp}. It is valid for 5 minutes.",
            from_=TWILIO_PHONE_NUMBER,
            to=phone
        )
        return message.sid
    except Exception as e:
        # In production, log the error details
        raise Exception(f"Failed to send SMS: {e}")

# import requests
# import json
# from config.config import FAST2SMS_API_KEY

# def format_phone_number(phone: int) -> str:
#     """Validate phone number"""
#     phone_str = str(phone)
#     if len(phone_str) != 10:
#         raise ValueError("Phone number must be 10 digits")
#     return phone_str

# def send_sms(phone: int, otp: str) -> str:
#     """
#     Send SMS using Fast2SMS
#     Returns request_id if successful
#     """
#     try:
#         phone_number = format_phone_number(phone)
#         message = f"Your OTP is {otp}. It is valid for 5 minutes."
        
#         url = "https://www.fast2sms.com/dev/bulkV2"
        
#         querystring = {
#             "authorization": FAST2SMS_API_KEY,
#             "message": message,
#             "language": "english",
#             "route": "q",
#             "numbers": phone_number
#         }
        
#         headers = {
#             "cache-control": "no-cache"
#         }
        
#         response = requests.request("GET", url, headers=headers, params=querystring)
#         print(f"API Response: {response.text}")  # Debug line
        
#         response_data = response.json()
        
#         if response_data.get('status_code') == 200:
#             return response_data.get('request_id', 'SMS sent successfully')
#         else:
#             raise Exception(response_data.get('message', 'Unknown error occurred'))
            
#     except ValueError as ve:
#         raise Exception(f"Invalid phone number: {str(ve)}")
#     except json.JSONDecodeError:
#         raise Exception(f"Invalid API response: {response.text}")
#     except Exception as e:
#         raise Exception(f"Failed to send SMS: {str(e)}")
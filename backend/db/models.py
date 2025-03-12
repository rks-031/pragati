

from pydantic import BaseModel, Field


class RegisterModel(BaseModel):
    name: str
    student_class: str = Field(..., alias="class")  
    school: str = Field(..., alias="school_anganbadi_name")  
    parent_phone: str
    pin: str  

class LoginModel(BaseModel):
    name: str
    phone: str = Field(..., alias="Phone_Number")
    pin: str

class ForgotPasswordModel(BaseModel):
    phone: str

class ResetPasswordModel(BaseModel):
    phone: str
    otp: str
    new_pin: str
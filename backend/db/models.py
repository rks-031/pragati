
from pydantic import BaseModel, Field # type: ignore
from pydantic import BaseModel, Field, constr, conint # type: ignore

class RegisterModel(BaseModel):
    name: str
    student_class: str = Field(..., alias="class")  
    school: str = Field(..., alias="school_anganbadi_name")  
    parent_phone: int  
    pin: str

class LoginModel(BaseModel):
    # name: str
    phone: int
    pin: str

class ForgotPasswordModel(BaseModel):
    phone: int

class ResetPasswordModel(BaseModel):
    phone: int
    otp: str
    new_pin: str 
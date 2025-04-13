
from enum import Enum
from typing import Optional
from pydantic import BaseModel, Field # type: ignore
from pydantic import BaseModel, Field, constr, conint # type: ignore

class QualificationEnum(str, Enum):
    BED = "BED"
    JUNIOR = "Junior"
    DIPLOMA = "Diploma"
    ELEMENTARY = "Elementary"
    TGT = "TGT"
    PGT = "PGT"

class roleEnum(str, Enum):
    teacher = "teacher"
    student = "student"
class RegisterModel(BaseModel):
    name: str
    student_class: Optional[str] = None
    school: Optional[str] = None
    parent_phone: Optional[int] = None 
    pin: str
    role: roleEnum
    qualification: Optional[QualificationEnum] = None
    apaar_id: Optional[int] = None
    phone: Optional[int] = None


class LoginModel(BaseModel):
    # name: str
    phone: Optional[int] = None
    pin: str
    role: roleEnum
    apaar_id: Optional[int] = None

class ForgotPasswordModel(BaseModel):
    phone: int

class ResetPasswordModel(BaseModel):
    phone: int
    otp: str
    new_pin: str 

class AnswerSubmission(BaseModel):
    questionIndex: int
    selected: str
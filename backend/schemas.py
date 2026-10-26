from pydantic import BaseModel, EmailStr, Field

class UserRegister(BaseModel):
    full_name: str = Field(min_length=2, max_length=100)
    email: EmailStr
    password: str = Field(min_length=8, max_length=128)


class UserResponse(BaseModel):
    id: int 
    full_name: str
    email: EmailStr


    class Config:
        from_attributes = True

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class MatchRequest(BaseModel):
    skills: list[str] = Field(min_length=1)


class SkillsUpdate(BaseModel):
    skills: list[str] = Field(min_length=1)
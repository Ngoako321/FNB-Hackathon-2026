from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, func
from database import Base 


class User(Base):
     __tablename__ = "users"

     id = Column(Integer, primary_key=True, index=True)
     full_name = Column(String(100), nullable=False)
     email = Column(String(255), unique=True, index=True, nullable=False)
     hashed_password = Column(String(255), nullable=False)
     skills = Column(Text, nullable=True, default="")


class Opportunity(Base):
     __tablename__ = "opportunities"

     id = Column(Integer, primary_key=True, index=True)
     title = Column(String(200), nullable=False)
     company = Column(String(200), nullable=False)
     type = Column(String(100),nullable=False)
     location = Column(String(200), nullable=False)
     description = Column(Text, nullable=False)
     skills = Column(Text, nullable=True, default="")

class Application(Base):
     __tablename__ = "applications"

     id = Column(Integer, primary_key=True, index=True)

     user_id = Column(Integer, ForeignKey("users.id"), nullable=False)

     opportunity_id = Column(Integer, ForeignKey("opportunities.id"), nullable=False)

     motivation = Column(Text, nullable=False)

     status = Column(String(50), nullable=False, default="Pending")

     created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
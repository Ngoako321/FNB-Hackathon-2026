from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from pwdlib import PasswordHash
from pydantic import BaseModel

from database import Base, engine, SessionLocal, get_db
from models import User, Opportunity, Application
from schemas import UserRegister, UserResponse, UserLogin, MatchRequest, SkillsUpdate
import logging 

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="LinkU API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

Base.metadata.create_all(bind=engine)

password_hash = PasswordHash.recommended()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@app.get("/")
def home():
    return {
        "message": "Welcome to LinkU API",
        "status": "Running",
    }


@app.get("/health")
def health_check():
    return {
        "status": "Healthy",
        "application": "LinkU",
    }



@app.post(
    "/register",
    response_model=UserResponse,
    status_code=status.HTTP_201_CREATED,
)
def register_user(user_data: UserRegister, db: Session = Depends(get_db)):
    try:
        email = str(user_data.email).lower()

        existing_user = (
            db.query(User)
            .filter(User.email == email)
            .first()
        )

        if existing_user:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="An account with this email already exists.",
            )

        hashed_password = password_hash.hash(user_data.password)

        new_user = User(
            full_name=user_data.full_name.strip(),
            email=email,
            hashed_password=hashed_password,
        )

        db.add(new_user)
        db.commit()
        db.refresh(new_user)

        return new_user

    except HTTPException:
        raise

    except Exception:
        db.rollback()
        logger.exception("Registration failed")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Could not create account. Check the backend terminal.",
        )

@app.post("/login")
def login_user(login_data: UserLogin, db: Session = Depends(get_db),):

    email = str(login_data.email).strip().lower()

    user = (
        db.query(User).filter(User.email == email).first()
    )

    if not user or not password_hash.verify(
        login_data.password,
        user.hashed_password,
    ):

        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password."
        )

    return {
        "message": "Login successful!",
        "user": {
            "id": user.id,
            "full_name": user.full_name,
            "email": user.email,
        },
    }
    
@app.get("/opportunities") 
def get_opportunities(db: Session = Depends(get_db)):
    opportunities = db.query(Opportunity).order_by(Opportunity.id.desc()).all()

    return [
        {
            "id": opportunity.id,
            "title": opportunity.title,
            "company": opportunity.company,
            "type": opportunity.type,
            "location": opportunity.location,
            "description": opportunity.description,
            "skills": [
                skill.strip()
                for skill in opportunity.skills.split(",")
                if skill.strip()
            ],
        }

        for opportunity in opportunities
    ]


@app.post(
    "/opportunities",
    status_code=status.HTTP_201_CREATED,
)
def create_opportunity(
    opportunity_data: dict,
    db: Session = Depends(get_db),
):
    required_fields = ["title","company","type","location","description","skills",]

    if any(
        field not in opportunity_data
        or not opportunity_data[field]
        for field in required_fields
    ):
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="All opportunity fields are required.",
        )

    skills = opportunity_data["skills"]

    if isinstance(skills, list):
        skills = ", ".join(str(skill) for skill in skills)

    new_opportunity = Opportunity(
        title= str(opportunity_data["title"]).strip(),
        company= str(opportunity_data["company"]).strip(),
        type= str(opportunity_data["type"]).strip(),
        location= str(opportunity_data["location"]).strip(),
        description= str(opportunity_data["description"]).strip(),
        skills= str(skills),
    )

    db.add(new_opportunity)
    db.commit()
    db.refresh(new_opportunity)

    return {
        "message": "Opportunity created successfully.",
        "id": new_opportunity.id,
        "title": new_opportunity.title,
    }

@app.get("/opportunities/{opportunity_id}")
def get_opportunity_details(
    opportunity_id: int,
    db: Session = Depends(get_db)
) :
    opportunity = db.query(Opportunity).filter(
        Opportunity.id == opportunity_id
    ).first()

    if opportunity is None:
        raise HTTPException(
            status_code=404,
            detail="Opportunity not found"
        )

    return {
        "id": opportunity.id,
        "title": opportunity.title,
        "company": opportunity.company,
        "type": opportunity.type,
        "location": opportunity.location,
        "description": opportunity.description,
        "skills": [
            skill.strip()
            for skill in opportunity.skills.split(",")
            if skill.strip()
        ],
    }

class ApplicationRequest(BaseModel):
    user_id: int
    opportunity_id: int
    motivation: str

@app.post("/applications", status_code=status.HTTP_201_CREATED)
def apply_for_opportunity(
    application_data: ApplicationRequest,
    db: Session = Depends(get_db),
):
    user = db.query(User).filter(
        User.id == application_data.user_id
    ).first()

    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found.",
        )

    opportunity = db.query(Opportunity).filter(
        Opportunity.id == application_data.opportunity_id
    ).first()

    if not opportunity:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Opportunity not found.",
        )

    motivation = application_data.motivation.strip()

    if not motivation:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Motivation cannot be empty.",
        )

    new_application = Application(
        user_id = user.id,
        opportunity_id= opportunity.id,
        motivation=motivation,
    )

    try: 
        db.add(new_application)
        db.commit()
        db.refresh(new_application)

        return {
            "message": "Application submitted successfully.",
            "application_id": new_application.id,
            "user_id": new_application.user_id,
            "opportunity_id": new_application.opportunity_id,
            "motivation": new_application.motivation,
            "status": new_application.status,
            "created_at": new_application.created_at,
        }

    except Exception as e:
        db.rollback()
        logger.exception("Application submission failed: %s", e)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e),
    )


@app.get("/applications")
def get_applications(db: Session = Depends(get_db)):
    applications = db.query(Application).all()

    return [
        {
            "id": application.id,
            "user_id": application.user_id,
            "opportunity_id": application.opportunity_id,
            "motivation": application.motivation,
            "status": application.status,
            "created_at": application.created_at,
        }
        for application in applications
    ]



@app.post("/match-opportunities")
def match_opportunities(
    request: MatchRequest,
    db: Session = Depends(get_db)
):
    opportunities = db.query(Opportunity).all()

    user_skills = {
        skill.strip().lower()
        for skill in request.skills
        if skill.strip()
    }

    if not user_skills:
        raise HTTPException(
            status_code=400,
            detail="Please provide at least one skill."
        )

    results = []

    for opportunity in opportunities:
        required_skills = {
            skill.strip().lower()
            for skill in opportunity.skills.split(",")
            if skill.strip()
        }

        matching_skills = user_skills.intersection(
            required_skills
        )

        missing_skills = required_skills - user_skills

        if required_skills:
            score = round(
                len(matching_skills) / len(required_skills) * 100
            )
        else:
            score = 0

        results.append({
            "id": opportunity.id,
            "title": opportunity.title,
            "company": opportunity.company,
            "type": opportunity.type,
            "location": opportunity.location,
            "description": opportunity.description,
            "skills": opportunity.skills,
            "match_percentage": score,
            "matching_skills": sorted(matching_skills),
            "missing_skills": sorted(missing_skills)
        })

    results.sort(
        key=lambda item: item["match_percentage"],
        reverse=True
    )

    return results


@app.get("/users/{user_id}/skills")
def get_user_skills(
    user_id: int,
    db: Session = Depends(get_db)
):
    user = db.query(User).filter(User.id == user_id).first()

    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    saved_skills = [
        skill.strip()
        for skill in (user.skills or "").split(",")
        if skill.strip()
    ]

    return {
        "user_id": user.id,
        "skills": saved_skills
    } 


@app.put("/users/{user_id}/skills")
def update_user_skills(
    user_id: int,
    request: SkillsUpdate,
    db: Session = Depends(get_db)
):
    user = db.query(User).filter(User.id == user_id).first()

    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    cleaned_skills = list(dict.fromkeys(
        skill.strip()
        for skill in request.skills
        if skill.strip()
    ))

    if not cleaned_skills:
        raise HTTPException(
            status_code=400,
            detail="Please provide at least one skill."
        )

    user.skills = ", ".join(cleaned_skills)

    try:
        db.commit()
        db.refresh(user)
    except Exception:
        db.rollback()
        logger.exception("Saving user skills failed")
        raise HTTPException(
            status_code=500,
            detail="Could not save skills."
        )

    return {
        "message": "Skills saved successfully",
        "user_id": user.id,
        "skills": cleaned_skills
    }
  
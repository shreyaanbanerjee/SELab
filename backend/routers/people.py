from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from typing import List
from ..database import get_session
from ..models import Person, Skill, PersonSkillLink

router = APIRouter(prefix="/people", tags=["people"])

@router.post("/", response_model=Person)
def create_person(person: Person, session: Session = Depends(get_session)):
    session.add(person)
    session.commit()
    session.refresh(person)
    return person

from sqlalchemy.orm import selectinload

@router.get("/", response_model=List[Person])
def read_people(session: Session = Depends(get_session)):
    people = session.exec(select(Person).options(selectinload(Person.skills))).all()
    return people

@router.get("/{person_id}", response_model=Person)
def read_person(person_id: int, session: Session = Depends(get_session)):
    person = session.get(Person, person_id)
    if not person:
        raise HTTPException(status_code=404, detail="Person not found")
    return person

@router.post("/{person_id}/skills", response_model=Person)
def add_skill_to_person(person_id: int, skill_name: str, session: Session = Depends(get_session)):
    person = session.get(Person, person_id)
    if not person:
        raise HTTPException(status_code=404, detail="Person not found")
    
    skill = session.exec(select(Skill).where(Skill.name == skill_name)).first()
    if not skill:
        skill = Skill(name=skill_name)
        session.add(skill)
        session.commit()
        session.refresh(skill)
        
    # Check if link exists
    if skill in person.skills:
        return person
        
    person.skills.append(skill)
    session.add(person)
    session.commit()
    session.refresh(person)
    return person

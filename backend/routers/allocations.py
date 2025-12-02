from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from typing import List, Dict, Any
from ..database import get_session
from ..models import Allocation, Project, Person
from ..ai_engine import get_smart_suggestions

router = APIRouter(prefix="/allocations", tags=["allocations"])

@router.post("/", response_model=Allocation)
def create_allocation(allocation: Allocation, session: Session = Depends(get_session)):
    # Verify existence
    person = session.get(Person, allocation.person_id)
    project = session.get(Project, allocation.project_id)
    if not person or not project:
        raise HTTPException(status_code=404, detail="Person or Project not found")
    
    # Update availability
    if person.availability < allocation.effort_percentage:
        raise HTTPException(status_code=400, detail="Person does not have enough availability")
    
    person.availability -= allocation.effort_percentage
    session.add(person)
    
    session.add(allocation)
    session.commit()
    session.refresh(allocation)
    return allocation

@router.get("/suggestions/{project_id}")
def get_suggestions(project_id: int, session: Session = Depends(get_session)):
    project = session.get(Project, project_id)
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    
    people = session.exec(select(Person)).all()
    suggestions = get_smart_suggestions(project, people)
    return suggestions

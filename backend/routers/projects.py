from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from typing import List
from ..database import get_session
from ..models import Project, Skill

router = APIRouter(prefix="/projects", tags=["projects"])

@router.post("/", response_model=Project)
def create_project(project: Project, session: Session = Depends(get_session)):
    session.add(project)
    session.commit()
    session.refresh(project)
    return project

@router.get("/", response_model=List[Project])
def read_projects(session: Session = Depends(get_session)):
    projects = session.exec(select(Project)).all()
    return projects

@router.get("/{project_id}", response_model=Project)
def read_project(project_id: int, session: Session = Depends(get_session)):
    project = session.get(Project, project_id)
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    return project

@router.post("/{project_id}/skills", response_model=Project)
def add_skill_to_project(project_id: int, skill_name: str, session: Session = Depends(get_session)):
    project = session.get(Project, project_id)
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    
    skill = session.exec(select(Skill).where(Skill.name == skill_name)).first()
    if not skill:
        skill = Skill(name=skill_name)
        session.add(skill)
        session.commit()
        session.refresh(skill)
        
    if skill in project.required_skills:
        return project
        
    project.required_skills.append(skill)
    session.add(project)
    session.commit()
    session.refresh(project)
    return project

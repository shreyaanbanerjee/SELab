from typing import List, Optional
from sqlmodel import Field, Relationship, SQLModel
from datetime import datetime

# Link tables
class PersonSkillLink(SQLModel, table=True):
    person_id: Optional[int] = Field(default=None, foreign_key="person.id", primary_key=True)
    skill_id: Optional[int] = Field(default=None, foreign_key="skill.id", primary_key=True)

class ProjectSkillLink(SQLModel, table=True):
    project_id: Optional[int] = Field(default=None, foreign_key="project.id", primary_key=True)
    skill_id: Optional[int] = Field(default=None, foreign_key="skill.id", primary_key=True)

# Main entities
class Skill(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str = Field(index=True, unique=True)
    
    people: List["Person"] = Relationship(back_populates="skills", link_model=PersonSkillLink)
    projects: List["Project"] = Relationship(back_populates="required_skills", link_model=ProjectSkillLink)

class Person(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str
    role: str # e.g., "Developer", "Designer"
    availability: int = Field(default=100) # Percentage 0-100
    
    skills: List[Skill] = Relationship(back_populates="people", link_model=PersonSkillLink)
    allocations: List["Allocation"] = Relationship(back_populates="person")

class Project(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str
    description: str
    status: str = Field(default="Active") # Active, Completed, Pending
    
    required_skills: List[Skill] = Relationship(back_populates="projects", link_model=ProjectSkillLink)
    allocations: List["Allocation"] = Relationship(back_populates="project")

class Allocation(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    person_id: int = Field(foreign_key="person.id")
    project_id: int = Field(foreign_key="project.id")
    effort_percentage: int = Field(default=100)
    
    person: Person = Relationship(back_populates="allocations")
    project: Project = Relationship(back_populates="allocations")

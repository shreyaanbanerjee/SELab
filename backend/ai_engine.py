from typing import List, Dict
from .models import Person, Project, Skill

def calculate_match_score(person: Person, project: Project) -> int:
    score = 0
    
    # 1. Skill Match
    project_skills = {s.name for s in project.required_skills}
    person_skills = {s.name for s in person.skills}
    
    matching_skills = project_skills.intersection(person_skills)
    score += len(matching_skills) * 10
    
    # 2. Availability Match
    # Prefer people with more availability, but penalize if 0
    if person.availability > 0:
        score += int(person.availability / 10) # Max 10 points
    else:
        score -= 50 # Heavy penalty for no availability
        
    # 3. Role Match (Simple heuristic)
    # If project name contains role keywords, boost score
    # This is a basic "AI" feature
    if person.role.lower() in project.name.lower():
        score += 5
        
    return score

def get_smart_suggestions(project: Project, all_people: List[Person]) -> List[Dict]:
    suggestions = []
    for person in all_people:
        score = calculate_match_score(person, project)
        suggestions.append({
            "person": person,
            "score": score,
            "match_reason": f"Matches {len(set(s.name for s in project.required_skills).intersection({s.name for s in person.skills}))} skills"
        })
    
    # Sort by score descending
    suggestions.sort(key=lambda x: x["score"], reverse=True)
    return suggestions

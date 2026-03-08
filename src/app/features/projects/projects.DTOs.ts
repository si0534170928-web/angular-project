export interface Project {
    id: number;
    team_id: number;
    name: string;
    description?: string;
    status: string;           // ← הוספתי
    created_at: Date;
}
export interface CreateProjectDTO {
    teamId: number;          // ← teamId (לא team_id)
    name: string;
    description?: string;
}
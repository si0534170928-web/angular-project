export interface Team {
    id: number,
    name: string,
    created_at: Date,
    members_count: number,
    projects_count?: number
}

export interface CreateTeamDTO {
    name: string;
}

export interface AddMemberDTO {
    userId: number;
}

export interface AddMemberRequestDTO {
    userId: number;
    role?: string;
}



















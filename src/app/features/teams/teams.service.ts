import { inject, Injectable, signal } from "@angular/core";
import { ApiService } from "../../core/services/api.service";
import { Team, CreateTeamDTO, AddMemberRequestDTO } from "./teams.DTOs";
import { tap, map } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class TeamsService{
    private apiservice=inject(ApiService);
    private _teams=signal<Team[]>([]);
    
    get teams() {
        return this._teams.asReadonly();
    }
    
    getTeams(){
        return this.apiservice.get<Team[]>('/teams').
        pipe(
            tap((teams:Team[])=>{
                this._teams.set(teams);
            }),
            map(()=>this._teams())
        );
    }

    createTeam(data: CreateTeamDTO) {
        return this.apiservice.post<Team, CreateTeamDTO>('/teams', data).
        pipe(
            tap((newTeam: Team) => {
                this._teams.set([...this._teams(), newTeam]);
            })
        );
    }

    addMember(teamId: number, data: AddMemberRequestDTO) {
        console.log('Adding member to team:', teamId, data);

        return this.apiservice.post<void, AddMemberRequestDTO>(`/teams/${teamId}/members`, data).
        pipe(
            tap(() => {
                this._teams.update(teams => 
                    teams.map(team => 
                        team.id === teamId 
                            ? { ...team, members_count: Number(team.members_count || 0) + 1 }
                            : team
                    )
                );
            })
        );
    }

    // Method to update project count when a project is created
    incrementProjectCount(teamId: number): void {
        this._teams.update(teams => 
            teams.map(team => 
                team.id === teamId 
                    ? { ...team, projects_count: (team.projects_count || 0) + 1 }
                    : team
            )
        );
    }

    // Method to get a specific team by ID
    getTeamById(teamId: number): Team | undefined {
        return this._teams().find(team => team.id === teamId);
    }
}
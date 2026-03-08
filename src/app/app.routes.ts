import { Routes } from '@angular/router';
import { Login } from './features/auth/login/login';
import { Register } from './features/auth/register/register';
import { Teams } from './features/teams/pages/teams/teams';
import { Tasks } from './features/tasks/pages/tasks/tasks';
import { Dashboard } from './shared/pages/dashboard/dashboard';
import { DesignShowcase } from './shared/pages/design-showcase/design-showcase';
import { Projects } from './features/projects/pages/projects/projects';
import { ProjectDetails } from './features/projects/pages/project-details/project-details.component';
import { TaskDetail } from './features/tasks/pages/task-detail/task-detail.component';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
    {path:'',redirectTo:'dashboard',pathMatch:'full'},
    {path:'auth/login',component:Login},
    {path:'projects',component:Projects,canActivate:[authGuard]},
    {path:'projects/:id',component:ProjectDetails,canActivate:[authGuard]},
    {path:'projects/:id/tasks/:taskId',component:TaskDetail,canActivate:[authGuard]},
    {path:'auth/register',component:Register},
    {path:'dashboard',component:Dashboard},
    {path:'teams',component:Teams, canActivate:[authGuard]},
    {path:'tasks',component:Tasks, canActivate:[authGuard]},
    {path:'design-showcase',component:DesignShowcase}
];

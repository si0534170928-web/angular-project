import { Injectable, Inject, PLATFORM_ID } from "@angular/core";
import { isPlatformBrowser } from "@angular/common";
import { User } from "../DTOs/user.model";

@Injectable({
    providedIn: 'root'
})
export class TokenService {
    constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

    private isBrowser(): boolean {
        return isPlatformBrowser(this.platformId);
    }

    getToken: () => string | null = () => {
        if (!this.isBrowser()) return null;
        return sessionStorage.getItem('token');
    }

    setToken = (token: string): void => {
        if (!this.isBrowser()) return;
        sessionStorage.setItem('token', token);
    }

    removeToken = (): void => {
        if (!this.isBrowser()) return;
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('user');
    }

    isLoggedIn: () => boolean = () => {
        if (!this.isBrowser()) return false;
        return this.getToken() !== null;
    }

    getUser(): User | null {
        if (!this.isBrowser()) return null;
        const userStr = sessionStorage.getItem('user');
        return userStr ? JSON.parse(userStr) : null;
    }

    setUser(user: User): void {
        if (!this.isBrowser()) return;
        sessionStorage.setItem('user', JSON.stringify(user));
    }
};
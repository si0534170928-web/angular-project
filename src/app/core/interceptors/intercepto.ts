import { HttpInterceptorFn, HttpErrorResponse } from "@angular/common/http";
import { inject } from "@angular/core";
import { catchError, throwError } from "rxjs";
import { Router } from "@angular/router";
import { TokenService } from "../services/token.service";
import { NotificationService } from "../services/notification.service";

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const tokenService = inject(TokenService);
  const notifications = inject(NotificationService);
  const router = inject(Router);
  const token = tokenService.getToken();
  const isAuthRequest = req.url.includes('/auth/');

  const authReq = (token && !isAuthRequest)
    ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
    : req;

  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      switch (error.status) {
        case 401:
          tokenService.removeToken();
          notifications.error('Your session has expired. Please log in again.');
          router.navigate(['/auth/login']);
          break;
        case 403:
          notifications.error('You do not have permission to perform this action.');
          break;
        case 404:
          notifications.error('The requested resource was not found.');
          break;
        case 500:
          notifications.error('A server error occurred. Please try again later.');
          break;
        case 0:
          notifications.error('Cannot connect to the server. Please check your connection.');
          break;
      }
      return throwError(() => error);
    })
  );
};

import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { throwError, catchError, tap } from 'rxjs';
import { passwordChangeRequest } from '../interfaces/passwordChangeRequest';
import { EmailChangeRequest } from '../interfaces/emailChangeRequest';
import { UserDetails } from '../interfaces/userDetails';
import { SharedUserDetailsService } from '../services/shared-user-details.service';

/**
 * Service for UserProfile component to communicate with backend
 */
@Injectable({
  providedIn: 'root'
})
export class UserProfileService {

  private readonly baseUrl = "http://localhost:8080/api/v1/users/"

  constructor(
    private http: HttpClient,
    private userDetailsService: SharedUserDetailsService
  ) { }

  /**
   * function to request the backend to change the password
   * @param passwordChangeRequest FORM entered by user
   * @param id of current logged-in user, passed from localStorage.getItem("userDetails")
   */
  updatePassword(passwordChangeRequest: passwordChangeRequest, id: string) {
    this.http.put<void>(this.baseUrl + `${id}/password`, passwordChangeRequest, { observe: 'body' })
      .pipe(
        catchError(this.handleException)
      );
  }

  changeEmail(emailChangeRequest: EmailChangeRequest, id: string) {
    this.http.put<UserDetails>(this.baseUrl + `${id}/email`, emailChangeRequest, { observe: 'body', responseType: 'json' })
      .pipe(
        tap((res: UserDetails) => {
          this.userDetailsService.setUserDetails(res)
        }),
        catchError(this.handleException)
      );
  }

  private handleException(exception: HttpErrorResponse) {
    if (exception.status === 0) {
      console.error(`Error on client-side occured:, ${exception.error}`)
    } else {
      console.error(`Error on server-side occured with status code: ${exception.status} and message: ${exception.error}`)
    }

    return throwError(() => new Error("Error happened; Try again"))
  }
}
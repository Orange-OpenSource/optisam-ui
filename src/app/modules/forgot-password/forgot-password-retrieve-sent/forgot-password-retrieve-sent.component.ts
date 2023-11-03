import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-forgot-password-retrieve-sent',
  templateUrl: './forgot-password-retrieve-sent.component.html',
  styleUrls: ['./forgot-password-retrieve-sent.component.scss']
})
export class ForgotPasswordRetrieveSentComponent implements OnInit {
  email: string = "vivek@testmail.com"
  constructor() { }

  ngOnInit(): void {
  }

}

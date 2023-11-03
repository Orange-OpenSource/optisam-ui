import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-invalid-link',
  templateUrl: './invalid-link.component.html',
  styleUrls: ['./invalid-link.component.scss']
})
export class InvalidLinkComponent implements OnInit {
  @Input() isLoggedIn: boolean = false;

  constructor() { }

  ngOnInit(): void {
  }

}

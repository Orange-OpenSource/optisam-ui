import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Input,
  OnChanges,
  OnInit,
  Renderer2,
  SimpleChanges,
  ViewChild,
} from '@angular/core';

@Component({
  selector: 'app-editor-info',
  templateUrl: './editor-info.component.html',
  styleUrls: ['./editor-info.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditorInfoComponent implements OnInit, OnChanges {
  @Input() data: any;
  @Input() loading: boolean;
  viewMoreTooltipText: string;
  constructor(private renderer: Renderer2) {}
  partnerManagerArray: string[];
  globalAccountManagers: string[];
  auditsInfoArray: string[];
  sourcerArray: string[];
  vendorArray: string[];
  ngOnInit(): void {}
  scopes: string[];
  showViewMore = false;
  showAudit: boolean = false;
  showAccountManager: boolean = false;
  showSourcer: boolean = false;
  extractedPartnerEmailsArray: string[];
  extractedAccountEmailsArray: string[];
  extractedSourcersEmailArray: string[];
  panelOpenState = false;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.data) {
      console.log(this.data);
      //partner managers
      this.partnerManagerArray = this.data?.partner_managers;
      this.partnerManagerArray = this.partnerManagerArray?.filter(
        (obj) => Object.keys(obj).length !== 0
      );
      this.partnerManagerArray = this.sortArrayonEmail(
        this.partnerManagerArray
      );
      console.log(this.partnerManagerArray);
      if (this.partnerManagerArray?.length > 1) {
        this.showViewMore = true;
      }
      this.extractedPartnerEmailsArray = this.extractObjectsWithEmail(
        this.partnerManagerArray
      );

      //account managers
      this.globalAccountManagers = this.data?.global_account_manager;
      this.globalAccountManagers = this.globalAccountManagers?.filter(
        (obj) => Object.keys(obj).length !== 0
      );
      this.globalAccountManagers = this.sortArrayonEmail(
        this.globalAccountManagers
      );
      if (this.globalAccountManagers?.length > 1) {
        this.showAccountManager = true;
      }
      this.extractedAccountEmailsArray = this.extractObjectsWithEmail(
        this.globalAccountManagers
      );
      //audits
      this.auditsInfoArray = this.data?.audits?.map((audit) => {
        // const year = new Date(audit.date).getFullYear();
        return { entity: audit.entity, year: audit.year };
      });
      if (this.auditsInfoArray?.length > 1) {
        this.showAudit = true;
      }
      this.auditsInfoArray = this.sortAuditArrayBasedOnYear(
        this.auditsInfoArray
      );
      this.auditsInfoArray = this.auditsInfoArray.filter(
        (audit: any) => audit.entity !== '' || audit.year !== 0
      ); // Remove objects where both entity and year are zero

      //sourcers
      this.sourcerArray = this.data?.sourcers;
      this.sourcerArray = this.sourcerArray?.filter(
        (obj) => Object.keys(obj).length !== 0
      );
      this.sourcerArray = this.sortArrayonEmail(this.sourcerArray);
      if (this.sourcerArray?.length > 1) {
        this.showSourcer = true;
      }
      this.extractedSourcersEmailArray = this.extractObjectsWithEmail(
        this.sourcerArray
      );

      //vendors
      if (this.data?.vendors?.length === 1) {
        this.vendorArray = this.data?.vendors[0]?.name?.split(',');
        console.log(this.vendorArray);
      } else {
        this.vendorArray = this.data?.vendors?.map((data: any) => {
          return data?.name;
        });
      }

      this.scopes = this.data?.scopes?.sort(
        (a: string, b: string) => a.length - b.length
      );
    }
  }

  sortArrayonEmail(partnerManagerArray: any[]) {
    const emailObjects = [];
    const nameObjects = [];
    const otherObjects = [];

    // Iterate through the array and separate objects based on their properties
    for (const object of partnerManagerArray) {
      if ('email' in object && object.email !== '') {
        emailObjects.push(object);
      } else if ('name' in object && object.name !== '') {
        nameObjects.push(object);
      } else {
        otherObjects.push(object);
      }
    }

    // Sort the email objects alphabetically by email field
    emailObjects.sort((a: any, b: any) => {
      return a.email.localeCompare(b.email);
    });

    // Combine the sorted arrays into a final result
    const result = emailObjects.concat(nameObjects, otherObjects);

    return result;
  }

  openEmailClient(arrayEmail: string[]) {
    const emails = arrayEmail;
    const subject = 'Email';
    const body = 'Your message here';

    const mailtoLink = `mailto:${emails.join(',')}?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`;
    window.location.href = mailtoLink;
  }

  extractObjectsWithEmail(arr: any) {
    return arr
      .filter((item) => {
        return item.email;
      })
      .map((item) => item.email);
  }

  sendEmail(email: string) {
    const mailtoUrl = `mailto:${email}`;
    window.open(mailtoUrl, '_blank');
  }

  sortAuditArrayBasedOnYear(arr: any) {
    return arr.sort((a: any, b: any) => {
      const aIsZeroOr1970 = a.year === 0;
      const bIsZeroOr1970 = b.year === 0;

      if (!aIsZeroOr1970 && bIsZeroOr1970) {
        return -1;
      } else if (aIsZeroOr1970 && !bIsZeroOr1970) {
        return 1;
      } else {
        return 0;
      }
    });
  }

  getScopesToolTip(): string {
    return this.scopes.slice(2).join(' ,');
  }
  getAuditsTooltip(): string {
    return this.auditsInfoArray
      .filter((audit: any) => audit.entity !== '' || audit.year !== 0) // Remove objects where both entity and year are zero
      .slice(1)
      .map((audit: any) => {
        const yearString = audit?.year === 0 ? '' : audit?.year;
        return `${yearString} ${audit?.entity}`;
      })
      .join(' , ');
  }

  getViewMoreTooltip() {
    return this.partnerManagerArray
      .slice(1)
      .map((p: any) => {
        let name = p.name ? p.name : '';
        let email = p.email ? ' ' + p.email : '';
        return name + email;
      })
      .join(', ');
  }

  getAccountManagerToolTip() {
    return this.globalAccountManagers
      .slice(1)
      .map((p: any) => {
        let name = p.name ? p.name : '';
        let email = p.email ? ' ' + p.email : '';
        return name + email;
      })
      .join(', ');
  }

  getSourcerToolTip() {
    return this.sourcerArray
      .slice(1)
      .map((p: any) => {
        let name = p.name ? p.name : '';
        let email = p.email ? ' ' + p.email : '';
        return name + email;
      })
      .join(', ');
  }

  onImgError(event): void {
    event.target.src = 'assets/images/default-company-icon.svg';
  }
}

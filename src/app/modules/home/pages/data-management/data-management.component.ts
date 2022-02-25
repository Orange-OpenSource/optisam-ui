import { Component, OnInit, AfterContentChecked } from "@angular/core";
import { FormControl, FormGroup } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { ActivatedRoute, Router } from "@angular/router";
import { TabMenu } from "@core/modals";
import { DataManagementService } from "src/app/core/services/data-management.service";
import { allowedScopes } from "src/app/core/util/common.functions";
import { ListInventoryLogsComponent } from "./list-inventory-logs/list-inventory-logs.component";

@Component({
  selector: "app-data-management",
  templateUrl: "./data-management.component.html",
  styleUrls: ["./data-management.component.scss"],
})
export class DataManagementComponent implements OnInit, AfterContentChecked {
  tabMenus: TabMenu[] = [
    { title: "Data", link: "/optisam/dm/data", show: true },
    {
      title: "Metadata",
      link: "/optisam/dm/metadata",
      show: this.allowedScope,
    },
    { title: "Global Data", link: "/optisam/dm/globaldata", show: true },
  ];
  activeLink = this.tabMenus[0].link;
  _loading: Boolean;
  errorMsg: String;
  globalFileName: string;
  deletionType: FormGroup;

  constructor(
    private router: Router,
    private dialog: MatDialog,
    private route: ActivatedRoute,
    private dpsService: DataManagementService
  ) {
    this.activeLink = this.router.url;
  }

  ngOnInit() {
    this.deletionType = new FormGroup({
      inventoryPark: new FormControl(false),
      acquiredRights: new FormControl(false),
    });
  }

  get inventoryPark() {
    return this.deletionType.get("inventoryPark");
  }

  get acquiredRights() {
    return this.deletionType.get("acquiredRights");
  }

  get noOptionSelected(): Boolean {
    if (Object.values(this.deletionType.value).includes(true)) {
      return false;
    }
    return true;
  }

  ngAfterContentChecked() {
    if (
      this.route.snapshot.firstChild &&
      this.route.snapshot.firstChild.params["globalFileId"]
    ) {
      this.activeLink = "/optisam/dm/data";
      this.globalFileName = localStorage.getItem("globalFileName");
    } else {
      this.activeLink = this.router.url;
      this.globalFileName = null;
    }
  }

  deleteInventoryConfirmation(deleteInventoryConfirmation) {
    this.openModal(deleteInventoryConfirmation, "40%");
  }

  deleteInventory(successDialog, errorDialog) {
    this._loading = true;
    let deletionType;
    if (this.inventoryPark.value && this.acquiredRights.value) {
      deletionType = "FULL";
    } else if (this.inventoryPark.value) {
      deletionType = "PARK";
    } else {
      deletionType = "ACQRIGHTS";
    }
    this.dpsService.deleteInventory(deletionType).subscribe(
      (res) => {
        this.dialog.closeAll();
        this.deletionType.reset();
        this.openModal(successDialog, "30%");
        this._loading = false;
      },
      (err) => {
        this.errorMsg =
          err.error.message ||
          "Some error occured! Could not complete delete operation.";
        this.dialog.closeAll();
        this.deletionType.reset();
        this.openModal(errorDialog, "30%");
        this._loading = false;
      }
    );
  }

  viewDeletionLogs() {
    const dialogRef = this.dialog.open(ListInventoryLogsComponent, {
      autoFocus: false,
      maxHeight: "90vh",
      width: "70vw",
    });
  }

  backToAllDataFiles() {
    this.globalFileName = undefined;
    this.router.navigate(["/optisam/dm/data"]);
  }

  openModal(templateRef, width) {
    let dialogRef = this.dialog.open(templateRef, {
      width: width,
      disableClose: true,
    });
  }

  get allowedScope(): boolean {
    return allowedScopes();
  }
}

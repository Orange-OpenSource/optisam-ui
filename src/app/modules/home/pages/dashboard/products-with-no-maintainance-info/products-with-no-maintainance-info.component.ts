import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SoftwareWithNoMaintenance } from '@core/modals';

@Component({
  selector: 'app-products-with-no-maintainance-info',
  templateUrl: './products-with-no-maintainance-info.component.html',
  styleUrls: ['./products-with-no-maintainance-info.component.scss'],
})
export class ProductsWithNoMaintainanceInfoComponent implements OnInit {
  displayedColumns: string[] = ['product_name', 'version'];
  constructor(
    public dialogRef: MatDialogRef<ProductsWithNoMaintainanceInfoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: SoftwareWithNoMaintenance // Replace 'any' with the actual type of obj if needed
  ) {
    console.log('Data received:', this.data);
  }

  ngOnInit(): void { }
}

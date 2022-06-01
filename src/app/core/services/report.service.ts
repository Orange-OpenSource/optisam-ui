import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

@Injectable({
  providedIn: 'root',
})
export class ReportService {
  reportUrl = environment.API_REPORT_URL;
  _isDownloading = new Subject<boolean>();

  constructor(private http: HttpClient) {}

  getReportTypes(): Observable<any> {
    const url = this.reportUrl + '/report/types';
    return this.http.get(url);
  }

  getListOfReports(query): Observable<any> {
    const url =
      this.reportUrl +
      '/reports' +
      query +
      '&scope=' +
      localStorage.getItem('scope');
    return this.http.get(url);
  }

  getReportById(reportID): Observable<any> {
    const url =
      this.reportUrl +
      '/report/' +
      reportID +
      '?scope=' +
      localStorage.getItem('scope');
    return this.http.get(url);
  }

  createReport(body): Observable<any> {
    const url = this.reportUrl + '/report';
    return this.http.post(url, body);
  }

  convertToCSV(objArray, headerList) {
    let jsonInput =
      typeof objArray != 'object' ? JSON.parse(objArray) : objArray;
    let csvOutput = '';
    let headerRow = '';

    for (let index in headerList) {
      headerRow += headerList[index] + ',';
    }
    headerRow = headerRow.slice(0, -1);
    csvOutput += headerRow + '\r\n';
    for (let i = 0; i < jsonInput.length; i++) {
      let contentLine = '';
      for (let index in headerList) {
        let head = headerList[index];
        if (index == '0') {
          contentLine += jsonInput[i][head];
        } else {
          contentLine += ',' + jsonInput[i][head];
        }
      }
      csvOutput += contentLine + '\r\n';
    }
    return csvOutput;
  }

  downloadFile(data, headerList, filename, format) {
    if (format == 'CSV') {
      let csvData = this.convertToCSV(data, headerList);
      let blob = new Blob(['\ufeff' + csvData], {
        type: 'text/csv;charset=utf-8;',
      });
      let dwldLink = document.createElement('a');
      let url = URL.createObjectURL(blob);
      dwldLink.setAttribute('href', url);
      dwldLink.setAttribute('download', filename + '.csv');
      dwldLink.style.visibility = 'hidden';
      document.body.appendChild(dwldLink);
      dwldLink.click();
      document.body.removeChild(dwldLink);
      this._isDownloading.next(true);
    } else if (format == 'PDF') {
      var doc = new jsPDF({orientation: "landscape"});
      var col = headerList;
      var rows = [];
      var contentBody = typeof data != 'object' ? JSON.parse(data) : data;

      for (let i = 0; i < contentBody.length; i++) {
        let contentLine = [];
        for (let index in headerList) {
          let head = headerList[index];
          contentLine.push(contentBody[i][head]);
        }
        rows.push(contentLine);
      }
      autoTable(doc,{
        head: [col],
        body: rows,
        theme: 'grid',
        styles: {
          overflow: 'linebreak',
          cellWidth: 'auto',
          minCellWidth: 14,
          fontSize: 7,
        },
      });
      doc.save(filename + '.pdf');
      this._isDownloading.next(true);
    }
  }

  getDownloadStatus() {
    return this._isDownloading.asObservable();
  }
}

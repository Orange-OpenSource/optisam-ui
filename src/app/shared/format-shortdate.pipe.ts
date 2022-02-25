import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "formatShortdate",
})
export class FormatShortdatePipe implements PipeTransform {
  twoDigit(value) {
    return value < 10 ? "0" + value : value;
  }

  transform(value: Date): any {
    if (value) {
      const d = new Date(value);
      const formattedDate = [
        d.getFullYear(),
        this.twoDigit(d.getMonth() + 1),
        this.twoDigit(d.getDate()),
      ].join("-");
      return formattedDate;
    }
    return value;
  }
}

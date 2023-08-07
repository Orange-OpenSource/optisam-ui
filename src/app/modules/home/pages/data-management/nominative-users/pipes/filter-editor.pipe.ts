import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterEditor',
  pure: true,
})
export class FilterEditorPipe implements PipeTransform {
  transform(editors: string[], editorCurrentValue: string): string[] {
    const data =
      editors?.filter((editor: string) =>
        editor
          .toLowerCase()
          .includes(editorCurrentValue ? editorCurrentValue.toLowerCase() : '')
      ) || [];

    return data;
  }
}

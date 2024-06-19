import { Component, OnInit } from '@angular/core';
import { DocumentService } from 'src/app/shared/services/document.service';
import { FormControl } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-filter-table',
  templateUrl: './filter-table.component.html',
  styleUrls: ['./filter-table.component.scss']
})
export class FilterTableComponent implements OnInit {
  searchControl: FormControl = new FormControl();
  documents;
  filteredDocuments;

  constructor(private documentService: DocumentService) {}

  ngOnInit() {
    this.documentService.getDocuments()
        .subscribe((res: any[]) => {
          console.log('Documents received:', res);
          this.documents = [...res];
          this.filteredDocuments = res;
        });

    this.searchControl.valueChanges
        .pipe(debounceTime(200))
        .subscribe(value => {
          this.filterData(value);
        });
  }

  filterData(val) {
    if (val) {
      val = val.toLowerCase();
    } else {
      return this.filteredDocuments = [...this.documents];
    }

    const columns = Object.keys(this.documents[0] || {});
    if (!columns.length) {
      return;
    }

    const rows = this.documents.filter(function(d) {
      return columns.some(column => d[column] && d[column].toString().toLowerCase().includes(val));
    });
    this.filteredDocuments = rows;
  }
}

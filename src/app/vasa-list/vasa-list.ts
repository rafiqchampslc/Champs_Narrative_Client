import { Component, OnInit, ViewChild, AfterViewInit, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OdkVersionService } from '../services/odk-version.service';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { provideNativeDateAdapter } from '@angular/material/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { VasaNarrativeFilter } from '../models/vasa-narrative-filter.model';
import { catchError, of } from 'rxjs';
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';


@Component({
  selector: 'app-vasa-list',
  standalone: true,
  imports: [CommonModule, FormsModule, MatTableModule,MatIconModule, MatPaginator, MatFormFieldModule, MatInputModule, MatSelectModule, MatButtonModule, MatDatepickerModule, MatCardModule],
  templateUrl: './vasa-list.html',
  styleUrl: './vasa-list.css',
})
export class  VasaListComponent implements OnInit, AfterViewInit {
  vasaRecords: any[] = [];
  odkVersions: any[] = [];
  selectedOdkVersion: string = '';
  selectedDeathType: string = '0';
  selectedNarrativeStatus: string = '0';
  dataCollectionDateFrom: Date | null = null;
  dataCollectionDateTo: Date | null = null;
  dateRangeError: string = '';
  apiError: string = '';
  vasaNarrativeData: MatTableDataSource<any> = new MatTableDataSource<any>();

  columnDisplayNames: { [key: string]: string } = {
    'name': 'Name',
    'champsid': 'CHAMPS ID',
    'hdssid': 'HDSS ID',
    'dob': 'Date of Birth',
    'dod': 'Date of Death',
    'age': 'Age',
    'sex': 'Sex',
    'vasaNarrative': 'Narrative',
    'fat_hhhead': 'Father/HH Head',
    'mother': 'Mother',
    'adderss': 'Address',
    'deathStatus': 'Death Status',
    'intv_date': 'Interview Date',
    'intv_time': 'Interview Time',
    'intrv_result': 'Interview Status',
    'isconcented': 'Consent',
    'starttime': 'Data Entry DateTime',
    'version': 'System Version',
    'uuid': 'UUID',
    'datacollector': 'Data Collector',
    'datauploaddate': 'Submission Date'
  };

  private odkVersionsLoaded = false;
  private paginatorInitialized = false;

  deathTypes = [
    { label: 'All', value: '0' },
    { label: 'Neonate + Stillbirth', value: '1' },
    { label: 'Stillbirth', value: '2' },
    { label: 'Neonate', value: '3' },
    { label: 'Child', value: '4' },
    { label: 'Adult', value: '5' }
  ];

  narrativeStatuses = [
    { label: 'All', value: '0' },
    { label: 'Not Written Yet', value: '9' },
    { label: 'Completed', value: '1' },
    { label: 'Incomplete', value: '2' },
    { label: 'No Narrative', value: '3' }
  ];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild('input') filterInput!: ElementRef;

  constructor(private odkVersionService: OdkVersionService, private router: Router, private authService: AuthService) { }

  ngOnInit(): void {
    // Load filter state from AuthService if available
    const savedFilterState = this.authService.getFilterState();
    if (savedFilterState.odkVersion) {
      this.selectedDeathType = savedFilterState.deathType;
      this.selectedNarrativeStatus = savedFilterState.narrativeStatus;
      this.dataCollectionDateFrom = savedFilterState.dateFrom;
      this.dataCollectionDateTo = savedFilterState.dateTo;
      this.vasaNarrativeData.filter = savedFilterState.filterText;
    }
    this.fetchOdkVersions();
  }

  ngAfterViewInit() {
    this.vasaNarrativeData.paginator = this.paginator;
    // Set the filter input value if it was saved
    if (this.filterInput) {
      this.filterInput.nativeElement.value = this.authService.currentFilterText;
    }

    // Restore paginator state
    this.paginator.pageIndex = this.authService.currentPageIndex;
    this.paginator.pageSize = this.authService.currentPageSize;

    // Subscribe to page events to save state
    this.paginator.page.subscribe(event => {
      this.authService.currentPageIndex = event.pageIndex;
      this.authService.currentPageSize = event.pageSize;
    });

    this.paginatorInitialized = true;
    this.tryFetchData();
  }

  private tryFetchData() {
    if (this.odkVersionsLoaded && this.paginatorInitialized) {
      this.fetchVasaNarrativeData();
    }
  }

  fetchOdkVersions() {
    this.odkVersionService.getOdkVersions().subscribe((data: any) => {
      // Prepend the "All" option with value '0'
      this.odkVersions = [{ vasaDisplayVersion: 'All', actualValue: '0' }, ...data];

      // If a version was saved in authService, use it; otherwise, default to '0' (All)
      if (this.authService.currentOdkVersion && this.odkVersions.some(v => v.actualValue === this.authService.currentOdkVersion || v.vasaDisplayVersion === this.authService.currentOdkVersion)) {
        this.selectedOdkVersion = this.authService.currentOdkVersion;
      } else if (this.odkVersions.length > 0) {
        this.selectedOdkVersion = '0';
      }
      this.odkVersionsLoaded = true;
      this.tryFetchData();
    });
  }

  fetchVasaNarrativeData() {
    const versionToFetch = this.selectedOdkVersion;
    const deathTypeToFetch = this.selectedDeathType;
    const narrativeStatusToFetch = this.selectedNarrativeStatus;
    const dateFrom = this.dataCollectionDateFrom ? this.formatDate(this.dataCollectionDateFrom) : null;
    const dateTo = this.dataCollectionDateTo ? this.formatDate(this.dataCollectionDateTo) : null;
debugger;
    const filters: VasaNarrativeFilter = {
      odkVersion: versionToFetch,
      deathType: deathTypeToFetch,
      narrativeStatus: narrativeStatusToFetch,
      dateFrom: dateFrom,
      dateTo: dateTo
    };

    this.apiError = ''; // Clear any previous API error
    this.odkVersionService.getVasaNarrativeByFilters(filters).pipe(
      catchError(error => {
        console.error('Error fetching VASA narrative data:', error);
        if (error.status === 404) {
          this.apiError = error.error || 'No data found.';
        } else {
          this.apiError = 'Failed to fetch data. Please try again later.';
        }
        this.vasaNarrativeData.data = []; // Clear table data on error
        return of([]);
      })
    ).subscribe((data: any) => {
      debugger;
      this.vasaNarrativeData.data = data.map((item: any) => {
        const rowData: any = { ...item.pgData }; // Start with pgData properties
        rowData.vasaNarrative = item.narrativeData?.vasaNarrative || ''; // Add vasaNarrative, defaulting to empty string
        rowData.isCompleted = item.narrativeData?.isCompleted; // Add isCompleted for button color

        // Format Sex
        rowData.sex = this.formatSex(rowData.sex);

        // Determine Death Status
        if (rowData.is_sb == 1) {
          rowData.deathStatus = 'Stillbirth';
        } else if (rowData.is_neonate == 1) {
          rowData.deathStatus = 'Neonate';
        } else if (rowData.is_child == 1) {
          rowData.deathStatus = 'Child';
        } else if (rowData.is_adult == 1) {
          rowData.deathStatus = 'Adult';
        } else {
          rowData.deathStatus = ''; // Default or unknown status
        }

        // Remove original columns if they are no longer needed in the display
        delete rowData.is_sb;
        delete rowData.is_neonate;
        delete rowData.is_child;
        delete rowData.is_adult;

        // Format Age
        rowData.age = this.formatAge(rowData.age, rowData.age_unit);

        // Remove original age_unit column
        delete rowData.age_unit;

        // Format Interview Status
        rowData.intrv_result = this.formatInterviewStatus(rowData.intrv_result);

        // Format Consent
        rowData.isconcented = this.formatConsent(rowData.isconcented);

        

        return rowData;
      });
      // Re-apply paginator and its state after data is set
      if (this.paginator) {
        this.vasaNarrativeData.paginator = this.paginator;
        this.paginator.pageIndex = this.authService.currentPageIndex;
      }
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.vasaNarrativeData.filter = filterValue.trim().toLowerCase();
    this.authService.currentFilterText = filterValue.trim().toLowerCase();

    if (this.vasaNarrativeData.paginator) {
      this.vasaNarrativeData.paginator.firstPage();
      this.authService.currentPageIndex = 0;
    }
  }

  onSearch() {
    if (this.dataCollectionDateFrom && this.dataCollectionDateTo && this.dataCollectionDateTo < this.dataCollectionDateFrom) {
      this.dateRangeError = '"Data Collection Date To" must be greater than or equal to "Data Collection Date From".';
      return;
    }
    this.dateRangeError = ''; // Clear any previous error

    // Reset paginator to the first page on new search
    if (this.paginator) {
      this.paginator.firstPage();
      this.authService.currentPageIndex = 0;
    }

    this.fetchVasaNarrativeData();
  }

  

  openNarrative(element: any) {
    debugger;
    // Save current filter state before navigating
    this.authService.setFilterState(
      this.selectedOdkVersion,
      this.selectedDeathType,
      this.selectedNarrativeStatus,
      this.dataCollectionDateFrom,
      this.dataCollectionDateTo,
      this.vasaNarrativeData.filter,
      this.paginator.pageIndex,
      this.paginator.pageSize
    );
    debugger;
    this.router.navigate(['/vasa-narrative-details', element.version, element.uuid]);
  }

  getNarrativeButtonColor(isCompleted: number | null | undefined): string {
    if (isCompleted === 1) {
      return 'DarkGreen';
    } else if (isCompleted === 2) {
      return 'DarkOrange';
    }else if (isCompleted === 3) {
      return 'Indigo';
    } else {
      return 'Crimson';
    }
  }

  getDisplayedColumns(): string[] {
    const desiredOrder = [
      'name', 'champsid', 'hdssid', 'sex', 'deathStatus', 'vasaNarrative',
      'dod', 'dob', 'age', 'datacollector', 'mother', 'fat_hhhead', 'adderss', 'intrv_result',
      'isconcented', 'intv_date', 'intv_time', 'starttime', 'version', 'datauploaddate','uuid'
    ];
    const availableColumns = this.vasaNarrativeData.data.length > 0 ? Object.keys(this.vasaNarrativeData.data[0]) : [];
    const orderedColumns = desiredOrder.filter(col => availableColumns.includes(col));
    return ['narrative', ...orderedColumns];
  }

  getTableColumns(): string[] {
    const desiredOrder = [
      'name', 'champsid', 'hdssid', 'sex', 'deathStatus', 'vasaNarrative',
      'dod', 'dob', 'age', 'datacollector','mother', 'fat_hhhead', 'adderss', 'intrv_result',
      'isconcented', 'intv_date', 'intv_time', 'starttime', 'version', 'datauploaddate', 'uuid'
    ];
    const availableColumns = this.vasaNarrativeData.data.length > 0 ? Object.keys(this.vasaNarrativeData.data[0]) : [];
    return desiredOrder.filter(col => availableColumns.includes(col));
  }

  formatAge(age: string, ageUnit: string): string {
    let unit = '';
    switch (ageUnit) {
      case '1':
        unit = 'Day/s';
        break;
      case '2':
        unit = 'Month/s';
        break;
      case '3':
        unit = 'Year/s';
        break;
      default:
        return String(age);
    }
    return `${age} ${unit}`;
  }

  formatInterviewStatus(intrv_result: string): string {
    if (intrv_result === '13') {
      return 'Started';
    } else {
      return 'Not Started';
    }
  }

  formatSex(sex: string): string {
    switch (sex) {
      case '1':
        return 'Male';
      case '2':
        return 'Female';
      default:
        return String(sex);
    }
  }
exportToExcel(): void {
  const worksheetData = this.vasaNarrativeData.data.map((item: any) => {
    const row: any = {};
    this.getTableColumns().forEach(col => {
      row[this.columnDisplayNames[col] || col] = item[col];
    });
    return row;
  });

  const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(worksheetData);
  const workbook: XLSX.WorkBook = { Sheets: { 'VASA Details': worksheet }, SheetNames: ['VASA Details'] };
  const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  const blob: Blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
  FileSaver.saveAs(blob, 'vasa_details.xlsx');
}

  

  formatConsent(isconcented: number): string {
    if (isconcented == 1) {
      return 'Given';
    } else if (isconcented == 2) {
      return 'Not Given';
    } else {
      return String(isconcented);
    }
  }

  private formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;}
  }

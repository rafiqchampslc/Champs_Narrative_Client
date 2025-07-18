import { Component } from '@angular/core';

@Component({
  selector: 'app-vasa-list',
  imports: [],
  templateUrl: './vasa-list.html',
  styleUrl: './vasa-list.css'
})
export class  VasaListComponent {
  // This component will display a list of VASA (Vessel and Seafarer) records.
  // You can add properties and methods to manage the list as needed.

  vasaRecords: any[] = []; // Replace 'any' with your actual data type

  constructor() {
    // Initialize the vasaRecords array or fetch data from a service
  }

  // Add methods to handle actions like fetching, adding, or deleting records

}

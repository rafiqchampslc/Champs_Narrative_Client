import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { OdkVersionService } from '../services/odk-version.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatRadioModule } from '@angular/material/radio';
import { AuthService } from '../services/auth.service';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { Location } from '@angular/common';
import { catchError } from 'rxjs/operators';
import { Observable, of } from 'rxjs'; // Added Observable here

@Component({
  selector: 'app-vasa-narrative-details',
  standalone: true,
  imports: [CommonModule, FormsModule, MatCardModule, MatIconModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatRadioModule, MatGridListModule],
  templateUrl: './vasa-narrative-details.html',
  styleUrls: ['./vasa-narrative-details.css']
})
export class VasaNarrativeDetailsComponent implements OnInit {
  narrativeDetails: any;
  vasaNarrative: string = '';
  errorMessage: string = '';
  narrativeStatus: string | null = null;
  isSaveButtonEnabled: boolean = false;
  canSaveOrUpdate: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private odkVersionService: OdkVersionService,
    private location: Location,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    const userRole = this.authService.getLoggedInUserRole();
    this.canSaveOrUpdate = userRole === 1;

    const version = this.route.snapshot.paramMap.get('odkVersion'); // This now holds the 'version' value
    const uri = this.route.snapshot.paramMap.get('uuid');
    if (version && uri) {
      this.odkVersionService.getVasaNarrativeDetails(version, uri)
        .subscribe({
          next: (data) => {
            if (data) {
              this.narrativeDetails = data;
              if (data.narrativeData) {
                this.vasaNarrative = data.narrativeData.vasaNarrative;
                // Initialize narrativeStatus based on isCompleted
                if (data.narrativeData.isCompleted === 1) {
                  this.narrativeStatus = '1';
                } else if (data.narrativeData.isCompleted === 2) {
                  this.narrativeStatus = '2';
                } else if (data.narrativeData.isCompleted === 3) {
                  this.narrativeStatus = '3';
                } else {
                  this.narrativeStatus = null;
                }
              } else {
                this.vasaNarrative = '';
                this.narrativeStatus = null;
              }
              this.checkSaveButtonStatus();
            }
          },
          error: (error: any) => {
            console.error('Error fetching narrative details:', error);
            this.errorMessage = 'Something went wrong or Item not found';
          }
        });
    }
  }

  onNarrativeChange() {
    this.checkSaveButtonStatus();
  }

  onNarrativeStatusChange() {
    this.checkSaveButtonStatus();
  }

  checkSaveButtonStatus() {
    this.isSaveButtonEnabled = (this.narrativeStatus !== null && this.narrativeStatus !== '') && (this.vasaNarrative.trim().length > 0);
  }

  saveNarrative() {
    if (!this.isSaveButtonEnabled) {
      return; // Button is disabled, so this shouldn't be called, but as a safeguard
    }

    const loggedInUserId = this.authService.getLoggedInUserId();

    const payload = {
      vasaUUID: this.narrativeDetails.pgData.uuid,
      vasaNarrative: this.vasaNarrative,
      odkVersion: String(this.narrativeDetails.pgData.version), // Explicitly convert to string
      entryBy: loggedInUserId || '', // Use logged-in user ID
      entryDate: this.narrativeDetails.narrativeData?.entryDate || new Date().toISOString(), // Keep original entryDate if updating
      editBy: loggedInUserId || '', // Use logged-in user ID
      editDate: new Date().toISOString(),
      isCompleted: parseInt(this.narrativeStatus || '0') // Convert to number
    };

    let apiCall: Observable<any>;

    if (this.narrativeDetails.narrativeData) {
      // Update scenario
      apiCall = this.odkVersionService.putVasaNarrative(payload);
    } else {
      // Save scenario
      apiCall = this.odkVersionService.postVasaNarrative(payload);
    }

    apiCall.subscribe({
      next: (response: string) => {
        console.log('Narrative saved successfully:', response);
        // Optionally, navigate back or show a success message
        this.location.back();
      },
      error: (error: any) => { // Explicitly typed error
        console.error('Error saving narrative:', error);
        // Show an error message to the user
        this.errorMessage = 'Failed to save narrative. Please try again. Details: ' + error.message;
      }
    });
  }

  goBack(): void {
    this.location.back();
  }

  formatAge(age: number, ageUnit: string): string {
    let unit = '';
    switch (ageUnit) {
      case '1':
        unit = 'Year';
        break;
      case '2':
        unit = 'Month';
        break;
      case '3':
        unit = 'Day';
        break;
      default:
        unit = String(ageUnit);
        break;
    }
    return `${age} ${unit}`;
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

  formatAgeGroup(is_sb: string, is_neonate: string, is_child: string, is_adult: string): string {
    if (is_sb === '1') {
      return 'Still Birth';
    } else if (is_neonate === '1') {
      return 'Neonate';
    } else if (is_child === '1') {
      return 'Child';
    } else if (is_adult === '1') {
      return 'Adult';
    } else {
      return "Don't know";
    }
  }

  formatInterviewStatus(intrv_result: string): string {
    if (intrv_result === '13') {
      return 'Started';
    } else {
      return 'Not Started';
    }
  }

  formatConsent(isconcented: string): string {
    if (isconcented === '1') {
      return 'Given';
    } else {
      return 'Not Given';
    }
  }
}

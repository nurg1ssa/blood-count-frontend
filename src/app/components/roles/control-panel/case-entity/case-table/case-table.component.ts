import { Component, OnInit } from '@angular/core';
import { ICaseResponse } from 'src/app/interfaces/ICaseResponse';
import { CaseService } from 'src/app/services/case.service';
import { IAbnormalityResponse } from 'src/app/interfaces/IAbnormalityResponse';
import { CaseDataService } from 'src/app/services/caseData.service';
import { SharedUserDetailsService } from 'src/app/services/shared-user-details.service';
import { UserDetails } from 'src/app/interfaces/IUserDetails';
import { NotifierService } from 'angular-notifier';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-case-table',
  templateUrl: './case-table.component.html',
  styleUrls: ['./case-table.component.css'],
})

export class CaseTableComponent implements OnInit {
  tableData: ICaseResponse[] = [];
  abnormalityData: IAbnormalityResponse[] = [];
  currentPage = 1;
  groupsPerPage = 10;
  openedPopup = false;
  userDetails: UserDetails;
  caseDetails: ICaseResponse;
  selectedLanguage: string = 'EN';

  private readonly notifier: NotifierService;

  onLanguageChange(language: string) {
    this.selectedLanguage = language;
    this.fetchTableData(); 
  }

  constructor(
    private caseService: CaseService,
    private caseDataService: CaseDataService,
    private sharedUserService: SharedUserDetailsService,
    notifierService: NotifierService
  ) {
    this.notifier = notifierService;
  }

  ngOnInit(): void {
    this.fetchTableData()
    this.caseDataService.refreshTable$.subscribe(() => {
      this.fetchTableData();
    });
    this.sharedUserService.getUserDetails().subscribe(userDetails => {
      this.userDetails = userDetails;
    });

  }

  fetchTableData(): void {
    this.caseService.getAllCasesWithAbnormalities().subscribe(
      (data) => {
        // Filter data based on selected language
        this.tableData = [data].flatMap((subArray) => subArray)
          .filter(item => item.language === this.selectedLanguage);
      },
      (error: any) => {
        console.error(error);
      }
    );
  }

  get totalPages(): number {
    return Math.ceil(this.tableData.length / this.groupsPerPage);
  }

  get displayedGroups(): ICaseResponse[] {
    const startIndex = (this.currentPage - 1) * this.groupsPerPage;
    const endIndex = startIndex + this.groupsPerPage;
    return this.tableData.slice(startIndex, endIndex);
  }


  get pages(): number[] {
    return Array.from({ length: this.totalPages }, (_, index) => index + 1);
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }


  openPopup(item) {
    this.abnormalityData = item.abnormalities
    this.openedPopup = true
    this.caseDetails = item
  }

  closePopup() {
    this.openedPopup = false

  }

  deletCase(item) {
    this.caseService.deleteCase(item).subscribe(
      () => {
        this.notifier.notify('success', 'Case has been deleted');
        this.fetchTableData()
      },
      (error: HttpErrorResponse) => {
        this.notifier.notify('error', error.message);
      })
  }
}

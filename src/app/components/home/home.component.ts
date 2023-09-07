import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { CaseService } from 'src/app/services/case.service';
import { ICaseResponse } from 'src/app/interfaces/ICaseResponse';
import { TimerComponent } from '../exam/timer/timer.component';
import { Router } from "@angular/router";
import { GameService } from 'src/app/services/game.service';
import { UserDetails } from 'src/app/interfaces/IUserDetails';
import { SharedUserDetailsService } from 'src/app/services/shared-user-details.service';
import { IStartGameRequest } from 'src/app/interfaces/IStartGameRequest';
import { TranslateService } from '@ngx-translate/core';
import { Language } from 'src/app/enums/language.enum';
import { SharedLanguageService } from 'src/app/services/shared-lang.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  @ViewChild(TimerComponent) timerComponent: TimerComponent;
  userDetails: UserDetails;
  onClick = false;
  dropdownOptions: ICaseResponse[] = [];
  selectedOption = null;
  selectedOptionId = null;
  isTestFinished: string;
  inProgress: boolean;
  gameId: number
  currentLang: string

  constructor(
    private caseService: CaseService,
    private router: Router,
    private gameService: GameService,
    private sharedUserService: SharedUserDetailsService,
    private languageService: TranslateService,
    private langService: SharedLanguageService

  ) { }

  toggleClick() {
    this.onClick = !this.onClick;
  }

  ngOnInit() {
    this.fetchCase();
    this.sharedUserService.getUserDetails().subscribe(userDetails => {
      this.userDetails = userDetails;
    });
    this.langService.language$.subscribe((language: string) => {
      if (!this.currentLang && language == 'EN') {
        this.selectedOption = 'Please choose the language to get cases';
      }
      else if(!this.currentLang && language == 'PL'){
        this.selectedOption = "Proszę wybrać język, aby uzyskać przypadki"
      }
      this.gameService.checkIfAnyInProgress(this.userDetails.id).subscribe(response => {
        this.inProgress = response.inProgress;
        this.gameId = response.gameId;
        if (this.inProgress && language == 'EN') {
          this.selectedOption = 'Your game is running, please press continue button';
        }
        else if(this.inProgress && language == 'PL'){
          this.selectedOption = "Twoja gra jest w trakcie, proszę nacisnąć przycisk kontynuuj"
        }
      })
    });
    
  }

  fetchCase() {
      this.caseService.getAllCasesWithAbnormalities().subscribe(cases => {
        this.dropdownOptions = [cases]
          .flatMap((subArray) => subArray)
          .filter(caseItem => caseItem.language === this.currentLang)
          .sort();
          this.langService.language$.subscribe((language: string) => { 
            if (this.dropdownOptions.length == 0 && language == 'EN'){
              this.selectedOption = 'No cases yet';
            }
            else if (this.dropdownOptions.length == 0 && language == 'PL'){
              this.selectedOption = 'Nie ma jeszcze żadnych przypadków';
            }
          })
      });
  }

  selectOption(option: string, id: number) {
    this.selectedOption = 'Case ' + id;
    this.selectedOptionId = id;
    this.onClick = false;
  }

  startTest() {
    let selectedLanguage = this.currentLang;
    if (!selectedLanguage) {
      selectedLanguage = 'EN'
    }
    let startRequest: IStartGameRequest = {
      userId: this.userDetails.id,
      caseId: this.selectedOptionId,
      language: Language[selectedLanguage.toUpperCase() as keyof typeof Language]
    }
    this.gameService.start(startRequest).subscribe(data => {
      this.router.navigate(['/exam']);
    });
  }

  continueTest() {
    this.router.navigate(['/exam']);
  }
  pickLang(language){
    this.currentLang = language
    this.selectedOption = '';
    this.onClick = false
    this.fetchCase();
  }
}

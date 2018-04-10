import {NgModule} from '@angular/core';
import {HttpClientModule} from '@angular/common/http';
import {BrowserModule} from '@angular/platform-browser';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {HomeComponent} from './home/home.component';
import {QuizListComponent} from './quiz-list/quiz-list.component';
import {QuizComponent} from './quiz/quiz.component';
import {NavmenuComponent} from './navmenu/navmenu.component';
import {AboutComponent} from './about/about.component';
import {LoginComponent} from './login/login.component';
import {PageNotFoundComponent} from './page-not-found/page-not-found.component';
import {QuizEditComponent} from './quiz-edit/quiz-edit.component';
import {QuestionListComponent} from './question-list/question-list.component';
import {QuestionEditComponent} from './question-edit/question-edit.component';
import {AnswerListComponent} from './answer-list/answer-list.component';
import {AnswerEditComponent} from './answer-edit/answer-edit.component';
import {ResultListComponent} from './result-list/result-list.component';
import {ResultEditComponent} from './result-edit/result-edit.component';
import {QuizSearchComponent} from './quiz-search/quiz-search.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    QuizListComponent,
    QuizComponent,
    NavmenuComponent,
    AboutComponent,
    LoginComponent,
    PageNotFoundComponent,
    QuizEditComponent,
    QuestionListComponent,
    QuestionEditComponent,
    AnswerListComponent,
    AnswerEditComponent,
    ResultListComponent,
    ResultEditComponent,
    QuizSearchComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}

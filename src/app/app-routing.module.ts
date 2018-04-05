import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {HomeComponent} from './home/home.component';
import {AboutComponent} from './about/about.component';
import {LoginComponent} from './login/login.component';
import {PageNotFoundComponent} from './page-not-found/page-not-found.component';
import {QuizComponent} from './quiz/quiz.component';
import {QuizEditComponent} from './quiz-edit/quiz-edit.component';
import {QuestionEditComponent} from './question-edit/question-edit.component';
import {AnswerEditComponent} from './answer-edit/answer-edit.component';
import {ResultEditComponent} from './result-edit/result-edit.component';

const routes: Routes = [
  {path: '', redirectTo: 'home', pathMatch: 'full'},
  {path: 'home', component: HomeComponent},
  {path: 'quiz/create', component: QuizEditComponent},
  {path: 'quiz/edit/:id', component: QuizEditComponent},
  {path: 'quiz/:id', component: QuizComponent},
  {path: 'question/create/:id', component: QuestionEditComponent},
  {path: 'question/edit/:id', component: QuestionEditComponent},
  {path: 'answer/create/:id', component: AnswerEditComponent},
  {path: 'answer/edit/:id', component: AnswerEditComponent},
  {path: 'result/create/:id', component: ResultEditComponent},
  {path: 'result/edit/:id', component: ResultEditComponent},
  {path: 'about', component: AboutComponent},
  {path: 'login', component: LoginComponent},
  {path: '**', component: PageNotFoundComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}

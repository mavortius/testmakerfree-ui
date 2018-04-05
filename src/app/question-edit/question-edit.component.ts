import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {HttpClient} from '@angular/common/http';

import {environment} from '../../environments/environment';

@Component({
  selector: 'app-question-edit',
  templateUrl: './question-edit.component.html',
  styleUrls: ['./question-edit.component.css']
})
export class QuestionEditComponent implements OnInit {
  title: string;
  question: Question;
  editMode: boolean;

  constructor(private activatedRoute: ActivatedRoute,
              private router: Router,
              private http: HttpClient) {
  }

  ngOnInit() {
    this.question = <Question>{};
    const id = +this.activatedRoute.snapshot.params['id'];
    this.editMode = (this.activatedRoute.snapshot.url[1].path === 'edit');

    if (this.editMode) {
      const url = `${environment.apiUrl}/api/question/${id}`;

      this.http.get<Question>(url).subscribe(res => {
        this.question = res;
        this.title = `Edit - ${this.question.text}`;
      }, error => console.error(error));
    } else {
      this.question.quizId = id;
      this.title = 'Create a new Question';
    }
  }

  onSubmit(question: Question) {
    const url = `${environment.apiUrl}/api/question`;

    if (this.editMode) {
      this.http.put<Question>(url, question).subscribe(() => {
        console.log(`Question ${question.id} has been updated.`);
        this.router.navigate(['quiz/edit', question.quizId]);
      }, error => console.error(error));
    } else {
      this.http.post<Question>(url, question).subscribe(res => {
        console.log(`Question ${res.id} has been created.`);
        this.router.navigate(['quiz/edit', res.quizId]);
      }, error => console.error(error));
    }
  }

  onBack() {
    this.router.navigate(['quiz/edit', this.question.quizId]);
  }
}

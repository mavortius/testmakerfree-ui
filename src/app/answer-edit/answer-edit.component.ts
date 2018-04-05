import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';

@Component({
  selector: 'app-answer-edit',
  templateUrl: './answer-edit.component.html',
  styleUrls: ['./answer-edit.component.css']
})
export class AnswerEditComponent implements OnInit {
  title: string;
  answer: Answer;
  editMode: boolean;

  constructor(private activatedRoute: ActivatedRoute,
              private router: Router,
              private http: HttpClient) {
  }

  ngOnInit() {
    this.answer = <Answer>{};
    const id = +this.activatedRoute.snapshot.params['id'];
    this.editMode = (this.activatedRoute.snapshot.url[1].path === 'edit');

    if (this.editMode) {
      const url = `${environment.apiUrl}/api/answer/${id}`;

      this.http.get<Answer>(url).subscribe(res => {
        this.answer = res;
        this.title = `Edit - ${this.answer.text}`;
      }, error => console.error(error));
    } else {
      this.answer.questionId = id;
      this.title = 'Create a new Answer';
    }
  }

  onSubmit(answer: Answer) {
    const url = `${environment.apiUrl}/api/answer`;

    if (this.editMode) {
      this.http.put<Answer>(url, answer).subscribe(() => {
        console.log(`Answer ${answer.id} has been updated.`);
        this.router.navigate(['question/edit', answer.questionId]);
      }, error => console.error(error));
    } else {
      this.http.post<Answer>(url, answer).subscribe(res => {
        console.log(`Answer ${res.id} has been created.`);
        this.router.navigate(['question/edit', res.questionId]);
      }, error => console.error(error));
    }
  }

  onBack() {
    this.router.navigate(['question/edit', this.answer.questionId]);
  }
}

import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {HttpClient} from '@angular/common/http';

import {environment} from '../../environments/environment';

@Component({
  selector: 'app-quiz-edit',
  templateUrl: './quiz-edit.component.html',
  styleUrls: ['./quiz-edit.component.css']
})
export class QuizEditComponent implements OnInit {
  title: string;
  quiz: Quiz;
  editMode: boolean;

  constructor(private activatedRoute: ActivatedRoute,
              private router: Router,
              private http: HttpClient) {
  }

  ngOnInit() {
    this.quiz = <Quiz>{};

    const id = +this.activatedRoute.snapshot.params['id'];

    if (id) {
      this.editMode = true;
      const url = `${environment.apiUrl}/api/quiz/${id}`;
      this.http.get<Quiz>(url).subscribe(res => {
        this.quiz = res;
        this.title = `Edit - ${this.quiz.title}`;
      }, error => console.error(error));
    } else {
      this.editMode = false;
      this.title = 'Create a new Quiz';
    }
  }

  onSubmit(quiz: Quiz) {
    const url = `${environment.apiUrl}/api/quiz`;

    if (this.editMode) {
      this.http.put<Quiz>(url, quiz).subscribe(() => {
        console.log(`Quiz ${quiz.id} has been updated.`);
        this.onBack();
      }, error => console.error(error));
    } else {
      this.http.post<Quiz>(url, quiz).subscribe(res => {
        console.log(`Quiz ${res.id} has been created.`);
        this.onBack();
      }, error => console.error(error));
    }
  }

  onBack() {
    this.router.navigate(['home']);
  }
}

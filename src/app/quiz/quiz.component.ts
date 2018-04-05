import {Component, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ActivatedRoute, Router} from '@angular/router';

import {environment} from '../../environments/environment';

@Component({
  selector: 'app-quiz',
  templateUrl: './quiz.component.html',
  styleUrls: ['./quiz.component.css']
})
export class QuizComponent implements OnInit {
  quiz: Quiz;

  constructor(private activatedRoute: ActivatedRoute,
              private router: Router,
              private http: HttpClient) {
  }

  ngOnInit() {
    this.quiz = <Quiz>{};
    const id = +this.activatedRoute.snapshot.params['id'];

    console.log(id);

    if (id) {
      const url = `${environment.apiUrl}/api/quiz/${id}`;
      this.http.get<Quiz>(url).subscribe(result => this.quiz = result, error => console.log(error));
    } else {
      console.log('Invalid id: routing back to home...');
      this.router.navigate(['home']);
    }
  }

  onEdit() {
    this.router.navigate(['quiz/edit', this.quiz.id]);
  }

  onDelete() {
    if (confirm('Do you really want to delete this quiz?')) {
      const url = `${environment.apiUrl}/api/quiz/${this.quiz.id}`;

      this.http.delete(url).subscribe(res => {
        console.log(`Quiz ID ${this.quiz.id} has been deleted.`);
        this.router.navigate(['home']);
      }, error => console.error(error));
    }
  }
}

import {Component, OnInit, Input} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Router} from '@angular/router';

import {environment} from '../../environments/environment';

@Component({
  selector: 'app-quiz-list',
  templateUrl: './quiz-list.component.html',
  styleUrls: ['./quiz-list.component.css']
})
export class QuizListComponent implements OnInit {
  @Input() class: string;
  title: string;
  selectedQuiz: Quiz;
  quizzes: Quiz[];

  constructor(private http: HttpClient, private router: Router) {
    this.title = 'Latest Quizzes';
  }

  ngOnInit(): void {
    let url = `${environment.apiUrl}/api/quiz/`;

    switch (this.class) {
      case 'latest':
      default:
        this.title = 'Latest Quizzes';
        url += 'Latest/';
        break;
      case 'byTitle':
        this.title = 'Quizzes by Title';
        url += 'ByTitle/';
        break;
      case 'random':
        this.title = 'Random Quizzes';
        url += 'Random/';
        break;
    }

    this.http.get<Quiz[]>(url).subscribe(result => {
      this.quizzes = result;
    }, error => console.error(error));
  }

  onSelect(quiz: Quiz) {
    this.selectedQuiz = quiz;
    console.log(`quiz with Id ${this.selectedQuiz.id} has been selected.`);
    this.router.navigate(['quiz', this.selectedQuiz.id]);
  }
}

import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Router} from '@angular/router';

import {environment} from '../../environments/environment';

@Component({
  selector: 'app-question-list',
  templateUrl: './question-list.component.html',
  styleUrls: ['./question-list.component.css']
})
export class QuestionListComponent implements OnInit, OnChanges {
  @Input() quiz: Quiz;
  questions: Question[];
  title: string;

  constructor(private http: HttpClient,
              private router: Router) {
  }

  ngOnInit() {
    this.questions = [];
  }

  ngOnChanges(changes: SimpleChanges) {
    console.log('QuestionListComponent OnChanges called');

    if (typeof changes['quiz'] !== 'undefined') {
      const change = changes['quiz'];

      if (!change.isFirstChange()) {
        this.loadData();
      }
    }
  }

  loadData() {
    const url = `${environment.apiUrl}/api/question/all/${this.quiz.id}`;
    console.log(`Calling ${url}`);
    this.http.get<Question[]>(url).subscribe(res => {
      this.questions = res;
    }, error => console.error(error));
  }

  onCreate() {
    this.router.navigate(['/question/create', this.quiz.id]);
  }

  onEdit(question: Question) {
    this.router.navigate(['/question/edit', question.id]);
  }

  onDelete(question: Question) {
    if (confirm('Do you really want to delete this question?')) {
      const url = `${environment.apiUrl}/api/question/${question.id}`;

      this.http.delete(url).subscribe(res => {
        console.log(`Question ${question.id} has been deleted.`);
        this.loadData();
      }, error => console.error(error));
    }
  }
}

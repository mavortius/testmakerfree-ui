import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Router} from '@angular/router';

import {environment} from '../../environments/environment';

@Component({
  selector: 'app-answer-list',
  templateUrl: './answer-list.component.html',
  styleUrls: ['./answer-list.component.css']
})
export class AnswerListComponent implements OnInit, OnChanges {
  @Input() question: Question;
  answers: Answer[];
  title: string;

  constructor(private http: HttpClient,
              private router: Router) {
  }

  ngOnInit() {
    this.answers = [];
  }

  ngOnChanges(changes: SimpleChanges) {
    if (typeof changes['question'] !== 'undefined') {
      const change = changes['question'];

      if (!change.isFirstChange()) {
        this.loadData();
      }
    }
  }

  loadData() {
    const url = `${environment.apiUrl}/api/answer/all/${this.question.id}`;

    this.http.get<Answer[]>(url).subscribe(res => {
      this.answers = res;
    }, error => console.error(error));
  }

  onCreate() {
    this.router.navigate(['/answer/create', this.question.id]);
  }

  onEdit(answer: Answer) {
    this.router.navigate(['/answer/edit', answer.id]);
  }

  onDelete(answer: Answer) {
    if (confirm('Do you really want to delete this answer?')) {
      const url = `${environment.apiUrl}/api/answer/${answer.id}`;

      this.http.delete(url).subscribe(res => {
        console.log(`Answer ${answer.id} has been deleted.`);
        this.loadData();
      }, error => console.error(error));
    }
  }
}

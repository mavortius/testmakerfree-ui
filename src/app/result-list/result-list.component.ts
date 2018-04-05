import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Router} from '@angular/router';

import {environment} from '../../environments/environment';

@Component({
  selector: 'app-result-list',
  templateUrl: './result-list.component.html',
  styleUrls: ['./result-list.component.css']
})
export class ResultListComponent implements OnInit, OnChanges {
  @Input() quiz: Quiz;
  results: Result[];
  title: string;

  constructor(private http: HttpClient,
              private router: Router) {
  }

  ngOnInit() {
    this.results = [];
  }

  ngOnChanges(changes: SimpleChanges) {
    if (typeof changes['quiz'] !== 'undefined') {
      const change = changes['quiz'];

      if (!change.isFirstChange()) {
        this.loadData();
      }
    }
  }

  loadData() {
    const url = `${environment.apiUrl}/api/result/all/${this.quiz.id}`;

    this.http.get<Result[]>(url).subscribe(res => {
      this.results = res;
    }, error => console.error(error));
  }

  onCreate() {
    this.router.navigate(['/result/create', this.quiz.id]);
  }

  onEdit(result: Result) {
    this.router.navigate(['/result/edit', result.id]);
  }

  onDelete(result: Result) {
    if (confirm('Do you really want to delete this result?')) {
      const url = `${environment.apiUrl}/api/result/${result.id}`;

      this.http.delete(url).subscribe(res => {
        console.log(`Result ${result.id} has been deleted.`);
        this.loadData();
      }, error => console.error(error));
    }
  }
}

import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {HttpClient} from '@angular/common/http';

import {environment} from '../../environments/environment';

@Component({
  selector: 'app-result-edit',
  templateUrl: './result-edit.component.html',
  styleUrls: ['./result-edit.component.css']
})
export class ResultEditComponent implements OnInit {
  title: string;
  result: Result;
  editMode: boolean;

  constructor(private activatedRoute: ActivatedRoute,
              private router: Router,
              private http: HttpClient) { }

  ngOnInit() {
    this.result = <Result>{};
    const id = +this.activatedRoute.snapshot.params['id'];
    this.editMode = (this.activatedRoute.snapshot.url[1].path === 'edit');

    if (this.editMode) {
      const url = `${environment.apiUrl}/api/result/${id}`;

      this.http.get<Result>(url).subscribe(res => {
        this.result = res;
        this.title = `Edit - ${this.result.text}`;
      }, error => console.error(error));
    } else {
      this.result.quizId = id;
      this.title = 'Create a new Result';
    }
  }

  onSubmit(result: Result) {
    const url = `${environment.apiUrl}/api/result`;

    if (this.editMode) {
      this.http.put<Result>(url, result).subscribe(() => {
        console.log(`Result ${result.id} has been updated.`);
        this.router.navigate(['quiz/edit', result.quizId]);
      }, error => console.error(error));
    } else {
      this.http.post<Result>(url, result).subscribe(res => {
        console.log(`Result ${res.id} has been created.`);
        this.router.navigate(['quiz/edit', res.quizId]);
      }, error => console.error(error));
    }
  }

  onBack() {
    this.router.navigate(['quiz/edit', this.result.quizId]);
  }
}

import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {HttpClient} from '@angular/common/http';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

import {environment} from '../../environments/environment';


@Component({
  selector: 'app-result-edit',
  templateUrl: './result-edit.component.html',
  styleUrls: ['./result-edit.component.css']
})
export class ResultEditComponent implements OnInit {
  title: string;
  result: Result;
  form: FormGroup;
  editMode: boolean;

  constructor(private activatedRoute: ActivatedRoute,
              private router: Router,
              private http: HttpClient,
              private fb: FormBuilder) {
  }

  ngOnInit() {
    this.result = <Result>{};

    this.createForm();

    const id = +this.activatedRoute.snapshot.params['id'];
    this.editMode = (this.activatedRoute.snapshot.url[1].path === 'edit');

    if (this.editMode) {
      const url = `${environment.apiUrl}/api/result/${id}`;

      this.http.get<Result>(url).subscribe(res => {
        this.result = res;
        this.title = `Edit - ${this.result.text}`;
        this.updateForm();
      }, error => console.error(error));
    } else {
      this.result.quizId = id;
      this.title = 'Create a new Result';
    }
  }

  onSubmit() {
    const tempResult = <Result>{};

    tempResult.quizId = this.result.quizId;
    tempResult.text = this.result.text;
    tempResult.minValue = this.result.minValue;
    tempResult.maxValue = this.result.maxValue;

    const url = `${environment.apiUrl}/api/result`;

    if (this.editMode) {
      tempResult.id = this.result.id;

      this.http.put<Result>(url, tempResult).subscribe(() => {
        console.log(`Result ${tempResult.id} has been updated.`);
        this.router.navigate(['quiz/edit', tempResult.quizId]);
      }, error => console.error(error));
    } else {
      this.http.post<Result>(url, tempResult).subscribe(res => {
        console.log(`Result ${res.id} has been created.`);
        this.router.navigate(['quiz/edit', res.quizId]);
      }, error => console.error(error));
    }
  }

  onBack() {
    this.router.navigate(['quiz/edit', this.result.quizId]);
  }

  createForm() {
    this.form = this.fb.group({
      text: ['', Validators.required],
      minValue: ['', Validators.pattern(/^\d*$/)],
      maxValue: ['', Validators.pattern(/^\d*$/)]
    });
  }

  updateForm() {
    this.form.setValue({
      text: this.result.text,
      minValue: this.result.minValue || '',
      maxValue: this.result.maxValue || ''
    });
  }

  getFormControl(name: string) {
    return this.form.get(name);
  }

  isValid(name: string) {
    const e = this.getFormControl(name);
    return e && e.valid;
  }

  isChanged(name: string) {
    const e = this.getFormControl(name);
    return e && (e.dirty || e.touched);
  }

  hasError(name: string) {
    const e = this.getFormControl(name);
    return e && (e.dirty || e.touched) && !e.valid;
  }
}

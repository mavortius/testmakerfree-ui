import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
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
  form: FormGroup;
  editMode: boolean;

  constructor(private activatedRoute: ActivatedRoute,
              private router: Router,
              private http: HttpClient,
              private fb: FormBuilder) {
  }

  ngOnInit() {
    this.answer = <Answer>{};

    this.createForm();

    const id = +this.activatedRoute.snapshot.params['id'];
    this.editMode = (this.activatedRoute.snapshot.url[1].path === 'edit');

    if (this.editMode) {
      const url = `${environment.apiUrl}/api/answer/${id}`;

      this.http.get<Answer>(url).subscribe(res => {
        this.answer = res;
        this.title = `Edit - ${this.answer.text}`;
        this.updateForm();
      }, error => console.error(error));
    } else {
      this.answer.questionId = id;
      this.title = 'Create a new Answer';
    }
  }

  onSubmit() {
    const tempAnswer = <Answer>{};

    tempAnswer.questionId = this.answer.questionId;
    tempAnswer.text = this.form.value.text;
    tempAnswer.value = this.form.value.value;

    const url = `${environment.apiUrl}/api/answer`;

    if (this.editMode) {
      tempAnswer.id = this.answer.id;

      this.http.put<Answer>(url, tempAnswer).subscribe(() => {
        console.log(`Answer ${tempAnswer.id} has been updated.`);
        this.router.navigate(['question/edit', tempAnswer.questionId]);
      }, error => console.error(error));
    } else {
      this.http.post<Answer>(url, tempAnswer).subscribe(res => {
        console.log(`Answer ${res.id} has been created.`);
        this.router.navigate(['question/edit', res.questionId]);
      }, error => console.error(error));
    }
  }

  onBack() {
    this.router.navigate(['question/edit', this.answer.questionId]);
  }

  createForm() {
    this.form = this.fb.group({
      text: ['', Validators.required],
      value: ['', [Validators.required, Validators.min(-5), Validators.max(5)]]
    });
  }

  updateForm() {
    this.form.setValue({
      text: this.answer.text,
      value: this.answer.value
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

import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {HttpClient} from '@angular/common/http';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

import {environment} from '../../environments/environment';

@Component({
  selector: 'app-question-edit',
  templateUrl: './question-edit.component.html',
  styleUrls: ['./question-edit.component.css']
})
export class QuestionEditComponent implements OnInit {
  title: string;
  question: Question;
  form: FormGroup;
  editMode: boolean;

  constructor(private activatedRoute: ActivatedRoute,
              private router: Router,
              private http: HttpClient,
              private fb: FormBuilder) {
  }

  ngOnInit() {
    this.question = <Question>{};

    this.createForm();

    const id = +this.activatedRoute.snapshot.params['id'];
    this.editMode = (this.activatedRoute.snapshot.url[1].path === 'edit');

    if (this.editMode) {
      const url = `${environment.apiUrl}/api/question/${id}`;

      this.http.get<Question>(url).subscribe(res => {
        this.question = res;
        this.title = `Edit - ${this.question.text}`;
        this.updateForm();
      }, error => console.error(error));
    } else {
      this.question.quizId = id;
      this.title = 'Create a new Question';
    }
  }

  onSubmit() {
    const tempQuestion = <Question>{};

    tempQuestion.quizId = this.question.quizId;
    tempQuestion.text = this.form.value.text;

    const url = `${environment.apiUrl}/api/question`;

    if (this.editMode) {
      tempQuestion.id = this.question.id;

      this.http.put<Question>(url, tempQuestion).subscribe(() => {
        console.log(`Question ${tempQuestion.id} has been updated.`);
        this.router.navigate(['quiz/edit', tempQuestion.quizId]);
      }, error => console.error(error));
    } else {
      this.http.post<Question>(url, tempQuestion).subscribe(res => {
        console.log(`Question ${res.id} has been created.`);
        this.router.navigate(['quiz/edit', res.quizId]);
      }, error => console.error(error));
    }
  }

  onBack() {
    this.router.navigate(['quiz/edit', this.question.quizId]);
  }

  createForm() {
    this.form = this.fb.group({
      text: ['', Validators.required]
    });
  }

  updateForm() {
    this.form.setValue({
      text: this.question.text || ''
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

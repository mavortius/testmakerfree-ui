import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {HttpClient} from '@angular/common/http';
import {FormGroup, FormBuilder, Validators} from '@angular/forms';

import {environment} from '../../environments/environment';

@Component({
  selector: 'app-quiz-edit',
  templateUrl: './quiz-edit.component.html',
  styleUrls: ['./quiz-edit.component.css']
})
export class QuizEditComponent implements OnInit {
  title: string;
  quiz: Quiz;
  form: FormGroup;
  editMode: boolean;

  constructor(private activatedRoute: ActivatedRoute,
              private router: Router,
              private http: HttpClient,
              private fb: FormBuilder) {
  }

  ngOnInit() {
    this.quiz = <Quiz>{};

    this.createForm();

    const id = +this.activatedRoute.snapshot.params['id'];

    if (id) {
      this.editMode = true;
      const url = `${environment.apiUrl}/api/quiz/${id}`;
      this.http.get<Quiz>(url).subscribe(res => {
        this.quiz = res;
        this.title = `Edit - ${this.quiz.title}`;
        this.updateForm();
      }, error => console.error(error));
    } else {
      this.editMode = false;
      this.title = 'Create a new Quiz';
    }
  }

  onSubmit() {
    const tempQuiz = <Quiz>{};

    tempQuiz.title = this.form.value.title;
    tempQuiz.description = this.form.value.description;
    tempQuiz.text = this.form.value.text;

    const url = `${environment.apiUrl}/api/quiz`;

    if (this.editMode) {
      tempQuiz.id = this.quiz.id;

      this.http.put<Quiz>(url, tempQuiz).subscribe(() => {
        console.log(`Quiz ${tempQuiz.id} has been updated.`);
        this.onBack();
      }, error => console.error(error));
    } else {
      this.http.post<Quiz>(url, tempQuiz).subscribe(res => {
        console.log(`Quiz ${res.id} has been created.`);
        this.onBack();
      }, error => console.error(error));
    }
  }

  onBack() {
    this.router.navigate(['home']);
  }

  createForm() {
    this.form = this.fb.group({
      title: ['', Validators.required],
      description: '',
      text: ''
    });
  }

  updateForm() {
    this.form.setValue({
      title: this.quiz.title,
      description: this.quiz.description || '',
      text: this.quiz.text || ''
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

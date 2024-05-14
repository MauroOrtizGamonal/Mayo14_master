import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { User } from './User';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule, DatePipe } from '@angular/common';
import { Observable, switchMap } from 'rxjs';
import { of } from 'rxjs';
 
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ReactiveFormsModule, CommonModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [DatePipe],
})
export class AppComponent implements OnInit {
  title(title: any) {
    throw new Error('Method not implemented.');
  }
  users: User[] = [];
  userForm!: FormGroup;
  editMode = false; // Flag to track edit mode
 
  constructor(private formBuilder: FormBuilder) {}
 
  ngOnInit() {
    this.userForm = this.formBuilder.group({
      name: ['', Validators.required],
      birthdate: ['', Validators.required],
      gender: ['', Validators.required],
      country: ['', Validators.required],
      language: ['', Validators.required],
    });
  }
 
  addUser() {
    if (this.userForm.valid) {
      const newUser: User = {
        name: this.userForm.value.name,
        birthdate: this.userForm.value.birthdate,
        gender: this.userForm.value.gender,
        country: this.userForm.value.country,
        language: this.userForm.value.language,
      };
      if (this.editMode) {
        // If edit mode is true, update existing user
        const editedIndex = this.users.findIndex(user => user.name === newUser.name); // Assuming name is unique identifier
        if (editedIndex !== -1) {
          this.users[editedIndex] = newUser;
        }
        this.editMode = false; // Reset edit mode after updating
      } else {
        // If not in edit mode, add new user
        this.users.push(newUser);
      }
      this.userForm.reset();
    }
  }
 
  editUser(index: number) {
    this.editMode = true; // Set edit mode to true
    const userToEdit = this.users[index];
    // Find the index of the user to edit based on all fields comparison
    const editIndex = this.users.findIndex(user =>
      user.name === userToEdit.name &&
      user.birthdate === userToEdit.birthdate &&
      user.gender === userToEdit.gender &&
      user.country === userToEdit.country &&
      user.language === userToEdit.language
    );
    if (editIndex !== -1) {
      this.userForm.patchValue(userToEdit); // Use patchValue to update only specified fields
    }
  }
 
 
  deleteUser(index: number) {
    const observable = new Observable<number>(observer => {
      observer.next(index); // Emit the index of the user to delete
      observer.complete(); // Complete the observable
    });
    observable.pipe(
      switchMap(deletedIndex => {
        const userToDelete = this.users[deletedIndex];
        this.users.splice(deletedIndex, 1);
        return of(deletedIndex); // Emit the index of the deleted user
      })
    ).subscribe(
      deletedIndex => {
        console.log(`User deleted: ${deletedIndex}`);
      },
      error => {
        console.error('Error deleting user:', error);
      }
    );
  }
}
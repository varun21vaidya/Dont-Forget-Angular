import { Injectable } from '@angular/core';
import { Note } from './note.module';
@Injectable({
  providedIn: 'root',
})
export class NotesService {
  notes: Note[] = localStorage.getItem('datakey')
    ? JSON.parse(localStorage.getItem('datakey') || 'new Array<Note>()')
    : new Array<Note>();

  constructor() {}
  get(id: number) {
    return this.notes[id];
  }

  getId(note: Note) {
    return this.notes.indexOf(note);
  }

  getAll() {
    return this.notes;
  }

  add(note: Note) {
    // this method will add a new note to the array
    // where id is the index of the note in the array
    let newLength = this.notes.push(note);
    localStorage.setItem('datakey', JSON.stringify(this.notes));
    let index = newLength - 1;
    return index;
  }

  update(id: number, title: string, body: string) {
    let note = this.notes[id];
    note.title = title;
    note.body = body;
    localStorage.setItem('datakey', JSON.stringify(this.notes));
  }

  delete(id: number) {
    this.notes.splice(id, 1);
    localStorage.setItem('datakey', JSON.stringify(this.notes));
  }
}

import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Note } from '../shared/note.module';
import { NotesService } from '../shared/notes.service';

@Component({
  selector: 'app-note-card',
  templateUrl: './note-card.component.html',
  styleUrls: ['./note-card.component.css']
})
export class NoteCardComponent implements OnInit {
  @Input() title !: string;
  @Input() body !: string;
  @Input() link!: any;

  // so to delete the note, we have to create an event emmiter
  // and then we have to listen to that event emmiter in the parent component
  // and then we have to delete the note from the parent component
  // for that we have to output this delete event
  // 'delete' is the name of the event, which we will call in notes-list html
  // as it will be with index, and we will call the method from its component to delete the note
  @Output('delete') deleteEvent:EventEmitter<void> = new EventEmitter<void>();

  constructor() { }

  ngOnInit(): void {
  }

  // when x is clicked, this will emit the Output event to the parent component
  clickToDelete(){
    this.deleteEvent.emit();
  }
}

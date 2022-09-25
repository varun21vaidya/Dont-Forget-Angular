import { NgForm } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { Note } from 'src/app/shared/note.module';
import { NotesService } from 'src/app/shared/notes.service';
import { ActivatedRoute, Router, Params } from '@angular/router';

@Component({
  selector: 'app-notes-details',
  templateUrl: './notes-details.component.html',
  styleUrls: ['./notes-details.component.css']
})
export class NotesDetailsComponent implements OnInit {
  note!: Note;
  noteId!:number;
  new!:boolean;
  constructor(private notesService: NotesService, private router:Router, private route:ActivatedRoute) { }

  ngOnInit(): void {

  this.note= new Note();

    // we want to check if this is a new note or an existing note
    this.route.params.subscribe((params: Params)=> {
      if (params['id']){
        this.note=this.notesService.get(params['id']);
        this.noteId=params['id'];
        this.new=false;
      }
      else{
        this.new=true;
      }
    })
  }
  OnSubmit(form: NgForm){
    // console.log(form);
    if (this.new){
      // we will save the note
      this.notesService.add(form.value);

      
    }
    else{
      // we will update the note
      this.notesService.update(this.noteId,form.value.title,form.value.body);
    }
    this.router.navigateByUrl('/');
  }

  cancel(){
    this.router.navigateByUrl('/');
  }
}

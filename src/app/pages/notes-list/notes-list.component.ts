import {
  transition,
  trigger,
  style,
  animate,
  query,
  stagger,
} from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { Note } from 'src/app/shared/note.module';
import { NotesService } from 'src/app/shared/notes.service';
import { ViewChild, ElementRef } from '@angular/core';
@Component({
  selector: 'app-notes-list',
  templateUrl: './notes-list.component.html',
  styleUrls: ['./notes-list.component.css'],
  animations: [
    trigger('itemAnim', [
      //this will store animation metadata
      //this animations are used when we create or delete note cards
      //and will be applied on homepage

      // Entry Animation

      // this is used for when item is animated in
      // we use a state change expression, ie transition will go from
      // void (nothing existing in DOM) to * (anything)
      transition('void => *', [
        // more animation metadata
        style({
          // object to store style definations
          height: 0,
          opacity: 0,
          transform: 'scale(0.85)',
          'margin-bottom': '0',

          // we have to expand out the padding properties to support all browsers
          paddingTop: 0,
          paddingBottom: 0,
          paddingRight: 0,
          paddingLeft: 0,
        }),
        //we first want to animate the spacing (includes height and margin)
        animate(
          '50ms',
          style({
            height: '*',
            'margin-bottom': '*',
            paddingTop: '*',
            paddingBottom: '*',
            paddingRight: '*',
            paddingLeft: '*',
          })
        ),
        animate(68),
      ]),

      // DELETE ANIMATION
      transition('* => void', [
        // first scale up
        animate(
          '100ms',
          style({
            transform: 'scale(1.05)',
          })
        ),
        // then scale down while beginning to fade out
        animate(
          100,
          style({
            transform: 'scale(1)',
            opacity: 0.75,
          })
        ),
        // scale down and complete fade out
        animate(
          '120ms ease-out',
          style({
            opacity: 0,
            transform: 'scale(0.68)',
          })
        ),
        // then animate spacing (height, margin, and padding)
        animate(
          '150ms ease-out',
          style({
            height: 0,
            'margin-bottom': '0',
            paddingTop: 0,
            paddingBottom: 0,
            paddingRight: 0,
            paddingLeft: 0,
          })
        ),
      ]),
    ]),

    // when we create new card all cards animate which shouldnt happen
    // so we are going to stagger the animation
    trigger('listAnime', [
      transition('* => *', [
        // this is like psudo selector for entering elements
        query(
          ':enter',
          [
            style({
              opacity: 0,
              height: 0,
            }),
            stagger(100, [animate('0.2s ease')]),
          ],
          {
            optional: true,
          }
        ),
      ]),
    ]),
  ],
})
export class NotesListComponent implements OnInit {
  notes: Note[] = new Array<Note>();
  filteredNotes: Note[] = new Array<Note>();
  @ViewChild('filterInput') filterInputElRef!: ElementRef<HTMLInputElement>;

  constructor(private notesService: NotesService) {}

  ngOnInit() {
    // first recieve all notes from the service
    this.notes=this.notesService.getAll()
    this.filteredNotes=this.notesService.getAll()

  }

  // takes emited event from note-card component
  deleteNote(note: Note) {
    let NoteId = this.notesService.getId(note);
    this.notesService.delete(NoteId);
    this.filter(this.filterInputElRef.nativeElement.value)
  }

  filter(query: string) {
    query = query.toLowerCase().trim();

    let allResults: Note[] = new Array<Note>();

    // split up the serach query in indiviusal words
    let terms: string[] = query.split(' ');

    // remove duplicate serach terms
    terms = this.removeDuplicates(terms);

    // compile all relevant results into the allResults Array
    // ie first loop thorugh every term and pass each term
    // in the relevantNotes funcition which will return a notes
    // containing those terms and we will add all those notes in
    // allResults array and return the reult

    terms.forEach((term) => {
      let results = this.relevantNotes(term);
      allResults.push(...results);
    });

    // but allResults can contain duplicates
    // as a term can be part of many notes,
    // we dont want to show duplicates on UI
    let uniqueResults = this.removeDuplicates(allResults);

    // we do this because we want to show only results
    // if there filter it will show unitque results
    // if there is no fileter we have defined filteredNotes = notes
    this.filteredNotes = uniqueResults;

    // sort by relevancy
    this.sortByRelevancy(allResults);
  }

  removeDuplicates(arr: Array<any>): Array<any> {
    let uniqueResults: Set<any> = new Set<any>();

    // loop through the input array and add items to set
    arr.forEach((e) => uniqueResults.add(e));

    return Array.from(uniqueResults);
  }

  // so first lowercase the query
  // and filter the notes to check if title or body contains the query results
  // so if the note is relevant it will be true and added to filtered array
  // ie we are telling filter function that element passed into callback should be
  // included in the filtered array

  relevantNotes(query: string): Array<Note> {
    query = query.toLowerCase().trim();
    let relevantNotes = this.notes.filter((note) => {
      if (note.title && note.title.toLowerCase().includes(query)) {
        return true;
      } else if (note.body && note.body.toLowerCase().includes(query)) {
        return true;
      }
      return false;
    });

    return relevantNotes;
  }

  sortByRelevancy(searchResults: Note[]) {
    //This method will calculate the relevancy of a note based on number
    // of a note based on the number of times it appears in search results
    // or we can also say it fetches the full query first

    let noteCountObject: { [key: number]: any } = {}; //format: NoteId: count

    searchResults.forEach((note) => {
      let NoteId = this.notesService.getId(note);

      if (noteCountObject[NoteId]) {
        noteCountObject[NoteId] += 1;
      } else {
        noteCountObject[NoteId] = 1;
      }
    });
    this.filteredNotes = this.filteredNotes.sort((a: Note, b: Note) => {
      let aId = this.notesService.getId(a);
      let bId = this.notesService.getId(b);

      let aCount = noteCountObject[aId];
      let bCount = noteCountObject[bId];

      return bCount - aCount; //sorts in descending order ie max first
    });
  }
  generateNoteURL(note: Note) {
    let noteId = this.notesService.getId(note);
    return noteId;
  }
}

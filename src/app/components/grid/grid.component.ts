import {Component, OnDestroy, OnInit} from '@angular/core';
import {EventEntry} from '../../models/event-entry';
import {EventEntryMangerService} from '../../services/event-entry-manager/event-entry-manger.service';
import {FormControl} from '@angular/forms';
import {forkJoin, Observable, Subject} from 'rxjs';
import {untilDestroyed} from 'ngx-take-until-destroy';
import {StorageService} from '../../services/storage/storage.service';
import {SelectionModel} from '@angular/cdk/collections';
import {ResponseOne} from '../../models/response-one';
import {tap} from 'rxjs/operators';

@Component({
  selector: 'app-grid',
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.scss']
})
export class GridComponent implements OnInit, OnDestroy {
  public displayedColumns: string[];
  public dataSource: Subject<EventEntry[]> = new Subject<EventEntry[]>();
  public selection = new SelectionModel<EventEntry>(true, []);

  controls: {[index: string]: FormControl} = {};

  constructor(
    private eventEntryManager: EventEntryMangerService,
    private appStorage: StorageService,
  ) { }

  ngOnInit(): void {
    const columns = Object.keys(new EventEntry()).sort((a, b) => {
      if (a < b) { return -1; }
      if (a > b) { return 1; }
      return 0;
    }).filter((field: string) => field !== 'eventId');
    this.displayedColumns = ['eventId'].concat(columns);

    this.eventEntryManager.list().pipe(
      untilDestroyed(this)
    ).subscribe(
      (list: EventEntry[]) => this.dataSource.next(list),
    );
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = Object.keys(this.appStorage.all).length;
    return numSelected >= numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      Object.values(this.appStorage.all).forEach((row: EventEntry) => this.selection.select(row));
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: EventEntry): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.eventId + 1}`;
  }

  updateField(entityId, field) {
    const control = this.getControl(entityId, field);
    console.log('updateField', {index: entityId, field, value: control.value});
    const eventEntry = this.eventEntryManager.one(entityId);
    console.assert(eventEntry !== null, `Entity not found for ${entityId} ${field}`);

    if (eventEntry) {
      eventEntry[field] = control.value;
      this.dataSource.next(Object.values(this.appStorage.all));
    }
  }

  getControl(index, fieldName, defaultValue = null): FormControl {
    const controlKey = `${index}${fieldName}`;
    if (Object.keys(this.controls).indexOf(controlKey) === -1) {
      const control = new FormControl();
      control.setValue(defaultValue);
      this.controls[controlKey] = control;
      console.log('Created new control for', {index, fieldName, defaultValue});

      return control;
    } else {
      return this.controls[controlKey];
    }
  }

  ngOnDestroy(): void {
  }

  delete() {
    console.log('Deleting selected', this.selection.selected);
    const subscriptions: Observable<ResponseOne>[] = [];
    for (const entity of this.selection.selected) {
      subscriptions.push(this.eventEntryManager.delete(entity));
    }
    forkJoin(subscriptions)
      .pipe(
        untilDestroyed(this),
        tap(() => this.dataSource.next(Object.values(this.appStorage.all))),
        tap(() => this.selection.clear()),
      )
      .subscribe();
  }

  add() {
    console.log('Adding');
    const entity = new EventEntry();
    this.eventEntryManager.add(entity)
      .pipe(
        tap(() => this.dataSource.next(Object.values(this.appStorage.all))),
        untilDestroyed(this),
      )
      .subscribe();
  }
}

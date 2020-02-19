import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ResponseList} from '../../models/response-list';
import {Observable} from 'rxjs';
import {map, tap} from 'rxjs/operators';
import {StorageService} from '../storage/storage.service';
import {EventEntry} from '../../models/event-entry';
import {ResponseOne} from '../../models/response-one';

@Injectable({
  providedIn: 'root'
})
export class EventEntryMangerService {

  constructor(
    private http: HttpClient,
    private appStorage: StorageService,
  ) { }

  list(): Observable<EventEntry[]> {
    return this.http
      .get<ResponseList>('http://localhost:3000/statistic')
      .pipe(
        tap((responseList: ResponseList) => console.log('Loaded ResponseList:', responseList)),
        tap((responseList: ResponseList) => this.appStorage.setEventEntityList(responseList.result)),
        map((responseList: ResponseList) => responseList.result.sort((a, b) => {
          if (a.eventId < b.eventId) { return -1; }
          if (a.eventId > b.eventId) { return 1; }
          return 0;
        })),
      );
  }

  one(id: string): EventEntry | null {
    return this.appStorage.get(id);
  }

  add(entry: EventEntry): Observable<ResponseOne> {
    return this.http
      .post<ResponseOne>(
        `http://localhost:3000/statistic/${entry.eventId}`,
        entry
      )
      .pipe(
        tap((responseOne: ResponseOne) => console.log('Loaded ResponseOne ADD:', responseOne)),
        tap((responseOne: ResponseOne) => this.appStorage.set(responseOne.entry.eventId, responseOne.entry)),
      );
  }

  update(entry: EventEntry): Observable<ResponseOne> {
    return this.http
      .put<ResponseOne>(
        `http://localhost:3000/statistic/${entry.eventId}`,
        entry
      )
      .pipe(
        tap((responseOne: ResponseOne) => console.log('Loaded ResponseOne UPDATE:', responseOne)),
        tap((responseOne: ResponseOne) => this.appStorage.set(responseOne.entry.eventId, responseOne.entry)),
      );
  }

  delete(entry: EventEntry): Observable<ResponseOne> {
    return this.http
      .delete<ResponseOne>(
        `http://localhost:3000/statistic/${entry.eventId}`
      )
      .pipe(
        tap((responseOne: ResponseOne) => console.log('Loaded ResponseOne DELETE:', responseOne)),
        tap(() => this.appStorage.unset(entry.eventId)),
      );
  }

}

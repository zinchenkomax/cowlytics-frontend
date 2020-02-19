import {EventEntry} from './event-entry';

export class ResponseList {
  offset: number;
  limit: number;
  total: number;
  result: EventEntry[];
}

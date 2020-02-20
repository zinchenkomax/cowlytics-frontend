import {Injectable} from '@angular/core';
import { HttpRequest, HttpResponse, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { delay, mergeMap, materialize, dematerialize } from 'rxjs/operators';

@Injectable()
export class FakeBackendInterceptor implements HttpInterceptor {
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const { url, method } = request;

        return of(null)
            .pipe(mergeMap(handleRoute))
            .pipe(materialize())
            .pipe(delay(300))
            .pipe(dematerialize());

        function handleRoute() {
            switch (true) {
                case url.endsWith('/statistic') && method === 'GET':
                    return all();
                case url.endsWith('/statistic') && method === 'POST':
                    return add();
                case url.match(/\/statistic\/\d+$/) && method === 'PUT':
                    return update();
                case url.match(/\/statistic\/\d+$/) && method === 'DELETE':
                    return remove();
                default:
                    return next.handle(request);
            }
        }

        // route functions
        function all() {
            const dupReq = request.clone({ url: './assets/stub-data.json' });
            return next.handle(dupReq);
        }
        function add() {
            console.log('Interceptor add');
            return ok({
                entry: {eventId: Math.floor(Math.random() * (9999 - 1000)) + 1000},
                status: 'added'
            });
        }
        function update() {
            console.log('Interceptor update');
            return ok({
                entry: request.body,
                status: 'updated'
            });
        }
        function remove() {
            console.log('Interceptor delete');
            return ok({
                entry: request.body,
                status: 'deleted'
            });
        }

        // helper functions
        function ok(requestBody?) {
            return of(new HttpResponse({ status: 200, body: requestBody }));
        }
    }
}

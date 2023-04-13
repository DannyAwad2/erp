import { CacheService } from '../services/cache.service';
import {
  HttpEvent,
  HttpEventType,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, tap } from 'rxjs';

@Injectable()
export class CacheInterceptor implements HttpInterceptor {
  constructor(private cacheService: CacheService) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    if (req.method === 'GET') {
      const cache = this.cacheService.get(req.url);
      if (cache) {
        return of(cache);
      }
    }

    return next.handle(req).pipe(
      tap((r) => {
        if (r.type === HttpEventType.Response) {
          this.cacheService.set(r.url || '', r);
        }
      })
    );
  }
}

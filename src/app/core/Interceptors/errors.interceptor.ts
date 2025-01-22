import {
  HttpErrorResponse,
  HttpEvent,
  HttpEventType,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpResponse,
} from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { MessagesService } from '../services/messages.service';

export class ErrorIntercepter implements HttpInterceptor {
  messages = inject(MessagesService);

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      tap((event) => {
        if (event.type === HttpEventType.Response) {
          if (event.url?.includes('products')) {
            switch (req.method) {
              case 'GET':
                break;
              case 'POST':
                this.messages.toast('تم أضافة المنتج بنجاح', 'success');
                break;
              case 'PUT':
                this.messages.toast('تم تحديث تفاصيل المنتج بنجاح', 'success');
                break;
              case 'DELETE':
                this.messages.toast('تم اذالة المنتج بنجاح', 'success');
                break;
              default:
                console.log('unknowen reqeste method: ', req.method);
                break;
            }
          } else if (req.url?.includes('categories')) {
            switch (req.method) {
              case 'GET':
                break;
              case 'POST':
                this.messages.toast('تم إضافة التصنيف بنجاح', 'success');
                break;
              case 'PUT':
                this.messages.toast('تم تغير اسم التصنيف بنجاح', 'success');
                break;
              case 'DELETE':
                this.messages.toast('تم مسح التصنيف بنجاح', 'success');
                break;
              default:
                console.log('unknowen reqeste method: ', req.method);
                break;
            }
          }
        }
      }),
      catchError((error) => {
        if (error instanceof HttpErrorResponse) {
          if (error instanceof ErrorEvent) {
            console.error(error);
          } else {
            if (error.url?.includes('products')) {
              switch (req.method) {
                case 'GET':
                  this.messages.popup(
                    'مشكلة في الشبكة',
                    'غير قادر علي تحميل قائمة المنتجات',
                    'error'
                  );
                  break;
                case 'POST':
                  this.messages.popup(
                    'مشكلة في الشبكة',
                    'غير قادر علي انشاء المنتج جديد',
                    'error'
                  );
                  break;
                case 'PUT':
                  this.messages.popup(
                    'مشكلة في الشبكة',
                    'غير قادر علي تعديل تفاصيل المنتج',
                    'error'
                  );
                  break;
                case 'DELETE':
                  this.messages.popup(
                    'مشكلة في الشبكة',
                    'غير قادر علي مسح المنتج',
                    'error'
                  );
                  break;
                default:
                  console.log('unknowen reqeste method: ', req.method);
                  break;
              }
            } else if (error.url?.includes('categories')) {
              switch (req.method) {
                case 'GET':
                  this.messages.popup(
                    'مشكلة في الشبكة',
                    'غير قادر علي تحميل قائمة التصنيفات',
                    'error'
                  );
                  break;
                case 'POST':
                  this.messages.popup(
                    'مشكلة في الشبكة',
                    'غير قادر علي انشاء تصنيف جديد',
                    'error'
                  );
                  break;
                case 'PUT':
                  this.messages.popup(
                    'مشكلة في الشبكة',
                    'غير قادر علي تعديل تفاصيل التصنيف',
                    'error'
                  );
                  break;
                case 'DELETE':
                  this.messages.popup(
                    'مشكلة في الشبكة',
                    'غير قادر علي مسح التصنيف',
                    'error'
                  );
                  break;
                default:
                  console.log('unknowen reqeste method: ', req.method);
                  break;
              }
            }
          }
        }
        return throwError(() => new Error());
      })
    );
  }
}

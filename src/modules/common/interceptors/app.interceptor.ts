import {
  BadRequestException,
  CallHandler,
  ExecutionContext,
  HttpException,
  Inject,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Request } from 'express';
import { Observable, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
// import { ProviderError } from '../../common/errors/provider.errors';

function dataIsPaginated(data: any): boolean {
  return !!data.data;
}

@Injectable()
export class AppInterceptor implements NestInterceptor {
  constructor(@Inject(WINSTON_MODULE_PROVIDER) private readonly logger: any) {}
  intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> {
    const req: Request = context.switchToHttp().getRequest();
    const { ip, method, originalUrl, body } = req;
    const className = context.getClass().name;
    const handler = context.getHandler().name;
    const statusCode = context.switchToHttp().getResponse().statusCode;
    // this.logger.info(`Requesting🟢🟢🟢`, {
    //   method,
    //   url: originalUrl,
    //   className,
    //   handler,
    //   body: JSON.stringify(body),
    // });
    // @ts-ignore
    const startTimestamp = Date.now();
    return next.handle().pipe(
      map((_data) => {
        const data = _data || {};
        // Todo - type response
        let response: any = {
          data,
          status: statusCode >= 200 && statusCode <= 299 ? 'success' : 'failure',
          message: statusCode >= 200 && statusCode <= 299 ? 'success' : 'failure',
          code: context.switchToHttp().getResponse().statusCode,
        };

        if (dataIsPaginated(data) && data.pageInfo) {
          response.data = data.data;
          response.pageInfo = {
            total: data.pageInfo.total,
            page: data.pageInfo?.page || data.page,
            limit: data.pageInfo.limit || data.limit,
            totalPages: data.pageInfo.totalPages || data.totalCount,
          };
        }

        return response;
      }),
      tap(() => {
        const endTimestamp = Date.now();
        this.logger.info(`Request processed`, {
          method,
          url: originalUrl,
          className,
          handler,
          time: `${endTimestamp - startTimestamp}ms`,
        });
      }),
      catchError((exception) => {
        console.log(exception);
        const statusCode = exception?.status || 400;
        const defaultErrorMessage = 'Something went wrong';
        let message = exception?.message || exception?.detail || defaultErrorMessage;

        if (exception?.response?.message) {
          message = exception.response.message;
        }

        const errorResponse = new HttpException(
          {
            status: statusCode,
            // data: message,
            message,
            timestamp: new Date().toISOString(),
            route: req.path,
            method: req.method,
          },
          exception?.status,
        );
        this.logger.error(`Error 🚨⚠️ 🚨 `, {
          status: statusCode,
          message: message,
          route: req.path,
        });
        return throwError(errorResponse);
      }),
    );
  }
}

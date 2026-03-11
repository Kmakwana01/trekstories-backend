import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import * as qs from 'qs';

@Injectable()
export class FormDataParserInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const contentType = request.headers['content-type'] || '';

    if (
      contentType.includes('multipart/form-data') &&
      request.body &&
      Object.keys(request.body).length > 0
    ) {
      const rawBody = request.body as Record<string, unknown>;

      // Check whether any keys use bracket-notation (e.g. departureOptions[0][type])
      const hasBracketKeys = Object.keys(rawBody).some((k) => k.includes('['));

      if (hasBracketKeys) {
        /**
         * THE BUG that was here before:
         *   qs.stringify(rawBody) → encodes '[' as '%5B' and ']' as '%5D' in KEY names
         *   qs then treats '%5B0%5D' as a literal string, not bracket notation
         *   Result: nested objects never reconstructed → validation fails on every numeric/enum field
         *
         * THE FIX:
         *   Build the query string manually, keeping the bracket chars in keys as-is
         *   but still URL-encoding the VALUES so special characters in values are safe.
         *   qs.parse then correctly interprets bracket notation and rebuilds the nested object.
         */
        const queryParts: string[] = [];

        for (const [key, val] of Object.entries(rawBody)) {
          // multer can give a single value or an array (multi-value field)
          const values: unknown[] = Array.isArray(val) ? val : [val];
          for (const v of values) {
            // Key: keep as-is (brackets must remain literal for qs.parse)
            // Value: encode so '&', '=' etc. inside values don't break parsing
            queryParts.push(`${key}=${encodeURIComponent(String(v))}`);
          }
        }

        request.body = qs.parse(queryParts.join('&'), {
          depth: 10,
          allowPrototypes: false,
          parseArrays: true,
        });
      }
      // If no bracket keys the body is already a flat scalar map – nothing to do.
    }

    return next.handle();
  }
}

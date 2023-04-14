import { HttpErrorResponse } from "@angular/common/http";
import { CodeEnum, Error } from "@client/models";
import { catchError } from "rxjs";
import { SafeParseReturnType, z } from "zod";



export const ErrorSchema = z.object({
  code: z.nativeEnum(CodeEnum),
  message: z.string()
})

/**
 * Catch HttpErrorResponse and execute an action. 
 * @param action the action to execute
 * @returns rxjs OperatorFunction (e.g. for usage in Observable.map())
 */
export function catchApiError(action: (err: Error) => void) {
  return catchError((error: HttpErrorResponse) => {
    let validated: SafeParseReturnType<any, Error> = ErrorSchema.safeParse(error.error);
    if(validated.success) {
      action(validated.data);
      return [];
    }
    throw error;
  });
}

/**
 * Catch HttpErrorResponse and execute an action if the error matches a specific code. 
 * @param code the code to match
 * @param actionForThisError the action to execute
 * @returns rxjs OperatorFunction (e.g. for usage in Observable.map())
 */
export function catchApiErrorCode(code: CodeEnum, actionForThisError: (err: Error) => void) {
  return catchError((error: HttpErrorResponse) => {
    let validated: SafeParseReturnType<any, Error> = ErrorSchema.safeParse(error.error);
    if(validated.success && validated.data.code === code) {
      actionForThisError(validated.data);
      return [];
    }
    throw error;
  });
}
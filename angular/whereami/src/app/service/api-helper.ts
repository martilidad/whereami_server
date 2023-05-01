import { HttpErrorResponse } from "@angular/common/http";
import { CodeEnum, Error } from "@client/models";
import { ObservableInput, ObservedValueOf, OperatorFunction, catchError } from "rxjs";
import { SafeParseReturnType, z } from "zod";


export const ErrorSchema = z.object({
  code: z.nativeEnum(CodeEnum),
  message: z.string(),
  validation_errors: z.optional(z.record(z.string(), z.any()))
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
export function catchApiErrorCode<T, O extends ObservableInput<any>>(code: CodeEnum, actionForThisError: (err: Error) => O): OperatorFunction<T, T | ObservedValueOf<O>> {
  return catchError((error: HttpErrorResponse) => {
    let validated: SafeParseReturnType<any, Error> = ErrorSchema.safeParse(error.error);
    if(validated.success && validated.data.code === code) {
      return actionForThisError(validated.data);
    }
    throw error;
  });
}
/* tslint:disable */
/* eslint-disable */
import { CodeEnum } from './code-enum';
export interface Error {
  code: CodeEnum;
  message: string;
  validation_errors?: {
[key: string]: any;
};
}

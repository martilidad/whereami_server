import { CodeEnum, Error } from "@client/models";
import { z } from "zod";
import { ErrorSchema } from "./api-helper";


type ErrorSchemaType = z.infer<typeof ErrorSchema>;

//please update the following two lines, if you make changes to the schema
const errorSchemaInstance: ErrorSchemaType = {code: CodeEnum.Exists, message: "test"}
const errorInstance: Error = {code: CodeEnum.Exists, message: "test"}


describe('apiHelper', () => {
  it('schemas should match', () => {
    //This test should never be touched
    // It will fail to compile if the validated error Schema is not the same as the api Error Schema
    const errorSchemaInstanceCheck: Error = errorSchemaInstance;
    const errorInstanceCheck: ErrorSchemaType = errorInstance;
    expect(errorSchemaInstanceCheck).toBeTruthy();
    expect(errorInstanceCheck).toBeTruthy();
  });
})
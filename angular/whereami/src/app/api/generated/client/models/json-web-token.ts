/* tslint:disable */
/* eslint-disable */

/**
 * Serializer class used to validate a username and password.
 *
 * 'username' is identified by the custom UserModel.USERNAME_FIELD.
 *
 * Returns a JSON Web Token that can be used to authenticate later calls.
 */
export interface JsonWebToken {
  password: string;
  username: string;
}

import {MyAuthInfo} from "./my-auth-info";

export interface LoginTokenDto {
  token: string;
  myAuthInfo: MyAuthInfo | null;
}

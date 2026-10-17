import { doubleCsrfProtection } from "@/lib/csrf";

export class CsrfMiddleware {
  public auth = doubleCsrfProtection;
  public refreshToken = doubleCsrfProtection;
  public execute = doubleCsrfProtection;
}

declare module 'passport-azure-ad' {
  import { Strategy } from 'passport';
  
  export class BearerStrategy extends Strategy {
    constructor(options: any, verify: (token: any, done: Function) => void);
  }
}

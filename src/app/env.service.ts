import { Injectable } from '@angular/core';
import { Http, Response, RequestOptions, Headers, Request, RequestMethod } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';


@Injectable()
export class EnvService{
  
 Envs:Observable<any> = null;
 public envs;

  constructor(private http:Http){}

    // public getEnvs() {
    //   //console.log("trying to get heroku firebase url...");
    //   this.envs = this.http.get('/heroku-env-firebase').map(response => response)
    //   return this.envs;
    // }

    public load() {
        let promise = this.http.get('/heroku-env-firebase').map(res => res).toPromise();
        promise.then(res =>  {
          
          this.envs = res;
          

        });
        //console.log(promise, 'promise');
        return promise;
    };

   
  }


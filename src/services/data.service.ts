import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

@Injectable()
export class DataService{
    private url = 'https://sandwichorder-api.herokuapp.com'; //'http://localhost:8080';
  
  constructor (private http: Http){}

    get(endPoint:string): Observable<any[]> {
        return this.http.get(this.url + endPoint )
                    .map(this.extractData)
                    .catch(this.handleError);
    }
  
    post(endPoint:string,data: any): Observable<any>{
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });

        return this.http.post(this.url + endPoint,  data, options)
                        .map(res => {
                            return res.json()
                        })
                        .catch(this.handleError);
    }
    delete(endPoint:string,data: any): Observable<any>{
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });

        return this.http.delete(this.url+ endPoint + "/"+ data.id, options)
                        .map(res => {
                            return res.json()
                        })
                        .catch(this.handleError);
    }

    private extractData(res: Response) {
        let body = res.json(); 
        return body || { };
    }
    private handleError (error: Response | any) {
        // In a real world app, you might use a remote logging infrastructure
        let errMsg: string;
        if (error instanceof Response) {
        const body = error.json() || '';
        const err = body.error || JSON.stringify(body);
        errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
        } else {
        errMsg = error.message ? error.message : error.toString();
        }
        console.error(errMsg);
        return Observable.throw(errMsg);
    }
}                
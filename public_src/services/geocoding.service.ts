import {Http, Headers, Response} from "@angular/http";
import {Injectable} from "@angular/core";

import "rxjs/add/operator/map";
import "rxjs/add/operator/mergeMap";

@Injectable()
export class GeocodingService {
    http: Http;

    constructor(http: Http) {
        this.http = http;
    }

    geoPolygonFeatures() {
        return this.http
            .get("http://geo-exercise.id.com.au/api/geo")
            .map(res => res.json())
            .map(result => {
                if (result.status !== "OK") { throw new Error("unable to read geo end points"); }

              
            });
    }
}

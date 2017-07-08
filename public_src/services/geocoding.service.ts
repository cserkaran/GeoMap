import {Http, Headers, Response} from "@angular/http";
import {Injectable} from "@angular/core";
import {PolygonInfo} from "../core/polygonInfo.class";
import "rxjs/add/operator/map";
import "rxjs/add/operator/mergeMap";
import Collections = require('typescript-collections');

@Injectable()
export class GeocodingService {
    http: Http;

    constructor(http: Http) {
        this.http = http;
    }

   public geoDataPolygonColors(){
        return this.http
            .get("http://geo-exercise.id.com.au/api/data")
            .map(res => res.json())
            .map(result => {
                let  polygonColorDictionary = new Collections.Dictionary<string, PolygonInfo>();
                let  data = result.data;
                data.forEach(element => {
                    let info = new PolygonInfo();
                    info.color = element.color;
                    info.number = element.InfoBox["Number"];
                    info.percent = element.InfoBox["Percent (%)"];
                    info.totalPopulation = element.InfoBox["Total pop"];
                    polygonColorDictionary.setValue(element.GeoID, info);
                });  

                return polygonColorDictionary; 
            });
   }
 
   // read from geo data end point and transform to create polygon features in geo json format.
    public geoJsonPolygonFeatures() {
       
        return this.http
            .get("http://geo-exercise.id.com.au/api/geo")
            .map(res => res.json())
            .map(result => {
                
                let  polygons : GeoJSONGeoJsonObject[] = [];
                let shapes = result.shapes;

                for(let shape of shapes){

                       let shapeCoordinates = GeocodingService.decodePoints(shape.points);
                       let latlongArr: number[][] = [ ];
                       shapeCoordinates.forEach(element => {
                           let latlong: number[] = [ ];
                           latlong.push(element.lat);
                           latlong.push(element.lng);
                           latlongArr.push(latlong);
                       });

                       let polygon = {
                           "type": "Feature",
                            "properties": {"GeoID": shape.shapeName},
                             "geometry" : {
                                 "type" : "Polygon",
                                 "coordinates" : [latlongArr]
                             }
                       }
                     
                     polygons.push(polygon);
                }

                return polygons;
                
            });
    }

  // Helper method to decode the polygon points in the shapes array within the geo json endpoint. 
  // It will return an array of Latitude, Longitude objects 
   private static decodePoints(encoded : string){
        let len = String(encoded).length;
        let index = 0;
        let ar = [];
        let lat = 0;
        let lng = 0;

        try {
            while (index < len) {
                let b;
                let shift = 0;
                let result = 0;
                do {
                    b = encoded.charCodeAt(index++) - 63;
                    result |= (b & 0x1f) << shift;
                    shift += 5;
                }
                while (b >= 0x20);

                let dlat = ((result & 1) ? ~(result >> 1) : (result >> 1));
                lat += dlat;

                shift = 0;
                result = 0;
                do {
                    b = encoded.charCodeAt(index++) - 63;
                    result |= (b & 0x1f) << shift;
                    shift += 5;
                }
                while (b >= 0x20);

                let dlng = ((result & 1) ? ~(result >> 1) : (result >> 1));
                lng += dlng;

                ar.push(L.latLng((lat * 1e-5), (lng * 1e-5)));
            }

        }
        catch (ex) {
            console.log(ex);
        }
        return ar;
    }

}

import {Component} from "@angular/core";
import {MapService} from "../../services/map.service";
import {GeocodingService} from "../../services/geocoding.service";

@Component({
    selector: "app",
    template: require<any>("./app.component.html"),
    styles: [
        require<any>("./app.component.less")
    ],
    providers: []
})
export class AppComponent {

    constructor(private mapService: MapService, private geocoder: GeocodingService) {
    }

    ngOnInit() {
        let map = L.map("map", {
            zoomControl: false,
            // center around glen waverly, melbourne
            center: L.latLng(-37.8856077, 145.16483519999997),
            zoom: 13,
            layers: [this.mapService.baseMaps.OpenStreetMap]
        });

        L.control.zoom({ position: "topright" }).addTo(map);
        L.control.layers(this.mapService.baseMaps).addTo(map);
        L.control.scale().addTo(map);

        this.mapService.map = map;
        this.geocoder.geoJsonPolygonFeatures()
        .subscribe(polygons => {
           
           this.geocoder.geoDataPolygonColors().
           subscribe(polygonColorDictionary => {

           polygons.forEach(polygon =>
            { 
              L.geoJSON(polygon, { 
                  style: function(feature) {
                            return {color:  polygonColorDictionary.getValue(feature.properties["GeoID"]) };
                        }
                }).addTo(map);
            })
           }, error => console.error(error));
        }, error => console.error(error)); 
    }
}

import { Component, OnInit, Inject } from '@angular/core';
import { PlacesService } from 'src/app/services/places.service';
import * as L from 'leaflet';
import { LeafletLayersDemoModel } from 'src/app/models/layers-demo-model';
import { latLng, Layer, marker, tileLayer } from 'leaflet';
import { Place } from 'src/app/models/place';
import { TypeService } from 'src/app/services/type.service';
import { TypePlace } from 'src/app/models/type-place';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { AddPlaceComponent } from '../add-place/add-place.component';


@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {

  LAYER_OCM = {
    id: 'opencyclemap',
    name: 'Cycle Map',
    enabled: false,
    layer: tileLayer('http://{s}.tile.opencyclemap.org/cycle/{z}/{x}/{y}.png', {
      maxZoom: 18,
      attribution: 'CARTE INTERACTIVE © nahri&hammouch'
    })
  };
  LAYER_OSM = {
    id: 'openstreetmap',
    name: 'Street Map',
    enabled: true,
    layer: tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
      attribution: 'CARTE INTERACTIVE © nahri&hammouch'
    })
  };
  // Form model object
  model = new LeafletLayersDemoModel(
    [this.LAYER_OSM, this.LAYER_OCM],
    this.LAYER_OSM.id
  );
  // Values to bind to Leaflet Directive
  layers: Layer[];
  layersControl = {
    baseLayers: {
      'Open Street Map': this.LAYER_OSM.layer,
      'Open Cycle Map': this.LAYER_OCM.layer
    },
    overlays: {}
  };
  options = {
    zoom: 7,
    center: latLng(32.26855544621476, -6.584490045652705)
  };

  constructor(private placesServices: PlacesService, private typeServices: TypeService, public dialog: MatDialog) {
    this.apply();
  }

  ngOnInit(): void {
    this.getData();
  }

  getData() {
    this.typeServices.getAllTypes().subscribe((types: TypePlace[]) => {
      types.forEach(typePlace => {
        const layerGroup = [];
        this.placesServices.getPlacesBytype(typePlace.title).subscribe((places: Place[]) => {
          places.forEach(element => {
            const newPlace = marker(
              [element.x, element.y],
              {
                icon: this.getCustomIcon(typePlace),
              }
            ).bindPopup(`<img width="300px" height="200px" src="assets/${element.image}"><b>`
              + element.name + '</b><br>' + element.description).openPopup()
              .bindTooltip(element.name).openTooltip();
            layerGroup.push(newPlace);
          });
          const layer = {
            id: typePlace.title,
            name: typePlace.title,
            enabled: true,
            layer: L.layerGroup(layerGroup)
          };
          this.model.overlayLayers.push(layer);
          const titre = typePlace.title;
          this.layersControl.overlays[titre] = layer.layer;
          this.apply();
        });
      });
    });
  }

  getCustomIcon(typePlace: TypePlace) {
    return L.divIcon({
      className: 'custom-div-icon',
      html: '<div style=\'background-color:' + typePlace.color + ';\' class=\'marker-pin\'></div><i class=\'material-icons\'>'
        + typePlace.icon + '</i>',
      iconSize: [30, 42],
      iconAnchor: [15, 42]
    });
  }

  apply() {
    // Get the active base layer
    const baseLayer = this.model.baseLayers.find((l: any) => (l.id === this.model.baseLayer));
    // Get all the active overlay layers
    const newLayers = this.model.overlayLayers
      .filter((l: any) => l.enabled)
      .map((l: any) => l.layer);
    newLayers.unshift(baseLayer.layer);
    this.layers = newLayers;
    return false;
  }

  handleEvent(event) {
    const newPlace: Place = {
      x: event.latlng.lat,
      y: event.latlng.lng
    };
   
    const dialogRef = this.dialog.open(AddPlaceComponent, {
      width: '300px',
      data: newPlace
    });
    dialogRef.afterClosed().subscribe((result: Place) => {
      if (result) {
        result.image = 'restaurant.jpg';
        this.placesServices.addPlace(result).subscribe(data => {
        });
      }
    });
  }
}


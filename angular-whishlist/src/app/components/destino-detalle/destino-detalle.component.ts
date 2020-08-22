import { DestinoViaje } from './../../models/destino-viaje.model';
import { ActivatedRoute } from '@angular/router';
import { DestinosApiClient } from './../../models/destinos-api-client.model';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-destino-detalle',
  templateUrl: './destino-detalle.component.html',
  styleUrls: ['./destino-detalle.component.css'],
  providers: [ DestinosApiClient ]
})
export class DestinoDetalleComponent implements OnInit {
  destino: DestinoViaje;
  style = {
    souces:{
      world: {
        type: 'geojson',
        data: 'https://raw.githubusercontent.com/johan/world.geo.json/master/countries.geo.json' // json con información de países
      }
    },
    version: 8,
    layers:[{
      'id': 'countries',  // lo que se solicita del json
      'type': 'fill',
      'source':'world',
      'layout': {},
      'paint':{
        'fill-color' : '#6F788A'
      }
    }]
  };

  constructor(private route: ActivatedRoute, private destinosApliClient: DestinosApiClient) { }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.destino = this.destinosApliClient.getById(id);
  }

}

import { APP_CONFIG, appConfig, db } from './../app.module';
import { HttpClientModule, HttpHeaders, HttpRequest, HttpResponse, HttpClient } from '@angular/common/http';
import { NuevoDestinoAction, ElegidoFavoritoAction } from './destinos-viajes-state.model';
import { Store } from '@ngrx/store';
import { DestinoViaje } from './destino-viaje.model';
import { Subject, BehaviorSubject } from 'rxjs';
import { AppState } from '../app.module';
import { Injectable, Inject, forwardRef } from '@angular/core';


@Injectable()
export class DestinosApiClient{
  destinos: DestinoViaje[] = [];
  getById(id: string): DestinoViaje {
    return this.destinos.filter(function(d){return d.id.toString() === id;})[0];
  }
  constructor(private store: Store<AppState>, @Inject(forwardRef(() => APP_CONFIG)) private config: appConfig, private http: HttpClient){
  }

  add(d: DestinoViaje) {
    const headers: HttpHeaders = new HttpHeaders({'X-API-TOKEN': 'TOKEN SEGURIDAD'}); // agrega token de seguridad
    const req = new HttpRequest('POST', this.config.apiEndPoint + '/my', {nuevo: d.nombre}, {headers: headers});
    this.http.request(req).subscribe((data: HttpResponse<{}>) => {
      if (data.status === 200){ // codigo de estado de respuesta
        this.store.dispatch(new NuevoDestinoAction(d));
        const myDb = db; // es inicializacion exportada
        myDb.destinos.add(d);
        console.log('todos los destinos de la db');
        myDb.destinos.toArray().then(destinos => console.log(destinos));
      }
    });
  }

  elegir(d: DestinoViaje){
    this.store.dispatch(new ElegidoFavoritoAction(d));
  }
}

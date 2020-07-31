import { NuevoDestinoAction, ElegidoFavoritoAction } from './../models/destinos-viajes-state.model';
import { AppState } from './../app.module';
import { DestinosApiClient } from './../models/destinos-api-client.model';
import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { DestinoViajeComponent } from '../destino-viaje/destino-viaje.component';
import { DestinoViaje } from '../models/destino-viaje.model';
import { Store, State } from '@ngrx/store';

@Component({
  selector: 'app-lista-destinos',
  templateUrl: './lista-destinos.component.html',
  styleUrls: ['./lista-destinos.component.css']
})
export class ListaDestinosComponent implements OnInit {
  updates: string[];
  @Output() onItemAdded: EventEmitter<DestinoViaje>;


  constructor(public destinosApiClient: DestinosApiClient, private store: Store<AppState>) {
    this.updates = [];
    this.store.select(state => state.destinos.favorito).subscribe(d => {
      const fav = d;
      if (d != null){
        this.updates.push('se ha elegido a ' + d.nombre);
      }
    });
  }

  ngOnInit(): void {
  }

  agregado(d: DestinoViaje): void {
    this.destinosApiClient.add(d);
    this.onItemAdded.emit(d);
    this.store.dispatch(new ElegidoFavoritoAction(d));
  }

  elegido(e: DestinoViaje){
    this.destinosApiClient.elegir(e);
    this.store.dispatch(new ElegidoFavoritoAction(e));

  }
}

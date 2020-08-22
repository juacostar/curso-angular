import { DestinosApiClient } from './../../models/destinos-api-client.model';
import { VoteUpAction, VoteDownAction } from './../../models/destinos-viajes-state.model';
import { AppState } from './../../app.module';
import { Store } from '@ngrx/store';
import { Component, OnInit, Input, HostBinding, EventEmitter, Output, InjectionToken, Inject } from '@angular/core';
import { DestinoViaje } from './../../models/destino-viaje.model';
import { trigger, state, style, transition, animate } from '@angular/animations';

class DestinosApiClientViejo{
  getById(id: string): DestinoViaje{
    console.log('llamado de la clase vieja!');
    return null;
  }
}

interface AppConfig{
  apiEndPoint: string;
}

const APP_CONFIG_VALUE: AppConfig = {
  apiEndPoint: 'mi_api.com'
};

const APP_CONFIG = new InjectionToken<AppConfig>('app.config');

/*class DestinosApiClientDecorated extends DestinosApiClient{
  constructor(@Inject(APP_CONFIG) private config: AppConfig, store: Store<AppState>){
    super(store);
  }

  getById(id: string): DestinoViaje{
    console.log('llamando por la clase decorada!');
    console.log('config: ' + this.config.apiEndPoint);
    return super.getById(id);
  }
}*/

// En el decorador se declaran las animaciones
@Component({
  selector: 'app-destino-viaje',
  templateUrl: './destino-viaje.component.html',
  styleUrls: ['./destino-viaje.component.css'],
  /*providers: [
    DestinosApiClient,
    {provide: DestinosApiClientViejo, useExisting: DestinosApiClient}
  ]*/
  animations: [
    trigger('esFavorito',[
      state('estadoFavorito', style({
        backgroundColor: 'PaleRurquoise'
      })),
      state('estadoNoFavorito', style({
        backgroundColor: 'WhiteSmoke'
      })),
      transition('estadoNoFavorito => estadoFavorito', [
        animate('3s')
      ]),
      transition('estadoFavorito => estadoNoFavorito', [
        animate('1s')
      ]),
    ])
  ]
})
export class DestinoViajeComponent implements OnInit {
  @Input() destino: DestinoViaje;
  @Input() idx: number;
  @Output() clicked: EventEmitter<DestinoViaje>;
  @HostBinding('attr.class') cssClass = 'col-md-4'; // agrega estilos independientes
  constructor(private store: Store<AppState>) {
    this.clicked = new EventEmitter();
  }
  ngOnInit(): void {
  }

  ir(): boolean{// eligeel preferido
    this.clicked.emit(this.destino);
    return false;
  }

  voteUp(): boolean { // votar me gusta
    this.store.dispatch(new VoteUpAction(this.destino));
    return false;
  }

  voteDown(): boolean{
    this.store.dispatch(new VoteDownAction(this.destino));
    return false;
  }

}

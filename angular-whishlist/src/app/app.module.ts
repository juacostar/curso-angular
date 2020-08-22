import { Observable, from } from 'rxjs';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { AuthService } from './services/auth.service';
import { UsuarioLogueadoGuard } from './guards/usuario-logueado/usuario-logueado.guard';
import { EffectsModule } from '@ngrx/effects';
import { DestinosViajesState, reducerDestinosViajes, initializeDestinosViajesState, DestinosViajesEffects, initMyDataAction } from './models/destinos-viajes-state.model';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule, InjectionToken, Injectable, APP_INITIALIZER } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DestinoViajeComponent } from './components/destino-viaje/destino-viaje.component';
import { ListaDestinosComponent } from './components/lista-destinos/lista-destinos.component';
import { DestinoDetalleComponent } from './components/destino-detalle/destino-detalle.component';
import { FormDestinoVijeComponent } from './components/form-destino-vije/form-destino-vije.component';
import { DestinosApiClient } from './models/destinos-api-client.model';
import { ActionReducer, ActionReducerMap, StoreModule as NgRxStoreModule, Store } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { LoginComponent } from './components/login/login/login.component';
import { ProtectedComponent } from './components/protected/protected/protected.component';
import { VuelosComponentComponent } from './components/vuelos/vuelos-component/vuelos-component.component';
import { VuelosMainComponentComponent } from './components/vuelos/vuelos-main-component/vuelos-main-component.component';
import { VuelosMasInfoComponentComponent } from './components/vuelos/vuelos-mas-info-component/vuelos-mas-info-component.component';
import { VuelosDetalleComponentComponent } from './components/vuelos/vuelos-detalle-component/vuelos-detalle-component.component';
import { ReservasModule } from './reservas/reservas.module';
import { HttpClientModule, HttpClient, HttpHeaders, HttpRequest } from '@angular/common/http';
import Dexie from 'dexie';
import { DestinoViaje } from './models/destino-viaje.model';
import { flatMap } from 'rxjs/operators';
import { NgxMapboxGLModule } from 'ngx-mapbox-gl';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { EspiameDirective } from './espiame.directive';
import { TrackearClickDirective } from './trackear-click.directive';

export interface appConfig {
  apiEndPoint: string;
}

const APP_CONFIG_VALUE: appConfig = {
  apiEndPoint: 'http://localhost:3000'
}

export const APP_CONFIG = new InjectionToken<appConfig>('app.config'); // variables para integración con servidor


export const childrenRoutesVuelos: Routes = [
  {path: '', redirectTo: 'main', pathMatch: 'full'},
  {path: 'main', component: VuelosMainComponentComponent},
  {path: 'mas-info', component: VuelosMasInfoComponentComponent},
  {path: ':id', component: VuelosDetalleComponentComponent}
];


const routes: Routes = [
  {path: '', redirectTo: 'home', pathMatch: 'full'},
  {path: 'home', component: ListaDestinosComponent},
  {path: 'destino/:id', component: DestinoDetalleComponent},
  {path: 'login', component: LoginComponent},
  {path: 'protected', component: ProtectedComponent, canActivate: [UsuarioLogueadoGuard]},
  {path: 'vuelos', component: VuelosComponentComponent, canActivate: [UsuarioLogueadoGuard], children: childrenRoutesVuelos}
];

// init redux
export interface AppState{
  destinos: DestinosViajesState;
}

const reducers: ActionReducerMap<AppState> = {
  destinos: reducerDestinosViajes
};

const  reducersInitialState = {
  destinos: initializeDestinosViajesState()
};

// fin redux

// init appLoad
export function init_app(appLoadService: AppLoadService): () => Promise<any> {
  return () => appLoadService.initializeDestinosViajesState();
}

@Injectable()
class AppLoadService{
  constructor(private store: Store<AppState>, private http: HttpClient ){}
  async initializeDestinosViajesState(): Promise<any> {
    const headers: HttpHeaders = new HttpHeaders({'X-API-TOKEN': 'TOKEN SEGURIDAD'});
    const req = new HttpRequest('GET', APP_CONFIG_VALUE.apiEndPoint + '/my', {headers: headers});
    const response: any = await this.http.request(req).toPromise();
    this.store.dispatch(new initMyDataAction(response.body));
  }
}
// fin


// init dexie db
export class Translation {
  constructor(public id: number, public lang: string, public key: string, public value: string){}
}


@Injectable({
  providedIn: 'root'
})
export class MyDatabase extends Dexie{
  destinos: Dexie.Table<DestinoViaje, number>;
  translations: Dexie.Table<Translation, number>;
  constructor(){
    super('MyDatabase');
    this.version(1).stores({
      destinos: '++id,nombre,imagenUrl', // primeraversion base de datos
    });
    this.version(2).stores({
      destinos: '++id,nombre,imagenUrl', // segunda version base de datos
      translations: '++id,, lang, key, value'
    });
  }
}

export const db = new MyDatabase();
// fin dexie db


// init 18ie
class TranslationLoader{
  constructor(private http: HttpClient){}

  getTranslation(lang: string): Observable<any> {
    const promise = db.translations
                      .where('lang')
                      .equals(lang)
                      .toArray()
                      .then(results =>{
                                  if (results.length === 0 ){
                                    return this.http
                                    .get<Translation[]>(APP_CONFIG_VALUE.apiEndPoint + '/api/translation?lang=' + lang)
                                    .toPromise()
                                    .then(apiResults => {
                                      db.translations.bulkAdd(apiResults);
                                      return apiResults;
                                    });
                                  }
                                  return results;
                                }).then(traducciones => {
                                  console.log('traducciones cargadas:');
                                  console.log(traducciones);
                                  return traducciones;
                                }).then((traduccciones) => {
                                  return traduccciones.map((t) => ({ [t.key]: t.value}));
                                } );
    return from(promise).pipe(flatMap((elems) => from(elems)));
                      }
}

function HttpLoadFactory(http: HttpClient){
  return new TranslationLoader(http);
}

// fin i18ns



@NgModule({
  declarations: [
    AppComponent,
    DestinoViajeComponent,
    ListaDestinosComponent,
    DestinoDetalleComponent,
    FormDestinoVijeComponent,
    LoginComponent,
    ProtectedComponent,
    VuelosComponentComponent,
    VuelosMainComponentComponent,
    VuelosMasInfoComponentComponent,
    VuelosDetalleComponentComponent,
    EspiameDirective,
    TrackearClickDirective,
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(routes),
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NgRxStoreModule.forRoot(reducers, {initialState: reducersInitialState
    }),
    EffectsModule.forRoot([DestinosViajesEffects]),
    StoreDevtoolsModule,
    ReservasModule,
    HttpClientModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslationLoader,
        useFactory: (HttpLoadFactory),
        deps: [HttpClient]
      }
    }
    ),
    NgxMapboxGLModule,
    BrowserAnimationsModule
  ],
  providers: [DestinosApiClient, AuthService, ProtectedComponent,
    {provide: APP_CONFIG, useValue: APP_CONFIG_VALUE},
    AppLoadService,
    {provide: APP_INITIALIZER, useFactory: init_app, deps: [AppLoadService], multi: true}, MyDatabase ],
  bootstrap: [AppComponent],

})
export class AppModule { }

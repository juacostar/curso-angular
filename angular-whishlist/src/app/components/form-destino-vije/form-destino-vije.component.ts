import { APP_CONFIG, appConfig } from './../../app.module';
import { Component, OnInit, Output, EventEmitter, Inject, forwardRef } from '@angular/core';
import { DestinoViaje } from './../../models/destino-viaje.model';
import { FormGroup, FormBuilder, Validators, FormControl, ValidatorFn } from '@angular/forms';
import { fromEvent } from 'rxjs';
import { map, filter, debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { ajax, AjaxResponse } from 'rxjs/ajax';

@Component({
  selector: 'app-form-destino-vije',
  templateUrl: './form-destino-vije.component.html',
  styleUrls: ['./form-destino-vije.component.css']
})
export class FormDestinoVijeComponent implements OnInit {
  @Output() onItemAdded: EventEmitter<DestinoViaje>;
  minLongitud = 3;
  fg: FormGroup;
  searchResults: string[];
  constructor(fb: FormBuilder, @Inject(forwardRef(() => APP_CONFIG)) private config: appConfig) {
    this.onItemAdded = new EventEmitter();
    this.fg = fb.group({
      nombre: ['', Validators.compose([Validators.required, this.nombreValidatorParametrizable(this.minLongitud)])],
      url: ['']
    });
  }

  ngOnInit(): void {
    let elemNombre = <HTMLInputElement>document.getElementById('nombre'); //obtiene el nombre del DOM
    fromEvent(elemNombre, 'input')
      .pipe(
        map((e: KeyboardEvent) => (e.target as HTMLInputElement).value),
        filter(text => text.length > 2),
        debounceTime(200),
        distinctUntilChanged(),
        switchMap((text: string) => ajax(this.config.apiEndPoint + '/ciudades?q=' + text)))
        .subscribe(AjaxResponse => this.searchResults = AjaxResponse.response);
  }

  guardar(nombre: string, url: string): boolean {
    const d = new DestinoViaje(nombre, url);
    this.onItemAdded.emit(d);
    return false;
  }

  nombreValidator(control: FormControl): { [s: string]: boolean }{
    const l = control.value.toString().trim().length;
    if (l > 0 && l < 5){
      return{ invalidNombre: true};
    }

    return null;
  }

  nombreValidatorParametrizable(minLong: number): ValidatorFn {
    return(control: FormControl): { [s:string]:boolean }| null => {
      const l = control.value.toString().trim().length;
      console.log(l);
      if (l > 0 && l < minLong){
        return{ minLongNombre: true};
      }

      return null;
    }

  }

}

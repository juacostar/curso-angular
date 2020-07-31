import { Component, OnInit, Input, HostBinding, EventEmitter, Output } from '@angular/core';
import { DestinoViaje } from '../models/destino-viaje.model';

@Component({
  selector: 'app-destino-viaje',
  templateUrl: './destino-viaje.component.html',
  styleUrls: ['./destino-viaje.component.css']
})
export class DestinoViajeComponent implements OnInit {
  @Input() destino: DestinoViaje;
  @Input() idx: Number;
  @Output() clicked: EventEmitter<DestinoViaje>;
  @HostBinding('attr.class') cssClass = 'col-md-4';
  constructor() {
    this.clicked = new EventEmitter();
  }
  ngOnInit(): void {
  }

  ir(): boolean{
    this.clicked.emit(this.destino);
    return false;
  }

}

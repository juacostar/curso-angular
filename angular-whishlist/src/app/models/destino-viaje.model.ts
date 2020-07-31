export class DestinoViaje{
  private selected: boolean;
  public servicios: String[];
  constructor(public nombre:String, public u:String){
    this.servicios = ['pileta', 'desayuno'];
  }

  isSelected(): boolean{
    return this.selected;
  }

  setSelected(s: boolean): void{
    this.selected = s;
  }

}

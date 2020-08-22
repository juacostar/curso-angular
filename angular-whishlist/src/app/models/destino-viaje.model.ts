export class DestinoViaje{
  private selected: boolean;
  public servicios: string[];
  public id: number;
  constructor(public nombre: string, public u: string, public votes: number = 0){
    this.servicios = ['pileta', 'desayuno'];
  }

  isSelected(): boolean{
    return this.selected;
  }

  setSelected(s: boolean): void{
    this.selected = s;
  }

  voteUp() {
    this.votes++;
  }

  voteDown() {
    this.votes--;
  }

}

import { DestinoViaje } from './destino-viaje.model';
import {
  reducerDestinosViajes,
  DestinosViajesState,
  initializeDestinosViajesState,
  initMyDataAction,
  NuevoDestinoAction
} from './destinos-viajes-state.model';


describe('reducerDestinosViajes', () =>{
  it('should reduce init data', () => {
    const prevState: DestinosViajesState = initializeDestinosViajesState();
    const action: initMyDataAction = new initMyDataAction(['destino 1', 'destino 2']);
    const newState: DestinosViajesState = reducerDestinosViajes(prevState, action);
    expect(newState.items.length).toEqual(2);
    expect(newState.items[0].nombre).toEqual('destino 1');
  });

  it('should reduce new item added', () => {
    const prevState: DestinosViajesState = initializeDestinosViajesState();
    const action: NuevoDestinoAction = new NuevoDestinoAction(new DestinoViaje('barcelona', 'url'));
    const newState: DestinosViajesState = reducerDestinosViajes(prevState, action);
    expect(newState.items.length).toEqual(1);
    expect(newState.items[0].nombre).toEqual('barcelona');
  })
})

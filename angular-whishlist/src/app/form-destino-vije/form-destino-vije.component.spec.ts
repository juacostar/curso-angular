import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormDestinoVijeComponent } from './form-destino-vije.component';

describe('FormDestinoVijeComponent', () => {
  let component: FormDestinoVijeComponent;
  let fixture: ComponentFixture<FormDestinoVijeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormDestinoVijeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormDestinoVijeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

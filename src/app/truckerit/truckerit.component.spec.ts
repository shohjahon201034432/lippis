import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TruckeritComponent } from './truckerit.component';

describe('TruckeritComponent', () => {
  let component: TruckeritComponent;
  let fixture: ComponentFixture<TruckeritComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TruckeritComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TruckeritComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

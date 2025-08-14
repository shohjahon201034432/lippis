import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SnapbackitComponent } from './snapbackit.component';

describe('SnapbackitComponent', () => {
  let component: SnapbackitComponent;
  let fixture: ComponentFixture<SnapbackitComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SnapbackitComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SnapbackitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

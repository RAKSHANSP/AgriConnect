import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GovtOfficial } from './govt-official';

describe('GovtOfficial', () => {
  let component: GovtOfficial;
  let fixture: ComponentFixture<GovtOfficial>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GovtOfficial]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GovtOfficial);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

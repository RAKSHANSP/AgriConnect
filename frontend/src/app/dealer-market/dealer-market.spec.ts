import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DealerMarket } from './dealer-market';

describe('DealerMarket', () => {
  let component: DealerMarket;
  let fixture: ComponentFixture<DealerMarket>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DealerMarket]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DealerMarket);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

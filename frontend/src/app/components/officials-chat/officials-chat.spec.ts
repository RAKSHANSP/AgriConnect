import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OfficialsChat } from './officials-chat';

describe('OfficialsChat', () => {
  let component: OfficialsChat;
  let fixture: ComponentFixture<OfficialsChat>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OfficialsChat]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OfficialsChat);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

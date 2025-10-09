import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IndividualChat } from './individual-chat';

describe('IndividualChat', () => {
  let component: IndividualChat;
  let fixture: ComponentFixture<IndividualChat>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IndividualChat]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IndividualChat);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InformationSharing } from './information-sharing';

describe('InformationSharing', () => {
  let component: InformationSharing;
  let fixture: ComponentFixture<InformationSharing>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InformationSharing]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InformationSharing);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

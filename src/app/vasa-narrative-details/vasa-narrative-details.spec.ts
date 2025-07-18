import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VasaNarrativeDetailsComponent } from './vasa-narrative-details';

describe('VasaNarrativeDetails', () => {
  let component: VasaNarrativeDetailsComponent;
  let fixture: ComponentFixture<VasaNarrativeDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VasaNarrativeDetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VasaNarrativeDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

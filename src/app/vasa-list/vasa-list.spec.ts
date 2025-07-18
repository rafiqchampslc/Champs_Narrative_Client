import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VASAList } from './vasa-list';

describe('VASAList', () => {
  let component: VASAList;
  let fixture: ComponentFixture<VASAList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VASAList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VASAList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

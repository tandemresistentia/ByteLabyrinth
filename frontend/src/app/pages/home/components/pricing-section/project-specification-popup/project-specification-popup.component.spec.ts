import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectSpecificationPopupComponent } from './project-specification-popup.component';

describe('ProjectSpecificationPopupComponent', () => {
  let component: ProjectSpecificationPopupComponent;
  let fixture: ComponentFixture<ProjectSpecificationPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProjectSpecificationPopupComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProjectSpecificationPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

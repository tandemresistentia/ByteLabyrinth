import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectFileComponent } from './project-file.component';

describe('ProjectFileComponent', () => {
  let component: ProjectFileComponent;
  let fixture: ComponentFixture<ProjectFileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProjectFileComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ProjectFileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

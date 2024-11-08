import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ImageManipulationComponent } from './image-manipulation.component';

describe('ImageManipulationComponent', () => {
  let component: ImageManipulationComponent;
  let fixture: ComponentFixture<ImageManipulationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ImageManipulationComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ImageManipulationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ContentComponent } from './content.component';

describe('Content Component', () => {
  let component: ContentComponent;
  let fixture: ComponentFixture<ContentComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ContentComponent ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create Content Component', () => {
    expect(component).toBeTruthy();
  });
});

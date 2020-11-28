import { TestBed, waitForAsync } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { RootComponent } from './root.component';

describe('Root Component', () => {
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
      ],
      declarations: [
        RootComponent,
      ],
    }).compileComponents();
  }));

  it('should create the Root Component', () => {
    const fixture = TestBed.createComponent(RootComponent);
    const root = fixture.componentInstance;
    expect(root).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SleepinessPage } from './sleepiness.page';

describe('SleepinessPage', () => {
  let component: SleepinessPage;
  let fixture: ComponentFixture<SleepinessPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(SleepinessPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

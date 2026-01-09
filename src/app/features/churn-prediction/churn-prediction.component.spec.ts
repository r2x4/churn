import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ChurnPredictionComponent } from './churn-prediction.component';
import { ApiService } from '../../core/services/api.service';

describe('ChurnPredictionComponent', () => {
  let component: ChurnPredictionComponent;
  let fixture: ComponentFixture<ChurnPredictionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ ChurnPredictionComponent, ReactiveFormsModule, HttpClientTestingModule ],
      providers: [ ApiService ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChurnPredictionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

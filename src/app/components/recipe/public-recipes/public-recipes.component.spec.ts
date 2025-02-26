import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PublicRecipesComponent } from './public-recipes.component';

describe('PublicRecipesComponent', () => {
  let component: PublicRecipesComponent;
  let fixture: ComponentFixture<PublicRecipesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PublicRecipesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PublicRecipesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

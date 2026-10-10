import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeComponent } from './home.component';
import { FilterEnum } from '../../enums/filtes.enum';
import { Task } from '../../models/task.model';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;

  const titles = () => Array.from(
    (fixture.nativeElement as HTMLElement).querySelectorAll('.todo-list label')
  ).map(label => label.textContent);

  function createComponent(saved: Task[] = []) {
    localStorage.clear();
    if (saved.length) {
      localStorage.setItem('tasks', JSON.stringify(saved));
    }
    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }

  const savedTasks: Task[] = [
    { id: 1, title: 'Pendiente A', completed: false },
    { id: 2, title: 'Hecha B', completed: true },
    { id: 3, title: 'Pendiente C', completed: false },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeComponent]
    })
    .compileComponents();
  });

  it('should create', () => {
    createComponent();
    expect(component).toBeTruthy();
  });

  it('should load the saved tasks', () => {
    createComponent(savedTasks);

    expect(titles()).toEqual(['Pendiente A', 'Hecha B', 'Pendiente C']);
  });

  it('should add a task and ignore blank titles', () => {
    createComponent();

    component.newTaskControl.setValue('  Nueva tarea  ');
    component.changeHandler(new Event('change'));
    component.newTaskControl.setValue('   ');
    component.changeHandler(new Event('change'));
    fixture.detectChanges();

    expect(titles()).toEqual(['Nueva tarea']);
    expect(component.newTaskControl.value).toBe('   ');
  });

  it('should filter pending and completed tasks', () => {
    createComponent(savedTasks);

    component.changeFilter(FilterEnum.PENDING);
    fixture.detectChanges();
    expect(titles()).toEqual(['Pendiente A', 'Pendiente C']);

    component.changeFilter(FilterEnum.COMPLETED);
    fixture.detectChanges();
    expect(titles()).toEqual(['Hecha B']);
  });

  it('should delete the task that was clicked even when a filter is active', () => {
    createComponent(savedTasks);
    component.changeFilter(FilterEnum.PENDING);
    fixture.detectChanges();

    // Segundo elemento visible: "Pendiente C" (en la lista completa, el segundo es "Hecha B")
    const buttons = (fixture.nativeElement as HTMLElement).querySelectorAll<HTMLButtonElement>('.destroy');
    buttons[1].click();
    fixture.detectChanges();

    expect(component.tasks().map(task => task.title)).toEqual(['Pendiente A', 'Hecha B']);
  });

  it('should toggle the task that was clicked even when a filter is active', () => {
    createComponent(savedTasks);
    component.changeFilter(FilterEnum.PENDING);
    fixture.detectChanges();

    const toggles = (fixture.nativeElement as HTMLElement).querySelectorAll<HTMLInputElement>('.toggle');
    toggles[1].dispatchEvent(new Event('change'));
    fixture.detectChanges();

    expect(component.tasks().find(task => task.id === 3)?.completed).toBeTrue();
    expect(component.tasks().find(task => task.id === 2)?.completed).toBeTrue();
    expect(component.tasks().find(task => task.id === 1)?.completed).toBeFalse();
  });

  it('should edit a title and keep the previous one when the new one is blank', () => {
    createComponent(savedTasks);
    const input = document.createElement('input');

    input.value = '  Renombrada  ';
    component.updateTaskText(1, { target: input } as unknown as Event);
    input.value = '   ';
    component.updateTaskText(3, { target: input } as unknown as Event);

    expect(component.tasks().map(task => task.title)).toEqual(['Renombrada', 'Hecha B', 'Pendiente C']);
  });

  it('should clear the completed tasks', () => {
    createComponent(savedTasks);

    component.clearCompleted();

    expect(component.tasks().map(task => task.id)).toEqual([1, 3]);
  });

  it('should save the tasks without the editing flag', () => {
    createComponent(savedTasks);

    component.updateTaskEditingMode(1);
    fixture.detectChanges();

    const stored: Task[] = JSON.parse(localStorage.getItem('tasks') ?? '[]');
    expect(stored.length).toBe(3);
    expect(stored.some(task => 'editing' in task)).toBeFalse();
  });
});

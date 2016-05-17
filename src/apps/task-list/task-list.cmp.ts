import {Component, OnInit} from 'angular2/core';

@Component({
  selector: 'task-list',
  templateUrl: './task-list.tpl.html',
  moduleId: module.id
})
export class TaskListComponent implements OnInit {
  tasks: Array<any> = [
    {taskId: 1, name: 'task -1'},
    {taskId: 2, name: 'task -2'},
    {taskId: 3, name: 'task -3'},
    {taskId: 4, name: 'task -4'},
    {taskId: 5, name: 'task -5'}
  ];

  ngOnInit(): void {
    //
  }

  clickTask(task: any): void {
    alert('You clicked ' + task.name);
  }

}
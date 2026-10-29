import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';
import { projects } from '../../core/demo-data';
import { TableColumn, TableRow } from '../../shared/datatable.component';
@Component({
  selector: 'eit-dashboard',
  imports: [CommonModule, RouterLink, FormsModule, SharedModule],
  templateUrl: './dashboard.html',
})
export class DashboardComponent {
  projects = projects;
  selected = signal<TableRow | null>(null);
  period = signal('Last 6 months');
  rangeOpen = signal(false);
  from = '2026-10-01';
  to = '2026-10-29';
  rangeLabel = signal('Oct 1 – Oct 29, 2026');
  factor = signal(1);
  columns: TableColumn[] = [
    { field: 'name', label: 'PROJECT NAME', type: 'avatar' },
    { field: 'status', label: 'STATUS', type: 'status' },
    { field: 'progress', label: 'PROGRESS', type: 'progress' },
    { field: 'due', label: 'DUE DATE' },
  ];
  stats = [
    {
      label: 'Total revenue',
      value: 48290,
      prefix: '$',
      icon: 'currency-dollar',
      change: '12.8%',
      down: false,
      color: '#206bc4',
      line: 'M0 30 L10 26 L20 29 L30 17 L40 20 L50 14 L60 19 L70 7 L80 12 L90 4 L100 8 L120 0',
    },
    {
      label: 'Total users',
      value: 2847,
      prefix: '',
      icon: 'users',
      change: '8.2%',
      down: false,
      color: '#8b5fc3',
      line: 'M0 30 L12 28 L24 20 L36 24 L48 17 L60 20 L72 10 L84 14 L96 7 L108 10 L120 2',
    },
    {
      label: 'Active projects',
      value: 48,
      prefix: '',
      icon: 'briefcase',
      change: '6.4%',
      down: false,
      color: '#0d9488',
      line: 'M0 29 L10 20 L20 25 L35 15 L45 18 L55 10 L70 16 L80 8 L95 11 L105 3 L120 7',
    },
    {
      label: 'Conversion rate',
      value: 4.38,
      prefix: '',
      icon: 'chart-arrows-vertical',
      change: '0.4%',
      down: true,
      color: '#e59a42',
      line: 'M0 8 L12 15 L24 10 L36 22 L48 17 L60 24 L72 19 L84 29 L96 23 L108 30 L120 25',
    },
  ];
  sources = [
    { name: 'Direct', value: '10,704', percent: '43%', color: '#206bc4' },
    { name: 'Organic search', value: '7,219', percent: '29%', color: '#6b9de0' },
    { name: 'Referral', value: '4,232', percent: '17%', color: '#a3c4ef' },
    { name: 'Social', value: '2,737', percent: '11%', color: '#dce9fa' },
  ];
  activities = [
    {
      name: 'Olivia Rhye',
      initials: 'OR',
      action: 'created a new project',
      target: 'Website redesign',
      time: '5 minutes ago',
      color: 'avatar-blue',
      tag: '',
    },
    {
      name: 'Phoenix Baker',
      initials: 'PB',
      action: 'uploaded a file to',
      target: 'Mobile application',
      time: '24 minutes ago',
      color: 'avatar-purple',
      tag: 'Project brief.pdf',
    },
    {
      name: 'Lana Steiner',
      initials: 'LS',
      action: 'completed the task',
      target: 'Update brand guidelines',
      time: '1 hour ago',
      color: 'avatar-orange',
      tag: '',
    },
    {
      name: 'Demi Wilkinson',
      initials: 'DW',
      action: 'invited',
      target: 'Drew Cano to the workspace',
      time: '2 hours ago',
      color: 'avatar-green',
      tag: '',
    },
  ];
  scaled(value: number) {
    return value === 4.38 ? '4.38%' : Math.round(value * this.factor()).toLocaleString('en-US');
  }
  applyRange() {
    if (this.from && this.to && this.from <= this.to) {
      const days = Math.round((Date.parse(this.to) - Date.parse(this.from)) / 86400000) + 1;
      this.factor.set(days / 29);
      this.rangeLabel.set(this.from + ' – ' + this.to);
      this.rangeOpen.set(false);
    }
  }
  exportReport() {
    const csv =
      'Project,Status,Progress,Budget,Due date\n' +
      this.projects
        .map((p) =>
          [p.name, p.status, p.progress, p.budget.replace(',', ''), p.due.replace(',', '')].join(
            ',',
          ),
        )
        .join('\n');
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }));
    const a = document.createElement('a');
    a.href = url;
    a.download = 'workspace-report.csv';
    a.click();
    URL.revokeObjectURL(url);
  }
}

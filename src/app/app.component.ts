import { Component, OnInit, OnDestroy } from '@angular/core';
import { interval, Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {

  currentTime = new Date();
  reminderText = '';
  reminderTime = '';
  reminders: any[] = [];
  fastMode = false;

  private clockSub!: Subscription;

  ngOnInit() {
    this.runClock();
  }

  runClock() {
    this.clockSub?.unsubscribe();

    this.clockSub = interval(1000).subscribe(() => {
      const step = this.fastMode ? 60000 : 1000;
      this.currentTime = new Date(this.currentTime.getTime() + step);
      this.updateReminders();
    });
  }

  toggleFastMode() {
    this.fastMode = !this.fastMode;
    this.runClock();
  }

  addReminder() {
  if (!this.reminderText || !this.reminderTime) return;

  if (this.reminders.length > 0) {
    this.reminders[this.reminders.length - 1].expired = true;
  }

  this.reminders.push({
    text: this.reminderText,
    time: this.reminderTime,
    expired: false
  });

  this.reminderText = '';
  this.reminderTime = '';
}


  updateReminders() {
    this.reminders.forEach(reminder => {
      const [h, m] = reminder.time.split(':').map(Number);
      const targetTime = new Date(this.currentTime);
      targetTime.setHours(h, m, 0, 0);

      if (this.currentTime >= targetTime) {
        reminder.expired = true;
      }
    });
  }

  ngOnDestroy() {
    this.clockSub?.unsubscribe();
  }
}

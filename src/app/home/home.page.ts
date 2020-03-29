import { Component, OnInit, ApplicationRef } from '@angular/core';
import { PushService } from '../services/push.service';
import { OSNotificationPayload } from '@ionic-native/onesignal/ngx';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

  messages: OSNotificationPayload[] = [];
  constructor( public pushService: PushService,
               private applicationRef: ApplicationRef) {}

  ngOnInit() {

    this.pushService.pushListener.subscribe( noti => {
      this.messages.unshift( noti );
      this.applicationRef.tick(); // le dice a angular que hace el ciclo de detencion de cambios nuevamente.
    });
  }

  async ionViewWillEnter() {
    this.messages = await this.pushService.getMessages();
    console.log('Will Enter - load messages', this.messages);
  }

  async deleteMessages() {
    await this.pushService.deleteMessages();
    this.messages = [];
  }
}

import { Injectable, EventEmitter } from '@angular/core';
import { Storage } from '@ionic/storage';
import { OneSignal, OSNotification, OSNotificationPayload } from '@ionic-native/onesignal/ngx';

@Injectable({
  providedIn: 'root'
})
export class PushService {

  messages: OSNotificationPayload[] = [
    // {
    //   title: 'Push title',
    //   body: 'This is the push body',
    //   date: new Date()
    // }
  ];

  pushListener = new EventEmitter<OSNotificationPayload>();

  constructor( private oneSignal: OneSignal,
               private storage: Storage) {

    this.loadMessages();
  }

  initconfiguration() {

    // ONESIGNAL APP ID && firebase ID del remitente

    this.oneSignal.startInit('5de87667-6042-4c65-9f78-483c3cc8e973', '767194411535');

    // this.oneSignal.inFocusDisplaying(this.oneSignal.OSInFocusDisplayOption.InAppAlert);
    this.oneSignal.inFocusDisplaying(this.oneSignal.OSInFocusDisplayOption.Notification);

    this.oneSignal.handleNotificationReceived().subscribe( ( noti ) => {
     // do something when notification is received
     console.log('notification received!', noti);
     this.notificationReceived( noti );
    });
    
    this.oneSignal.handleNotificationOpened().subscribe( async( noti ) => {
      // do something when a notification is opened
      console.log('notification openend!', noti);
      await this.notificationReceived( noti.notification );

    });
    
    this.oneSignal.endInit();
  
  }

  async notificationReceived( noti: OSNotification) {

    // just in case
    await this.loadMessages();

    const payload = noti.payload;

    const existPush = this.messages.find( message => message.notificationID === payload.notificationID);

    if ( existPush ) {
      return;
    }

    this.messages.unshift( payload );

    // cada vez que hay una nueva notificacion se emite el evento
    this.pushListener.emit( payload );
    await this.storeMessages();
  }

  async storeMessages() {
    this.storage.set('messages', this.messages);

  }

  async loadMessages() {
    // this.storage.clear();
    this.messages = await this.storage.get('messages') || [];
    console.log('load messages', this.messages);
    return this.messages;
  }

  async getMessages() {
    await this.loadMessages();
    return [...this.messages];
  }
}

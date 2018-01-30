import {MessageService} from '../../_services/message.service';
import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css']
})
export class MessagesComponent implements OnInit {

  title = 'Messages';

  constructor(public messageService: MessageService) {}

  ngOnInit() {
  }

}

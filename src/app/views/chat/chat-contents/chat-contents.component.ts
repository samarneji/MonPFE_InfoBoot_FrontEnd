import { Component, OnInit, ViewChild, ViewChildren, Input, OnDestroy } from '@angular/core';
import { PerfectScrollbarDirective } from 'ngx-perfect-scrollbar';
import { ChatService, User } from '../chat.service';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { SharedAnimations } from 'src/app/shared/animations/shared-animations';

@Component({
  selector: 'app-chat-contents',
  templateUrl: './chat-contents.component.html',
  styleUrls: ['./chat-contents.component.scss'],
  animations: [SharedAnimations]
})
export class ChatContentsComponent implements OnInit, OnDestroy {
  user: User = new User();
  activeConversation: any = null;
  public messagesList: any[] = [];
  newMessage: String = '';

  userUpdateSub: Subscription;
  chatUpdateSub: Subscription;
  chatSelectSub: Subscription;

  @Input('matSidenav') matSidenav;
  @ViewChild(PerfectScrollbarDirective) psContainer: PerfectScrollbarDirective;

  @ViewChildren('msgInput') msgInput;
  @ViewChild('msgForm') msgForm: NgForm;

  constructor(public chatService: ChatService) {}

  ngOnInit(): void {
    this.loadConversations();

    // Listen for chat updates
    this.chatUpdateSub = this.chatService.onChatsUpdated.subscribe(conversation => {
      if (!conversation) { return; }
      this.activeConversation = conversation;
      this.chatService.getChatByConversation(conversation.id).subscribe(res => {
        this.messagesList = res;
        this.messagesList.forEach(message => {
          if (message.response_type === 'file') {
            message.text = `<a  href="${message.text}" download="${message.file_name}">Voici le document recherché:  ${message.file_name}</a>`;
          }
        });
        console.log('from sub', res);
        console.log('this.messagesList', this.messagesList);
      }, err => {
        console.log(err);
      });
      this.scrollToBottom();
    });
  }

  loadConversations(): void {
    this.chatService.getListOfConversations().subscribe(data => {
      this.activeConversation = data;
    });
  }

  ngOnDestroy() {
    if ( this.userUpdateSub ) { this.userUpdateSub.unsubscribe(); }
    if ( this.chatSelectSub ) { this.chatSelectSub.unsubscribe(); }
    if ( this.chatUpdateSub ) { this.chatUpdateSub.unsubscribe(); }
  }



  sendMessage(): void {
    if (this.newMessage.trim() && this.activeConversation?.id !== null) {
      const userMessage = this.newMessage.valueOf();
      this.chatService.sendMessage(this.activeConversation.id, userMessage).subscribe(response => {
        // Ajouter le message de l'utilisateur
        this.messagesList.push({
          sender: 'user',
          text: userMessage,
          created_at: new Date()
        });
        console.log(response.response, response.response_type);

        // Ajouter la réponse du bot
        if (response.response_type === 'file') {
          const fileResponse = response;
          this.messagesList.push({
            sender: 'bot',
            text: `<a href="${fileResponse.response}" download="${fileResponse.file_name}" >Voici le document recherché:   ${fileResponse.file_name}</a>`,
            created_at: new Date()
          });
        } else {
          const botResponse = response;
          this.messagesList.push({
            sender: 'bot',
            text: botResponse.response,
            created_at: new Date()
          });
        }

        this.newMessage = '';
        this.scrollToBottom();
        this.chatService.getChatByConversation(this.activeConversation.id); // Mettre à jour la conversation
      });
    }
  }
  initMsgForm() {
    setTimeout(() => {
      this.msgForm.reset();
      this.msgInput.first.nativeElement.focus();
      this.scrollToBottom();
    });
  }

  scrollToBottom() {
    setTimeout(() => {
      this.psContainer.update();
      this.psContainer.scrollToBottom(0, 400);
    });
  }
}

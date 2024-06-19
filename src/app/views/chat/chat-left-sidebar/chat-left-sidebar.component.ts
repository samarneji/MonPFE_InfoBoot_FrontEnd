import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ChatService } from '../chat.service';

@Component({
  selector: 'app-chat-left-sidebar',
  templateUrl: './chat-left-sidebar.component.html',
  styleUrls: ['./chat-left-sidebar.component.scss']
})
export class ChatLeftSidebarComponent implements OnInit {

  loadDataSub: Subscription;

  listOfConversations: any[] = [];
  messagesList: any[] = [];
  activeConversation: any | null = null;
  newMessage: String = '';
  conversationToEdit: any | null = null;
  private chatUpdateSub: Subscription;
  constructor(private chatService: ChatService) {}

  ngOnInit() {
    this.loadDataSub = this.chatService.getListOfConversations()
      .subscribe(listOfConversations => {
        this.listOfConversations = listOfConversations;
        console.log(listOfConversations);
      });
  }
  // tslint:disable-next-line:use-lifecycle-interface
  ngOnDestroy() {
    if ( this.loadDataSub ) { this.loadDataSub.unsubscribe(); }
  }

  getChatByConversation(conversationId) {
    this.chatService.onChatsUpdated.next(this.listOfConversations.find(elt => elt.id === conversationId));
  }
  createNewConversation(): void {
    const userId = 1; // Remplacez par l'ID utilisateur actuel
    this.chatService.createNewConversation(userId).subscribe(response => {
      const conversation = response.conversation;
      const defaultMessage = response.default_message;
      this.listOfConversations.push(conversation);
      this.activeConversation = conversation;
      this.messagesList = [defaultMessage];
    });
    this.chatService.onChatsUpdated.next(this.listOfConversations.find(elt => elt.id === this.activeConversation.id ));
  }

  goToEditConversationLabel(conversation) {
    this.conversationToEdit = conversation;
  }

  changeConversationLabel(): void {
    if (this.conversationToEdit) {
      this.chatService.updateConversationLabel(this.conversationToEdit.id, this.conversationToEdit.label)
          .subscribe(updatedConversation => {
            this.conversationToEdit = null;
          });
    }
  }
}

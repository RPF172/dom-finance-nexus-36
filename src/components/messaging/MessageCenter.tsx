import React, { useState, useEffect, useRef } from 'react';
import { Send, MoreVertical, Search, Phone, Video, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNow } from 'date-fns';

interface Message {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar?: string;
  content: string;
  timestamp: Date;
  type: 'text' | 'image' | 'system';
  read: boolean;
}

interface Conversation {
  id: string;
  participantId: string;
  participantName: string;
  participantAvatar?: string;
  lastMessage: string;
  lastMessageTime: Date;
  unreadCount: number;
  isOnline: boolean;
}

const MessageCenter: React.FC = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Mock conversations
    const mockConversations: Conversation[] = [
      {
        id: '1',
        participantId: '1',
        participantName: 'Sarah Johnson',
        participantAvatar: '/placeholder-avatar.jpg',
        lastMessage: 'Great job on completing the lesson!',
        lastMessageTime: new Date(Date.now() - 1000 * 60 * 15),
        unreadCount: 2,
        isOnline: true
      },
      {
        id: '2',
        participantId: '2',
        participantName: 'Mike Chen',
        lastMessage: 'Want to join the study group?',
        lastMessageTime: new Date(Date.now() - 1000 * 60 * 60 * 2),
        unreadCount: 0,
        isOnline: false
      },
      {
        id: '3',
        participantId: '3',
        participantName: 'Emma Wilson',
        lastMessage: 'Thanks for the help with the quiz!',
        lastMessageTime: new Date(Date.now() - 1000 * 60 * 60 * 6),
        unreadCount: 1,
        isOnline: true
      }
    ];

    setConversations(mockConversations);
  }, []);

  useEffect(() => {
    if (selectedConversation) {
      // Mock messages for selected conversation
      const mockMessages: Message[] = [
        {
          id: '1',
          senderId: selectedConversation === '1' ? '1' : '2',
          senderName: selectedConversation === '1' ? 'Sarah Johnson' : 'Mike Chen',
          content: 'Hey! How are you doing with the current lesson?',
          timestamp: new Date(Date.now() - 1000 * 60 * 30),
          type: 'text',
          read: true
        },
        {
          id: '2',
          senderId: 'me',
          senderName: 'You',
          content: 'Going well! Just finished the quiz section.',
          timestamp: new Date(Date.now() - 1000 * 60 * 25),
          type: 'text',
          read: true
        },
        {
          id: '3',
          senderId: selectedConversation === '1' ? '1' : '2',
          senderName: selectedConversation === '1' ? 'Sarah Johnson' : 'Mike Chen',
          content: 'Great job on completing the lesson!',
          timestamp: new Date(Date.now() - 1000 * 60 * 15),
          type: 'text',
          read: false
        }
      ];

      setMessages(mockMessages);
    }
  }, [selectedConversation]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = () => {
    if (!newMessage.trim() || !selectedConversation) return;

    const message: Message = {
      id: Date.now().toString(),
      senderId: 'me',
      senderName: 'You',
      content: newMessage.trim(),
      timestamp: new Date(),
      type: 'text',
      read: true
    };

    setMessages(prev => [...prev, message]);
    setNewMessage('');

    // Update conversation last message
    setConversations(prev => prev.map(conv => 
      conv.id === selectedConversation 
        ? { ...conv, lastMessage: message.content, lastMessageTime: message.timestamp }
        : conv
    ));
  };

  const filteredConversations = conversations.filter(conv =>
    conv.participantName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedConv = conversations.find(c => c.id === selectedConversation);

  return (
    <div className="flex h-[600px] border rounded-lg overflow-hidden bg-background">
      {/* Conversations List */}
      <div className="w-80 border-r bg-muted/30">
        <div className="p-4 border-b">
          <h2 className="text-lg font-semibold mb-3">Messages</h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        <ScrollArea className="flex-1">
          <div className="p-2">
            {filteredConversations.map((conversation) => (
              <div
                key={conversation.id}
                onClick={() => setSelectedConversation(conversation.id)}
                className={`p-3 rounded-lg cursor-pointer hover:bg-muted transition-colors ${
                  selectedConversation === conversation.id ? 'bg-primary/10' : ''
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={conversation.participantAvatar} />
                      <AvatarFallback>
                        {conversation.participantName[0]}
                      </AvatarFallback>
                    </Avatar>
                    {conversation.isOnline && (
                      <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 bg-green-500 rounded-full border-2 border-background" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="font-medium text-sm truncate">
                        {conversation.participantName}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formatDistanceToNow(conversation.lastMessageTime, { addSuffix: true })}
                      </p>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-muted-foreground truncate">
                        {conversation.lastMessage}
                      </p>
                      {conversation.unreadCount > 0 && (
                        <Badge variant="destructive" className="h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
                          {conversation.unreadCount}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {selectedConv ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b bg-background">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={selectedConv.participantAvatar} />
                      <AvatarFallback>{selectedConv.participantName[0]}</AvatarFallback>
                    </Avatar>
                    {selectedConv.isOnline && (
                      <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 bg-green-500 rounded-full border-2 border-background" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium">{selectedConv.participantName}</p>
                    <p className="text-sm text-muted-foreground">
                      {selectedConv.isOnline ? 'Online' : 'Last seen recently'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm">
                    <Phone className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Video className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Info className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Messages */}
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.senderId === 'me' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-[70%] ${message.senderId === 'me' ? 'order-2' : 'order-1'}`}>
                      {message.senderId !== 'me' && (
                        <div className="flex items-center gap-2 mb-1">
                          <Avatar className="h-6 w-6">
                            <AvatarImage src={selectedConv.participantAvatar} />
                            <AvatarFallback>{selectedConv.participantName[0]}</AvatarFallback>
                          </Avatar>
                          <p className="text-xs text-muted-foreground">
                            {message.senderName}
                          </p>
                        </div>
                      )}
                      <div
                        className={`p-3 rounded-lg ${
                          message.senderId === 'me'
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted'
                        }`}
                      >
                        <p className="text-sm">{message.content}</p>
                        <p className={`text-xs mt-1 ${
                          message.senderId === 'me' 
                            ? 'text-primary-foreground/70' 
                            : 'text-muted-foreground'
                        }`}>
                          {formatDistanceToNow(message.timestamp, { addSuffix: true })}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>

            {/* Message Input */}
            <div className="p-4 border-t bg-background">
              <div className="flex items-center gap-2">
                <Input
                  placeholder="Type a message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                  className="flex-1"
                />
                <Button onClick={sendMessage} disabled={!newMessage.trim()}>
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-muted-foreground">
            <div className="text-center">
              <h3 className="text-lg font-medium mb-2">Select a conversation</h3>
              <p className="text-sm">Choose from your existing conversations or start a new one</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MessageCenter;
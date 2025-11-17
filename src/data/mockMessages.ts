import type { MessageThread, Message } from '../types';

// モックデータ：メッセージスレッド一覧
export const mockThreads: MessageThread[] = [
  {
    id: 'thread-1',
    partnerId: 'user-company-1',
    partnerName: '山田 太郎',
    partnerCompanyName: '株式会社メディカルケア',
    partnerIconUrl: undefined,
    latestMessageContent: 'ご応募ありがとうございます。面接日程についてご相談させてください。',
    latestMessageTimestamp: new Date('2025-11-17T14:30:00'),
    unreadCount: 2,
    updatedAt: new Date('2025-11-17T14:30:00'),
  },
  {
    id: 'thread-2',
    partnerId: 'user-company-2',
    partnerName: '佐藤 花子',
    partnerCompanyName: '医療法人社団 健康会',
    partnerIconUrl: undefined,
    latestMessageContent: 'ご質問ありがとうございます。勤務時間については柔軟に対応可能です。',
    latestMessageTimestamp: new Date('2025-11-16T10:15:00'),
    unreadCount: 0,
    updatedAt: new Date('2025-11-16T10:15:00'),
  },
  {
    id: 'thread-3',
    partnerId: 'user-company-3',
    partnerName: '田中 一郎',
    partnerCompanyName: 'ケアプラス株式会社',
    partnerIconUrl: undefined,
    latestMessageContent: '承知いたしました。それでは来週火曜日14時でお願いします。',
    latestMessageTimestamp: new Date('2025-11-15T16:45:00'),
    unreadCount: 0,
    updatedAt: new Date('2025-11-15T16:45:00'),
  },
];

// モックデータ：メッセージ詳細（スレッド別）
export const mockMessages: Record<string, Message[]> = {
  'thread-1': [
    {
      id: 'msg-1-1',
      threadId: 'thread-1',
      senderId: 'user-company-1',
      content: 'この度はご応募いただきありがとうございます。書類選考の結果、面接にお進みいただくことになりました。',
      sentAt: new Date('2025-11-17T10:00:00'),
      readAt: new Date('2025-11-17T10:05:00'),
    },
    {
      id: 'msg-1-2',
      threadId: 'thread-1',
      senderId: 'current-user',
      content: 'ありがとうございます。ぜひよろしくお願いいたします。',
      sentAt: new Date('2025-11-17T10:10:00'),
      readAt: new Date('2025-11-17T10:12:00'),
    },
    {
      id: 'msg-1-3',
      threadId: 'thread-1',
      senderId: 'user-company-1',
      content: '面接日程についてご相談させてください。来週の火曜日か水曜日の14時以降でご都合はいかがでしょうか？',
      sentAt: new Date('2025-11-17T14:25:00'),
      readAt: null,
    },
    {
      id: 'msg-1-4',
      threadId: 'thread-1',
      senderId: 'user-company-1',
      content: '場所は本社会議室を予定しております。オンライン面接も可能ですので、ご希望があればお知らせください。',
      sentAt: new Date('2025-11-17T14:30:00'),
      readAt: null,
    },
  ],
  'thread-2': [
    {
      id: 'msg-2-1',
      threadId: 'thread-2',
      senderId: 'user-company-2',
      content: 'はじめまして。求人をご覧いただきありがとうございます。',
      sentAt: new Date('2025-11-15T09:00:00'),
      readAt: new Date('2025-11-15T09:30:00'),
    },
    {
      id: 'msg-2-2',
      threadId: 'thread-2',
      senderId: 'current-user',
      content: 'はじめまして。勤務時間について質問させていただきたいのですが、夜勤はありますでしょうか？',
      sentAt: new Date('2025-11-15T10:00:00'),
      readAt: new Date('2025-11-15T10:05:00'),
    },
    {
      id: 'msg-2-3',
      threadId: 'thread-2',
      senderId: 'user-company-2',
      content: 'ご質問ありがとうございます。当施設では日勤のみの勤務も可能です。シフトについては柔軟に対応させていただいております。',
      sentAt: new Date('2025-11-16T10:10:00'),
      readAt: new Date('2025-11-16T11:00:00'),
    },
    {
      id: 'msg-2-4',
      threadId: 'thread-2',
      senderId: 'current-user',
      content: 'ありがとうございます。それでは一度見学させていただくことは可能でしょうか？',
      sentAt: new Date('2025-11-16T10:15:00'),
      readAt: new Date('2025-11-16T10:20:00'),
    },
  ],
  'thread-3': [
    {
      id: 'msg-3-1',
      threadId: 'thread-3',
      senderId: 'user-company-3',
      content: 'キャリアシートを拝見しました。ぜひ一度お話しさせていただきたいです。',
      sentAt: new Date('2025-11-14T14:00:00'),
      readAt: new Date('2025-11-14T15:00:00'),
    },
    {
      id: 'msg-3-2',
      threadId: 'thread-3',
      senderId: 'current-user',
      content: 'ありがとうございます。来週でしたらいつでも大丈夫です。',
      sentAt: new Date('2025-11-14T16:00:00'),
      readAt: new Date('2025-11-14T16:30:00'),
    },
    {
      id: 'msg-3-3',
      threadId: 'thread-3',
      senderId: 'user-company-3',
      content: 'それでは来週火曜日の14時にオンラインでお願いできますでしょうか？',
      sentAt: new Date('2025-11-15T10:00:00'),
      readAt: new Date('2025-11-15T10:30:00'),
    },
    {
      id: 'msg-3-4',
      threadId: 'thread-3',
      senderId: 'current-user',
      content: '承知いたしました。それでは来週火曜日14時でお願いします。',
      sentAt: new Date('2025-11-15T16:45:00'),
      readAt: new Date('2025-11-15T17:00:00'),
    },
  ],
};

// 現在のユーザーID（モック用）
export const CURRENT_USER_ID = 'current-user';


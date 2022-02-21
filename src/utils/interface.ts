export interface IMessageListProps {
  id: string;
  text: string;
  createdAt?: number;
  creatorId?: string;
  isOwner?: boolean;
}

export interface IMessageListProps {
  id: string;
  text: string;
  photoURL: string;
  createdAt?: number;
  creatorId?: string;
  isOwner?: boolean;
}

export interface IUserObjProps {
  userObj: any;
}

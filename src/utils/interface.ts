export interface IMessageListProps {
  id: string;
  text: string;
  photoURL: string;
  createdAt?: number | Date;
  creatorId?: string;
  isOwner?: boolean;
  userId: string;
  userImage: string;
}

export interface IUserObjProps {
  userObj: any;
}

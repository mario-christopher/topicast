export type AspectRatio = "1.91:1" | "1:1";
export type UserResponseStatus = "Started" | "Completed";
export type EthAddress = `0x${string}`;

export enum ButtonName {
  Prev = "Prev",
  Next = "Next",
  Link = "Link",
  Check = "Check",
  Resume = "Resume",
  Finish = "Finish"
}

export interface UserPrompt {
  prompt?: string;
  correctAnswers?: string[];
  allowCheckAnswer?: true;
}

export interface Frame {
  id: number;
  title: string;
  imageFileName: string;
  prompt?: UserPrompt;
  externalUrl?: string;
}

export interface Topic {
  name: string;
  createdDate: Date;
  imageAspectRatio: AspectRatio;
  frames: Frame[];
}

export interface Topics {
  [name: string]: Topic;
}

export interface TopicState {
  fid: number;
  castId: number;
  requesterCustodyAddress: EthAddress;
  userName: string;
  displayName: string;
  topicName: string;
  startDateTime: Date;
  status: UserResponseStatus;
  endDateTime?: Date;
  itemResponse?: {
    [frame: number]: string;
  }
}

export interface AppState {
  frame: number;
}
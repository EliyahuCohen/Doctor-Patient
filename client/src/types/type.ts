export interface Register {
  fName: string;
  lName: string;
  email: string;
  password: string;
  role: number;
  speciality: string;
  location: string;
  isMale: boolean;
}
export interface Login {
  email: string;
  password: string;
}
export interface User {
  _id: string;
  fName: string;
  lName: string;
  email: string;
  password: string;
  role: number;
  speciality: string;
  location: string;
  approved: boolean;
  isMale: boolean;
  meetingAmount: number;
  listOfDoctors: string[];
  listOfPatients: string[];
  meetings: string[];
  live: boolean;
  createdAt: string;
  messages: IAlert[];
}
export interface IMessage {
  senderName: string;
  message: string;
  id: string;
  type: "MESSAGE" | "SYSTEM" | "DELETE";
  time: 2000 | 3000 | 4000 | 5000;
}

export interface IAlert {
  message: string;
  type: 1 | 2 | 3;
}

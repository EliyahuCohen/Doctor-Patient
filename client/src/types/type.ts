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
  sender: string;
  message: string;
  type: "MESSAGE" | "SYSTEM" | "DELETE";
}

export interface IAlert {
  message: string;
  type: 1 | 2 | 3;
}

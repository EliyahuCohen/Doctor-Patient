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
  senderId: string;
  senderName: string;
  message: string;
  id: string;
  type:
    | "MESSAGE"
    | "SYSTEM"
    | "DELETE"
    | "DARK"
    | "NIGHT"
    | "AFTERNOON"
    | "OVERDATE";
  time: 2000 | 3000 | 4000 | 5000;
}

export interface IAlert {
  message: string;
  type: 1 | 2 | 3;
}
export enum stage {
  ALL,
  DOCTORS,
  PATIENTS,
}
export interface ITimeSpan {
  startTime: 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18 | 19;
  endTime: 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18 | 19;
}
export interface Schedule {
  day: 1 | 2 | 3 | 4 | 5 | 6;
  times: ITimeSpan[];
}
export interface ScheduleDay {
  schedule: Schedule;
  day: string;
}

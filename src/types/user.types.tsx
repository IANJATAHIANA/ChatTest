export interface IUser{
    idUser: number,
    FirstName: string,
    LastName: string,
    Pseudo: string,
    Email?: string,
    Password: string,
    Birth: Date,
    Sex: string,
    Status: boolean
}
export type IUserCreation = Omit<IUser, "idUser">;

export interface ILogin {
  Email: string;
  Password: string;
}

export interface ILoginResponse {
  idUser: number;
  token: string;
}
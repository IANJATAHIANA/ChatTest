import axios from "axios";
import type { IUser } from "../types/user.types";
import type { ILogin, ILoginResponse } from "../types/user.types";

const API_URL = 'http://localhost:3006/api/user';

export const getUsers = () => {
    return axios.get(API_URL);
}

export const getUserById = (idUser: number) => {
    return axios.get(`${API_URL}/${idUser}`);
}

export const createUser = (data: IUser) => {
    return axios.post(API_URL, data);
}

export const updateUser = (idUser: number, data: IUser) => {
    return axios.put(`${API_URL}/${idUser}`, data);
}

export const deleteUser = (idUser: number) => {
    return axios.delete(`${API_URL}/${idUser}`);
}

export const loginUser = (data: ILogin): Promise<ILoginResponse> => {
  return axios.post(`${API_URL}/login`, data).then(res => res.data);
};
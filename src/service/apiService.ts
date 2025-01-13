import http from "./httpService";
interface loginReq {
  email: string;
  password: string;
}

interface signreq {
  email: string;
  password: string;
  name: string,
  mobile: string,
}

type AddUserPayload = 
  | { email: string }
  | { mobile: string };




export function userLogin(data: loginReq) {
  return http.post(`/login`, data);
}

export function userSignup(data: signreq) {
  return http.post(`/register`, data);
}

export function verifyUser(token: string | null){
  return http.patch(`/verify?token=${token}`);
}

export function getReceivers() {
  return http.get(`/users/receivers`);
}

export function Chats(sender: string, receiver: string) {
  return http.get(`/chats/${sender}/${receiver}`);
}

export function addUser(data: AddUserPayload){
return http.post(`/users/receivers`, data)
}

export function upload(data:any ){
    return http.post(`/upload`, data)
}



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

export interface MenuResponse {
  data: [
    {
      _id: string;
      name: string;
      category: string;
      price: number;
      availability: boolean;
    }
  ];
  meta: {
    totalItems: number;
    totalPages: number;
    currentPage: number;
    itemsPerPage: number;
    previousPage: number | null;
    nextPage: number | null;
  };
}
interface MenuReq {
  name: string,
  category: string;
  price: number;
  availability: boolean;
}

interface createOrderReq {
  items: {
    menuItemId: string;
    quantity: number;
  }[]; // Changed from tuple to array
}

export function userLogin(data: loginReq) {
  return http.post(`/login`, data);
}

export function userSignup(data: signreq) {
  return http.post(`/register`, data);
}

export function verifyUser(token: string | null){
  return http.patch(`/verify?token=${token}`);
}

export function menu(page: number, limit: number) {
  return http.get(`/menu?page=${page}&limit=${limit}`);
}

export function createMenu(data: MenuReq) {
  return http.post("/menu", data);
}

export function updateMenu(data: MenuReq, id:string){
return http.put(`/menu/${id}`, data)
}

export function deleteMenu(id: string){
    return http.delete(`/menu/${id}`)
}

export function searchMenu(page: number, limit: number, query: string, category: string){
  return http.get(`/menu/search?page=${page}&limit=${limit}&query=${query}&category=${category}`)
}

export function createOrder(data: createOrderReq){
  return http.post(`/order`,data);
}

export function orderHistory(page: number, limit: number){
  return http.get(`/orders?page=${page}}&limit=${limit}`);
}


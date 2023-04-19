import axios from "axios";


export const Api = axios.create({
  baseURL: "https://Backend-J3M3-21.silva248.repl.co/"
  }  
);


if(typeof window !== 'undefined'
){
  loadToken()
}

export function loadToken(){

  Api.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem('token')}`

}
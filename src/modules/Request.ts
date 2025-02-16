import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";
import { ElMessage } from "element-plus";

const baseUrl = "http://localhost:5235/Api";

axios.defaults.baseURL = baseUrl;

export function createCancelToken(){
  return axios.CancelToken.source();
}

export async function RequestAsync(url:string,type:string,data:any,headers:Record<string,any>){
  const option:Record<string,any> = {};
  if(data!=null)
    option.data = data;
  option.url = url;
  option.headers = headers;
  option.method = type;
  return (await axios.request(option)).data;
}

const defaultFailCallback = (error:AxiosError)=>{
  ElMessage({
    message:error.message,
    type:"error"
  });
}

export interface Result{
    message?:string,
    ok?:boolean,
    data?:any
}

export function Request(url:string,type:string,data:any,headers:Record<string,any>,successCallback:(response:AxiosResponse)=>void
    ,failCallback=defaultFailCallback){
  const option:Record<string,any> = {};
  if(data!=null)
    option.data = data;
  option.url = url;
  option.headers = headers;
  option.method = type;
  axios.request(option).then(successCallback).catch(failCallback);
}

export async function GetAsync(url:string, config:AxiosRequestConfig) {
  return (await axios.get(url, config)).data;
}

export async function PostAsync(url:string,data:any,config:AxiosRequestConfig){
    return (await axios.post(url,data,config)).data;
}

export async function PutAsync(url:string,data:any,config:AxiosRequestConfig){
  return  (await axios.put(url,data,config)).data;
}

export async function DeleteAsync(url:string,config:AxiosRequestConfig)
{
  return (await axios.delete(url, config)).data;
}

export async function PatchAsync(url:string,data:any,config:AxiosRequestConfig){
  return  (await axios.patch(url,data,config)).data;
}


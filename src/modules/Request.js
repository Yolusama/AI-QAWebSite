import axios from "axios";
import { ElMessage } from "element-plus";

const baseUrl = "http://localhost:5235/Api";

axios.defaults.baseURL = baseUrl;

class RequestOption{
  constructor(url,headers,method){
    this.url = url;
    this.headers = headers;
    this.method = method;
  }
}

export async function RequestAsync(url,type,data,headers){
  const option = new RequestOption();
  if(data!=null)
    option.data = data;
  option.url = url;
  option.headers = headers;
  option.method = type;
  return (await axios.request(option)).data;
}

const defaultFailCallback = error=>{
  ElMessage({
    message:error.message,
    type:"error"
  });
}

export function Request(url,type,data,headers,successCallback,failCallback=defaultFailCallback){
  const option = new RequestOption();
  if(data!=null)
    option.data = data;
  option.url = url;
  option.headers = headers;
  option.method = type;
  axios.request(option).then(successCallback).catch(failCallback);
}

export async function GetAsync(url, config) {
  return (await axios.get(url, config)).data;
}
export async function PostAsync(url,data,config){
    return (await axios.post(url,data,config)).data;
}
export async function PutAsync(url,data,config){
  return  (await axios.put(url,data,config)).data;
}
export async function DeleteAsync(url,config)
{
  return (await axios.delete(url, config)).data;
}
export async function PatchAsync(url,data,config){
  return  (await axios.patch(url,data,config)).data;
}
export async function HeadAsync(url,config){
  return (await axios.head(url,config)).data;
}


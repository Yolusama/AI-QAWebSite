import axios from "axios";

const baseUrl = "http://localhost:5225/Api";

axios.defaults.baseURL = baseUrl;

class RequestOption{
  constructor(url,headers,method){
    this.url = url;
    this.headers = headers;
    this.method = method;
  }
}

export function imgSrc(sourceName)
{
  return `http://localhost:5225/img/${sourceName}`;
}

export async function request(url,type,data,headers){
  const option = new RequestOption();
  if(data!=null)
    option.data = data;
  option.url = url;
  option.headers = headers;
  option.method = type;
  return (await axios.request(option)).data;
}

export async function Get(url, config) {
  return (await axios.get(url, config)).data;
}
export async function Post(url,data,config){
    return (await axios.post(url,data,config)).data;
}
export async function Put(url,data,config){
  return  (await axios.put(url,data,config)).data;
}
export async function Delete(url,config)
{
  return (await axios.delete(url, config)).data;
}
export async function Patch(url,data,config){
  return  (await axios.patch(url,data,config)).data;
}
export async function Head(url,config){
  return (await axios.head(url,config)).data;
}


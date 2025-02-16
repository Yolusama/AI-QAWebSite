import { api } from "./Api";
import { ElMessage } from "element-plus";
import axios, { AxiosError, CancelToken } from "axios";
import { Result } from "@/modules/Request";
import { ChatMessage } from "@/modules/Common";

export function Chat(messages:ChatMessage[],useSearch:boolean,model:string,cancelToken:CancelToken,
    successCallback:(result:Result)=>void,failCallback:(error:AxiosError)=>void){
    const data = {
        messages:messages,
        useSearch:useSearch,
        model:model
    };
    axios.post("/Chat/Communicate",data,{
      cancelToken:cancelToken
    }).then(response=>{
        const res = response.data;
        if(!res.ok){
         ElMessage({
             message:res.message,
             type:"error"
         });
         return;
        }
        successCallback({message:res.message,data:res.data});
     }).catch(failCallback);
}

export function GetHeadMessageId(successCallback:(result:Result)=>void){
    api.get("/Chat/GenHeadMessageId",{},successCallback);
}
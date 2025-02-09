import { Get } from "./Api";
import { ElMessage } from "element-plus";
import axios from "axios";

export function Chat(messages,useSearch,model,cancelToken,successCallback,failCallback){
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

export function GetHeadMessageId(successCallback){
    Get("/Chat/GenHeadMessageId",{},successCallback);
}
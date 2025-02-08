import { Request, RequestAsync } from "@/modules/Request";
import { ElMessage } from "element-plus";

async function asyncApiTemplate(url, headers, type, data, successCallback = null, failCallback = null) {
    const res = await RequestAsync(url, type, data, headers);
    if (!res.ok) {
        ElMessage({
            message: res.message,
            type: "error"
        });
        if (failCallback != null)
            failCallback();
        return;
    }
    if (successCallback != null)
        successCallback({message:res.message,data:res.data});
}

export async function GetAsync(url, headers, successCallback = null, failCallback = null) {
    await asyncApiTemplate(url, headers, "GET", null, successCallback, failCallback);
}

export async function PostAsync(url, headers, data, successCallback = null, failCallback = null) {
    await asyncApiTemplate(url, headers, "POST", data, successCallback, failCallback);
}

export async function DeleteAsync(url, headers, successCallback = null, failCallback = null) {
    await asyncApiTemplate(url, headers, "DELETE", null, successCallback, failCallback);
}

export async function HeadAsync(url, headers, successCallback = null, failCallback = null) {
    await asyncApiTemplate(url, headers, "HEAD", null, successCallback, failCallback);
}

export async function PutAsync(url, headers, data, successCallback = null, failCallback = null) {
    await asyncApiTemplate(url, headers, "PUT", data, successCallback, failCallback);
}

export async function PatchAsync(url, headers, data, successCallback = null, failCallback = null) {
    await asyncApiTemplate(url, headers, "PATCH", data, successCallback, failCallback);
}

function apiTemplate(url,headers,type,data, successCallback = null, failCallback = null){
    Request(url,type,data,headers,response=>{
        const res = response.data;
        if(!res.ok){
            ElMessage({
                message:res.message,
                type:"error"
            });
            if(failCallback!=null)
                failCallback();
            return;
        }
        if(successCallback!=null)
            successCallback({message:res.message,data:res.data});
    });
}

export function Get(url, headers, successCallback = null, failCallback = null) {
    apiTemplate(url, headers, "GET", null, successCallback, failCallback);
}

export function Post(url, headers, data, successCallback = null, failCallback = null) {
    apiTemplate(url, headers, "POST", data, successCallback, failCallback);
}

export function Delete(url, headers, successCallback = null, failCallback = null) {
    apiTemplate(url, headers, "DELETE", null, successCallback, failCallback);
}

export function Head(url, headers, successCallback = null, failCallback = null) {
    apiTemplate(url, headers, "HEAD", null, successCallback, failCallback);
}

export function Put(url, headers, data, successCallback = null, failCallback = null) {
    apiTemplate(url, headers, "PUT", data, successCallback, failCallback);
}

export function Patch(url, headers, data, successCallback = null, failCallback = null) {
    apiTemplate(url, headers, "PATCH", data, successCallback, failCallback);
}





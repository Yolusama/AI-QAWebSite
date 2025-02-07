import { request } from "@/modules/Request";
import stateStroge from "@/modules/StateStorage";
import { ElMessage } from "element-plus";

async function apiTemplate(url, headers, type, data, successCallback = null, failCallback = null) {
    const res = await request(url, type, data, headers);
    if (!res.succeeded) {
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

export async function Get(url, headers, successCallback = null, failCallback = null) {
    await apiTemplate(url, headers, "GET", null, successCallback, failCallback);
}

export async function Post(url, headers, data, successCallback = null, failCallback = null) {
    await apiTemplate(url, headers, "POST", data, successCallback, failCallback);
}

export async function Delete(url, headers, successCallback = null, failCallback = null) {
    await apiTemplate(url, headers, "DELETE", null, successCallback, failCallback);
}

export async function Head(url, headers, successCallback = null, failCallback = null) {
    await apiTemplate(url, headers, "HEAD", null, successCallback, failCallback);
}

export async function Put(url, headers, data, successCallback = null, failCallback = null) {
    await apiTemplate(url, headers, "PUT", data, successCallback, failCallback);
}

export async function Patch(url, headers, data, successCallback = null, failCallback = null) {
    await apiTemplate(url, headers, "PATCH", data, successCallback, failCallback);
}

export function authorization(isFormData = false){
const user = stateStroge.get("user");
const token = user.token;
if (!isFormData)
    return {
        token: token
    }
else
    return {
        ContentType: "multipart/form-data",
        token: token
    }
}




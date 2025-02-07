import { authorization, Get, Put } from "./Api";
import { Get as DirectGet } from "@/modules/Request";

export const VersionCode = "ICP13412594123GD";

export async function GetVersions(pagination, queryKey, year, type, successCallback) {
    await Get(`/Admin/GetVersions?page=${pagination.current}&pageSize=${pagination.size}&queryKey=${queryKey}&` +
        `year=${year}&type=${type}`, authorization(), successCallback
    );
}

export async function Publish(version, userId, successCallback) {
    await Put(`/Version/Publish/${userId}`, authorization(), version, successCallback);
}

export async function Download(fileName) {
    const headers = authorization();
    const res = await DirectGet(`/Version/Download/${fileName}`, {
        responseType: "blob",
        headers: headers
    });
    const anchor = document.createElement('a');
    anchor.href = URL.createObjectURL(res);
    anchor.download = fileName;
    anchor.target = "blank";
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
}

import { Get, Post } from "./Api";

export function Chat(messages,useSearch,successCallback){
    Post("/Chat/Communicate",{},{
        messages:messages,
        useSearch:useSearch
    },successCallback);
}

export function GetHeadMessageId(successCallback){
    Get("/Chat/GenHeadMessageId",{},successCallback);
}
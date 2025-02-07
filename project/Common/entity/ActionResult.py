import json

from django.http import JsonResponse

class ActionResult():
    def __init__(self,message,ok,data):
        self.message = message
        self.ok = ok
        self.data = data

class ActionResultEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, ActionResult):
            return obj.__dict__  # 或者使用 obj.to_dict()
        return super().default(obj)

def response(result):
    res = JsonResponse(data=result,safe=False,encoder=ActionResultEncoder)
    res.charset = "utf-8"
    return res

def make_result(message,ok):
        return ActionResult(message,ok,{})

def make_data_result(message,ok,data):
        return ActionResult(message,ok,data)
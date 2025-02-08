import random

from openai import OpenAI

class AICorrespondent:
   def __init__(self):
     api_key = "sk-0e6584f5a8d64a64b5273ca85dd7dc19"
     base_url = "https://api.deepseek.com/v1"
     self.client =OpenAI(
           base_url= base_url,
           api_key = api_key
     )
   def transport(self,messages,use_search,model):
     response = self.client.chat.completions.create(
           model = model,
           messages = messages
       )
     return response.choices[0].message.content

ai = AICorrespondent()


def random_head_message_id():
    bound = 9
    res = "H"
    count = random.randint(bound,11)
    for i in range(1,count):
        res += str(random.randint(0,bound))
    return res


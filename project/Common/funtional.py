from openai import OpenAI

class AICorrespondent:
   def __init__(self):
     api_key = "sk-0e6584f5a8d64a64b5273ca85dd7dc19"
     base_url = "https://api.deepseek.com/v1"
     self.model = "deepseek-chat"
     self.client =OpenAI(
           base_url= base_url,
           api_key = api_key
     )
   def transport(self,messages):
     response = self.client.chat.completions.create(
           model = self.model,
           messages = messages
       )
     return response.choices[0].message.content

ai = AICorrespondent()

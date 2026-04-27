import dotenv from "dotenv";

dotenv.config();
import { ChatGoogle } from "@langchain/google";


export const model=new ChatGoogle({
     model: "gemini-2.5-flash-lite",
     
     apiKey:process.env.GEMINI_API_KEY
});


export async function testAI(){
  model.invoke("What is the capital of India?").then((response)=>{
    console.log(response.text)
  })


}




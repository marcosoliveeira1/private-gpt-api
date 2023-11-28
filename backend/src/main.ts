import express, { Request, Response } from 'express';
import cors from 'cors';
import { ChatOllama } from "langchain/chat_models/ollama";
import { ChatPromptTemplate } from "langchain/prompts";


import { StringOutputParser } from "langchain/schema/output_parser";



const app = express();
const port = 3001;

app.use(express.json());

app.use(cors({
    origin: 'https://chat.oliveira.software',
}))

app.post('/', (req, res) => {
    res.json({ message: 'Hello, World!' });
});


app.post('/question', async (req: Request, res: Response) => {

    const { messages }: { messages: { role: string; content: string }[] } = req.body;

    let { content } = messages.pop() ?? {};


    if (!content) {
        return res.status(400).json({ error: 'messages is required.' });
    }

    let prompts: { input: string; output: string }[] = [];


    const prompt = ChatPromptTemplate.fromMessages(messages.map((message) => ([
        message.role,
        message.content
    ])));

    const model = new ChatOllama({
        baseUrl: "http://llm:11434",
        model: "llama2-uncensored:7b"
    });

    const stream = await model
        .pipe(new StringOutputParser())
        .stream(content || "");

    res.writeHead(200, { 'Content-Type': 'application/json' });

    for await (const chunk of stream) {
        console.log(chunk);
        res.write(chunk);
    }

    res.end();

});


app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

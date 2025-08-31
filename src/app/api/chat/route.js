import { NextResponse } from "next/server";
import { OpenAI } from "openai";

const client = new OpenAI({
  baseURL: "https://router.huggingface.co/v1",
  apiKey: process.env.NEXT_PUBLIC_HF_TOKEN,
});

export async function POST(req) {
  try {
    const { message } = await req.json();

    const completion = await client.chat.completions.create({
      model: "openai/gpt-oss-20b:together",
      messages: [{ role: "user", content: message }],
    });

    return NextResponse.json({ response: completion.choices[0].message.content });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ response: "❌ Failed to get a response." }, { status: 500 });
  }
}

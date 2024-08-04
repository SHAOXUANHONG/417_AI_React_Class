import openai from "@/services/openai";

export async function POST(req) {
    const body = await req.json();
    // console.log("body:", body);
    const { base64 } = body;
    // TODO: 透過base64讓AI辨識圖片
    // 文件連結：https://platform.openai.com/docs/guides/vision?lang=node
    const systemPrompt = `請用繁體中文根據傳入的圖片說明圖片內容`;
    const propmpt = [
        {
            type: "image_url",
            image_url: {
                url: base64
            }
        }
    ];

    const openAIReqBody = {
        messages: [
            { "role": "system", "content": systemPrompt },
            { "role": "user", "content": propmpt }
        ],
        model: "gpt-4o",
    };
    const completion = await openai.chat.completions.create(openAIReqBody);
    console.log("completion:", completion.choices[0].message);
    const result = completion.choices[0].message;

    return Response.json({ result });
}
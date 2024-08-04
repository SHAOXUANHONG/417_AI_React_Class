"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { faImage } from "@fortawesome/free-solid-svg-icons"
import CurrentFileIndicator from "@/components/CurrentFileIndicator";
import PageHeader from "@/components/PageHeader";
import GeneratorButton from "@/components/GenerateButton";
import ImageGenCard from "@/components/ImageGenCard";
import ImageGenPlaceholder from "@/components/ImageGenPlaceholder";

export default function ImgGen() {
    const [userInput, setUserInput] = useState("");

    const [ImageGenList, setImageGenList] = useState([]);

    // 是否在等待回應
    const [isWaiting, setIsWaiting] = useState(false);

    useEffect(() => {
        setIsWaiting(true);
        axios.get("/api/image-ai")
            .then(res => {
                setIsWaiting(false);
                setImageGenList(res.data);
            })
            .catch(err => {
                setIsWaiting(false);
            })
    }, [])

    function submitHandler(e) {
        e.preventDefault();
        console.log("User Input: ", userInput);
        const body = { userInput };
        console.log("body:", body);

        // 清空輸入資料
        setUserInput("");
        setIsWaiting(true);

        // 將body POST到 /api/image-ai { userInput: "" }
        axios
            .post("/api/image-ai", body)
            .then(res => {
                console.log("res", res);
                setIsWaiting(false);
                setImageGenList([res.data, ...ImageGenList]);
            })
            .catch(err => {
                console.log("err", err);
                setIsWaiting(false);
            });

    }

    return (
        <>
            <CurrentFileIndicator filePath="/app/image-generator/page.js" />
            <PageHeader title="AI Image Generator" icon={faImage} />
            <section>
                <div className="container mx-auto">
                    <form onSubmit={submitHandler}>
                        <div className="flex">
                            <div className="w-4/5 px-2">
                                <input
                                    value={userInput}
                                    onChange={(e) => setUserInput(e.target.value)}
                                    type="text"
                                    className="border-2 focus:border-pink-500 w-full block p-3 rounded-lg"
                                    placeholder="Enter a word or phrase"
                                    required
                                />
                            </div>
                            <div className="w-1/5 px-2">
                                <GeneratorButton />
                            </div>
                        </div>
                    </form>
                </div>
            </section>
            <section>
                <div className="container mx-auto">
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 py-8">
                        {isWaiting ? <ImageGenPlaceholder /> : null}
                        {
                            ImageGenList.map(ImageGenList => {
                                const { imageURL, prompt, createdAt } = ImageGenList;
                                return <ImageGenCard key={createdAt} imageURL={imageURL} prompt={prompt} />
                            })
                        }
                    </div>

                </div>
            </section>
        </>
    )
}
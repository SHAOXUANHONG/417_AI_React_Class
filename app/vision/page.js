"use client";

import { useState } from "react";
import axios from "axios";
import CurrentFileIndicator from "@/components/CurrentFileIndicator";
import PageHeader from "@/components/PageHeader";
import { faEye, faSpinner } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";


export default function Vision() {
    // 是否在等待回應
    const [isWaiting, setIsWaiting] = useState(false);

    const [result, setResult] = useState("");

    function changeHandler(e) {
        // TODO: 將使用者上傳的圖片轉換成base64 POST到 /api/vision-ai { base64: "" }
        console.log("檔案被改變了", e.target.files);
        const file = e.target.files[0];
        console.log(file);
        const fileReader = new FileReader();

        // 初始化
        setIsWaiting(true);
        setResult("")

        fileReader.onloadend = function () {
            const base64 = fileReader.result;

            axios
                .post("/api/vision-ai", { base64 })
                .then(res => {
                    setIsWaiting(false);
                    console.log("res", res.data);
                    setResult(res.data.result.content);
                })
                .catch(err => {
                    setIsWaiting(false);
                    console.log("err", err);
                });
        }
        fileReader.readAsDataURL(file);
    }

    return (
        <>
            <CurrentFileIndicator filePath="/app/vision/page.js" />
            <PageHeader title="AI Vision" icon={faEye} />
            <section>
                <div className="container mx-auto">
                    <label
                        htmlFor="imageUploader"
                        className="inline-block bg-amber-500 hover:bg-amber-600">
                        Upload Image
                    </label>
                    <input
                        className="hidden"
                        id="imageUploader"
                        type="file"
                        onChange={changeHandler}
                        accept=".jpg, .jpeg, .png"
                    />

                    {isWaiting ?
                        <>
                            <FontAwesomeIcon
                                icon={faSpinner}
                                className="fa-spin text-xl text-slate-600 mx-3"
                            />
                            <span>Loading...</span>
                        </>
                        : null
                    }

                    <textarea
                        className="border-2 block mt-2 h-[200px w-full p-2]"
                        value={result}
                        readOnly
                    ></textarea>
                </div>
            </section>
            <section>
                <div className="container mx-auto">
                    {/* TODO: 顯示AI輸出結果 */}

                </div>
            </section>
        </>
    )
}
"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { faImage } from "@fortawesome/free-solid-svg-icons";
import { faEarthAmericas } from "@fortawesome/free-solid-svg-icons";
import CurrentFileIndicator from "@/components/CurrentFileIndicator";
import PageHeader from "@/components/PageHeader";
import GeneratorButton from "@/components/GenerateButton";
import VocabGenResultCard from "@/components/VocabGenResultCard";
import VocabGenResultPlaceholder from "@/components/VocabGenResultPlaceholder";
import ImageGenCard from "@/components/ImageGenCard";
import ImageGenPlaceholder from "@/components/ImageGenPlaceholder";


export default function Home() {
  // 使用者輸入內容
  const [userInput, setUserInput] = useState("");
  // 下拉選單-語言選擇
  const [language, setLanguage] = useState("English");
  // 所有的單字生成結果清單
  const [vocabList, setVocabList] = useState([]);
  // 是否在等待回應
  const [isWaiting, setIsWaiting] = useState(false);

  // useEffect(函式, 綁定資料)
  useEffect(() => {
    setIsWaiting(true);
    // 當綁定的陣列是空，只有第一次render會執行
    console.log("跟後端要資料");
    axios.get("/api/vocab-ai")
      .then(res => {
        setIsWaiting(false);
        setVocabList(res.data);
      })
      .catch(err => {
        console.log("err:", err);
        alert("出錯了，請稍後再試");
        setIsWaiting(false);
      });
  }, [])

  function submitHandler(e) {
    e.preventDefault();
    console.log("User Input: ", userInput);
    console.log("Language: ", language);
    const body = { userInput, language };
    console.log("body:", body);
    // TODO: 將body POST到 /api/vocab-ai { userInput: "", language: "" }
    // 清空輸入框 && 設定正在等候
    setUserInput("");
    setIsWaiting(true);

    // 將body POST到 /api/vocab-ai { userInput: "", language: "" }
    axios
      .post("/api/vocab-ai", body)
      .then(res => {
        console.log("後端傳來的資料:", res.data);
        setIsWaiting(false);
        setVocabList([res.data, ...vocabList])
      })
      .catch(err => {
        console.log("err:", err);
        alert("出錯了，請稍後再試");
        setIsWaiting(false);
      });
  }

  return (
    <>
      <CurrentFileIndicator filePath="/app/page.js" />
      <PageHeader title="AI Vocabulary Generator" icon={faEarthAmericas} />
      <section>
        <div className="container mx-auto">
          <form onSubmit={submitHandler}>
            <div className="flex">
              <div className="w-3/5 px-2">
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
                <select
                  className="border-2 w-full block p-3 rounded-lg"
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  required
                >
                  <option value="English">English</option>
                  <option value="Japanese">Japanese</option>
                  <option value="Korean">Korean</option>
                  <option value="Spanish">Spanish</option>
                  <option value="French">French</option>
                  <option value="German">German</option>
                  <option value="Italian">Italian</option>
                </select>
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
          {/* 等待後端回應時要顯示的載入畫面 */}
          {isWaiting ? <VocabGenResultPlaceholder /> : null}
          {/* TODO: 顯示AI輸出結果 */}
          {vocabList.map(result => <VocabGenResultCard result={result} key={result.createdAt} />)}

          {/* TODO: 一張單字生成卡的範例，串接正式API後移除
          <VocabGenResultCard
            result={{
              title: "水果",
              payload: {
                wordList: ["Apple", "Banana", "Cherry", "Date", "Elderberry"],
                zhWordList: ["蘋果", "香蕉", "櫻桃", "棗子", "接骨木"],
              },
              language: "English",
              createdAt: new Date().getTime(),
            }}
          /> */}

        </div>
      </section>
    </>
  );
}

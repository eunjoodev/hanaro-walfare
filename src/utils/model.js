import * as tf from "@tensorflow/tfjs";
import supabase from "../supabase-client.js";

const keywordToVec = (keyword) => {
  const vector = new Array(128).fill(0);
  for (let i = 0; i < keyword.length; i++) {
    vector[i % 128] += keyword.charCodeAt(i);
  }
  return vector;
};

const articleToVec = (articleId) => {
  return new Array(128).fill(articleId % 128);
};

export const trainModel = async () => {
  const { data: keywordData, error: keywordError } = await supabase
    .from("search_keywords")
    .select("*");

  const { data: clickedData, error: clickError } = await supabase
    .from("click_data")
    .select("*");

  if (keywordError || clickError) {
    console.error("Error fetching data:", { keywordError, clickError });
    return null;
  }

  if (!keywordData.length || !clickedData.length) {
    console.warn("Not enough data for training. Check your dataset.");
    return null;
  }

  console.log(`Keyword Data Length: ${keywordData.length}`);
  console.log(`Clicked Data Length: ${clickedData.length}`);

  // 데이터 길이 일치 여부 확인
  if (keywordData.length !== clickedData.length) {
    console.error(
      "Mismatch in the number of samples between keywordData and clickedData",
    );
    return null;
  }

  const xs = tf.tensor(
    keywordData.map((keyword) => keywordToVec(keyword.keyword)),
  );
  const ys = tf.tensor(
    clickedData.map((article) => articleToVec(article.article_id)),
  );

  console.log(`xs shape: ${xs.shape}`); // 텐서 모양 확인
  console.log(`ys shape: ${ys.shape}`);

  const model = tf.sequential();
  model.add(
    tf.layers.dense({ units: 128, activation: "relu", inputShape: [128] }),
  );
  model.add(tf.layers.dense({ units: 64, activation: "relu" }));
  model.add(tf.layers.dense({ units: 128, activation: "softmax" }));

  model.compile({
    optimizer: "adam",
    loss: "categoricalCrossentropy",
    metrics: ["accuracy"],
  });

  await model.fit(xs, ys, {
    epochs: 10,
    callbacks: {
      onEpochEnd: (epoch, logs) => {
        console.log(`Epoch ${epoch}: loss = ${logs.loss}`);
      },
    },
  });

  return model;
};

export const recommendArticles = async (model, keyword) => {
  const keywordVec = keywordToVec(keyword);
  const pred = model.predict(tf.tensor([keywordVec]));
  const recommendedArticleVec = pred.arraySync()[0];

  const { data: articles, error } = await supabase
    .from("news")
    .select("*")
    .in("id", recommendedArticleVec);

  if (error) {
    console.error("Error fetching recommended articles:", error);
  }

  return articles || [];
};

import { defineRule, configure } from "vee-validate";
import { required, email, min, max } from "@vee-validate/rules";
import { localize } from "@vee-validate/i18n";
import ja from "@vee-validate/i18n/dist/locale/ja.json";

export default defineNuxtPlugin(() => {
  // ルールをグローバルに定義
  defineRule("required", required);
  defineRule("email", email);
  defineRule("min", min);
  defineRule("max", max);

  // エラーメッセージを日本語化
  configure({
    generateMessage: localize("ja", {
      messages: {
        // デフォルトの日本語メッセージを全て読み込む
        ...ja.messages,
        // 各ルールのメッセージを上書き
        required: "{field}を入力してください",
        email: "正しいメールアドレスの形式で入力してください",
        min: "{field}は{0}文字以上で入力してください",
        max: "{field}は{0}文字以内で入力してください",
      },
      names: {
        username: "ユーザーネーム",
        email: "メールアドレス",
        password: "パスワード",
        content: "投稿内容",
        comment: "コメント",
      },
    }),
  });
});

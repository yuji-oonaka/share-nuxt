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
    generateMessage: localize("ja", ja),
  });
});

# Fish Studio

網站設計與前端開發工作室的官網。

- 網址：https://fishtoyo.github.io/studio/（之後改為自訂網域）
- 技術：React 19、TypeScript、Vite、Tailwind CSS 4、Framer Motion、Swiper、Lenis

## 開發

```bash
npm install
npm run dev
```

## 修改內容

所有文案、作品、常見問題都集中在 `src/content.ts`，改字只需要改這個檔案。

## 發佈

push 到 `main` 後，GitHub Actions 會自動打包並發佈到 GitHub Pages。

## 綁定自訂網域

1. `vite.config.ts` 的 `base` 改成 `'/'`。
2. `index.html` 的 `og:image` 網址換成新網域。
3. 到 repo 的 Settings → Pages 設定 Custom domain，DNS 加上對應記錄，勾選 Enforce HTTPS。

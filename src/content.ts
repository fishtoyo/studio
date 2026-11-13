// 工作室頁面的所有文案與資料集中於此，改字只需改這個檔案

export const studio = {
  name: 'Fish Studio',
  tagline: 'One-Stop Digital Studio',
  // 聯絡資訊：留空的欄位不會顯示
  email: '',
  location: '台中・全台遠端合作',
  responseTime: '1 個工作天內回覆',
  responseNote: '（六日、國定假日除外）',
  // Web3Forms access key（https://web3forms.com 免費申請，填入 Email 即可取得）
  // 留空時表單為「預覽模式」，不會真的送出
  formAccessKey: '',
}

export const nav = [
  { id: 'card', label: '友善介面' },
  { id: 'services', label: '服務項目' },
  { id: 'works', label: '精選案例' },
  { id: 'pricing', label: '收費標準' },
  { id: 'process', label: '合作流程' },
  { id: 'about', label: '關於我們' },
  { id: 'faq', label: '常見問題' },
  { id: 'rescue', label: '網站救援' },
]

export const hero = {
  eyebrow: 'One-Stop Digital Studio',
  title: ['讓你的網站，', '開始幫你做生意。'],
  desc: '不只是做網站，更幫你把生意搬上線：預約、購物、會員一套系統幫你接單，再串起網站、APP 與 LINE，讓客人一直回來。',
  // 說明下方的三個重點
  points: [
    { icon: 'storefront', text: '品牌形象網站、購物會員與預約系統' },
    { icon: 'hub', text: '金流、LINE 官方帳號與社群一次串接' },
    { icon: 'support_agent', text: '上線後持續維護與優化' },
  ],
  primary: '免費諮詢',
  secondary: { label: '一條龍服務', href: '#services' },
  // 右側示意圖輪播順序（左側文案固定不動）
  visuals: ['build', 'support', 'products'] as HeroVisualType[],
}

// Hero 右側示意圖：網站與程式碼／客戶對話與合作紀錄／自有產品卡片牆
export type HeroVisualType = 'build' | 'support' | 'products'

// 一條龍服務：網站上線需要的每一段，都能交給同一個窗口
export const servicesHead = {
  title: '從網站到接單，一條龍全包辦',
  desc: '架網站只是第一步，金流、LINE、社群、網域主機都要串起來，客人才找得到你、買得到東西。這些我們一次規劃、一起完成，你只要專心經營生意。',
}

// 收費標準
// price 為數字字串時顯示「NT$ 金額」，其他文字（例如「討論後報價」）直接顯示
export const pricingHead = {
  title: '收費標準',
  desc: '想快速上線，可以選固定樣板方案，價格透明；需要特別的功能，就選客製化方案。原本的網站找不到人維護，也可以交給我們接手。',
  note: '以上價格皆未稅；網域、主機、金流手續費與簡訊等第三方費用依實際使用另計。',
}

export const pricing = [
  {
    name: '小資經營方案',
    tagline: '建立品牌門面，輕鬆開店',
    price: '6,999',
    desc: '適合美髮、美甲、美睫、按摩等預約制店家，客人線上選時段，店家自動收到通知。',
    features: ['品牌形象頁面', '線上預約與時段管理', '預約成功與提醒訊息通知', '手機、電腦都好操作', '精選樣板，不含額外客製功能'],
    badge: '快速上線',
    featured: false,
  },
  {
    name: '商品販售方案',
    tagline: '會員、購物車、金流一次搞定',
    price: '16,999',
    desc: '適合販售商品的品牌與小店，從上架、下單到收款都在同一個網站完成。',
    features: ['商品上架與分類管理', '會員註冊與訂單查詢', '購物車與線上金流', '訂單通知與後台管理', '精選樣板，不含額外客製功能'],
    badge: '快速上線',
    featured: true,
  },
  {
    name: '客製化方案',
    tagline: '依你的需求量身打造',
    price: '討論後報價',
    desc: '固定樣板不夠用？功能、流程與版面都依需求規劃，打造專屬於你的系統。',
    features: ['專屬版面設計', '預約、購物、會員自由組合', '金流、LINE 與第三方系統串接', '上線後持續維護'],
    badge: '完全客製',
    featured: false,
  },
]

// 網站救援：原服務商不處理、聯絡不上或停業的網站，接手整理與修改
export const rescue = {
  eyebrow: 'Website Rescue',
  title: ['網站還好好的，', '卻找不到人維護？'],
  desc: '不用整個砍掉重做。我們可以接手你現有的網站，幫你整理、修改，讓它繼續幫你做生意。',
  price: '依項目個別報價',
  cta: '找我們接手',
  // 主要狀況：放在四張常見狀況的正中央浮動
  highlight: { icon: 'devices', title: '技術、版型太舊', desc: '想改成響應式版型，符合現代人手一機的瀏覽操作，手機也能順利操作！' },
  // 常見狀況
  cases: [
    { icon: 'block', title: '服務商不願意調整', desc: '想改個文字、換張圖，對方卻說做不到或不處理。' },
    { icon: 'phone_disabled', title: '原廠商聯絡不上', desc: '電話不接、信不回，網站出問題也沒人管。' },
    { icon: 'domain_disabled', title: '原廠商已經停業', desc: '公司收掉了，網站卻還在跑，不知道能撐多久。' },
    { icon: 'key_off', title: '帳號都在別人手上', desc: '主機、網域、後台帳號不在自己手裡，不知道從何下手。' },
  ],
  // 可以處理的項目
  services: ['接手既有網站', '內容與版面修改', '錯誤修正與速度優化', '主機、網域搬家', '後續維護'],
}

export const services = [
  {
    icon: 'palette',
    title: '品牌網站設計',
    desc: '依品牌調性規劃架構與視覺，形象官網、活動頁、購物網站都能做，手機電腦都好看，客人看完就想聯絡你。',
    tags: ['形象官網', '購物網站', 'RWD'],
  },
  {
    icon: 'credit_card',
    title: '金流與電商串接',
    desc: '串接綠界、藍新等金流，信用卡、ATM、超商代碼都能收；購物車、會員、訂單管理一次建好，網站直接就能接單收款。',
    tags: ['線上刷卡', '超商付款', '訂單管理'],
  },
  {
    icon: 'chat',
    title: 'LINE 官方帳號',
    desc: '協助開通與設定官方帳號，規劃圖文選單、歡迎訊息與自動回覆，並和網站互相導流，讓客人加好友後就能預約、詢問、回購。',
    tags: ['圖文選單', '自動回覆', 'LINE 登入'],
  },
  {
    icon: 'share',
    title: '社群整合',
    desc: 'Facebook、Instagram 粉專建置與網站串接，設定分享預覽圖、Meta Pixel 與 Google Analytics，社群流量導得進來、成效看得見。',
    tags: ['FB／IG', '分享預覽', '數據追蹤'],
  },
  {
    icon: 'dns',
    title: '網域主機與上線',
    desc: '網域註冊、主機、SSL 安全憑證、公司信箱與 Google 商家一次處理，帳號都登記在你名下，不用自己研究一堆設定。',
    tags: ['網域', 'SSL', 'Google 商家'],
  },
  {
    icon: 'trending_up',
    title: '維護與持續優化',
    desc: '上線後的內容更新、功能擴充、SEO 與速度優化，可依月或依需求彈性合作，有固定窗口隨時找得到人。',
    tags: ['內容更新', 'SEO', '功能擴充'],
  },
]

/* ---------------- 跨裝置操作：手機（客人）／平板（店家）／電腦（萬用），點按鈕切換 ---------------- */
export type DeviceId = 'phone' | 'tablet' | 'desktop'

export const webCard = {
  cta: '免費諮詢',
  devices: [
    {
      id: 'phone' as DeviceId,
      label: '手機',
      icon: 'smartphone',
      role: '給你的客人',
      title: '手機版，',
      accent: '隨時隨地預約下單',
      desc: '客人在通勤、排隊的空檔，打開手機就能瀏覽商品、預約時段、下單付款。用 LINE 登入免註冊，購物車與訂單紀錄隨時查得到。',
      tags: ['線上預約', '一鍵下單', '線上付款', 'LINE 登入', '訂單查詢'],
    },
    {
      id: 'tablet' as DeviceId,
      label: '平板',
      icon: 'tablet_mac',
      role: '給店家老闆',
      title: '平板版，',
      accent: '店裡管理更順手',
      desc: '在櫃台或倉庫拿起平板，就能查看今日訂單、更新庫存、確認預約名單。不用守在電腦前，現場有狀況也能馬上處理。',
      tags: ['庫存管理', '訂單出貨', '預約名單', '會員資料', '即時通知'],
    },
    {
      id: 'desktop' as DeviceId,
      label: '電腦',
      icon: 'desktop_windows',
      role: '萬用的工作台',
      title: '電腦版，',
      accent: '大畫面操作最舒適',
      desc: '大螢幕一次看清楚所有內容：客人逛商品更舒服，店家上架商品、看營業報表、處理大量資料也最有效率。',
      tags: ['完整瀏覽', '商品上架', '營業報表', '批次處理', '數據分析'],
    },
  ],
}

export type WorkStatus = 'live' | 'beta' | 'soon'

export interface Work {
  title: string
  category: string
  desc: string
  tech: string[]
  status: WorkStatus
  link?: string
  cover?: string        // 有截圖時填入路徑，例如 /assets/studio/vocab-hero.png
  coverTone: string     // 無截圖時使用的封面漸層
  coverIcon: string     // 無截圖時顯示的圖示（Material Symbols 名稱）
}

export const works: Work[] = [
  {
    title: '單字英雄 WordHero',
    category: 'English Learning Game',
    desc: '把背單字變成闖關遊戲：學生挑戰老師設計的關卡，老師在後台出題、查看成績。',
    tech: ['Vue 3', 'Vite', 'PHP', 'MySQL'],
    status: 'live',
    link: 'https://www.wordhero.tw/',
    coverTone: 'linear-gradient(135deg, #f59e0b 0%, #f97316 50%, #ef4444 100%)',
    coverIcon: 'school',
  },
  {
    title: '物忘我 ItemsHere',
    category: 'iOS Home Organizer App',
    desc: '用「空間＋可移動收納箱」記錄物品放在哪裡，掃 QR Code 免開箱就能看到箱內物品，備品存量一目了然。',
    tech: ['SwiftUI', 'SwiftData', 'QR Code'],
    status: 'soon',
    coverTone: 'linear-gradient(135deg, #10b981 0%, #14b8a6 50%, #0ea5e9 100%)',
    coverIcon: 'inventory_2',
  },
  {
    title: 'Wave EIP',
    category: 'Enterprise Portal',
    desc: '中小企業內部入口網站：請假加班線上簽核、行事曆、專案工作、薪資計算，以及離職與留職停薪交接。',
    tech: ['Vue 3', 'NestJS', 'PostgreSQL', 'Docker'],
    status: 'beta',
    coverTone: 'linear-gradient(135deg, #1e3a8a 0%, #2563eb 50%, #38bdf8 100%)',
    coverIcon: 'apartment',
  },
  {
    title: 'Fishness',
    category: 'Fitness Tracker PWA',
    desc: '記錄體重、體脂等身體數值與體態照片的健身 App，趨勢圖與訓練月曆一眼看出變化，可加入手機主畫面使用。',
    tech: ['Nuxt', 'Vue', 'Supabase', 'PWA', 'Chart.js'],
    status: 'live',
    coverTone: 'linear-gradient(135deg, #0e0f12 0%, #1a1c21 50%, #4d6b0c 100%)',
    coverIcon: 'monitor_weight',
  },
  {
    title: 'EngIsle 英文單字學習島',
    category: 'iOS English Learning App',
    desc: '自己建立單字庫、為每個單字錄下發音，再用選擇題與拼字測驗複習生疏的單字，資料只存在手機裡。',
    tech: ['SwiftUI', 'iOS'],
    status: 'soon',
    coverTone: 'linear-gradient(135deg, #0891b2 0%, #06b6d4 50%, #67e8f9 100%)',
    coverIcon: 'translate',
  },
  {
    title: 'GO繳租',
    category: 'Rent Payment Web App',
    desc: '房東收租、房客繳租的線上服務介面：房東管理租約與帳務，房客查看繳租明細與積分。',
    tech: ['Next.js', 'React', 'Chakra UI'],
    status: 'soon',
    coverTone: 'linear-gradient(135deg, #7c3aed 0%, #a855f7 50%, #f472b6 100%)',
    coverIcon: 'real_estate_agent',
  },
  {
    title: 'NPC 小村',
    category: 'Three.js Experiment',
    desc: '完全用程式即時組出的 Q 版 3D 角色，不載入任何模型或圖片，會眨眼、說話，還有各自的特殊動作。',
    tech: ['Three.js', 'JavaScript'],
    status: 'live',
    link: 'https://fishtoyo.github.io/npc-village/',
    coverTone: 'linear-gradient(135deg, #fb7185 0%, #f9a8d4 50%, #fde68a 100%)',
    coverIcon: 'toys',
  },
]

export const statusLabel: Record<WorkStatus, string> = {
  live: '已上線',
  beta: '測試中',
  soon: '即將推出',
}

export const process = [
  { icon: 'forum', title: '需求訪談', desc: '了解你的生意、目標客群與預算，確認線上要做到哪些事。' },
  { icon: 'request_quote', title: '整體規劃', desc: '網站、金流、LINE、社群一次規劃，提出完整架構與明確報價。' },
  { icon: 'draw', title: '設計製作', desc: '設計與開發同步進行，階段性提供預覽連結，隨時看得到進度。' },
  { icon: 'fact_check', title: '串接測試', desc: '金流、LINE、表單與各裝置逐項實測，確認每個環節都順。' },
  { icon: 'rocket_launch', title: '持續陪伴', desc: '協助上線與帳號交接，保固期內問題修正，之後持續優化。' },
]

export const about = {
  title: '專業技術，負責任的態度',
  paragraphs: [
    'Fish Studio 是位於台中的網站工作室，累積 16 年網站實戰經驗，長期與品牌、設計公司及開發團隊合作。從品牌網站、預約與購物系統，到金流、LINE 官方帳號與網域主機，每一段都以扎實的技術完成。',
    '我們在意的不只是把網站做出來，而是做對、做穩：規劃時把做法與預算說清楚，製作時把關每個細節與速度，交付時附上完整原始碼與帳號。善用 AI 工具提升效率，品質依然一項一項確認，對交出去的成果負責。',
  ],
  // 工作室特色
  highlights: ['16 年網站經驗', '現代化技術', '品牌網站設計', '金流串接', 'LINE 官方帳號', '社群整合', '網域主機代辦', '原始碼完整交付', '保固與長期維護'],
  cta: { label: '免費諮詢', href: '#contact' },
}

export const faqs = [
  {
    q: '我什麼都還沒有，可以從零開始嗎？',
    a: '可以，這正是一條龍服務最適合的情況。從網域、網站、金流到 LINE 官方帳號與社群，我們會依你的生意規劃需要的項目，一步步帶你完成。',
  },
  {
    q: '網站做完後，還找得到人嗎？',
    a: '一定找得到。從洽談、製作到上線都是同一個窗口，不轉包；上線後一樣 1 個工作天內回覆，保固期內免費修正，之後也能長期合作維護。網站與各項帳號都登記在你名下，也不怕被綁住。',
  },
  {
    q: '金流帳號要自己申請嗎？',
    a: '金流商（如綠界、藍新）的帳號需要用你的公司或個人名義申請，款項才會直接進你的帳戶。我們會協助準備申請資料，並完成串接與實際付款測試。',
  },
  {
    q: '已經有網站了，可以只做金流、LINE 或社群嗎？',
    a: '可以。每一項服務都能單獨委託，我們會先評估現有網站的狀況，再建議最省事的做法。',
  },
  {
    q: '網站製作大概需要多久？',
    a: '一般形象官網約 3–6 週；含金流的購物網站會依商品與功能多寡另外評估。實際時程會在報價時明確列出。',
  },
  {
    q: '費用怎麼計算？',
    a: '依網站頁數、功能，以及需要的金流、LINE、社群等項目組合而定。填寫下方表單描述需求後，會提供免費初步評估與報價。',
  },
  {
    q: '用 AI 架的網站，品質會比較差嗎？',
    a: 'AI 負責加速提案與重複性的製作，最終的版面細節、響應式、跨瀏覽器與程式品質都由工程師逐一檢查調整，交付標準與傳統製作相同。',
  },
  {
    q: '上線後有問題怎麼辦？',
    a: '交付後提供保固期內的免費修正，之後也可依需求選擇單次或月約維護。網域、主機、金流等帳號都登記在你名下，隨時可以自己掌握。',
  },
]

export const contact = {
  title: '聊聊你的需求',
  desc: '想開一間線上小店、加上預約或購物功能，或是舊網站找不到人維護？告訴我們你的狀況，我們幫你挑選合適的方案與預算，諮詢完全免費。',
  // 左側合作特色列表（icon 為 Material Symbols 名稱）
  highlights: [
    { icon: 'schedule', title: '1 個工作天內回覆', note: '（六日、國定假日除外）', desc: '收到需求後將即時回覆，不讓你的需求空等。' },
    { icon: 'public', title: '全台遠端合作', desc: '線上會議與即時通訊，12 年遠端經驗，溝通零距離。' },
    { icon: 'deployed_code', title: '一條龍全包辦', desc: '網站、金流、LINE、社群一次整合，原始碼與帳號完整交付。' },
    { icon: 'build', title: '舊網站也能接手', desc: '原廠商不處理或聯絡不上的網站，也可以交給我們整理、修改。' },
  ],
  serviceOptions: ['一條龍全包', '品牌網站', '購物網站／金流', 'LINE 官方帳號', '社群整合', '網站改版', '維護合作', '其他'],
  // 方案與預算：先列出有固定價格的方案（名稱、價格直接取自 pricing，改價格會自動同步），再接預算區間
  budgetOptions: [
    '尚未確定',
    ...pricing.filter(p => /^[\d,]+$/.test(p.price)).map(p => `${p.name}（NT$${p.price}）`),
    '預算 5 萬以下',
    '預算 5–10 萬',
    '預算 10–20 萬',
    '預算 20 萬以上',
  ],
}

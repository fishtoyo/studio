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
  { id: 'ai', label: 'AI 快速架站' },
  { id: 'services', label: '一條龍服務' },
  { id: 'card', label: '網站類型' },
  { id: 'works', label: '精選作品' },
  { id: 'process', label: '合作流程' },
  { id: 'about', label: '關於我們' },
  { id: 'faq', label: '常見問題' },
]

export const hero = {
  eyebrow: 'One-Stop Digital Studio',
  title: ['從網站到金流，', '一個窗口全包辦。'],
  desc: '品牌網站設計、線上金流、LINE 官方帳號、社群串接到網域主機，不用分別找設計師、工程師和各家廠商。告訴我們你想做的生意，其他交給 Fish Studio 一次整合到好。',
  primary: '免費諮詢',
  secondary: '看看作品',
  // 右側示意圖上輪播切換的能力標籤（color 為 icon 顏色）
  badges: [
    { icon: 'palette', text: '品牌網站設計', color: '#0ea5e9' },
    { icon: 'credit_card', text: '金流串接', color: '#10b981' },
    { icon: 'chat', text: 'LINE 官方帳號', color: '#22c55e' },
    { icon: 'share', text: '社群整合', color: '#f43f5e' },
    { icon: 'auto_awesome', text: 'AI 快速架站', color: '#8b5cf6' },
    { icon: 'travel_explore', text: 'SEO 友善結構', color: '#f59e0b' },
  ],
}

export const stats = [
  { value: '1', unit: '個', label: '窗口從規劃到上線' },
  { value: '16', unit: '年', label: '主理人網站實戰經驗' },
  { value: '7', unit: '件', label: '自主開發產品' },
  { value: '12', unit: '年', label: '遠端協作經驗' },
]

// AI 快速架站（Hero 下方的優勢強調區）
export const aiBuild = {
  eyebrow: 'AI-Powered Website',
  title: 'AI 快速架站，',
  titleAccent: ['時間縮短、', '品質不打折。'], // 手機版會分成兩行
  desc: '結合 AI 工具加速版面提案與程式開發，再由 16 年經驗的工程師逐頁把關細節。讓你用更短的時程、更實在的預算，擁有專業又好維護的網站。',
  cta: '了解 AI 快速架站',
  // 時程比較（數字請依實際接案狀況調整）
  compare: {
    title: '一般形象網站製作時程',
    scaleWeeks: 6, // 進度條下方刻度：0 ～ 6 週（ratio 以此為滿格）
    traditional: { label: '傳統製作', value: '3–6 週', ratio: 1 },        // 6 / 6 週
    ai: { label: 'AI 快速架站', value: '最快 1–2 週', ratio: 2 / 6 },     // 2 / 6 週
  },
  features: [
    { icon: 'auto_awesome', title: 'AI 快速提案', desc: '短時間產出多種風格方向，先看到樣子再做決定。' },
    { icon: 'bolt', title: 'AI 加速開發', desc: '重複性的版面與程式由 AI 協助，大幅縮短製作時間。' },
    { icon: 'verified', title: '工程師人工把關', desc: 'RWD、跨瀏覽器、效能與 SEO 逐項人工檢查。' },
    { icon: 'savings', title: '省時也省預算', desc: '製作時數降低，同樣的預算能做更多頁面與功能。' },
  ],
}

// 一條龍服務：網站上線需要的每一段，都能交給同一個窗口
export const servicesHead = {
  title: '從網站到接單，一條龍全包辦',
  desc: '架網站只是第一步，金流、LINE、社群、網域主機都要串起來，客人才找得到你、買得到東西。這些我們一次規劃、一起完成，你只要專心經營生意。',
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

/* ---------------- 網站類型（各類型網站在不同裝置的呈現） ---------------- */
export type ShowcaseType = 'brand' | 'shop' | 'app'

export const webCard = {
  eyebrow: 'Responsive Website',
  // 左右輪播的網站類型：每一塊依序展示手機 → 平板 → 電腦，播完整塊滑到下一塊
  types: [
    {
      id: 'brand' as ShowcaseType,
      label: '形象網站',
      accent: '每個螢幕都好看',
      desc: '完整呈現品牌與服務，一鍵撥號、LINE、地圖導航，看完就能聯絡你。',
      audiences: ['中小企業', '個人工作室', '自由工作者', '講師／顧問', '設計師'],
      url: 'pinan.studio',
    },
    {
      id: 'shop' as ShowcaseType,
      label: '購物會員網站',
      accent: '隨時隨地都能下單',
      desc: '商品、購物車、會員與訂單一應俱全，串好線上金流，手機上也能順暢完成付款。',
      audiences: ['品牌電商', '選物店', '餐飲外帶', '課程販售', '會員制服務'],
      url: 'lumi.shop',
    },
    {
      id: 'app' as ShowcaseType,
      label: 'APP',
      accent: '會員服務帶著走',
      desc: '預約、會員卡與點數放進手機，可搭配 LINE 登入，再用電腦版後台管理。',
      audiences: ['美容美髮', '健身運動', '診所', '補習教育', '會員制店家'],
      url: 'bloom.app',
    },
  ],
  // 裝置畫面裡的示意網站（虛構範例）
  sample: {
    name: '品安個人工作室',
    logoIcon: 'chair',   // 示意 LOGO 圖示（室內設計）
    role: '室內設計師',
    url: 'pinan.studio',
    actions: [
      { icon: 'call', label: '撥打電話' },
      { icon: 'chat', label: 'LINE' },
      { icon: 'mail', label: 'Email' },
      { icon: 'map', label: '工作室' },
    ],
    links: ['作品集', '服務項目', '預約諮詢'],
  },
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
  { icon: 'rocket_launch', title: '上線陪跑', desc: '協助上線與帳號交接，保固期內問題修正，之後持續優化。' },
]

export const about = {
  title: '一個窗口，把線上生意整套做好',
  paragraphs: [
    'Fish Studio 是位於台中的一條龍網站工作室。從品牌網站設計、金流串接、LINE 官方帳號到社群與網域主機，網站上線需要的每一段都能交給我們。主理人 Fish 擁有 16 年網站實戰經驗，長期與品牌、設計公司及開發團隊合作。',
    '很多店家架網站時，要分別找設計、工程、金流和行銷，光溝通就耗掉大半力氣。我們把這些整合成同一個窗口：沒有層層轉包，結合 AI 工具加快製作，再逐一把關細節，讓你的網站上線就能開始接單。',
  ],
  // 工作室特色
  highlights: ['單一窗口', '品牌網站設計', '金流串接', 'LINE 官方帳號', '社群整合', '網域主機代辦', '原始碼完整交付', '保固與長期維護'],
  cta: { label: '免費諮詢', href: '#contact' },
}

export const faqs = [
  {
    q: '我什麼都還沒有，可以從零開始嗎？',
    a: '可以，這正是一條龍服務最適合的情況。從網域、網站、金流到 LINE 官方帳號與社群，我們會依你的生意規劃需要的項目，一步步帶你完成。',
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
    a: '一般形象官網約 3–6 週，選擇 AI 快速架站最快 1–2 週即可上線；含金流的購物網站會依商品與功能多寡另外評估。實際時程會在報價時明確列出。',
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
  title: '聊聊你的生意',
  desc: '不確定需要哪些服務也沒關係，告訴我們你想做什麼，我們幫你規劃整套做法與預算，諮詢完全免費。',
  // 左側合作特色列表（icon 為 Material Symbols 名稱）
  highlights: [
    { icon: 'schedule', title: '1 個工作天內回覆', note: '（六日、國定假日除外）', desc: '收到需求後將即時回覆，不讓你的需求空等。' },
    { icon: 'handshake', title: '台中可約面談', desc: '台中地區可安排實體會議，當面討論需求與細節。' },
    { icon: 'public', title: '全台遠端合作', desc: '線上會議與即時通訊，12 年遠端經驗，溝通零距離。' },
    { icon: 'deployed_code', title: '一條龍全包辦', desc: '網站、金流、LINE、社群一次整合，原始碼與帳號完整交付。' },
    { icon: 'verified_user', title: '保固與後續維護', desc: '上線後提供保固期修正，也可彈性安排長期維護。' },
  ],
  serviceOptions: ['一條龍全包', '品牌網站', '購物網站／金流', 'LINE 官方帳號', '社群整合', 'AI 快速架站', '網站改版', '維護合作', '其他'],
  budgetOptions: ['尚未確定', '5 萬以下', '5–10 萬', '10–20 萬', '20 萬以上'],
}

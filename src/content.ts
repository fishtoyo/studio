// 工作室頁面的所有文案與資料集中於此，改字只需改這個檔案

export const studio = {
  name: 'Fish Studio',
  tagline: 'Web Design & Front-end Studio',
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
  { id: 'services', label: '服務項目' },
  { id: 'card', label: '網站類型' },
  { id: 'works', label: '精選作品' },
  { id: 'process', label: '合作流程' },
  { id: 'about', label: '關於我們' },
  { id: 'faq', label: '常見問題' },
]

export const hero = {
  eyebrow: 'Web Design & Front-end Studio',
  title: ['把好的設計，', '做成好用的網站。'],
  desc: '從形象官網、設計稿 1:1 切版到前端互動開發，以 16 年實戰經驗，交付好看、好維護、跨裝置都穩定的網站。',
  primary: '洽談合作',
  secondary: '看看作品',
  // 右側示意圖上輪播切換的能力標籤（color 為 icon 顏色）
  badges: [
    { icon: 'check_circle', text: 'Pixel-Perfect 1:1', color: '#10b981' },
    { icon: 'auto_awesome', text: 'AI 快速架站', color: '#8b5cf6' },
    { icon: 'devices', text: 'RWD 響應式設計', color: '#0ea5e9' },
    { icon: 'speed', text: '效能優化', color: '#f59e0b' },
    { icon: 'travel_explore', text: 'SEO 友善結構', color: '#f43f5e' },
    { icon: 'language', text: '跨瀏覽器相容', color: '#6366f1' },
  ],
}

export const stats = [
  { value: '16', unit: '年', label: '主理人前端實戰經驗' },
  { value: '7', unit: '件', label: '自主開發產品' },
  { value: '12', unit: '年', label: '遠端協作經驗' },
  { value: '1:1', unit: '', label: '設計稿還原精準度' },
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

export const services = [
  {
    icon: 'web',
    title: '形象官網設計製作',
    desc: '從架構規劃、視覺設計到上線，打造符合品牌調性的企業官網與活動頁，讓第一眼印象就說服你的客戶。',
    tags: ['企業官網', '活動頁', 'Landing Page'],
  },
  {
    icon: 'design_services',
    title: '設計稿 1:1 切版',
    desc: 'Figma / PSD 精準轉為 HTML，RWD 響應式、跨瀏覽器，結構乾淨好接後端，適合設計公司與工程團隊外包合作。',
    tags: ['Figma', 'RWD', 'SCSS'],
  },
  {
    icon: 'code',
    title: '前端互動開發',
    desc: '以 React、Vue、TypeScript 開發元件化介面，搭配 GSAP 動態，兼顧體驗與效能，元件可重複使用、日後擴充更省力。',
    tags: ['React', 'Vue', 'GSAP'],
  },
  {
    icon: 'autorenew',
    title: '網站改版與優化',
    desc: '舊站翻新、手機版重整、載入速度與 SEO 基礎優化，保留原有內容與流量，讓既有網站重新變得好用。',
    tags: ['改版', '效能', 'SEO'],
  },
  {
    icon: 'build',
    title: '長期維護與合作',
    desc: '上線後的內容調整、功能擴充與問題排除，可依月或依需求彈性合作，有固定窗口隨時找得到人。',
    tags: ['維護', '擴充', '技術支援'],
  },
  {
    icon: 'handshake',
    title: '團隊前端外包',
    desc: '加入你的專案團隊，配合既有後端、版本控管與開發流程，遠端穩定交付，進度與溝通即時透明。',
    tags: ['遠端協作', 'Git', '後端串接'],
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
      desc: '商品、購物車、會員與訂單一應俱全，手機上也能順暢完成購買。',
      audiences: ['品牌電商', '選物店', '餐飲外帶', '課程販售', '會員制服務'],
      url: 'lumi.shop',
    },
    {
      id: 'app' as ShowcaseType,
      label: 'APP',
      accent: '會員服務帶著走',
      desc: '預約、會員卡與點數放進手機，再搭配電腦版管理後台。',
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
  { icon: 'forum', title: '需求訪談', desc: '了解目標、預算與時程，確認網站要解決的問題。' },
  { icon: 'request_quote', title: '規劃報價', desc: '提出頁面架構、功能範圍與明確報價，雙方確認後開工。' },
  { icon: 'draw', title: '設計／切版', desc: '依設計稿或共同討論的風格製作，階段性提供預覽連結。' },
  { icon: 'fact_check', title: '測試驗收', desc: '多裝置、多瀏覽器測試，依回饋調整至滿意。' },
  { icon: 'rocket_launch', title: '上線維護', desc: '協助上線部署，並提供保固期內的問題修正。' },
]

export const about = {
  title: '小而專精的網站工作室',
  paragraphs: [
    'Fish Studio 是位於台中的網站設計與前端開發工作室，專注於形象官網、設計稿切版與前端互動開發。主理人 Fish 擁有 16 年網站前端經驗，長期與品牌、設計公司及開發團隊遠端合作。',
    '我們相信好網站不只要好看，更要好用、好維護。結合 AI 工具加快製作節奏，再由工程師逐一把關每個細節；沒有層層轉包，從需求溝通、設計製作到上線維護，都由同一個窗口負責到底。',
  ],
  // 工作室特色（取代原本個人技能清單）
  highlights: ['單一窗口', 'AI 加速製作', '設計稿 1:1 還原', 'RWD 響應式', 'SEO 基礎優化', '原始碼完整交付', '保固與長期維護'],
  cta: { label: '洽談合作', href: '#contact' },
}

export const faqs = [
  {
    q: '用 AI 架的網站，品質會比較差嗎？',
    a: 'AI 負責加速提案與重複性的製作，最終的版面細節、響應式、跨瀏覽器與程式品質都由工程師逐一檢查調整，交付標準與傳統製作相同。',
  },
  {
    q: '網站製作大概需要多久？',
    a: '一般形象官網約 3–6 週，選擇 AI 快速架站最快 1–2 週即可上線；單純切版依頁數約 1–2 週。實際時程會在報價時依需求範圍明確列出。',
  },
  {
    q: '費用怎麼計算？',
    a: '依頁數、功能複雜度與是否需要設計而定。填寫下方表單描述需求後，會提供免費初步評估與報價。',
  },
  {
    q: '我只有想法、沒有設計稿可以嗎？',
    a: '可以。會先透過訪談與參考網站整理出風格方向，再進行版面設計，確認後才開始製作。',
  },
  {
    q: '可以只接切版或前端的部分嗎？',
    a: '可以，也非常歡迎設計公司、行銷公司與接案團隊合作，配合你們既有的流程與後端系統。',
  },
  {
    q: '上線後有問題怎麼辦？',
    a: '交付後提供保固期內的免費修正，之後也可依需求選擇單次或月約維護。',
  },
]

export const contact = {
  title: '聊聊你的專案',
  desc: '不論是全新網站、改版，或只是想先問問看，都歡迎留下需求，我們會即時回覆你。',
  // 左側合作特色列表（icon 為 Material Symbols 名稱）
  highlights: [
    { icon: 'schedule', title: '1 個工作天內回覆', note: '（六日、國定假日除外）', desc: '收到需求後將即時回覆，不讓你的需求空等。' },
    { icon: 'handshake', title: '台中可約面談', desc: '台中地區可安排實體會議，當面討論需求與細節。' },
    { icon: 'public', title: '全台遠端合作', desc: '線上會議與即時通訊，12 年遠端經驗，溝通零距離。' },
    { icon: 'deployed_code', title: '完整交付專案', desc: '從規劃、製作到上線一手包辦，原始碼完整交付。' },
    { icon: 'verified_user', title: '保固與後續維護', desc: '上線後提供保固期修正，也可彈性安排長期維護。' },
  ],
  serviceOptions: ['AI 快速架站', '形象官網', '設計稿切版', '前端開發', '網站改版', '維護合作', '其他'],
  budgetOptions: ['尚未確定', '5 萬以下', '5–10 萬', '10–20 萬', '20 萬以上'],
}

import { Fragment, useCallback, useEffect, useRef, useState, type ReactNode } from 'react'
import { motion, MotionConfig, AnimatePresence, useInView, animate } from 'framer-motion'
import {
  studio, nav, hero, type HeroVisualType, services, webCard, works, statusLabel, type DeviceId,
  process, about, faqs, contact, servicesHead, pricingHead, pricing, rescue, type Work,
} from './content'
import { ContactForm } from './components/ContactForm'
import { useSmoothScroll } from './useSmoothScroll'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Pagination, A11y } from 'swiper/modules'
import 'swiper/css'

// 全站共用的向右箭頭（以 Material arrow_forward 20px 為基準：橫線長度不變、上下斜線各縮短 2px）
// 所有「前往／了解更多」類的按鈕與連結都用這個，確保箭頭樣式一致
function ArrowRight({ className = '' }: { className?: string }) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      aria-hidden="true"
      className={`shrink-0 ${className}`}
    >
      {/* 橫線：約 13.3px */}
      <line x1="4.7" y1="10" x2="18" y2="10" />
      {/* 上下斜線：各約 7.4px（原 9.4px − 2px） */}
      <polyline points="12.75,4.75 18,10 12.75,15.25" strokeLinejoin="miter" />
    </svg>
  )
}

// 進場動畫：捲動到可視範圍時淡入上移
// 區塊進場動畫節奏：放慢、拉開項目間的間隔，避免急促感
const REVEAL_DURATION = 1.1   // 單一元素進場秒數
const REVEAL_STAGGER = 1.8    // 各處傳入的 delay 一律乘上此倍率，讓卡片依序出現的間隔更從容
const REVEAL_EASE = [0.16, 1, 0.3, 1] as const

function Reveal({ children, delay = 0, className = '' }: { children: ReactNode; delay?: number; className?: string }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: REVEAL_DURATION, delay: delay * REVEAL_STAGGER, ease: REVEAL_EASE }}
    >
      {children}
    </motion.div>
  )
}

function SectionHead({ eyebrow, title, desc, center = false }: { eyebrow: string; title: string; desc?: string; center?: boolean }) {
  return (
    <Reveal className={center ? 'mx-auto max-w-2xl text-center' : 'max-w-2xl'}>
      <p className="eyebrow">{eyebrow}</p>
      <h2 className="heading">{title}</h2>
      {desc && <p className="lead">{desc}</p>}
    </Reveal>
  )
}

function Logo() {
  return (
    // 「FISH」用履歷 logo 的圖（已裁掉右側名字），右邊兩行小字用 Quicksand 排出，大小與行距比照原 logo
    <a href="#top" className="flex shrink-0 items-center gap-1.5 text-[#0b1b2b]" aria-label={studio.name}>
      <img src={`${import.meta.env.BASE_URL}assets/logo-black.png`} alt="" width={75} height={27} className="block h-[27px] w-auto" />
      <span className="font-brand text-[14px] font-bold uppercase leading-[14px]" aria-hidden>
        <span className="block">Website</span>
        <span className="block">Studio</span>
      </span>
    </a>
  )
}

/* ---------------- Header ---------------- */
/**
 * 目前畫面所在的選單區塊（scroll spy）。
 * - 以 header 下方約 35% 畫面高度的位置當判斷線，最後一個越過判斷線的區塊即為目前區塊
 * - 點選單時立刻切到目標，並在平滑捲動抵達前暫停判斷，避免裝飾線一路掃過中間的項目
 */
const HEADER_H = 72
function useActiveSection(ids: string[]) {
  const [active, setActive] = useState<string | null>(null)
  const lockRef = useRef<{ id: string; from: number } | null>(null)

  useEffect(() => {
    // 聯絡區不在選單裡，但要納入判斷：捲到聯絡區時選單不應停留在「常見問題」
    const watch = [...ids, 'contact']
    const onScroll = () => {
      const lock = lockRef.current
      if (lock) {
        // 點擊瞬間瀏覽器會先原生跳到錨點、Lenis 再拉回來平滑捲動，所以前 200ms 的「已抵達」不算數
        const elapsed = performance.now() - lock.from
        const top = document.getElementById(lock.id)?.getBoundingClientRect().top ?? 0
        const arrived = Math.abs(top - HEADER_H) <= 2 && elapsed > 200
        if (!arrived && elapsed < 3000) return
        lockRef.current = null
      }
      const probe = HEADER_H + (window.innerHeight - HEADER_H) * 0.35
      // 取「已越過判斷線、且位置最下面」的區塊，不依陣列順序（聯絡區不在選單裡，卻排在網站救援前面）
      let current: string | null = null
      let best = -Infinity
      for (const id of watch) {
        const top = document.getElementById(id)?.getBoundingClientRect().top
        if (top !== undefined && top <= probe && top > best) { best = top; current = id }
      }
      setActive(current && ids.includes(current) ? current : null)
    }
    // 平滑捲動途中使用者自己滾動，就解除鎖定、改回依位置判斷
    const unlock = () => { lockRef.current = null }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    window.addEventListener('wheel', unlock, { passive: true })
    window.addEventListener('touchstart', unlock, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      window.removeEventListener('wheel', unlock)
      window.removeEventListener('touchstart', unlock)
    }
  }, [ids])

  const select = (id: string) => {
    lockRef.current = { id, from: performance.now() }
    setActive(id)
  }
  return [active, select] as const
}

const navIds = nav.map(n => n.id)

function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const [active, select] = useActiveSection(navIds)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 140)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <>
    {/* 漢堡選單打開時，後方頁面蓋一層霧面遮罩，選單與內容才分得清楚；點遮罩即關閉選單
        （放在 header 外面：header 有 backdrop-filter，fixed 子元素會被限制在 header 範圍內） */}
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-40 bg-ink/25 backdrop-blur-sm lg:hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          onClick={() => setOpen(false)}
          aria-hidden
        />
      )}
    </AnimatePresence>
    <header
      // 手機／平板（漢堡選單版型）一開始就是有底色的樣式；電腦版捲動超過 140px 才加上
      className={`fixed inset-x-0 top-0 z-50 bg-white/90 shadow-[0_1px_0_rgba(8,38,66,0.08),0_8px_24px_-12px_rgba(8,38,66,0.15)] backdrop-blur-md transition-all duration-300 ${
        scrolled || open ? '' : 'lg:bg-transparent lg:shadow-none lg:backdrop-blur-none'
      }`}
    >
      <div className="flex h-18 w-full items-center justify-between px-5">
        <Logo />

        <nav className="hidden items-center gap-6 lg:flex xl:gap-8" aria-label="主選單">
          {nav.map(n => {
            const isActive = active === n.id
            return (
              <a
                key={n.id}
                href={`#${n.id}`}
                onClick={() => select(n.id)}
                aria-current={isActive ? 'true' : undefined}
                className={`relative flex h-18 items-center whitespace-nowrap text-[17px] font-medium transition-colors duration-300 hover:text-brand ${isActive ? 'text-brand' : 'text-ink'}`}
              >
                {n.label}
                {/* 跟隨的裝飾線：貼齊 header 底邊、左右比文字各寬 3px；layoutId 讓線從上一個項目滑到目前項目 */}
                {isActive && (
                  <motion.span
                    layoutId="nav-underline"
                    className="absolute -inset-x-[3px] bottom-0 h-0.5 bg-brand"
                    transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                  />
                )}
              </a>
            )
          })}
          <a href="#contact" className="btn btn-sm btn-primary text-[16px]">預約諮詢</a>
        </nav>

        {/* 收合狀態：預約諮詢（小按鈕）直接放在漢堡選單旁邊，不用打開選單才看得到 */}
        <div className="flex items-center gap-1.5 lg:hidden">
          <a href="#contact" onClick={() => setOpen(false)} className="btn btn-sm btn-primary text-[16px]">預約諮詢</a>
          <button
            type="button"
            className="flex h-11 w-11 items-center justify-center rounded-full text-ink"
            aria-label={open ? '關閉選單' : '開啟選單'}
            aria-expanded={open}
            onClick={() => setOpen(o => !o)}
          >
            <span className="icon text-[28px]!">{open ? 'close' : 'menu'}</span>
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.nav
            className="overflow-hidden border-t border-line lg:hidden"
            initial={{ height: 0 }}
            animate={{ height: 'auto' }}
            exit={{ height: 0 }}
            aria-label="行動版選單"
          >
            {/* 各項目之間是滿版灰線；不留外層上下內距，每一格的高度（含第一格）都一樣 */}
            <div className="flex flex-col divide-y divide-line">
              {nav.map(n => (
                <a
                  key={n.id}
                  href={`#${n.id}`}
                  onClick={() => { select(n.id); setOpen(false) }}
                  aria-current={active === n.id ? 'true' : undefined}
                  className={`flex items-center justify-center py-3.5 text-[20px] font-medium transition-colors ${active === n.id ? 'text-brand' : 'text-ink'}`}
                >
                  <span className={`h-0.5 rounded-full bg-brand transition-all duration-300 ${active === n.id ? 'mr-3 w-5' : 'w-0'}`} />
                  {n.label}
                  {/* 右側放等寬的透明佔位，左邊出現短線時文字仍保持置中 */}
                  <span className={`h-0.5 transition-all duration-300 ${active === n.id ? 'ml-3 w-5' : 'w-0'}`} aria-hidden />
                </a>
              ))}
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
    </>
  )
}

/* ---------------- Hero ---------------- */
// Hero：左側文案固定，右側三張示意圖原地淡出淡入輪播（不左右滑動），自動播放，滑鼠移入時暫停
const HERO_SLIDE_MS = 7000
const HERO_EASE = [0.16, 1, 0.3, 1] as const

// 依目前是否為作用中的那一組，決定元素進場／退場（每次切到該組都重播進場動畫）
function useSlideReveal(active: boolean) {
  // 上一組先在 0.3 秒內淡出，新的一組再依序淡入
  return (delay = 0, from: { y?: number } = { y: 20 }) => ({
    initial: { opacity: 0, ...from },
    animate: active ? { opacity: 1, y: 0 } : { opacity: 0, ...from },
    transition: active
      ? { duration: 0.9, delay: 0.3 + delay, ease: HERO_EASE }
      // 淡出時原地消失，等完全透明後才把位置歸回起點，下次輪到時才能再往上浮現
      : { opacity: { duration: 0.3 }, y: { duration: 0, delay: 0.3 } },
  })
}

/* 第一張：電腦瀏覽器＋手機 RWD 畫面，兩邊同步播放：點網址列 → 逐字輸入網址 → 區塊閃過 loading 光暈 → 載入完成 */
const BROWSER_URL = 'www.your-brand.com.tw'
type BrowserPhase = 'idle' | 'pointing' | 'typing' | 'loading' | 'done'

function useBrowserSequence(active: boolean) {
  const [phase, setPhase] = useState<BrowserPhase>('idle')
  const [typed, setTyped] = useState(0)

  useEffect(() => {
    const timers: number[] = []
    const at = (ms: number, fn: () => void) => timers.push(window.setTimeout(fn, ms))
    if (!active) {
      // 等整張淡出後才歸零，避免看到畫面重置
      at(350, () => { setPhase('idle'); setTyped(0) })
    } else {
      const TYPE_START = 1900
      const TYPE_MS = 65
      at(700, () => setPhase('pointing'))                   // 游標移向網址列
      at(TYPE_START - 200, () => setPhase('typing'))        // 點擊，出現輸入游標
      for (let i = 1; i <= BROWSER_URL.length; i++) at(TYPE_START + i * TYPE_MS, () => setTyped(i))
      const typedEnd = TYPE_START + BROWSER_URL.length * TYPE_MS
      at(typedEnd + 250, () => setPhase('loading'))         // 按下 Enter，開始載入
      at(typedEnd + 2050, () => setPhase('done'))
    }
    return () => timers.forEach(clearTimeout)
  }, [active])

  return { phase, typed, focused: phase === 'typing', loading: phase === 'loading', loaded: phase === 'done' }
}
type BrowserState = ReturnType<typeof useBrowserSequence>

/* 網址列內容：鎖頭＋已輸入的網址＋閃爍的輸入游標 */
function AddressText({ st, className = '' }: { st: BrowserState; className?: string }) {
  return (
    <>
      {(st.typed > 0 || st.loading || st.loaded) && <span className="icon text-[1.1em]! text-muted">lock</span>}
      <span className={`truncate text-ink/80 ${className}`}>{BROWSER_URL.slice(0, st.typed)}</span>
      {st.focused && <span className="caret-blink -ml-1 h-[1.2em] w-px shrink-0 bg-ink" />}
    </>
  )
}

/* 網址列下方的載入進度條 */
function LoadBar({ st }: { st: BrowserState }) {
  return (
    <div className="h-0.5 overflow-hidden">
      <motion.div
        className="h-full bg-brand"
        initial={false}
        animate={{ width: st.loading ? '85%' : st.loaded ? '100%' : '0%', opacity: st.loaded ? 0 : 1 }}
        transition={{ width: { duration: st.loading ? 1.8 : 0.3, ease: 'easeOut' }, opacity: { duration: 0.4, delay: st.loaded ? 0.3 : 0 } }}
      />
    </div>
  )
}

/* 主視覺：載入完成後淡入品牌漸層 */
function HeroBanner({ st, className }: { st: BrowserState; className: string }) {
  return (
    <div className={`relative overflow-hidden bg-paper ${className} ${st.loading ? 'shimmer' : ''}`}>
      <motion.div
        className="absolute inset-0"
        style={{ background: 'linear-gradient(120deg,#066786,#28aad6)' }}
        initial={false}
        animate={{ opacity: st.loaded ? 1 : 0 }}
        transition={{ duration: st.loaded ? 0.6 : 0 }}
      />
    </div>
  )
}

/* 骨架區塊：載入中閃過光暈；dark 為標題列，載入完成後變深色 */
function Bone({ st, className, dark = false }: { st: BrowserState; className: string; dark?: boolean }) {
  const color = dark && st.loaded ? 'bg-ink/80' : className.includes('bg-') ? '' : 'bg-line'
  return <div className={`relative overflow-hidden transition-colors duration-500 ${color} ${className} ${st.loading ? 'shimmer' : ''}`} />
}

/* 電腦瀏覽器 */
function DesktopBrowser({ st }: { st: BrowserState }) {
  return (
    <div className="relative">
      <div className="flex items-center gap-2 border-b border-line px-5 py-3.5">
        <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
        <span className="h-3 w-3 rounded-full bg-[#febc2e]" />
        <span className="h-3 w-3 rounded-full bg-[#28c840]" />
        <div className={`ml-3 flex h-7 flex-1 items-center gap-1.5 rounded-md px-3 font-mono text-[13px] transition-all duration-300 ${st.focused ? 'bg-white ring-2 ring-brand/50' : 'bg-paper'}`}>
          <AddressText st={st} />
        </div>
      </div>
      <LoadBar st={st} />
      <div className="space-y-5 px-7 pb-7 pt-6.5">
        <HeroBanner st={st} className="h-36 rounded-2xl" />
        <Bone st={st} className="h-4 w-2/3 rounded" dark />
        <Bone st={st} className="h-3 w-full rounded" />
        <Bone st={st} className="h-3 w-5/6 rounded" />
        <div className="grid grid-cols-3 gap-4 pt-2">
          {[0, 1, 2].map(i => <Bone key={i} st={st} className="h-20 rounded-xl bg-paper" />)}
        </div>
      </div>

      {/* 滑鼠游標：從頁面中間移到網址列，點一下後淡出 */}
      <motion.svg
        viewBox="0 0 24 24"
        className="pointer-events-none absolute left-0 top-0 h-6 w-6 drop-shadow-md"
        initial={false}
        animate={
          st.phase === 'idle' ? { x: 220, y: 260, opacity: 0, scale: 1 }
          : st.phase === 'pointing' ? { x: 170, y: 26, opacity: 1, scale: 1 }
          : st.phase === 'typing' ? { x: 170, y: 26, opacity: [1, 1, 0], scale: [0.8, 1, 1] }
          : { x: 170, y: 26, opacity: 0, scale: 1 }
        }
        transition={
          st.phase === 'pointing' ? { duration: 0.9, ease: [0.4, 0, 0.2, 1] }
          : st.phase === 'typing' ? { duration: 0.9, times: [0, 0.2, 1] }
          : { duration: 0.2 }
        }
      >
        <path d="M5 3l14 8-6.5 1.5L9 19z" fill="#0d1f33" stroke="#fff" strokeWidth="1.5" strokeLinejoin="round" />
      </motion.svg>
    </div>
  )
}

/* 手機瀏覽器：同一個網站的 RWD 版面，用手指點擊取代滑鼠游標 */
function PhoneBrowser({ st }: { st: BrowserState }) {
  return (
    <div className="relative flex h-full flex-col overflow-hidden rounded-[1.9rem] bg-white">
      {/* 狀態列 */}
      <div className="flex items-center justify-between px-5 pb-1 pt-3 text-[11px] font-semibold">
        <span>9:41</span>
        <span className="h-4 w-16 rounded-full bg-[#0d1f33]" />
        <span className="flex items-center gap-1">
          <span className="icon text-[13px]!">signal_cellular_alt</span>
          <span className="icon text-[13px]!">battery_full</span>
        </span>
      </div>
      {/* 網址列 */}
      <div className="px-3 pb-2.5 pt-1.5">
        <div className={`flex h-8 items-center gap-1 rounded-full px-3.5 font-mono text-[11px] transition-all duration-300 ${st.focused ? 'bg-white ring-2 ring-brand/50' : 'bg-paper'}`}>
          <AddressText st={st} />
        </div>
      </div>
      <LoadBar st={st} />
      {/* 頁面內容（手機版：單欄、卡片兩欄） */}
      <div className="flex-1 space-y-3.5 px-4 pt-4">
        <HeroBanner st={st} className="h-28 rounded-xl" />
        <Bone st={st} className="h-3.5 w-3/4 rounded" dark />
        <Bone st={st} className="h-2.5 w-full rounded" />
        <Bone st={st} className="h-2.5 w-5/6 rounded" />
        <div className="grid grid-cols-2 gap-3 pt-1">
          {[0, 1, 2, 3].map(i => <Bone key={i} st={st} className="h-16 rounded-lg bg-paper" />)}
        </div>
      </div>
      <span className="mx-auto mb-2 mt-3 h-1 w-24 rounded-full bg-ink/80" />

      {/* 手指點擊：圓點移到網址列，按下時擴散一圈後消失 */}
      <motion.span
        className="pointer-events-none absolute left-0 top-0 h-9 w-9 rounded-full border-2 border-white bg-ink/25 shadow-lg"
        initial={false}
        animate={
          st.phase === 'idle' ? { x: 110, y: 300, opacity: 0, scale: 1 }
          : st.phase === 'pointing' ? { x: 110, y: 46, opacity: 1, scale: 1 }
          : st.phase === 'typing' ? { x: 110, y: 46, opacity: [1, 1, 0], scale: [0.75, 1.3, 1.6] }
          : { x: 110, y: 46, opacity: 0, scale: 1 }
        }
        transition={
          st.phase === 'pointing' ? { duration: 0.9, ease: [0.4, 0, 0.2, 1] }
          : st.phase === 'typing' ? { duration: 0.9, times: [0, 0.25, 1] }
          : { duration: 0.2 }
        }
      />
    </div>
  )
}

function HeroVisualBuild({ active }: { active: boolean }) {
  const reveal = useSlideReveal(active)
  const st = useBrowserSequence(active) // 電腦與手機共用同一個時間軸，動作完全同步
  return (
    <>
      <motion.div
        className="absolute left-0 top-4 w-[76%] overflow-hidden rounded-3xl border border-line bg-white shadow-[0_30px_60px_-25px_rgba(8,38,66,0.3)]"
        {...reveal(0.1, { y: 24 })}
      >
        <DesktopBrowser st={st} />
      </motion.div>

      <motion.div
        className="absolute bottom-0 right-0 aspect-[9/18.5] w-[31%] rounded-[2.4rem] bg-[#0d1f33] p-2 shadow-[0_40px_80px_-30px_rgba(8,38,66,0.55)]"
        {...reveal(0.3, { y: 24 })}
      >
        <PhoneBrowser st={st} />
      </motion.div>
    </>
  )
}

/* 第二張的對話視窗：客戶來訊（先顯示輸入中…）→ Fish 在下方輸入框打字回覆並送出 → 已讀 → 客戶再回覆 */
const CHAT_REPLY = '可以！我明天整理好做法和報價給你。'

function useChatSequence(active: boolean) {
  const [step, setStep] = useState(0)
  const [typed, setTyped] = useState(0)

  useEffect(() => {
    const timers: number[] = []
    const at = (ms: number, fn: () => void) => timers.push(window.setTimeout(fn, ms))
    if (!active) {
      at(350, () => { setStep(0); setTyped(0) })
    } else {
      const TYPE_START = 2300
      const TYPE_MS = 75
      const typedEnd = TYPE_START + CHAT_REPLY.length * TYPE_MS
      at(600, () => setStep(1))                  // 客戶輸入中…
      at(1500, () => setStep(2))                 // 客戶訊息出現
      at(TYPE_START - 150, () => setStep(3))     // Fish 點進輸入框
      for (let i = 1; i <= CHAT_REPLY.length; i++) at(TYPE_START + i * TYPE_MS, () => setTyped(i))
      at(typedEnd + 300, () => setStep(4))       // 送出
      at(typedEnd + 900, () => setStep(5))       // 已讀
      at(typedEnd + 1300, () => setStep(6))      // 客戶輸入中…
      at(typedEnd + 2100, () => setStep(7))      // 客戶回覆
    }
    return () => timers.forEach(clearTimeout)
  }, [active])

  return { step, typed }
}

/* 訊息泡泡：先佔好位置（透明），輪到時才淡入，版面不會跳動；typing 時在同一位置顯示「輸入中」三個點 */
function ChatBubble({ show, typing = false, mine = false, children }: { show: boolean; typing?: boolean; mine?: boolean; children: ReactNode }) {
  const bubble = mine
    ? 'rounded-2xl rounded-tr-sm bg-brand px-4 py-3 text-white'
    : 'rounded-2xl rounded-tl-sm bg-white px-4 py-3'
  return (
    <div className={`relative flex ${mine ? 'justify-end' : ''}`}>
      <motion.p
        className={`max-w-[80%] shadow-sm ${bubble}`}
        initial={false}
        animate={show ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 8, scale: 0.96 }}
        transition={{ duration: show ? 0.35 : 0, ease: HERO_EASE }}
        style={{ transformOrigin: mine ? 'right bottom' : 'left bottom' }}
      >
        {children}
      </motion.p>
      <AnimatePresence>
        {typing && (
          <motion.span
            className="absolute left-0 top-0 flex items-center gap-1 rounded-2xl rounded-tl-sm bg-white px-4 py-4 shadow-sm"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.1 } }}
          >
            {[0, 1, 2].map(i => <span key={i} className="typing-dot h-2 w-2 rounded-full bg-ink/40" style={{ animationDelay: `${i * 0.15}s` }} />)}
          </motion.span>
        )}
      </AnimatePresence>
    </div>
  )
}

function ChatWindow({ active }: { active: boolean }) {
  const { step, typed } = useChatSequence(active)
  const composing = step === 3
  const draft = composing ? CHAT_REPLY.slice(0, typed) : ''
  return (
    <>
      <div className="flex items-center gap-3 border-b border-line px-6 py-4">
        <span className="flex h-11 w-11 items-center justify-center rounded-full bg-brand font-display text-[18px] font-bold text-white">F</span>
        <div>
          <p className="text-[16px] font-bold">Fish Studio</p>
          <p className="flex items-center gap-1.5 text-[12px] text-muted">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />通常 1 個工作天內回覆
          </p>
        </div>
      </div>

      <div className="space-y-4 bg-paper/60 px-6 py-6 text-[15px] leading-relaxed">
        <ChatBubble show={step >= 2} typing={step === 1}>網站上線半年了，想加一個線上預約功能，可以嗎？</ChatBubble>
        <div>
          <ChatBubble show={step >= 4} mine>{CHAT_REPLY}</ChatBubble>
          <motion.p
            className="mt-1 text-right text-[11px] text-muted"
            initial={false}
            animate={{ opacity: step >= 5 ? 1 : 0 }}
            transition={{ duration: 0.3 }}
          >
            已讀 14:32
          </motion.p>
        </div>
        <ChatBubble show={step >= 7} typing={step === 6}>太好了，謝謝！</ChatBubble>
      </div>

      {/* 輸入框：Fish 在這裡打字回覆 */}
      <div className="flex items-center gap-3 border-t border-line px-5 py-3.5">
        <div className={`flex h-10 flex-1 items-center rounded-full px-4 text-[14px] transition-all duration-300 ${composing ? 'bg-white ring-2 ring-brand/40' : 'bg-paper'}`}>
          {draft
            ? <span className="truncate text-ink">{draft}</span>
            : !composing && <span className="text-muted/70">輸入訊息…</span>}
          {composing && <span className="caret-blink ml-px h-4 w-px shrink-0 bg-ink" />}
        </div>
        <motion.span
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-white"
          initial={false}
          animate={{
            backgroundColor: draft ? '#28aad6' : '#cbd5e1',
            scale: step === 4 ? [1, 0.85, 1] : 1,
          }}
          transition={{ duration: 0.3 }}
        >
          <span className="icon text-[20px]!">send</span>
        </motion.span>
      </div>
    </>
  )
}

/* 第二張：客戶詢問對話＋長期合作紀錄（示意） */
const supportTimeline = [
  { date: '2024.03', text: '品牌網站上線' },
  { date: '2024.09', text: '新增會員與購物車' },
  { date: '2025.02', text: '串接 LINE 官方帳號' },
  { date: '2025.08', text: '年度改版與 SEO 優化' },
]

function HeroVisualSupport({ active }: { active: boolean }) {
  const reveal = useSlideReveal(active)
  return (
    <>
      {/* 對話視窗 */}
      <motion.div
        className="absolute left-0 top-4 w-[62%] overflow-hidden rounded-3xl border border-line bg-white shadow-[0_30px_60px_-25px_rgba(8,38,66,0.3)]"
        {...reveal(0.1, { y: 24 })}
      >
        <ChatWindow active={active} />
      </motion.div>

      {/* 合作紀錄 */}
      <motion.div
        className="absolute bottom-0 right-0 w-[40%] rounded-3xl border border-navy/10 bg-[#0d1f33] p-6 text-white shadow-2xl"
        {...reveal(0.3, { y: 24 })}
      >
        <p className="font-display text-[12px] font-semibold uppercase tracking-[0.2em] text-[#7dd3fc]">Long-term Partner</p>
        <p className="mt-1.5 text-[18px] font-bold">長期合作・持續陪伴</p>
        <ol className="mt-5 space-y-3.5 border-l border-white/15 pl-5">
          {supportTimeline.map(t => (
            <li key={t.date} className="relative text-[14px]">
              <span className="absolute -left-[25px] top-1.5 h-2.5 w-2.5 rounded-full bg-[#28aad6] ring-4 ring-[#0d1f33]" />
              <span className="mr-3 font-mono text-white/50">{t.date}</span>{t.text}
            </li>
          ))}
        </ol>
      </motion.div>

    </>
  )
}

/* 第三張：自有產品卡片牆，三欄無限垂直滾動（左右兩欄往上、中間一欄往下） */
function HeroProductCard({ w }: { w: Work }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-line bg-white shadow-[0_24px_48px_-24px_rgba(8,38,66,0.3)]">
      <div className="flex h-28 items-center justify-center xl:h-32" style={{ background: w.coverTone }}>
        <span className="icon text-[44px]! text-white/90">{w.coverIcon}</span>
      </div>
      <div className="px-4 py-3.5">
        <p className="truncate text-[15px] font-bold">{w.title}</p>
        <p className="mt-0.5 truncate text-[12px] text-muted">{w.category}</p>
      </div>
    </div>
  )
}

function HeroVisualProducts({ active }: { active: boolean }) {
  const reveal = useSlideReveal(active)
  // 切到這張時先整齊排好（三欄同一排對齊），約 0.8 秒後（淡入途中）開始滾動；切走淡出後再歸位
  const [moving, setMoving] = useState(false)
  useEffect(() => {
    const t = window.setTimeout(() => setMoving(active), active ? 800 : 350)
    return () => clearTimeout(t)
  }, [active])
  // 中間欄與左右兩欄用不同的作品，反向滾動交錯時才不會並排出現同一件；
  // 左右兩欄不相鄰，可共用同一組但起始錯開。每欄長度都要超過可視高度，才能無縫循環
  const pick = (ids: number[]) => ids.map(i => works[i % works.length])
  const columns = [pick([0, 2, 4, 6]), pick([1, 3, 5, 1, 3, 5]), pick([4, 6, 0, 2])]
  return (
    <div
      // 往下多延伸一些讓底部有空間淡出；不擋到下方輪播按鈕的點擊
      className="pointer-events-none absolute -inset-x-6 -bottom-14 -top-6 grid grid-cols-3 gap-5 overflow-hidden px-6"
      style={{
        maskImage: 'linear-gradient(to bottom, transparent 0%, #000 12%, #000 62%, transparent 100%)',
        WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, #000 12%, #000 62%, transparent 100%)',
      }}
    >
      {columns.map((col, c) => (
        // 進場位移方向跟滾動方向一致：左右兩欄由下往上浮現，中間欄由上往下落入，接著滾動時不會像突然反向
        <motion.div key={c} {...reveal(0.1 + c * 0.1, { y: c === 1 ? -30 : 30 })}>
          {/* 同一組卡片放兩份，往上（或往下）捲動剛好一份的高度後無縫接回起點 */}
          {/* 兩份內容相同，停在起點（0 或 -50%）時畫面一樣，所以開始滾動的瞬間不會跳 */}
          <div className={moving ? (c === 1 ? 'marquee-down' : 'marquee-up') : ''} style={{ animationDuration: `${44 + c * 4}s` }}>
            {[0, 1].map(copy => (
              <div key={copy} className="flex flex-col gap-5 pb-5" aria-hidden={copy === 1}>
                {col.map((w, i) => <HeroProductCard key={`${w.title}-${i}`} w={w} />)}
              </div>
            ))}
          </div>
        </motion.div>
      ))}
    </div>
  )
}

const heroVisuals: Record<HeroVisualType, (p: { active: boolean }) => ReactNode> = {
  build: HeroVisualBuild,
  support: HeroVisualSupport,
  products: HeroVisualProducts,
}

// 校稿用的左右箭頭、暫停、重複播放按鈕；正式畫面只留圓點，改成 true 就會再出現
const HERO_PROOF_CONTROLS = false

// 輪播控制：進度條圓點（＋校稿用按鈕），自動播放計時（暫停時進度停住）
// 外層以 key={active} 重新掛載，每切換一組計時就從 0 開始
function HeroControls({ count, active, paused, onSelect, onAutoNext, stopped, onToggleStop, looping, onToggleLoop }: {
  count: number; active: number; paused: boolean; onSelect: (i: number) => void; onAutoNext: () => void
  stopped: boolean; onToggleStop: () => void
  looping: boolean; onToggleLoop: () => void
}) {
  const [progress, setProgress] = useState(0)
  const elapsed = useRef(0)

  useEffect(() => {
    if (paused) return
    let raf = 0
    let last = performance.now()
    const tick = (now: number) => {
      // 分頁切到背景時畫面不更新，回來的那一格時間差會很大；每格最多算 100ms，避免一口氣跳過好幾張
      elapsed.current += Math.min(now - last, 100)
      last = now
      if (elapsed.current >= HERO_SLIDE_MS) {
        onAutoNext()
        return
      }
      setProgress(elapsed.current / HERO_SLIDE_MS)
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [paused, onAutoNext])

  return (
    <div className="flex items-center gap-5">
      {HERO_PROOF_CONTROLS && (
        <button type="button" className="slider-arrow" aria-label="上一組" onClick={() => onSelect((active - 1 + count) % count)}>
          <ArrowRight className="rotate-180 translate-x-px" />
        </button>
      )}
      <div className="flex items-center gap-2.5">
        {Array.from({ length: count }, (_, i) => (
          <button
            key={i}
            type="button"
            aria-label={`第 ${i + 1} 組`}
            aria-current={i === active}
            onClick={() => onSelect(i)}
            className={`relative h-1.5 overflow-hidden rounded-full transition-all duration-500 ${i === active ? 'w-14 bg-brand/20' : 'w-6 bg-ink/15 hover:bg-ink/30'}`}
          >
            {i === active && <span className="absolute inset-y-0 left-0 rounded-full bg-brand" style={{ width: `${progress * 100}%` }} />}
          </button>
        ))}
      </div>
      {HERO_PROOF_CONTROLS && (
        <>
          <button type="button" className="slider-arrow" aria-label="下一組" onClick={() => onSelect((active + 1) % count)}>
            <ArrowRight className="-translate-x-px" />
          </button>
          {/* 暫停／繼續自動播放 */}
          <button
            type="button"
            className="slider-arrow"
            aria-label={stopped ? '繼續自動播放' : '暫停自動播放'}
            title={stopped ? '繼續自動播放' : '暫停自動播放'}
            onClick={onToggleStop}
          >
            <span className="icon text-[20px]!">{stopped ? 'play_arrow' : 'pause'}</span>
          </button>
          {/* 重複播放目前這一張（校稿用）：不換下一張，動畫一直重播 */}
          <button
            type="button"
            className={`slider-arrow ${looping ? 'bg-brand! text-white! border-brand!' : ''}`}
            aria-pressed={looping}
            aria-label={looping ? '取消重複播放' : '重複播放這一張'}
            title={looping ? '取消重複播放' : '重複播放這一張'}
            onClick={onToggleLoop}
          >
            <span className="icon text-[20px]!">repeat_one</span>
          </button>
        </>
      )}
    </div>
  )
}

function Hero() {
  const [active, setActive] = useState(0)
  const [hovered, setHovered] = useState(false)
  const [stopped, setStopped] = useState(false) // 使用者按下暫停
  const [looping, setLooping] = useState(false) // 重複播放目前這一張
  const [replay, setReplay] = useState(0)        // 每加 1 就重新掛載示意圖，從頭播放動畫
  const touchX = useRef(0)
  const reduceMotion = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const reveal = useSlideReveal(true) // 左側文案只在進入頁面時播放一次進場
  const count = hero.visuals.length

  const select = useCallback((i: number) => setActive(i), [])
  // 時間到：重複播放模式重播同一張，否則換下一張
  const autoNext = useCallback(() => {
    if (looping) setReplay(r => r + 1)
    else setActive(a => (a + 1) % hero.visuals.length)
  }, [looping])

  return (
    <section
      id="top"
      // 手機版依內容自然高度排列，平板以上才撐滿一個畫面
      className="relative flex flex-col overflow-hidden bg-white pb-10 pt-28 text-ink md:min-h-svh md:pt-32"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* 背景：格線 + 光暈 */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage: 'linear-gradient(#082642 1px, transparent 1px), linear-gradient(90deg, #082642 1px, transparent 1px)',
          backgroundSize: '64px 64px',
          // 格線以區塊中心為基準（內容也是置中），再往右 13px：電腦版 1280～1920 寬時，
          // 右側示意圖（對話視窗、瀏覽器、產品卡片）的左邊框離直向格線都至少 23px，不會貼著格線
          backgroundPosition: 'calc(50% + 13px) calc(50% + 38px)',
          maskImage: 'radial-gradient(ellipse at 30% 40%, #000 30%, transparent 75%)',
        }}
      />
      <div className="pointer-events-none absolute -right-40 -top-40 h-[560px] w-[560px] rounded-full bg-brand/15 hidden md:block blur-[120px]" />
      <div className="pointer-events-none absolute -left-40 top-[30%] h-[480px] w-[480px] rounded-full bg-sky-200/40 hidden md:block blur-[120px]" />
      {/* 底部淡回白色，和下方服務區塊的漸層背景無縫銜接 */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-linear-to-b from-transparent to-white" />

      {/* 比其他區塊寬，讓右側示意圖有更大的空間 */}
      <div className="relative mx-auto grid w-full max-w-[1520px] flex-1 items-center gap-12 px-5 md:px-8 lg:grid-cols-[0.85fr_1.15fr] xl:gap-20 xl:px-14">
        {/* 左側：固定文案（往上提一些，對齊右側圖塊的視覺中心，而不是連圓點一起算的中心） */}
        <div className="lg:pb-16">
          <motion.p className="eyebrow" {...reveal(0, { y: 0 })}>{hero.eyebrow}</motion.p>
          <motion.h1 className="mt-5 text-[38px] font-black leading-[1.2] tracking-tight sm:text-[52px] xl:text-[60px]" {...reveal(0.08)}>
            {hero.title[0]}
            <br />
            <span className="bg-linear-to-r from-brand to-[#0b4f8a] bg-clip-text text-transparent">{hero.title[1]}</span>
          </motion.h1>
          {/* 電腦版寬度 544px：斷行剛好落在「產品」「APP，」之後，「客人」不會被拆開 */}
          <motion.p className="mt-6 max-w-xl text-[17px] leading-relaxed text-muted md:text-[18px] lg:max-w-[544px]" {...reveal(0.16)}>
            {hero.desc}
          </motion.p>

          {/* 三個重點 */}
          <motion.ul className="mt-7 space-y-3" {...reveal(0.24)}>
            {hero.points.map(p => (
              <li key={p.text} className="flex items-center gap-3 text-[15px] font-medium text-ink/80 md:text-[16px]">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand/10 text-brand-dark">
                  <span className="icon text-[18px]!">{p.icon}</span>
                </span>
                {p.text}
              </li>
            ))}
          </motion.ul>

          <motion.div className="mt-10 flex flex-wrap gap-4" {...reveal(0.32)}>
            <a href="#contact" className="btn btn-primary">
              {hero.primary}
              <ArrowRight />
            </a>
            <a href={hero.secondary.href} className="btn btn-ghost">{hero.secondary.label}</a>
          </motion.div>
        </div>

        {/* 右側：示意圖輪播（三張疊在同一格，只切換顯示） */}
        <div className="hidden lg:block">
          <div
            className="relative aspect-[4/3] touch-pan-y"
            aria-hidden="true"
            onPointerDown={e => { touchX.current = e.clientX }}
            onPointerUp={e => {
              const dx = e.clientX - touchX.current
              if (e.pointerType !== 'mouse' && Math.abs(dx) > 50) select((active + (dx < 0 ? 1 : -1) + count) % count)
            }}
          >
            {hero.visuals.map((type, i) => {
              const Visual = heroVisuals[type]
              return (
                <div key={i === active ? `${type}-${replay}` : type} className={`absolute inset-0 ${i === active ? '' : 'pointer-events-none'}`}>
                  <Visual active={i === active} />
                </div>
              )
            })}
          </div>
          {/* 第三張卡片牆往下延伸約 56px 才淡出，圓點再往下拉開一段距離，上下留白才平均 */}
          <div className="mt-25 flex justify-center">
            <HeroControls
              key={`${active}-${replay}`}
              count={count}
              active={active}
              // 重複播放時不因滑鼠移入而暫停，方便邊看邊校稿
              paused={stopped || (!looping && (hovered || reduceMotion))}
              onSelect={select}
              onAutoNext={autoNext}
              stopped={stopped}
              onToggleStop={() => setStopped(v => !v)}
              looping={looping}
              onToggleLoop={() => { setLooping(v => !v); setStopped(false) }}
            />
          </div>
        </div>
      </div>
    </section>
  )
}

/* ---------------- 區塊漸層背景 ----------------
   每個區塊由上往下直向漸層，上緣顏色＝上一區塊下緣顏色，交界無縫銜接；
   光暈放在區塊中段、透明度低，不會在交界處露出色差 */
const SECTION_TONES = {
  card: ['#ffffff', '#f6f2fb 50%', '#eaf4fb'],              // 白 → 淺紫 → 淺藍
  services: ['#eaf4fb', '#eef5fb 50%', '#fbf0f4'],          // 淺藍 → 淺藍 → 淺粉
  works: ['#fbf0f4', '#f1f3f7 50%', '#eef2fb'],             // 淺粉 → 淺灰 → 淺藍灰
  pricing: ['#eef2fb', '#f6f3fb 50%', '#f4f1f8'],           // 淺藍灰 → 淺紫 → 淺薰衣草
  process: ['#f4f1f8', '#fdf4ee'],                          // 淺薰衣草 → 淺杏
  about: ['#fdf4ee', '#f8f5f0 50%', '#edf6f3'],             // 淺杏 → 米白 → 淺薄荷
  faq: ['#edf6f3', '#ffffff 50%', '#f0f3f8'],               // 淺薄荷 → 白 → 淺灰藍
  contact: ['#f0f3f8', '#fbf3f6 60%', '#ffffff'],           // 淺灰藍 → 淺粉 → 白（接頁尾）
}

function SectionBg({ tone, blobs = [] }: { tone: keyof typeof SECTION_TONES; blobs?: string[] }) {
  return (
    <>
      <div className="pointer-events-none absolute inset-0" style={{ background: `linear-gradient(180deg, ${SECTION_TONES[tone].join(', ')})` }} />
      {blobs.map(b => <div key={b} className={`pointer-events-none absolute rounded-full hidden md:block blur-[120px] ${b}`} />)}
    </>
  )
}

/* ---------------- Services ---------------- */
// 六張服務卡片各自的淡色底（主色不重複）
// 手機版底色與邊框加深一階（-100／-200），電腦版維持原本的淡色（-50／-100）
const serviceTones = [
  { card: 'bg-sky-100 border-sky-200 md:bg-sky-50 md:border-sky-100 hover:border-sky-300',                     icon: 'bg-sky-500/10 text-sky-600 group-hover:bg-sky-500' },
  { card: 'bg-violet-100 border-violet-200 md:bg-violet-50 md:border-violet-100 hover:border-violet-300',      icon: 'bg-violet-500/10 text-violet-600 group-hover:bg-violet-500' },
  { card: 'bg-emerald-100 border-emerald-200 md:bg-emerald-50 md:border-emerald-100 hover:border-emerald-300', icon: 'bg-emerald-500/10 text-emerald-600 group-hover:bg-emerald-500' },
  { card: 'bg-amber-100 border-amber-200 md:bg-amber-50 md:border-amber-100 hover:border-amber-300',           icon: 'bg-amber-500/10 text-amber-600 group-hover:bg-amber-500' },
  { card: 'bg-rose-100 border-rose-200 md:bg-rose-50 md:border-rose-100 hover:border-rose-300',                icon: 'bg-rose-500/10 text-rose-600 group-hover:bg-rose-500' },
  { card: 'bg-indigo-100 border-indigo-200 md:bg-indigo-50 md:border-indigo-100 hover:border-indigo-300',      icon: 'bg-indigo-500/10 text-indigo-600 group-hover:bg-indigo-500' },
]

function Services() {
  return (
    <section id="services" className="section section-screen relative overflow-hidden">
      <SectionBg tone="services" blobs={['-left-40 top-1/3 h-[480px] w-[480px] bg-sky-200/30', '-right-32 top-1/2 h-[420px] w-[420px] bg-pink-200/35']} />
      <div className="container-x relative">
        <SectionHead eyebrow="One-Stop Service" title={servicesHead.title} desc={servicesHead.desc} />
        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((s, i) => (
            <Reveal key={s.title} delay={(i % 3) * 0.08}>
              <article className={`group h-full rounded-2xl border p-7 md:backdrop-blur-sm transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_48px_-24px_rgba(8,38,66,0.25)] ${serviceTones[i % serviceTones.length].card}`}>
                <div className="card-head">
                  <span className={`card-icon transition group-hover:text-white ${serviceTones[i % serviceTones.length].icon}`}>
                    <span className="icon">{s.icon}</span>
                  </span>
                  <h3 className="card-title">{s.title}</h3>
                </div>
                <p className="card-desc">{s.desc}</p>
                <ul className="mt-5 flex flex-wrap gap-2">
                  {s.tags.map(t => (
                    <li key={t} className="rounded-full bg-white/80 px-3 py-1 text-[12px] font-medium text-ink/70">{t}</li>
                  ))}
                </ul>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ---------------- 收費標準 ---------------- */
function Pricing() {
  const plans = pricing
  return (
    <section id="pricing" className="relative overflow-hidden">
      <SectionBg tone="pricing" blobs={['-right-40 top-1/3 h-[460px] w-[460px] bg-violet-200/25', '-left-40 top-2/3 h-[400px] w-[400px] bg-sky-200/25']} />
      <div className="section-screen relative py-10 md:py-8">
      <div className="container-x">
        <SectionHead eyebrow="Pricing" title={pricingHead.title} desc={pricingHead.desc} />
        {/* 三張卡片在桌機版無間距連成一體：中間那張欄寬較寬、上下各凸出 24px 並疊在最上層（不設 h-full，負 margin 才能撐高）；
            左右兩張只保留外側圓角，貼著中間卡片 */}
        <div className="mt-10 grid gap-5 md:grid-cols-[1fr_1.12fr_1fr] md:gap-0 md:py-6">
          {plans.map((p, i) => {
            const isNumber = /^[\d,]+$/.test(p.price)
            const side = i === 0 ? 'md:rounded-r-none md:border-r-0' : i === plans.length - 1 ? 'md:rounded-l-none md:border-l-0' : ''
            return (
              <Reveal key={p.name} delay={i * 0.08} className={p.featured ? 'relative z-10 md:-my-6' : 'h-full'}>
                <article
                  className={`relative flex h-full flex-col rounded-2xl border p-7 lg:p-8 ${
                    p.featured
                      ? 'border-brand bg-white shadow-[0_32px_64px_-28px_rgba(8,38,66,0.45)] md:py-12 lg:px-10 lg:py-12'
                      // 手機版直式閱讀：三張都用與主推方案相同的白底、品牌色邊框與陰影；平板以上才改回淡色
                      : `border-brand bg-white shadow-[0_32px_64px_-28px_rgba(8,38,66,0.45)] md:border-line md:bg-white/80 md:shadow-none md:backdrop-blur-sm ${side}`
                  }`}
                >
                  {p.featured && (
                    <span className="absolute -top-3 left-7 rounded-full bg-brand px-3 py-1 text-[12px] font-bold text-white lg:left-10">最多人選擇</span>
                  )}
                  {/* 標籤列固定高度，沒有標籤的卡片也留位，三張的標題與價格才會對齊 */}
                  <div className="mb-3 h-6">
                    {p.badge && <span className="inline-block rounded-md bg-ink/6 px-2 py-0.5 text-[12px] font-bold text-ink/60">{p.badge}</span>}
                  </div>
                  <h3 className="card-title">{p.name}</h3>
                  <p className="mt-1.5 text-[15px] font-bold text-brand-dark">{p.tagline}</p>
                  <p className="mt-6 flex min-h-9 items-baseline gap-1 text-ink">
                    {isNumber ? (
                      <>
                        <span className="text-[15px] font-bold">NT$</span>
                        <span className="font-brand text-[36px] font-bold leading-none">{p.price}</span>
                      </>
                    ) : (
                      <span className="text-[24px] font-bold leading-9">{p.price}</span>
                    )}
                  </p>
                  <p className="mt-4 text-[17px] leading-relaxed text-muted md:text-[14px]">{p.desc}</p>
                  <ul className="mt-6 flex flex-1 flex-col gap-2.5 border-t border-line pt-6">
                    {p.features.map(f => (
                      <li key={f} className="flex items-start gap-2 text-[15px] text-ink/80">
                        <span className="icon mt-0.5 text-[18px]! text-brand">check</span>
                        {f}
                      </li>
                    ))}
                  </ul>
                  <a href="#contact" className={`btn mt-8 ${p.featured ? 'btn-primary' : 'btn-outline'}`}>免費諮詢</a>
                </article>
              </Reveal>
            )
          })}
        </div>

        <p className="mt-4 flex items-start gap-1.5 text-[14px] text-muted"><span aria-hidden>※</span>{pricingHead.note}</p>
      </div>
      </div>
    </section>
  )
}

/* ---------------- 網站救援 ---------------- */
// 深色獨立區塊：左邊說明、可處理項目與報價，右邊是常見狀況
function Rescue() {
  return (
    <section id="rescue" className="section section-screen relative overflow-hidden text-white" style={{ background: 'linear-gradient(135deg, #1d5687 0%, #2a74ad 55%, #4f6fd0 100%)' }}>
      {/* 品牌藍到藍紫的漸層底，加淡淡的格線紋理與光暈 */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.08]"
        style={{
          backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)',
          backgroundSize: '56px 56px',
          maskImage: 'radial-gradient(ellipse 70% 60% at 50% 50%, #000 20%, transparent 100%)',
        }}
      />
      <div className="pointer-events-none absolute -right-40 top-1/4 h-[480px] w-[480px] rounded-full bg-violet-400/30 hidden md:block blur-[120px]" />
      <div className="pointer-events-none absolute -left-40 bottom-0 h-[420px] w-[420px] rounded-full bg-sky-300/25 hidden md:block blur-[120px]" />

      <div className="container-x relative grid items-center gap-12 lg:grid-cols-[1fr_1.1fr] lg:gap-20">
        <Reveal>
          <p className="eyebrow text-sky-200!">{rescue.eyebrow}</p>
          <h2 className="heading text-white!">
            {rescue.title[0]}
            <br />
            {/* 第二行用暖色漸層字（淺黃 → 淺粉），在藍色漸層背景上才跳得出來 */}
            <span className="bg-linear-to-r from-amber-200 to-pink-300 bg-clip-text text-transparent">{rescue.title[1]}</span>
          </h2>
          <p className="lead text-white/85!">{rescue.desc}</p>
          <ul className="mt-8 grid gap-3 sm:grid-cols-2">
            {rescue.services.map(f => (
              <li key={f} className="flex items-start gap-2 text-[15px] text-white/90">
                <span className="icon mt-0.5 text-[18px]! text-sky-200">check</span>
                {f}
              </li>
            ))}
          </ul>
          <div className="mt-10 flex flex-wrap items-center gap-6">
            <a href="#contact" className="btn bg-white text-brand-dark hover:bg-sky-50">{rescue.cta}<ArrowRight /></a>
            <p className="text-[18px] font-bold">{rescue.price}</p>
          </div>
        </Reveal>

        {/* 常見狀況 2×2，中間一排放主要狀況（白色橫式，跨兩欄） */}
        <div className="grid gap-4 sm:grid-cols-2">
          {[rescue.cases[0], rescue.cases[1], null, rescue.cases[2], rescue.cases[3]].map((c, i) =>
            c ? (
              <Reveal key={c.title} delay={i * 0.06} className="h-full">
                {/* 手機版：與白色主要狀況卡同樣的橫式架構與尺寸（底色、邊框、icon 維持半透明白）；sm 以上才改回直式小卡 */}
                <article className="flex h-full items-center gap-5 rounded-2xl border border-white/20 bg-white/10 p-6 md:backdrop-blur-sm transition duration-300 hover:border-white/40 hover:bg-white/15 sm:block">
                  <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white/15 text-white sm:h-11 sm:w-11 sm:rounded-xl">
                    <span className="icon text-[30px]! sm:text-[24px]!">{c.icon}</span>
                  </span>
                  <div>
                    <h3 className="text-[20px] font-bold sm:mt-4 sm:text-[18px]">{c.title}</h3>
                    <p className="mt-1 text-[17px] leading-relaxed text-white/85 sm:mt-2 sm:text-[14px]">{c.desc}</p>
                  </div>
                </article>
              </Reveal>
            ) : (
              <Reveal key="highlight" delay={i * 0.06} className="sm:col-span-2">
                <article className="flex items-center gap-5 rounded-2xl bg-white p-6 text-ink shadow-[0_12px_24px_-16px_rgba(8,38,66,0.5)]">
                  <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-linear-to-br from-brand to-violet-500 text-white">
                    <span className="icon text-[30px]!">{rescue.highlight.icon}</span>
                  </span>
                  <div>
                    <h3 className="text-[20px] font-bold">{rescue.highlight.title}</h3>
                    <p className="mt-1 text-[17px] leading-relaxed text-muted md:text-[15px]">{rescue.highlight.desc}</p>
                  </div>
                </article>
              </Reveal>
            ),
          )}
        </div>
      </div>
    </section>
  )
}

/* ---------------- 網站類型（Responsive Website） ---------------- */
/* 跨裝置操作：手機（客人下單）／平板（店家管理）／電腦（萬用），點按鈕切換 */
type CardDevice = DeviceId
const SHADOW = 'shadow-[0_40px_80px_-30px_rgba(8,38,66,0.55)]'

/* ---- 裝置外框 ---- */
function PhoneFrame({ children }: { children: ReactNode }) {
  return (
    <div className={`w-[270px] rounded-[44px] bg-ink p-2.5 ${SHADOW}`}>
      <div className="relative h-[540px] overflow-hidden rounded-[36px] bg-white">
        <div className="absolute left-1/2 top-3 z-10 h-5 w-20 -translate-x-1/2 rounded-full bg-ink" />
        {children}
      </div>
    </div>
  )
}
function TabletFrame({ children }: { children: ReactNode }) {
  return (
    <div className={`w-[400px] rounded-[30px] bg-ink p-3 ${SHADOW}`}>
      <div className="relative h-[500px] overflow-hidden rounded-[20px] bg-white">{children}</div>
    </div>
  )
}
function DesktopFrame({ url, children }: { url: string; children: ReactNode }) {
  // 與 hero 相同的瀏覽器視窗造型
  return (
    <div className={`w-[600px] overflow-hidden rounded-3xl border border-line bg-white ${SHADOW}`}>
      <div className="flex items-center gap-2 border-b border-line px-5 py-3.5">
        <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
        <span className="h-3 w-3 rounded-full bg-[#febc2e]" />
        <span className="h-3 w-3 rounded-full bg-[#28c840]" />
        <span className="ml-3 flex h-7 flex-1 items-center gap-1.5 rounded-md bg-paper px-3 font-mono text-[13px] text-ink/80">
          <span className="icon text-[14px]! text-muted">lock</span>{url}
        </span>
      </div>
      {/* 畫面內容以 500px 寬的版面設計，等比放大 1.2 倍填滿視窗，字和元素都跟著變大 */}
      <div className="h-[440px] overflow-hidden">
        <div className="h-[367px] w-[500px] origin-top-left scale-[1.2]">{children}</div>
      </div>
    </div>
  )
}

/* ---- 背景裝飾：主裝置後方霧化的機身，內容只是示意色塊，與前景畫面無關 ---- */
function DecoContent({ tone, cols = 2 }: { tone: string; cols?: number }) {
  return (
    <div className="flex h-full flex-col gap-3 p-4 pt-9">
      <div className="flex items-center justify-between">
        <span className="h-3 w-16 rounded-full bg-ink/15" />
        <span className="h-3 w-6 rounded-full bg-ink/10" />
      </div>
      <div className={`h-28 shrink-0 rounded-2xl ${tone}`} />
      <span className="h-3 w-2/3 rounded-full bg-ink/12" />
      <span className="h-3 w-1/2 rounded-full bg-ink/8" />
      <div className={`grid flex-1 gap-3 ${cols === 3 ? 'grid-cols-3' : 'grid-cols-2'}`}>
        {Array.from({ length: cols * 2 }, (_, i) => <div key={i} className="rounded-xl bg-ink/6" />)}
      </div>
    </div>
  )
}
function DeviceBackdrop({ device }: { device: CardDevice }) {
  const fog = 'pointer-events-none absolute blur-[3px] opacity-55'
  if (device === 'phone') {
    return (
      <>
        {[
          { pos: 'left-[30px] -rotate-6', tone: 'bg-linear-to-br from-violet-200 to-sky-200' },
          { pos: 'right-[30px] rotate-6', tone: 'bg-linear-to-br from-amber-100 to-rose-200' },
        ].map(p => (
          <div key={p.pos} className={`${fog} top-1/2 -translate-y-1/2 ${p.pos}`} aria-hidden>
            <div className="w-[210px] rounded-[36px] bg-ink p-2">
              <div className="h-[420px] overflow-hidden rounded-[30px] bg-white"><DecoContent tone={p.tone} /></div>
            </div>
          </div>
        ))}
      </>
    )
  }
  if (device === 'tablet') {
    return (
      <div className={`${fog} left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2`} aria-hidden>
        <div className="w-[580px] rounded-[30px] bg-ink p-3">
          <div className="h-[400px] overflow-hidden rounded-[20px] bg-white"><DecoContent tone="bg-linear-to-br from-emerald-100 to-sky-200" cols={3} /></div>
        </div>
      </div>
    )
  }
  // 電腦：多個瀏覽器視窗往左上階梯狀疊起（像視窗一路連開的排列），越後面越淡越糊
  const windows = [
    { off: 108, blur: 'blur-[5px]', opacity: 'opacity-30', tone: 'bg-linear-to-br from-amber-100 to-rose-200' },
    { off: 72, blur: 'blur-[4px]', opacity: 'opacity-40', tone: 'bg-linear-to-br from-emerald-100 to-sky-200' },
    { off: 36, blur: 'blur-[3px]', opacity: 'opacity-55', tone: 'bg-linear-to-br from-violet-200 to-sky-200' },
  ]
  return (
    <>
      {windows.map(w => (
        <div
          key={w.off}
          className={`pointer-events-none absolute left-1/2 top-1/2 ${w.blur} ${w.opacity}`}
          style={{ transform: `translate(calc(-50% - ${w.off}px), calc(-50% - ${w.off}px))` }}
          aria-hidden
        >
          <div className="w-[600px] overflow-hidden rounded-3xl border border-line bg-white">
            <div className="flex items-center gap-2 border-b border-line px-5 py-3.5">
              <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
              <span className="h-3 w-3 rounded-full bg-[#febc2e]" />
              <span className="h-3 w-3 rounded-full bg-[#28c840]" />
              <span className="ml-3 h-7 flex-1 rounded-md bg-paper" />
            </div>
            <div className="h-[440px]"><DecoContent tone={w.tone} cols={3} /></div>
          </div>
        </div>
      ))}
    </>
  )
}

/* ---- 捲動示意：畫面出現後往下捲到底、停一下再捲回頂端，只播一次（切換裝置時重新掛載就會再播） ---- */
function ScrollDemo({ children, className = '' }: { children: ReactNode; className?: string }) {
  const box = useRef<HTMLDivElement>(null)
  const inner = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (!box.current || !inner.current) return
    const dist = Math.max(0, inner.current.offsetHeight - box.current.clientHeight)
    if (!dist) return
    const controls = animate(inner.current, { y: [0, -dist, -dist, 0] }, {
      duration: 3.6,
      times: [0, 0.4, 0.58, 1],
      ease: 'easeInOut',
      delay: 0.9, // 等裝置畫面切換進場後再開始捲
    })
    return () => controls.stop()
  }, [])
  return (
    <div ref={box} className={`h-full overflow-hidden ${className}`}>
      <div ref={inner}>{children}</div>
    </div>
  )
}

/* ---- 共用小元件 ---- */
const Ico = ({ name, className = '' }: { name: string; className?: string }) => <span className={`icon ${className}`}>{name}</span>
function TabBar({ items }: { items: [string, string][] }) {
  return (
    <div className="absolute inset-x-0 bottom-0 grid grid-cols-4 border-t border-line bg-white pb-4 pt-2">
      {items.map(([icon, label], i) => (
        <div key={label} className={`flex flex-col items-center gap-0.5 text-[10px] ${i === 0 ? 'text-brand' : 'text-ink/45'}`}>
          <Ico name={icon} className="text-[20px]!" />
          {label}
        </div>
      ))}
    </div>
  )
}

/* ---- 購物會員網站 ---- */
const shopProducts = [
  { name: '亞麻襯衫', price: 'NT$1,280', tone: 'from-stone-300 to-stone-100' },
  { name: '陶瓷馬克杯', price: 'NT$480', tone: 'from-sky-200 to-sky-50' },
  { name: '香氛蠟燭', price: 'NT$680', tone: 'from-amber-200 to-amber-50' },
  { name: '帆布托特包', price: 'NT$890', tone: 'from-emerald-200 to-emerald-50' },
  { name: '木質托盤', price: 'NT$560', tone: 'from-orange-200 to-orange-50' },
  { name: '棉麻抱枕', price: 'NT$750', tone: 'from-rose-200 to-rose-50' },
]
function ShopLogo({ className = '' }: { className?: string }) {
  return <span className={`font-brand font-bold tracking-[0.2em] text-ink ${className}`}>LUMI</span>
}
function CartIcon() {
  return (
    <span className="relative">
      <Ico name="shopping_bag" className="text-[20px]! text-ink" />
      <span className="absolute -right-1.5 -top-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-rose-500 text-[8px] font-bold text-white">2</span>
    </span>
  )
}
function ProductCard({ p, small = false }: { p: (typeof shopProducts)[number]; small?: boolean }) {
  return (
    <div>
      <div className={`relative rounded-xl bg-linear-to-br ${p.tone} ${small ? 'aspect-4/3' : 'aspect-square'}`}>
        <span className="absolute right-1.5 top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-white/80 text-rose-400">
          <Ico name="favorite" className="text-[12px]!" />
        </span>
      </div>
      <p className={`mt-1.5 font-medium text-ink ${small ? 'text-[10px]' : 'text-[12px]'}`}>{p.name}</p>
      <p className={`font-bold text-rose-500 ${small ? 'text-[10px]' : 'text-[12px]'}`}>{p.price}</p>
    </div>
  )
}
function ShopBanner({ className = '' }: { className?: string }) {
  return (
    <div className={`flex flex-col justify-center rounded-2xl bg-linear-to-br from-rose-200 via-orange-100 to-amber-50 px-4 ${className}`}>
      <p className="text-[10px] font-bold tracking-widest text-rose-500">NEW ARRIVAL</p>
      <p className="mt-0.5 text-[16px] font-bold text-ink">秋冬選物 8 折起</p>
      <p className="mt-2 w-fit rounded-full bg-ink px-2.5 py-1 text-[10px] font-bold text-white">立即選購</p>
    </div>
  )
}
const shopCats = ['全部', '服飾', '居家', '香氛']

function ShopScreen({ device }: { device: CardDevice }) {
  if (device === 'phone') return (
    <PhoneFrame>
      <ScrollDemo>
        <div className="flex items-center justify-between px-5 pb-3 pt-11">
          <ShopLogo className="text-[16px]" />
          <span className="flex items-center gap-3"><Ico name="search" className="text-[20px]! text-ink" /><CartIcon /></span>
        </div>
        <ShopBanner className="mx-4 h-28" />
        <div className="mt-3 flex gap-2 px-4">
          {shopCats.map((c, i) => <span key={c} className={`rounded-full px-3 py-1 text-[11px] ${i === 0 ? 'bg-ink text-white' : 'bg-paper text-ink/70'}`}>{c}</span>)}
        </div>
        <div className="mt-3 grid grid-cols-2 gap-3 px-4">
          {shopProducts.map(p => <ProductCard key={p.name} p={p} />)}
        </div>
        {/* 預約服務 */}
        <div className="mx-4 mt-4 flex items-center gap-3 rounded-2xl bg-violet-50 p-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500 text-white"><Ico name="event_available" className="text-[20px]!" /></span>
          <span className="flex-1">
            <span className="block text-[12px] font-bold text-ink">預約到店試穿</span>
            <span className="block text-[10px] text-muted">選好時段，到店直接取貨</span>
          </span>
          <span className="rounded-full bg-ink px-2.5 py-1 text-[10px] font-bold text-white">預約</span>
        </div>
        <div className="h-24" />{/* 留出底部選單的空間 */}
      </ScrollDemo>
      <TabBar items={[['home', '首頁'], ['grid_view', '分類'], ['shopping_cart', '購物車'], ['person', '會員']]} />
    </PhoneFrame>
  )
  if (device === 'tablet') return <ShopAdminTablet />
  return (
    <DesktopFrame url="lumi.shop">
      <ScrollDemo>
      <div className="flex items-center justify-between border-b border-line px-5 py-2.5">
        <ShopLogo className="text-[14px]" />
        <span className="flex gap-4 text-[11px] text-ink/70">{['新品', '服飾', '居家', '香氛', '會員專區'].map(m => <span key={m}>{m}</span>)}</span>
        <span className="flex items-center gap-3"><Ico name="search" className="text-[18px]! text-ink" /><Ico name="person" className="text-[18px]! text-ink" /><CartIcon /></span>
      </div>
      <div className="px-5 pt-3">
        <ShopBanner className="h-28" />
        <p className="mt-4 text-[12px] font-bold text-ink">本週熱銷</p>
        <div className="mt-2 grid grid-cols-4 gap-3">
          {shopProducts.slice(0, 4).map(p => <ProductCard key={p.name} p={p} small />)}
        </div>
        <p className="mt-4 text-[12px] font-bold text-ink">居家選物</p>
        <div className="mt-2 grid grid-cols-4 gap-3">
          {[...shopProducts.slice(4), ...shopProducts.slice(0, 2)].map((p, i) => <ProductCard key={`${p.name}-${i}`} p={p} small />)}
        </div>
      </div>
      {/* 頁尾 */}
      <div className="mt-5 flex items-center justify-between bg-ink px-5 py-4 text-[10px] text-white/70">
        <ShopLogo className="text-[12px] text-white!" />
        <span className="flex gap-4">{['關於我們', '會員條款', '配送說明', '聯絡客服'].map(m => <span key={m}>{m}</span>)}</span>
      </div>
      </ScrollDemo>
    </DesktopFrame>
  )
}

/* ---- 平板：店家後台（今日訂單、庫存、預約名單） ---- */
const adminStock = [
  { name: '亞麻襯衫', sku: 'A-1021', stock: 24, tone: 'from-stone-300 to-stone-100' },
  { name: '陶瓷馬克杯', sku: 'H-2034', stock: 3, tone: 'from-sky-200 to-sky-50' },
  { name: '香氛蠟燭', sku: 'F-3310', stock: 12, tone: 'from-amber-200 to-amber-50' },
  { name: '帆布托特包', sku: 'B-0412', stock: 0, tone: 'from-emerald-200 to-emerald-50' },
  { name: '棉麻抱枕', sku: 'H-2188', stock: 8, tone: 'from-rose-200 to-rose-50' },
  { name: '木質托盤', sku: 'H-2240', stock: 2, tone: 'from-orange-200 to-orange-50' },
  { name: '羊毛圍巾', sku: 'A-1107', stock: 16, tone: 'from-violet-200 to-violet-50' },
]
function ShopAdminTablet() {
  return (
    <TabletFrame>
      <div className="flex items-center justify-between border-b border-line px-5 py-3.5">
        <span className="flex items-center gap-2"><ShopLogo className="text-[16px]" /><span className="rounded bg-ink px-1.5 py-0.5 text-[9px] font-bold text-white">後台</span></span>
        <span className="flex items-center gap-3 text-ink">
          <span className="relative"><Ico name="notifications" className="text-[20px]!" /><span className="absolute -right-0.5 top-0 h-2 w-2 rounded-full bg-rose-500" /></span>
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-brand/15 text-[11px] font-bold text-brand-dark">店</span>
        </span>
      </div>
      <ScrollDemo className="h-[446px]">
      <div className="px-5 pb-6 pt-4">
        <p className="text-[13px] font-bold text-ink">今日概況</p>
        <div className="mt-2 grid grid-cols-3 gap-2.5">
          {[['receipt_long', '新訂單', '12', 'text-brand'], ['local_shipping', '待出貨', '5', 'text-amber-500'], ['event_available', '今日預約', '8', 'text-violet-500']].map(([icon, k, v, color]) => (
            <div key={k} className="rounded-xl border border-line p-2.5">
              <Ico name={icon} className={`text-[18px]! ${color}`} />
              <p className="mt-1 text-[10px] text-muted">{k}</p>
              <p className="text-[18px] font-bold leading-tight text-ink">{v}</p>
            </div>
          ))}
        </div>
        <div className="mt-4 flex items-center justify-between">
          <p className="text-[13px] font-bold text-ink">庫存管理</p>
          <span className="rounded-full bg-brand px-2.5 py-1 text-[10px] font-bold text-white">＋ 新增商品</span>
        </div>
        <ul className="mt-2 divide-y divide-line rounded-xl border border-line">
          {adminStock.map(p => (
            <li key={p.sku} className="flex items-center gap-2.5 px-3 py-2">
              <span className={`h-8 w-8 shrink-0 rounded-lg bg-linear-to-br ${p.tone}`} />
              <span className="min-w-0 flex-1">
                <span className="block text-[11px] font-medium text-ink">{p.name}</span>
                <span className="block text-[9px] text-muted">{p.sku}</span>
              </span>
              <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                p.stock === 0 ? 'bg-rose-100 text-rose-600' : p.stock < 5 ? 'bg-amber-100 text-amber-700' : 'bg-emerald-50 text-emerald-600'
              }`}>
                {p.stock === 0 ? '缺貨' : p.stock < 5 ? `剩 ${p.stock} 件` : `${p.stock} 件`}
              </span>
            </li>
          ))}
        </ul>
        <p className="mt-4 text-[13px] font-bold text-ink">今日預約</p>
        <ul className="mt-2 space-y-2">
          {[['14:00', '王小姐', '到店試穿'], ['15:30', '陳先生', '取貨'], ['17:00', '林小姐', '到店試穿']].map(([t, n, k]) => (
            <li key={t} className="flex items-center gap-3 rounded-xl bg-paper px-3 py-2 text-[11px]">
              <span className="font-mono font-bold text-brand-dark">{t}</span>
              <span className="flex-1 font-medium text-ink">{n}</span>
              <span className="text-muted">{k}</span>
            </li>
          ))}
        </ul>
      </div>
      </ScrollDemo>
    </TabletFrame>
  )
}

const deviceVariants = {
  enter: { opacity: 0, scale: 0.94, y: 16 },
  center: { opacity: 1, scale: 1, y: 0 },
  exit: { opacity: 0, scale: 0.97, y: -10 },
}

// 裝置自動輪播間隔：要讓捲動示意（延遲 0.9s＋捲動 3.6s）播完再換下一個
const DEVICE_SLIDE_MS = 7000

// 友善介面右側的裝置說明文案（隱形佔位版不使用 h2，避免重複標題）
function DeviceText({ d, heading = false }: { d: (typeof webCard.devices)[number]; heading?: boolean }) {
  const Title = heading ? 'h2' : 'p'
  return (
    <>
      <p className="text-[14px] font-bold text-brand-dark">{d.role}</p>
      <Title className="heading mt-2!">
        {d.title}
        <br />
        <span className="bg-linear-to-r from-brand to-violet-500 bg-clip-text text-transparent">{d.accent}</span>
      </Title>
      <p className="lead">{d.desc}</p>
      {/* 以 #標籤 文字呈現，避免看起來像可以點的按鈕 */}
      <ul className="mt-6 flex flex-wrap gap-x-4 gap-y-1.5">
        {d.tags.map(t => (
          <li key={t} className="text-[15px] font-medium text-brand-dark">#{t}</li>
        ))}
      </ul>
    </>
  )
}

function WebCard() {
  const { devices } = webCard
  const [index, setIndex] = useState(0)
  const current = devices[index]
  const sectionRef = useRef<HTMLElement>(null)
  const inView = useInView(sectionRef, { amount: 0.4 })   // 捲出畫面就暫停
  const [hovered, setHovered] = useState(false)            // 滑鼠停在區塊上時暫停

  // 每次切換（自動或手動點按鈕）都重新計時，手動點完不會馬上被切走
  useEffect(() => {
    if (!inView || hovered) return
    const timer = setTimeout(() => setIndex(i => (i + 1) % devices.length), DEVICE_SLIDE_MS)
    return () => clearTimeout(timer)
  }, [index, inView, hovered, devices.length])

  // 裝置切換按鈕：電腦版放在右側文字下方，手機／平板版放在裝置畫面下方
  const deviceTabs = (className: string) => (
    <div className={`gap-2.5 ${className}`} role="tablist" aria-label="裝置">
      {devices.map((d, i) => (
        <button
          key={d.id}
          type="button"
          role="tab"
          aria-selected={i === index}
          onClick={() => setIndex(i)}
          className={`flex h-16 w-16 flex-col items-center justify-center gap-0.5 rounded-lg border text-[12px] font-bold transition duration-300 ${
            i === index
              ? 'border-brand bg-brand text-white shadow-[0_12px_24px_-12px_rgba(40,170,214,0.8)]'
              : 'border-line bg-white text-ink/60 hover:border-brand/40 hover:text-ink'
          }`}
        >
          <Ico name={d.icon} className="text-[26px]!" />
          {d.label}
        </button>
      ))}
    </div>
  )

  return (
    <section ref={sectionRef} id="card" className="section section-screen relative overflow-hidden">
      <SectionBg tone="card" blobs={['-right-40 top-1/4 h-[520px] w-[520px] bg-violet-200/30', '-left-40 top-1/2 h-[420px] w-[420px] bg-sky-200/30']} />

      <div className="container-x relative">
        <Reveal>
          <div
            className="grid items-center gap-12 lg:grid-cols-[1.4fr_1fr] lg:gap-20"
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
          >
            {/* 左：裝置畫面 */}
            <div className="order-2 lg:order-1">
              {/* 舞台：600×600，依螢幕等比縮放；最大 600px 剛好放進左欄，不會貼到右側文字 */}
              <div className="relative mx-auto h-[330px] w-full max-w-[600px] sm:h-[510px] xl:h-[600px]">
                <div className="absolute left-1/2 top-0 h-[600px] w-[600px] origin-top -translate-x-1/2 scale-[0.55] sm:scale-[0.85] xl:scale-100">
                  <AnimatePresence mode="wait" initial={false}>
                    <motion.div
                      key={current.id}
                      variants={deviceVariants}
                      initial="enter"
                      animate="center"
                      exit="exit"
                      transition={{ duration: 0.45, ease: REVEAL_EASE }}
                      className="absolute inset-0 flex items-center justify-center will-change-transform"
                    >
                      <DeviceBackdrop device={current.id} />
                      <div className="relative"><ShopScreen device={current.id} /></div>
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>
              {deviceTabs('mt-6 flex justify-center lg:hidden')}
              <div className="mt-6 flex justify-center lg:hidden">
                <a href="#contact" className="btn btn-primary">
                  {webCard.cta}
                  <ArrowRight />
                </a>
              </div>
            </div>

            {/* 右：這個裝置的說明，下方是裝置切換按鈕與免費諮詢 */}
            <div className="order-1 lg:order-2">

              {/* 三個裝置的文案行數不同：把三份文案都疊在同一格（隱形）撐出最高的高度，
                  任何螢幕寬度切換時，下方的裝置畫面與按鈕都不會上下跳 */}
              <div className="grid">
                {devices.map(d => (
                  <div key={d.id} className="invisible [grid-area:1/1]" aria-hidden>
                    <DeviceText d={d} />
                  </div>
                ))}
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div
                    key={current.id}
                    className="[grid-area:1/1]"
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.35, ease: REVEAL_EASE }}
                  >
                    <DeviceText d={current} heading />
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* 電腦版：裝置切換按鈕＋免費諮詢同一排；手機／平板版這兩個都移到裝置畫面下方 */}
              <div className="mt-9 hidden flex-wrap items-center gap-5 lg:flex">
                {deviceTabs('hidden lg:flex')}
                <a href="#contact" className="btn btn-primary">
                  {webCard.cta}
                  <ArrowRight />
                </a>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

/* ---------------- Works ---------------- */
function WorkCard({ w }: { w: Work }) {
  const Wrapper = w.link ? 'a' : 'div'
  return (
    <Wrapper
      {...(w.link ? { href: w.link, ...(w.link.startsWith('http') ? { target: '_blank', rel: 'noopener' } : {}) } : {})}
      className={`group block h-full overflow-hidden rounded-2xl border border-line bg-white transition duration-300 ${
        w.link ? 'hover:-translate-y-1 hover:border-brand/30 hover:shadow-[0_24px_48px_-24px_rgba(8,38,66,0.3)]' : ''
      }`}
    >
      <div className="relative aspect-[16/10] overflow-hidden" style={w.cover ? undefined : { background: w.coverTone }}>
        {w.cover ? (
          <img src={w.cover} alt={w.title} loading="lazy" className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
        ) : (
          <div className="flex h-full items-center justify-center">
            <span className="icon text-[72px]! text-white/90 drop-shadow-lg transition duration-500 group-hover:scale-110">{w.coverIcon}</span>
          </div>
        )}
        <span
          className={`absolute left-4 top-4 rounded-full px-3 py-1 text-[12px] font-bold backdrop-blur ${
            w.status === 'live' ? 'bg-white/90 text-emerald-600' : 'bg-black/25 text-white'
          }`}
        >
          {statusLabel[w.status]}
        </span>
      </div>
      <div className="p-6 md:p-7">
        <p className="font-display text-[12px] font-semibold uppercase tracking-[0.15em] text-brand-dark">{w.category}</p>
        <h3 className="mt-2 flex items-center gap-1 text-[21px] font-bold text-ink">
          {w.title}
          {w.link && <span className="icon text-[20px]! text-muted transition group-hover:translate-x-1 group-hover:text-brand">arrow_outward</span>}
        </h3>
        <p className="mt-3 text-[17px] leading-relaxed text-muted md:text-[15px]">{w.desc}</p>
        <ul className="mt-5 flex flex-wrap gap-x-3 gap-y-1 text-[13px] font-medium text-ink/45">
          {w.tech.map(t => <li key={t}>#{t}</li>)}
        </ul>
      </div>
    </Wrapper>
  )
}

function Works() {
  return (
    <section id="works" className="section section-screen relative overflow-hidden">
      <SectionBg tone="works" blobs={['-left-32 top-1/3 h-[460px] w-[460px] bg-indigo-200/25']} />
      <div className="container-x relative">
        <div className="flex items-end justify-between gap-6">
          <SectionHead eyebrow="Selected Cases" title="精選案例" desc="自主開發的產品與技術實驗，結合 AI 工具加速開發，從構想、設計到上線完整實作。" />
          {/* 左右箭頭（手機版隱藏，用滑動與圓點切換） */}
          <div className="hidden shrink-0 gap-3 md:flex">
            <button type="button" className="works-prev slider-arrow" aria-label="上一組作品">
              <ArrowRight className="rotate-180 translate-x-px" />
            </button>
            <button type="button" className="works-next slider-arrow" aria-label="下一組作品">
              <ArrowRight className="-translate-x-px" />
            </button>
          </div>
        </div>

        {/* 手機版往右延伸到螢幕邊緣（抵銷 container 的 20px 內距），露出的下一張才會貼齊手機邊界 */}
        <Reveal className="mt-14 -mr-5 md:mr-0">
          <Swiper
            modules={[Navigation, Pagination, A11y]}
            className="works-swiper"
            spaceBetween={24}
            slidesPerView={1.08}
            slidesPerGroup={1}
            breakpoints={{
              768: { slidesPerView: 2, slidesPerGroup: 2 },
              1024: { slidesPerView: 3, slidesPerGroup: 3 },
            }}
            navigation={{ prevEl: '.works-prev', nextEl: '.works-next', disabledClass: 'is-disabled' }}
            pagination={{ el: '.works-dots', clickable: true, bulletClass: 'slider-dot', bulletActiveClass: 'is-active' }}
            a11y={{ prevSlideMessage: '上一組作品', nextSlideMessage: '下一組作品', paginationBulletMessage: '前往第 {{index}} 組' }}
          >
            {works.map((w, i) => (
              <SwiperSlide key={i} className="h-auto!">
                <WorkCard w={w} />
              </SwiperSlide>
            ))}
          </Swiper>
          <div className="works-dots slider-dots mt-8 mr-5 md:mr-0" />
        </Reveal>
      </div>
    </section>
  )
}

/* ---------------- Process ---------------- */
// 合作流程自動輪播：每個步驟輪流「往上跳＋icon 動一下」，上一個回到原位，一直循環
const PROCESS_STEP_MS = 2000

function Process() {
  const listRef = useRef<HTMLOListElement>(null)
  const inView = useInView(listRef, { amount: 0.4 })   // 捲出畫面就暫停，省效能
  const [active, setActive] = useState(0)
  const [paused, setPaused] = useState(false)         // 滑鼠停在某個步驟上時暫停在該步驟

  useEffect(() => {
    if (!inView || paused) return
    const timer = setInterval(() => setActive(a => (a + 1) % process.length), PROCESS_STEP_MS)
    return () => clearInterval(timer)
  }, [inView, paused])

  return (
    // 灰底圓角大區塊：不滿版，四周留白（左右由外層 padding、上下由前後區塊的間距撐開）
    // 外層撐滿一個畫面、上下留 48px，灰底區塊填滿其餘高度（從選單點過來時不會看到上下區塊）
    <section id="process" className="section-screen relative overflow-hidden px-3 md:px-6 md:py-12">
      <SectionBg tone="process" blobs={['right-[10%] top-1/3 h-[420px] w-[420px] bg-orange-200/25']} />
      <div className="relative mx-auto flex w-full max-w-400 flex-1 flex-col justify-center py-24 md:py-36 overflow-hidden rounded-[28px] bg-white/60 md:backdrop-blur-sm md:rounded-[40px]">
      {/* 淡淡的格線紋理，上下淡出 */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage: 'linear-gradient(#082642 1px, transparent 1px), linear-gradient(90deg, #082642 1px, transparent 1px)',
          backgroundSize: '56px 56px',
          maskImage: 'radial-gradient(ellipse 60% 45% at 50% 50%, #000 20%, transparent 100%)',
        }}
      />
      <div className="container-x relative">
        <SectionHead eyebrow="Process" title="合作流程" desc="清楚的步驟與階段性預覽，讓你隨時掌握進度。" center />
        <div className="relative mt-16">
          {/* 串起各步驟的連接線：從第一個圓心到最後一個圓心，兩端被圓圈蓋住 */}
          <div className="pointer-events-none absolute left-[10%] right-[10%] top-12 hidden h-0.5 -translate-y-1/2 rounded-full bg-brand/35 md:block" />
          <ol ref={listRef} className="relative grid gap-10 md:grid-cols-5 md:gap-6">
            {process.map((p, i) => {
              const isActive = active === i
              return (
                <motion.li
                  key={p.title}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-60px' }}
                  transition={{ duration: REVEAL_DURATION, delay: i * 0.08 * REVEAL_STAGGER, ease: REVEAL_EASE }}
                  onMouseEnter={() => { setActive(i); setPaused(true) }}
                  onMouseLeave={() => setPaused(false)}
                >
                  {/* 整塊往上跳 */}
                  <motion.div
                    className="flex gap-5 md:flex-col md:items-center md:text-center"
                    animate={{ y: isActive ? -14 : 0 }}
                    transition={{ type: 'spring', stiffness: 420, damping: 18 }}
                  >
                    <span
                      className={`relative z-1 flex h-24 w-24 shrink-0 items-center justify-center rounded-full border-2 transition-[background-color,border-color,color,box-shadow] duration-300 ${
                        isActive
                          ? 'border-brand bg-brand text-white shadow-[0_14px_30px_-12px_rgba(0,155,208,0.7)]'
                          : 'border-brand/60 bg-white text-brand shadow-[0_0_0_6px_rgba(0,155,208,0.08)]'
                      }`}
                    >
                      {/* icon 動態：輕微放大＋左右擺動 */}
                      <motion.span
                        className="icon text-[42px]!"
                        animate={isActive ? { scale: [1, 1.2, 1], rotate: [0, -14, 12, -6, 0] } : { scale: 1, rotate: 0 }}
                        transition={{ duration: 0.8, ease: 'easeInOut' }}
                      >
                        {p.icon}
                      </motion.span>
                    </span>
                    <div className="pt-1 md:pt-0">
                      <p className="font-display text-[12px] font-semibold tracking-[0.15em] text-brand-dark md:mt-5">STEP {String(i + 1).padStart(2, '0')}</p>
                      <h3 className={`mt-1 text-[21px] font-bold transition-colors duration-300 ${isActive ? 'text-brand' : 'text-ink'}`}>{p.title}</h3>
                      <p className="mt-2 text-[17px] leading-relaxed text-ink/85 md:text-[15px]">{p.desc}</p>
                    </div>
                  </motion.div>
                </motion.li>
              )
            })}
          </ol>
        </div>
      </div>
      </div>
    </section>
  )
}

/* ---------------- About ---------------- */
function About() {
  return (
    <section id="about" className="section section-screen relative overflow-hidden">
      <SectionBg tone="about" blobs={['-right-40 top-1/3 h-[480px] w-[480px] bg-emerald-200/25']} />
      <div className="container-x grid items-center gap-12 lg:grid-cols-[1fr_1.2fr] lg:gap-20 relative">
        <Reveal>
          {/* 品牌名片：90×54mm 名片比例；後方疊一張微傾的白卡增加實體感，滑過時名片轉正
              深藍漸層緩慢流動（studio.css 的 .about-card） */}
          <div className="group relative mx-auto w-full max-w-[480px] lg:mx-0">
            <div className="absolute inset-0 rotate-[5deg] rounded-2xl border border-line bg-white shadow-[0_20px_50px_-30px_rgba(8,38,66,0.35)] transition duration-500 group-hover:rotate-[7deg]" />
            <div className="about-card relative flex aspect-[90/54] -rotate-2 flex-col justify-between overflow-hidden rounded-2xl p-7 text-white shadow-[0_30px_60px_-30px_rgba(8,38,66,0.6)] transition duration-500 group-hover:rotate-0 md:p-8">
              {/* 名片光澤 */}
              <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(115deg,transparent_35%,rgba(255,255,255,0.12)_50%,transparent_65%)]" />
              <span className="font-brand pointer-events-none absolute -bottom-8 -right-4 text-[150px] font-bold leading-none text-white/[0.06]">FISH</span>

              {/* 上：品牌名 */}
              <div className="relative flex items-start justify-between">
                <div>
                  <p className="font-brand text-[36px] font-bold leading-none md:text-[40px]">FISH</p>
                  <p className="font-brand mt-2 text-[13px] tracking-[0.3em] text-white/60">STUDIO</p>
                </div>
                <span className="icon text-[28px]! text-white/70">code_blocks</span>
              </div>

              {/* 下：服務與地點 */}
              <div className="relative">
                <p className="font-brand text-[13px] tracking-[0.12em] text-white/80">ONE-STOP DIGITAL STUDIO</p>
                <p className="mt-2 flex items-center gap-1.5 text-[13px] text-white/70">
                  <span className="icon text-[16px]!">location_on</span>
                  {studio.location}
                </p>
              </div>
            </div>
          </div>
        </Reveal>

        <div>
          <SectionHead eyebrow="About" title={about.title} />
          <Reveal delay={0.1}>
            {about.paragraphs.map(p => (
              <p key={p.slice(0, 10)} className="mt-5 text-[17px] leading-[1.9] md:text-[16px] text-ink/85">{p}</p>
            ))}
            {/* 手機版一排兩個、寬度均分，字放大；平板以上維持依字數排列 */}
            <ul className="mt-8 grid grid-cols-2 gap-2 md:flex md:flex-wrap">
              {about.highlights.map(s => (
                <li key={s} className="flex items-center gap-1 rounded-full border border-line bg-white py-2 pl-2.5 pr-3.5 text-[15px] font-medium text-ink/75 md:py-1.5 md:text-[13px]">
                  <span className="icon text-[18px]! text-brand md:text-[16px]!">check</span>
                  {s}
                </li>
              ))}
            </ul>
            <a href={about.cta.href} className="btn btn-primary mt-8">
              {about.cta.label}
              <ArrowRight />
            </a>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

/* ---------------- FAQ ---------------- */
/* 常見問題左下的小裝飾：淺色系、帶立體光影的問號泡泡與幾何圖形，各自緩慢漂浮 */
const SOFT_3D = 'shadow-[inset_-10px_-12px_24px_rgba(8,38,66,0.10),inset_10px_10px_20px_rgba(255,255,255,0.75),0_24px_40px_-22px_rgba(8,38,66,0.35)]'
function FaqDeco() {
  const float = (d: number, y = 10, delay = 0) => ({
    animate: { y: [0, -y, 0] },
    transition: { duration: d, repeat: Infinity, ease: 'easeInOut' as const, delay },
  })
  return (
    <div className="pointer-events-none relative mt-14 hidden h-[280px] w-full max-w-[380px] lg:block" aria-hidden>
      {/* 大問號泡泡 */}
      <motion.div {...float(5, 12)} className={`absolute left-4 top-8 flex h-40 w-40 items-center justify-center rounded-full bg-linear-to-br from-sky-100 to-sky-300 ${SOFT_3D}`}>
        <span className="font-brand text-[88px] font-bold leading-none text-white drop-shadow-[0_4px_8px_rgba(14,116,144,0.35)]">?</span>
      </motion.div>
      {/* 小問號泡泡 */}
      <motion.div {...float(4, 8, 0.6)} className={`absolute left-44 top-0 flex h-16 w-16 items-center justify-center rounded-full bg-linear-to-br from-pink-100 to-rose-300 ${SOFT_3D}`}>
        <span className="font-brand text-[32px] font-bold leading-none text-white">?</span>
      </motion.div>
      {/* 圓弧 */}
      <motion.div {...float(6, 8, 0.3)} className="absolute right-8 top-16 h-28 w-28 rotate-45 rounded-full border-[16px] border-amber-200 border-b-transparent border-l-transparent drop-shadow-[0_12px_14px_rgba(8,38,66,0.12)]" />
      {/* 圓角方塊 */}
      <motion.div {...float(4.5, 10, 1)} className={`absolute bottom-6 left-48 h-16 w-16 rotate-12 rounded-2xl bg-linear-to-br from-emerald-100 to-teal-300 ${SOFT_3D}`} />
      {/* 膠囊 */}
      <motion.div {...float(5.5, 6, 0.8)} className={`absolute bottom-16 right-4 h-10 w-24 -rotate-12 rounded-full bg-linear-to-br from-violet-100 to-violet-300 ${SOFT_3D}`} />
      {/* 小圓點 */}
      <span className="absolute bottom-2 left-10 h-4 w-4 rounded-full bg-sky-200" />
      <span className="absolute left-36 top-44 h-3 w-3 rounded-full bg-rose-200" />
      <span className="absolute right-2 top-6 h-2.5 w-2.5 rounded-full bg-violet-200" />
    </div>
  )
}

function Faq() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)
  return (
    <section id="faq" className="section section-screen relative overflow-hidden">
      <SectionBg tone="faq" blobs={['-left-40 top-1/3 h-[440px] w-[440px] bg-sky-200/25']} />
      <div className="container-x grid gap-12 lg:grid-cols-[1fr_1.6fr] relative">
        <div>
          <SectionHead eyebrow="FAQ" title="常見問題" desc="沒有找到你想問的？歡迎直接透過表單詢問。" />
          <FaqDeco />
        </div>
        <Reveal delay={0.1}>
          {/* 手機版分隔線加深才看得清楚 */}
          <ul className="divide-y divide-ink/20 border-y border-ink/20 md:divide-line md:border-line">
            {faqs.map((f, i) => {
              const open = openIndex === i
              return (
                <li key={f.q}>
                  <button
                    type="button"
                    className="flex w-full items-center justify-between gap-6 py-6 text-left"
                    aria-expanded={open}
                    onClick={() => setOpenIndex(open ? null : i)}
                  >
                    <span className="text-[17px] font-bold text-ink">{f.q}</span>
                    <span className={`icon shrink-0 text-[32px]! text-brand transition-transform duration-300 md:text-[24px]! ${open ? 'rotate-45' : ''}`}>add</span>
                  </button>
                  <AnimatePresence initial={false}>
                    {open && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <p className="pb-6 pr-10 text-[17px] leading-relaxed text-muted md:text-[15px]">{f.a}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </li>
              )
            })}
          </ul>
        </Reveal>
      </div>
    </section>
  )
}

/* ---------------- Contact ---------------- */
function Contact() {
  return (
    <section id="contact" className="section section-screen relative overflow-hidden md:py-12">
      <SectionBg tone="contact" blobs={['-right-40 top-1/4 h-[480px] w-[480px] bg-pink-200/30']} />
      <div className="container-x relative grid gap-12 lg:grid-cols-[1fr_1.5fr] lg:gap-16">
        <Reveal>
          <p className="eyebrow">Contact</p>
          <h2 className="heading">{contact.title}</h2>
          <p className="mt-4 text-[17px] leading-relaxed text-muted md:text-[16px]">{contact.desc}</p>
          <ul className="mt-10 space-y-6">
            {contact.highlights.map(h => (
              <li key={h.title} className="flex items-start gap-5">
                <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-brand/10 ring-1 ring-brand/15">
                  <span className="icon text-[30px]! text-brand">{h.icon}</span>
                </span>
                <div className="pt-1">
                  <p className="text-[17px] font-bold text-ink">
                    {h.title}
                    {'note' in h && h.note && <span className="ml-1.5 text-[12px] font-normal text-ink/45">{h.note}</span>}
                  </p>
                  <p className="mt-1 text-[17px] leading-relaxed text-muted md:text-[14px]">{h.desc}</p>
                </div>
              </li>
            ))}
            {studio.email && (
              <li className="flex items-center gap-5">
                <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-brand/10 ring-1 ring-brand/15">
                  <span className="icon text-[30px]! text-brand">mail</span>
                </span>
                <a href={`mailto:${studio.email}`} className="text-[17px] font-bold text-ink hover:text-brand">{studio.email}</a>
              </li>
            )}
          </ul>
        </Reveal>
        <Reveal delay={0.1} className="text-ink">
          <ContactForm />
        </Reveal>
      </div>
    </section>
  )
}

/* ---------------- Footer ---------------- */
function Footer() {
  return (
    <footer className="border-t border-line bg-white py-10 text-muted">
      {/* 左：Logo；右：選單與版權文字兩行靠左對齊，整塊靠右 */}
      <div className="container-x flex flex-col items-center justify-between gap-6 md:flex-row">
        <Logo />
        <div className="flex flex-col items-center gap-3 md:items-start">
          {/* 項目之間用小圓點隔開（第一項前面不放） */}
          <nav className="flex flex-wrap items-center justify-center gap-x-3.5 gap-y-2 text-[14px] md:justify-start" aria-label="頁尾選單">
            {nav.map((n, i) => (
              <Fragment key={n.id}>
                {i > 0 && <span className="h-1 w-1 rounded-full bg-brand/50" aria-hidden />}
                <a href={`#${n.id}`} className="whitespace-nowrap hover:text-ink">{n.label}</a>
              </Fragment>
            ))}
          </nav>
          <p className="text-[13px]">Copyright © {new Date().getFullYear()} {studio.name}. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  )
}

export default function StudioApp() {
  useSmoothScroll()
  return (
    <MotionConfig reducedMotion="user">
      <Header />
      <main>
        <Hero />
        <WebCard />
        <Services />
        <Works />
        <Pricing />
        <Process />
        <About />
        <Faq />
        <Rescue />
        <Contact />
      </main>
      <Footer />
    </MotionConfig>
  )
}

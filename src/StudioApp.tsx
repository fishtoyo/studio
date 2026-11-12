import { useEffect, useRef, useState, type ReactNode } from 'react'
import { motion, MotionConfig, AnimatePresence, useInView } from 'framer-motion'
import {
  studio, nav, hero, stats, aiBuild, services, webCard, works, statusLabel, type ShowcaseType,
  process, about, faqs, contact, type Work,
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
    <a href="#top" className="flex items-baseline gap-2 font-brand text-ink" aria-label={studio.name}>
      <span className="text-[24px] font-bold tracking-wide">FISH</span>
      <span className="text-[13px] font-semibold tracking-[0.25em] text-ink/50">STUDIO</span>
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
      let current: string | null = null
      for (const id of watch) {
        const el = document.getElementById(id)
        if (el && el.getBoundingClientRect().top <= probe) current = id
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
    const onScroll = () => setScrolled(window.scrollY > 20)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled || open ? 'bg-white/90 shadow-[0_1px_0_rgba(8,38,66,0.08),0_8px_24px_-12px_rgba(8,38,66,0.15)] backdrop-blur-md' : 'bg-transparent'
      }`}
    >
      <div className="container-x flex h-18 items-center justify-between">
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
          <a href="#contact" className="btn btn-sm btn-primary">預約諮詢</a>
        </nav>

        <button
          type="button"
          className="flex h-11 w-11 items-center justify-center rounded-full text-ink lg:hidden"
          aria-label={open ? '關閉選單' : '開啟選單'}
          aria-expanded={open}
          onClick={() => setOpen(o => !o)}
        >
          <span className="icon text-[28px]!">{open ? 'close' : 'menu'}</span>
        </button>
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
            <div className="container-x flex flex-col py-4">
              {nav.map(n => (
                <a
                  key={n.id}
                  href={`#${n.id}`}
                  onClick={() => { select(n.id); setOpen(false) }}
                  aria-current={active === n.id ? 'true' : undefined}
                  className={`flex items-center py-3 text-[18px] font-medium transition-colors ${active === n.id ? 'text-brand' : 'text-ink'}`}
                >
                  <span className={`h-0.5 rounded-full bg-brand transition-all duration-300 ${active === n.id ? 'mr-3 w-5' : 'w-0'}`} />
                  {n.label}
                </a>
              ))}
              <a href="#contact" onClick={() => setOpen(false)} className="btn btn-primary mt-3">預約諮詢</a>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  )
}

/* ---------------- Hero ---------------- */
// Hero 示意圖上的能力標籤：每隔一段時間往上淡出，新項目從下方出現
function RotatingBadge() {
  const [index, setIndex] = useState(0)
  const badge = hero.badges[index]

  useEffect(() => {
    const timer = setInterval(() => setIndex(i => (i + 1) % hero.badges.length), 2600)
    return () => clearInterval(timer)
  }, [])

  return (
    // 外層固定高度，膠囊整顆絕對定位，舊的往上淡出、新的從下方出現
    <div className="relative h-9 w-56" aria-live="polite">
      <AnimatePresence initial={false}>
        <motion.div
          key={badge.text}
          className="absolute left-0 top-0 flex items-center gap-2 whitespace-nowrap rounded-full bg-white px-4 py-2 text-[13px] font-bold text-ink shadow-xl"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -24 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          <span className="icon text-[18px]!" style={{ color: badge.color }}>{badge.icon}</span>
          {badge.text}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

function HeroVisual() {
  return (
    <div className="relative hidden aspect-[5/4] lg:block" aria-hidden="true">
      {/* 設計稿視窗 */}
      <motion.div
        className="absolute left-0 top-6 w-[78%] overflow-hidden rounded-2xl border border-line bg-white shadow-[0_30px_60px_-25px_rgba(8,38,66,0.3)]"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: REVEAL_DURATION, delay: 0.3 * REVEAL_STAGGER, ease: REVEAL_EASE }}
      >
        <div className="flex items-center gap-1.5 border-b border-line px-4 py-3">
          <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
          <span className="ml-3 h-5 flex-1 rounded-md bg-paper" />
        </div>
        <div className="space-y-4 p-6">
          <div className="h-28 rounded-xl" style={{ background: 'linear-gradient(120deg,#066786,#28aad6)' }} />
          <div className="h-3 w-2/3 rounded bg-ink/80" />
          <div className="h-2.5 w-full rounded bg-line" />
          <div className="h-2.5 w-5/6 rounded bg-line" />
          <div className="grid grid-cols-3 gap-3 pt-2">
            <div className="h-16 rounded-lg bg-paper" />
            <div className="h-16 rounded-lg bg-paper" />
            <div className="h-16 rounded-lg bg-paper" />
          </div>
        </div>
      </motion.div>

      {/* 程式碼視窗 */}
      <motion.div
        className="absolute bottom-0 right-0 w-[62%] rounded-2xl border border-navy/10 bg-[#0d1f33] p-5 font-mono text-[12.5px] leading-6 shadow-2xl"
        initial={{ opacity: 0, x: 20, y: 10 }}
        animate={{ opacity: 1, x: 0, y: 0 }}
        transition={{ duration: REVEAL_DURATION, delay: 0.5 * REVEAL_STAGGER, ease: REVEAL_EASE }}
      >
        <p><span className="text-[#c792ea]">export</span> <span className="text-[#82aaff]">function</span> <span className="text-[#ffcb6b]">Fish</span><span className="text-white/60">() {'{'}</span></p>
        <p className="pl-4"><span className="text-[#c792ea]">return</span> <span className="text-white/60">(</span></p>
        <p className="pl-8"><span className="text-[#f07178]">&lt;section</span> <span className="text-[#ffcb6b]">className</span><span className="text-white/60">=</span><span className="text-[#c3e88d]">"fish"</span><span className="text-[#f07178]">&gt;</span></p>
        <p className="pl-12 text-white/80">把好的設計，</p>
        <p className="pl-12 text-white/80">做成好用的網站。</p>
        <p className="pl-8"><span className="text-[#f07178]">&lt;/section&gt;</span></p>
        <p className="pl-4 text-white/60">)</p>
        <p className="text-white/60">{'}'}</p>
      </motion.div>

      {/* 能力標籤：定時往上切換 */}
      <motion.div
        className="absolute -left-4 bottom-16"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.9 * REVEAL_STAGGER, ease: REVEAL_EASE }}
      >
        <RotatingBadge />
      </motion.div>
    </div>
  )
}

function Hero() {
  return (
    <section id="top" className="relative flex min-h-svh flex-col overflow-hidden bg-white pb-12 pt-28 text-ink md:pb-16 md:pt-32">
      {/* 背景：格線 + 光暈 */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage: 'linear-gradient(#082642 1px, transparent 1px), linear-gradient(90deg, #082642 1px, transparent 1px)',
          backgroundSize: '64px 64px',
          maskImage: 'radial-gradient(ellipse at 30% 40%, #000 30%, transparent 75%)',
        }}
      />
      <div className="pointer-events-none absolute -right-40 -top-40 h-[560px] w-[560px] rounded-full bg-brand/15 blur-[120px]" />
      <div className="pointer-events-none absolute -left-40 top-[30%] h-[480px] w-[480px] rounded-full bg-sky-200/40 blur-[120px]" />

      <div className="container-x relative grid flex-1 content-center items-center gap-16 lg:grid-cols-[1.05fr_1fr]">
        <div>
          <motion.p className="eyebrow" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: REVEAL_DURATION, ease: REVEAL_EASE }}>
            {hero.eyebrow}
          </motion.p>
          <motion.h1
            className="mt-5 text-[40px] font-black leading-[1.2] tracking-tight sm:text-[52px] xl:text-[64px]"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: REVEAL_DURATION, delay: 0.1 * REVEAL_STAGGER, ease: REVEAL_EASE }}
          >
            {hero.title[0]}
            <br />
            <span className="bg-linear-to-r from-brand to-[#0b4f8a] bg-clip-text text-transparent">{hero.title[1]}</span>
          </motion.h1>
          <motion.p
            className="mt-6 max-w-xl text-[16px] leading-relaxed text-muted md:text-[18px]"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: REVEAL_DURATION, delay: 0.2 * REVEAL_STAGGER, ease: REVEAL_EASE }}
          >
            {hero.desc}
          </motion.p>
          <motion.div
            className="mt-10 flex flex-wrap gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: REVEAL_DURATION, delay: 0.3 * REVEAL_STAGGER, ease: REVEAL_EASE }}
          >
            <a href="#contact" className="btn btn-primary">
              {hero.primary}
              <ArrowRight />
            </a>
            <a href="#works" className="btn btn-ghost">{hero.secondary}</a>
          </motion.div>
        </div>

        <HeroVisual />
      </div>

      {/* 數字實績 */}
      <div className="container-x relative mt-16 md:mt-20">
        <div className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-line bg-line shadow-[0_20px_50px_-30px_rgba(8,38,66,0.25)] md:grid-cols-4">
          {stats.map((s, i) => (
            <Reveal key={s.label} delay={i * 0.08} className="bg-white px-6 py-8 md:px-9 md:py-9">
              <p className="font-display text-[42px] font-bold leading-none md:text-[52px]">
                {s.value}<span className="ml-1 text-[22px] text-brand md:text-[28px]">{s.unit}</span>
              </p>
              <p className="mt-3 text-[16px] text-muted md:text-[17px]">{s.label}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ---------------- AI 快速架站 ---------------- */
// 進度條：每次進入畫面都重新跑（離開畫面時瞬間歸零），來回捲動都看得到
function TimelineBar({ ratio, bar, duration, active }: { ratio: number; bar: string; duration: number; active: boolean }) {
  return (
    <div className="mt-3 h-3 overflow-hidden rounded-full bg-paper">
      <motion.div
        className={`h-full rounded-full ${bar}`}
        initial={{ width: 0 }}
        animate={{ width: active ? `${ratio * 100}%` : 0 }}
        transition={active ? { duration, delay: 0.25, ease: [0.25, 0.8, 0.35, 1] } : { duration: 0 }}
      />
    </div>
  )
}

function AiBuild() {
  const { compare } = aiBuild
  // 以「時程比較」這一段是否進入畫面來觸發（手機上整個面板比螢幕高，不能用整個面板判斷）
  const timelineRef = useRef<HTMLDivElement>(null)
  const panelInView = useInView(timelineRef, { amount: 0.6 })
  const ticks = Array.from({ length: compare.scaleWeeks + 1 }, (_, i) => i)

  const rows = [
    { ...compare.traditional, bar: 'bg-slate-300', text: 'text-ink/50', duration: 2.8 },
    { ...compare.ai, bar: 'bg-linear-to-r from-violet-500 to-brand', text: 'text-violet-600', duration: 1.6 },
  ]

  // 高度至少為「視窗高 − header」，內容垂直置中：捲到這裡時畫面只會看到這一塊
  return (
    <section id="ai" className="relative flex min-h-[calc(100svh-4.5rem)] items-center py-14 md:py-8">
      <div className="container-x">
        {/* 上：左側標題、右側說明與按鈕（桌機左右並排，手機上下排列） */}
        <Reveal className="grid items-end gap-6 lg:grid-cols-[1.1fr_1fr] lg:gap-16">
          <div>
            <p className="inline-flex items-center gap-1.5 rounded-full bg-violet-50 px-3.5 py-1.5 font-display text-[12px] font-semibold uppercase tracking-[0.15em] text-violet-600 ring-1 ring-violet-200">
              <span className="icon text-[16px]!">auto_awesome</span>
              {aiBuild.eyebrow}
            </p>
            <h2 className="mt-4 text-[30px] font-bold leading-tight tracking-tight text-ink md:text-[42px]">
              {aiBuild.title}
              <br />
              <span className="bg-linear-to-r from-violet-600 to-brand bg-clip-text text-transparent">
                {aiBuild.titleAccent[0]}<br className="sm:hidden" />{aiBuild.titleAccent[1]}
              </span>
            </h2>
          </div>
          <div>
            <p className="text-[15px] leading-relaxed text-muted md:text-[17px]">{aiBuild.desc}</p>
          </div>
        </Reveal>

        {/* 下：加寬的面板（時程比較＋四項優勢） */}
        <Reveal delay={0.1} className="mt-8">
          <div className="rounded-3xl border border-line bg-white p-6 shadow-[0_30px_80px_-40px_rgba(8,38,66,0.3)] md:p-8">
            <p className="text-[15px] font-bold text-muted">{compare.title}</p>

            <div ref={timelineRef} className="mt-3 space-y-5">
              {rows.map(row => (
                <div key={row.label}>
                  <div className="flex items-baseline justify-between">
                    <span className="text-[16px] font-bold text-ink md:text-[17px]">{row.label}</span>
                    <motion.span
                      className={`font-display text-[18px] font-bold md:text-[20px] ${row.text}`}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: panelInView ? 1 : 0 }}
                      transition={panelInView ? { duration: 0.4, delay: 0.25 + row.duration * 0.85 } : { duration: 0 }}
                    >
                      {row.value}
                    </motion.span>
                  </div>
                  <TimelineBar ratio={row.ratio} bar={row.bar} duration={row.duration} active={panelInView} />
                </div>
              ))}

              {/* 週數刻度 */}
              <div className="relative h-5 text-[12px] text-ink/40">
                {ticks.map(t => (
                  <span
                    key={t}
                    className="absolute top-0 -translate-x-1/2 whitespace-nowrap first:translate-x-0 last:-translate-x-full"
                    style={{ left: `${(t / compare.scaleWeeks) * 100}%` }}
                  >
                    {t === 0 ? '0' : `${t} 週`}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-6 grid gap-5 border-t border-line pt-6 sm:grid-cols-2 lg:grid-cols-4">
              {aiBuild.features.map((f, i) => (
                <Reveal key={f.title} delay={0.15 + i * 0.08}>
                  <div className="group h-full rounded-2xl bg-linear-to-b from-violet-50/70 to-sky-50/50 p-5 ring-1 ring-violet-100/80 transition duration-300 hover:-translate-y-1 hover:shadow-[0_20px_40px_-24px_rgba(76,29,149,0.35)]">
                    {/* icon 與標題水平排列 */}
                    <div className="card-head">
                      <span className="card-icon bg-linear-to-br from-violet-500 to-brand text-white shadow-[0_10px_20px_-10px_rgba(124,58,237,0.6)] transition duration-300 group-hover:scale-105">
                        <span className="icon">{f.icon}</span>
                      </span>
                      <h3 className="card-title">{f.title}</h3>
                    </div>
                    <p className="card-desc">{f.desc}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </Reveal>

        {/* 按鈕：區塊最下方、水平置中 */}
        <Reveal delay={0.2} className="mt-8 flex justify-center">
          <a href="#contact" className="btn bg-linear-to-r from-violet-500 to-brand text-white shadow-[0_10px_30px_-10px_rgba(139,92,246,0.7)] hover:brightness-110">
            {aiBuild.cta}
            <ArrowRight />
          </a>
        </Reveal>
      </div>
    </section>
  )
}

/* ---------------- Services ---------------- */
// 六張服務卡片各自的淡色底（主色不重複）
const serviceTones = [
  { card: 'bg-sky-50 border-sky-100 hover:border-sky-300',             icon: 'bg-sky-500/10 text-sky-600 group-hover:bg-sky-500' },
  { card: 'bg-violet-50 border-violet-100 hover:border-violet-300',    icon: 'bg-violet-500/10 text-violet-600 group-hover:bg-violet-500' },
  { card: 'bg-emerald-50 border-emerald-100 hover:border-emerald-300', icon: 'bg-emerald-500/10 text-emerald-600 group-hover:bg-emerald-500' },
  { card: 'bg-amber-50 border-amber-100 hover:border-amber-300',       icon: 'bg-amber-500/10 text-amber-600 group-hover:bg-amber-500' },
  { card: 'bg-rose-50 border-rose-100 hover:border-rose-300',          icon: 'bg-rose-500/10 text-rose-600 group-hover:bg-rose-500' },
  { card: 'bg-indigo-50 border-indigo-100 hover:border-indigo-300',    icon: 'bg-indigo-500/10 text-indigo-600 group-hover:bg-indigo-500' },
]

function Services() {
  return (
    <section id="services" className="section section-screen">
      <div className="container-x">
        <SectionHead eyebrow="Services" title="我們能為你做什麼" desc="不論你是需要一個完整網站的品牌主，還是需要可靠前端夥伴的設計團隊，都能找到合適的合作方式。" />
        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((s, i) => (
            <Reveal key={s.title} delay={(i % 3) * 0.08}>
              <article className={`group h-full rounded-2xl border p-7 backdrop-blur-sm transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_48px_-24px_rgba(8,38,66,0.25)] ${serviceTones[i % serviceTones.length].card}`}>
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

/* ---------------- 網站類型（Responsive Website） ---------------- */
// 裝飾用 QR Code 圖樣（非真實可掃描），固定亂數種子讓每次畫面一致
const QR_SIZE = 21
const qrCells = (() => {
  let seed = 7
  const rand = () => ((seed = (seed * 9301 + 49297) % 233280) / 233280)
  const inFinder = (x: number, y: number) =>
    (x < 8 && y < 8) || (x > QR_SIZE - 9 && y < 8) || (x < 8 && y > QR_SIZE - 9)
  const cells: [number, number][] = []
  for (let y = 0; y < QR_SIZE; y++)
    for (let x = 0; x < QR_SIZE; x++)
      if (!inFinder(x, y) && rand() > 0.52) cells.push([x, y])
  return cells
})()

function QrPattern({ className = '' }: { className?: string }) {
  const finder = (x: number, y: number) => (
    <g key={`${x}-${y}`}>
      <rect x={x} y={y} width="7" height="7" rx="1.2" fill="currentColor" />
      <rect x={x + 1} y={y + 1} width="5" height="5" rx="0.8" fill="#fff" />
      <rect x={x + 2} y={y + 2} width="3" height="3" rx="0.6" fill="currentColor" />
    </g>
  )
  return (
    <svg viewBox={`0 0 ${QR_SIZE} ${QR_SIZE}`} className={className} aria-hidden="true">
      {qrCells.map(([x, y]) => <rect key={`${x}-${y}`} x={x} y={y} width="1" height="1" rx="0.25" fill="currentColor" />)}
      {finder(0, 0)}
      {finder(QR_SIZE - 7, 0)}
      {finder(0, QR_SIZE - 7)}
    </svg>
  )
}

/* 網站類型示意：每種網站類型依序展示手機 → 平板 → 電腦，播完左右滑到下一種類型 */
type CardDevice = 'phone' | 'tablet' | 'desktop'
const cardDevices: { id: CardDevice; label: string; icon: string }[] = [
  { id: 'phone', label: '手機', icon: 'smartphone' },
  { id: 'tablet', label: '平板', icon: 'tablet_mac' },
  { id: 'desktop', label: '電腦', icon: 'desktop_windows' },
]
const CARD_DEVICE_MS = 3800
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
  return (
    <div className="flex w-[520px] flex-col items-center">
      <div className={`w-full rounded-2xl bg-ink p-2.5 ${SHADOW}`}>
        <div className="h-[310px] overflow-hidden rounded-lg bg-white">
          {/* 瀏覽器網址列 */}
          <div className="flex items-center gap-2 border-b border-line bg-paper px-3 py-2">
            <span className="flex gap-1">
              <i className="h-2 w-2 rounded-full bg-rose-300" /><i className="h-2 w-2 rounded-full bg-amber-300" /><i className="h-2 w-2 rounded-full bg-emerald-300" />
            </span>
            <span className="ml-2 flex flex-1 items-center gap-1 rounded-md bg-white px-2 py-0.5 text-[10px] text-muted">
              <span className="icon text-[11px]!">lock</span>{url}
            </span>
          </div>
          {children}
        </div>
      </div>
      {/* 螢幕支架 */}
      <div className="h-8 w-16 bg-linear-to-b from-ink/80 to-ink/60" />
      <div className="h-2 w-40 rounded-full bg-ink/70" />
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

/* ---- 形象網站 ---- */
function CardLogo({ size = 'h-22 w-22 text-[40px]' }: { size?: string }) {
  return (
    <div className={`flex shrink-0 items-center justify-center rounded-2xl border-4 border-white bg-linear-to-br from-amber-400 to-rose-400 text-white shadow-md ${size}`}>
      <span className="icon" style={{ fontSize: 'inherit' }}>{webCard.sample.logoIcon}</span>
    </div>
  )
}
function CardActions({ compact = false }: { compact?: boolean }) {
  return (
    <div className="grid grid-cols-4 gap-2">
      {webCard.sample.actions.map(a => (
        <div key={a.label} className="flex flex-col items-center gap-1.5">
          <span className={`flex items-center justify-center rounded-2xl bg-brand/10 text-brand ${compact ? 'h-9 w-9' : 'h-11 w-11'}`}>
            <Ico name={a.icon} className={compact ? 'text-[18px]!' : 'text-[22px]!'} />
          </span>
          <span className="text-[11px] text-ink/70">{a.label}</span>
        </div>
      ))}
    </div>
  )
}
function CardLinks({ grid = false }: { grid?: boolean }) {
  return (
    <ul className={grid ? 'grid grid-cols-3 gap-2' : 'space-y-2'}>
      {webCard.sample.links.map(l => (
        <li
          key={l}
          className={`flex items-center rounded-xl border border-line py-2.5 text-[12px] font-medium whitespace-nowrap text-ink ${grid ? 'justify-center px-2' : 'justify-between px-3.5'}`}
        >
          {l}
          {!grid && <Ico name="chevron_right" className="text-[16px]! text-muted" />}
        </li>
      ))}
    </ul>
  )
}
const CardContact = () => <p className="rounded-xl bg-brand py-2.5 text-center text-[12px] font-bold text-white">立即聯絡</p>
const thumbTones = ['from-sky-200 to-sky-100', 'from-violet-200 to-violet-100', 'from-amber-200 to-amber-100']

function BrandScreen({ device }: { device: CardDevice }) {
  const { sample } = webCard
  if (device === 'phone') return (
    <PhoneFrame>
      <div className="about-card h-28" />
      <div className="px-5 text-center">
        <div className="-mt-11 flex justify-center"><CardLogo /></div>
        <p className="mt-3 text-[20px] font-bold text-ink">{sample.name}</p>
        <p className="mt-0.5 text-[13px] text-muted">{sample.role}</p>
        <div className="mt-5"><CardActions /></div>
        <div className="mt-5 text-left"><CardLinks /></div>
        <div className="mt-4"><CardContact /></div>
      </div>
    </PhoneFrame>
  )
  if (device === 'tablet') return (
    <TabletFrame>
      <div className="about-card h-32" />
      <div className="px-8">
        <div className="flex gap-4">
          <div className="-mt-12"><CardLogo size="h-24 w-24 text-[44px]" /></div>
          <div className="pt-3">
            <p className="text-[22px] font-bold text-ink">{sample.name}</p>
            <p className="text-[13px] text-muted">{sample.role}</p>
          </div>
        </div>
        <div className="mt-6"><CardActions /></div>
        <div className="mt-6"><CardLinks grid /></div>
        <div className="mt-4 grid grid-cols-3 gap-2">
          {thumbTones.map(c => <div key={c} className={`aspect-4/3 rounded-lg bg-linear-to-br ${c}`} />)}
        </div>
        <div className="mt-5"><CardContact /></div>
      </div>
    </TabletFrame>
  )
  return (
    <DesktopFrame url={sample.url}>
      <div className="about-card h-20" />
      <div className="grid grid-cols-[150px_1fr] gap-6 px-6">
        <div className="-mt-10">
          <CardLogo size="h-20 w-20 text-[36px]" />
          <p className="mt-3 text-[16px] font-bold text-ink">{sample.name}</p>
          <p className="text-[12px] text-muted">{sample.role}</p>
          <div className="mt-4"><CardContact /></div>
        </div>
        <div className="pt-4">
          <CardActions compact />
          <div className="mt-4"><CardLinks grid /></div>
          <div className="mt-3 grid grid-cols-3 gap-2">
            {thumbTones.map(c => <div key={c} className={`aspect-video rounded-md bg-linear-to-br ${c}`} />)}
          </div>
        </div>
      </div>
    </DesktopFrame>
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
      <div className="flex items-center justify-between px-5 pb-3 pt-11">
        <ShopLogo className="text-[16px]" />
        <span className="flex items-center gap-3"><Ico name="search" className="text-[20px]! text-ink" /><CartIcon /></span>
      </div>
      <ShopBanner className="mx-4 h-28" />
      <div className="mt-3 flex gap-2 px-4">
        {shopCats.map((c, i) => <span key={c} className={`rounded-full px-3 py-1 text-[11px] ${i === 0 ? 'bg-ink text-white' : 'bg-paper text-ink/70'}`}>{c}</span>)}
      </div>
      <div className="mt-3 grid grid-cols-2 gap-3 px-4">
        {shopProducts.slice(0, 4).map(p => <ProductCard key={p.name} p={p} />)}
      </div>
      <TabBar items={[['home', '首頁'], ['grid_view', '分類'], ['shopping_cart', '購物車'], ['person', '會員']]} />
    </PhoneFrame>
  )
  if (device === 'tablet') return (
    <TabletFrame>
      <div className="flex items-center justify-between px-6 pb-3 pt-5">
        <ShopLogo className="text-[18px]" />
        <span className="flex items-center gap-4"><Ico name="search" className="text-[20px]! text-ink" /><Ico name="person" className="text-[20px]! text-ink" /><CartIcon /></span>
      </div>
      <ShopBanner className="mx-6 h-32" />
      <div className="mt-4 flex gap-2 px-6">
        {shopCats.map((c, i) => <span key={c} className={`rounded-full px-3 py-1 text-[11px] ${i === 0 ? 'bg-ink text-white' : 'bg-paper text-ink/70'}`}>{c}</span>)}
      </div>
      <div className="mt-4 grid grid-cols-3 gap-3 px-6">
        {shopProducts.map(p => <ProductCard key={p.name} p={p} />)}
      </div>
    </TabletFrame>
  )
  return (
    <DesktopFrame url="lumi.shop">
      <div className="flex items-center justify-between border-b border-line px-5 py-2.5">
        <ShopLogo className="text-[14px]" />
        <span className="flex gap-4 text-[11px] text-ink/70">{['新品', '服飾', '居家', '香氛', '會員專區'].map(m => <span key={m}>{m}</span>)}</span>
        <span className="flex items-center gap-3"><Ico name="search" className="text-[18px]! text-ink" /><Ico name="person" className="text-[18px]! text-ink" /><CartIcon /></span>
      </div>
      <div className="px-5 pt-3">
        <ShopBanner className="h-20" />
        <div className="mt-3 grid grid-cols-4 gap-3">
          {shopProducts.slice(0, 4).map(p => <ProductCard key={p.name} p={p} small />)}
        </div>
      </div>
    </DesktopFrame>
  )
}

/* ---- APP（預約會員 App ＋ 電腦版管理後台） ---- */
const appBookings = [
  { day: '12', week: '週四', title: '剪髮＋護髮', time: '14:00・Lily 設計師' },
  { day: '28', week: '週六', title: '染髮療程', time: '10:30・Amber 設計師' },
]
function MemberCard({ className = '' }: { className?: string }) {
  return (
    <div className={`rounded-2xl bg-linear-to-br from-violet-500 to-brand p-4 text-white ${className}`}>
      <div className="flex items-center justify-between">
        <p className="font-brand text-[12px] font-bold tracking-[0.2em]">BLOOM</p>
        <span className="rounded-full bg-white/20 px-2 py-0.5 text-[9px] font-bold">GOLD</span>
      </div>
      <p className="mt-4 text-[10px] text-white/70">會員點數</p>
      <p className="text-[22px] font-bold leading-tight">1,280</p>
    </div>
  )
}
const appActions: [string, string][] = [['event', '預約'], ['redeem', '點數'], ['confirmation_number', '優惠券'], ['history', '紀錄']]
function AppActions() {
  return (
    <div className="grid grid-cols-4 gap-2">
      {appActions.map(([icon, label]) => (
        <div key={label} className="flex flex-col items-center gap-1">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-50 text-violet-500"><Ico name={icon} className="text-[20px]!" /></span>
          <span className="text-[10px] text-ink/70">{label}</span>
        </div>
      ))}
    </div>
  )
}
function BookingItem({ b }: { b: (typeof appBookings)[number] }) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-line p-2.5">
      <div className="flex h-10 w-10 shrink-0 flex-col items-center justify-center rounded-lg bg-brand/10 text-brand">
        <span className="text-[13px] font-bold leading-none">{b.day}</span>
        <span className="text-[8px]">{b.week}</span>
      </div>
      <div className="min-w-0">
        <p className="text-[12px] font-bold text-ink">{b.title}</p>
        <p className="text-[10px] text-muted">{b.time}</p>
      </div>
    </div>
  )
}

function AppScreen({ device }: { device: CardDevice }) {
  if (device === 'phone') return (
    <PhoneFrame>
      <div className="px-5 pt-11">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[11px] text-muted">早安</p>
            <p className="text-[18px] font-bold text-ink">Amy</p>
          </div>
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-paper text-ink"><Ico name="notifications" className="text-[20px]!" /></span>
        </div>
        <MemberCard className="mt-4" />
        <div className="mt-4"><AppActions /></div>
        <p className="mt-4 text-[13px] font-bold text-ink">即將到來的預約</p>
        <div className="mt-2 space-y-2">{appBookings.map(b => <BookingItem key={b.day} b={b} />)}</div>
      </div>
      <TabBar items={[['home', '首頁'], ['calendar_month', '預約'], ['loyalty', '會員卡'], ['person', '我的']]} />
    </PhoneFrame>
  )
  if (device === 'tablet') return (
    <TabletFrame>
      <div className="grid h-full grid-cols-[1fr_1.1fr] gap-4 p-5">
        <div>
          <p className="text-[11px] text-muted">早安</p>
          <p className="text-[20px] font-bold text-ink">Amy</p>
          <MemberCard className="mt-4" />
          <div className="mt-4"><AppActions /></div>
          <div className="mt-4 space-y-2">{appBookings.map(b => <BookingItem key={b.day} b={b} />)}</div>
        </div>
        {/* 預約日曆 */}
        <div className="rounded-2xl bg-paper p-3">
          <p className="text-[13px] font-bold text-ink">選擇預約時間</p>
          <div className="mt-3 grid grid-cols-7 gap-1 text-center text-[9px] text-muted">
            {['日', '一', '二', '三', '四', '五', '六'].map(d => <span key={d}>{d}</span>)}
            {Array.from({ length: 28 }, (_, i) => (
              <span key={i} className={`rounded-md py-1 text-[10px] ${i === 11 ? 'bg-brand font-bold text-white' : 'text-ink/70'}`}>{i + 1}</span>
            ))}
          </div>
          <div className="mt-3 grid grid-cols-3 gap-1.5">
            {['10:00', '11:30', '13:00', '14:00', '15:30', '17:00'].map((t, i) => (
              <span key={t} className={`rounded-md py-1.5 text-center text-[10px] ${i === 3 ? 'bg-brand text-white' : 'bg-white text-ink/70'}`}>{t}</span>
            ))}
          </div>
          <p className="mt-3 rounded-lg bg-brand py-2 text-center text-[11px] font-bold text-white">確認預約</p>
        </div>
      </div>
    </TabletFrame>
  )
  return (
    <DesktopFrame url="admin.bloom.app">
      <div className="grid h-full grid-cols-[110px_1fr]">
        {/* 後台側欄 */}
        <div className="bg-ink px-3 py-3 text-white">
          <p className="font-brand text-[11px] font-bold tracking-[0.2em]">BLOOM</p>
          <ul className="mt-3 space-y-1 text-[10px]">
            {[['dashboard', '總覽'], ['calendar_month', '預約管理'], ['group', '會員'], ['redeem', '點數'], ['settings', '設定']].map(([icon, label], i) => (
              <li key={label} className={`flex items-center gap-1.5 rounded-md px-2 py-1.5 ${i === 0 ? 'bg-white/15' : 'text-white/60'}`}>
                <Ico name={icon} className="text-[13px]!" />{label}
              </li>
            ))}
          </ul>
        </div>
        <div className="p-3">
          <p className="text-[12px] font-bold text-ink">營運總覽</p>
          <div className="mt-2 grid grid-cols-3 gap-2">
            {[['今日預約', '18'], ['本月新會員', '46'], ['本月營收', '86K']].map(([k, v]) => (
              <div key={k} className="rounded-lg border border-line p-2">
                <p className="text-[9px] text-muted">{k}</p>
                <p className="text-[15px] font-bold text-ink">{v}</p>
              </div>
            ))}
          </div>
          {/* 長條圖 */}
          <div className="mt-2 flex h-16 items-end gap-1.5 rounded-lg border border-line px-2 pb-1.5 pt-2">
            {[40, 62, 48, 75, 58, 90, 70].map((h, i) => (
              <div key={i} className="flex-1 rounded-sm bg-linear-to-t from-violet-400 to-brand" style={{ height: `${h}%` }} />
            ))}
          </div>
          <div className="mt-2 space-y-1">
            {appBookings.map(b => (
              <div key={b.day} className="flex justify-between rounded-md bg-paper px-2 py-1 text-[9px] text-ink/70">
                <span>{b.day} 日・{b.title}</span><span>{b.time.split('・')[0]}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DesktopFrame>
  )
}

function ShowcaseScreen({ type, device }: { type: ShowcaseType; device: CardDevice }) {
  if (type === 'shop') return <ShopScreen device={device} />
  if (type === 'app') return <AppScreen device={device} />
  return <BrandScreen device={device} />
}

/* ---- 輪播狀態：kind 記錄這次是「換裝置」還是「換整塊」，決定轉場方式 ---- */
type ShowcasePos = { type: number; device: number; kind: 'device' | 'type'; dir: 1 | -1 }
const deviceVariants = {
  enter: { opacity: 0, scale: 0.92, y: 16 },
  center: { opacity: 1, scale: 1, y: 0 },
  exit: { opacity: 0, scale: 0.96, y: -10 },
}
// 整塊左右滑動：舊的一塊往左滑出、新的一塊從右側滑入（往回則相反）
const slideVariants = {
  enter: (dir: number) => ({ x: `${dir * 100}%`, opacity: 0 }),
  center: { x: '0%', opacity: 1 },
  exit: (dir: number) => ({ x: `${dir * -100}%`, opacity: 0 }),
}

function WebCard() {
  const { types } = webCard
  const sliderRef = useRef<HTMLDivElement>(null)
  const inView = useInView(sliderRef, { amount: 0.4 })
  const [pos, setPos] = useState<ShowcasePos>({ type: 0, device: 0, kind: 'device', dir: 1 })
  const [paused, setPaused] = useState(false)

  // 自動播放：手機 → 平板 → 電腦，播完整塊滑到下一種網站類型
  // 每次畫面切換（含手動點選）都重新計時，避免剛點完就被自動切走
  useEffect(() => {
    if (!inView || paused) return
    const timer = setTimeout(() => {
      setPos(p => p.device < cardDevices.length - 1
        ? { ...p, device: p.device + 1, kind: 'device' }
        : { type: (p.type + 1) % types.length, device: 0, kind: 'type', dir: 1 })
    }, CARD_DEVICE_MS)
    return () => clearTimeout(timer)
  }, [inView, paused, pos, types.length])

  const goType = (i: number, dir: 1 | -1) => setPos({ type: (i + types.length) % types.length, device: 0, kind: 'type', dir })
  const goDevice = (i: number) => setPos(p => ({ ...p, device: i, kind: 'device' }))

  const current = types[pos.type]
  const device = cardDevices[pos.device].id

  return (
    <section id="card" className="section section-screen relative overflow-hidden">
      {/* 背景淡淡的光暈，和前後白底區塊做出區隔 */}
      <div className="pointer-events-none absolute -right-40 top-1/4 h-[520px] w-[520px] rounded-full bg-sky-100/60 blur-[120px]" />
      <div className="pointer-events-none absolute -left-40 bottom-0 h-[420px] w-[420px] rounded-full bg-violet-100/50 blur-[120px]" />

      <div className="container-x relative">
        <Reveal>
          {/* 輪播：兩塊疊在同一格，轉場時舊的滑出、新的同時滑入 */}
          <div ref={sliderRef} className="grid" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
            <AnimatePresence initial={false} custom={pos.dir}>
              <motion.div
                key={current.id}
                custom={pos.dir}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.8, ease: REVEAL_EASE }}
                className="col-start-1 row-start-1 grid items-center gap-12 lg:grid-cols-[1fr_1.15fr] lg:gap-20"
              >
                {/* 左：裝置示意（手機 → 平板 → 電腦） */}
                <div className="order-2 lg:order-1">
                  {/* 舞台：520×600 依螢幕等比縮小 */}
                  <div className="relative mx-auto h-[400px] w-full max-w-[520px] sm:h-[540px]">
                    <div className="absolute left-1/2 top-0 h-[600px] w-[520px] origin-top -translate-x-1/2 scale-[0.66] sm:scale-90">
                      <AnimatePresence mode="wait" initial={false}>
                        <motion.div
                          key={device}
                          variants={deviceVariants}
                          initial="enter"
                          animate="center"
                          exit="exit"
                          transition={{ duration: 0.5, ease: REVEAL_EASE }}
                          className="absolute inset-0 flex items-center justify-center"
                        >
                          <ShowcaseScreen type={current.id} device={device} />
                        </motion.div>
                      </AnimatePresence>

                      {/* 浮動：分享網址 */}
                      <motion.div
                        className="absolute -left-6 top-2 z-10 flex items-center gap-2 rounded-full bg-white py-2 pl-2.5 pr-4 text-[13px] font-bold text-ink shadow-xl"
                        animate={{ y: [0, -8, 0] }}
                        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
                      >
                        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-brand text-white">
                          <Ico name="link" className="text-[16px]!" />
                        </span>
                        {current.url}
                      </motion.div>

                      {/* QR Code：固定不動，每隔幾秒彈大一下 */}
                      <motion.div
                        className="absolute -right-[17px] bottom-6 z-10 rounded-2xl bg-white p-3 text-center shadow-xl"
                        animate={{ scale: [1, 1.12, 0.97, 1] }}
                        transition={{ duration: 0.6, times: [0, 0.4, 0.7, 1], ease: 'easeOut', repeat: Infinity, repeatDelay: 3.4, delay: 1.5 }}
                      >
                        <QrPattern className="h-20 w-20 text-ink" />
                        <p className="mt-2 text-[11px] font-bold text-ink/70">掃描開啟網站</p>
                      </motion.div>
                    </div>
                  </div>

                  {/* 目前裝置（輕量指示，也可點選） */}
                  <div className="mt-4 flex justify-center gap-6" aria-label="裝置版型">
                    {cardDevices.map((d, i) => (
                      <button
                        key={d.id}
                        type="button"
                        aria-pressed={i === pos.device}
                        onClick={() => goDevice(i)}
                        className={`flex items-center gap-1 text-[14px] font-medium transition-colors duration-300 ${i === pos.device ? 'text-brand' : 'text-ink/35 hover:text-ink/60'}`}
                      >
                        <Ico name={d.icon} className="text-[18px]!" />
                        {d.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 右：這一塊的說明 */}
                <div className="order-1 lg:order-2">
                  <p className="eyebrow">{webCard.eyebrow}</p>
                  <h2 className="heading">
                    {current.label}，
                    <br />
                    <span className="bg-linear-to-r from-brand to-violet-500 bg-clip-text text-transparent">{current.accent}</span>
                  </h2>
                  <p className="lead">{current.desc}</p>
                  <ul className="mt-6 flex flex-wrap gap-2">
                    {current.audiences.map(a => (
                      <li key={a} className="rounded-full border border-line bg-white px-3.5 py-1.5 text-[13px] font-medium text-ink/75">{a}</li>
                    ))}
                  </ul>
                  <a href="#contact" className="btn btn-primary mt-9">
                    洽談合作
                    <ArrowRight />
                  </a>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* 輪播控制：左右箭頭＋圓點（與精選作品同一套樣式） */}
          <div className="mt-8 flex items-center justify-center gap-5">
            <button type="button" className="slider-arrow" aria-label="上一種網站類型" onClick={() => goType(pos.type - 1, -1)}>
              <ArrowRight className="rotate-180 translate-x-px" />
            </button>
            <div className="slider-dots">
              {types.map((t, i) => (
                <button
                  key={t.id}
                  type="button"
                  aria-label={`前往${t.label}`}
                  className={`slider-dot ${i === pos.type ? 'is-active' : ''}`}
                  onClick={() => i !== pos.type && goType(i, i > pos.type ? 1 : -1)}
                />
              ))}
            </div>
            <button type="button" className="slider-arrow" aria-label="下一種網站類型" onClick={() => goType(pos.type + 1, 1)}>
              <ArrowRight className="-translate-x-px" />
            </button>
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
        <p className="mt-3 text-[15px] leading-relaxed text-muted">{w.desc}</p>
        <ul className="mt-5 flex flex-wrap gap-x-3 gap-y-1 text-[13px] font-medium text-ink/45">
          {w.tech.map(t => <li key={t}>#{t}</li>)}
        </ul>
      </div>
    </Wrapper>
  )
}

function Works() {
  return (
    <section id="works" className="section section-screen bg-paper">
      <div className="container-x">
        <div className="flex items-end justify-between gap-6">
          <SectionHead eyebrow="Selected Works" title="精選作品" desc="自主開發的產品與技術實驗，結合 AI 工具加速開發，從構想、設計到上線完整實作。" />
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

        <Reveal className="mt-14">
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
          <div className="works-dots slider-dots mt-8" />
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
    <section id="process" className="section-screen px-3 md:px-6 md:py-12">
      <div className="relative mx-auto flex w-full max-w-400 flex-1 flex-col justify-center py-24 md:py-36 overflow-hidden rounded-[28px] bg-paper md:rounded-[40px]">
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
                      <p className="mt-2 text-[15px] leading-relaxed text-ink/75">{p.desc}</p>
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
    <section id="about" className="section section-screen">
      <div className="container-x grid items-center gap-12 lg:grid-cols-[1fr_1.2fr] lg:gap-20">
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
                <p className="font-brand text-[13px] tracking-[0.12em] text-white/80">WEB DESIGN &amp; FRONT-END</p>
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
              <p key={p.slice(0, 10)} className="mt-5 text-[16px] leading-[1.9] text-ink/75">{p}</p>
            ))}
            <ul className="mt-8 flex flex-wrap gap-2">
              {about.highlights.map(s => (
                <li key={s} className="flex items-center gap-1 rounded-full border border-line bg-white py-1.5 pl-2.5 pr-3.5 text-[13px] font-medium text-ink/75">
                  <span className="icon text-[16px]! text-brand">check</span>
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
function Faq() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)
  return (
    <section id="faq" className="section section-screen bg-paper">
      <div className="container-x grid gap-12 lg:grid-cols-[1fr_1.6fr]">
        <SectionHead eyebrow="FAQ" title="常見問題" desc="沒有找到你想問的？歡迎直接透過表單詢問。" />
        <Reveal delay={0.1}>
          <ul className="divide-y divide-line border-y border-line">
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
                    <span className={`icon shrink-0 text-brand transition-transform duration-300 ${open ? 'rotate-45' : ''}`}>add</span>
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
                        <p className="pb-6 pr-10 text-[15px] leading-relaxed text-muted">{f.a}</p>
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
    <section id="contact" className="section relative">
      <div className="container-x relative grid gap-12 lg:grid-cols-[1fr_1.5fr] lg:gap-16">
        <Reveal>
          <p className="eyebrow">Contact</p>
          <h2 className="heading">{contact.title}</h2>
          <p className="mt-4 text-[16px] leading-relaxed text-muted">{contact.desc}</p>
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
                  <p className="mt-1 text-[14px] leading-relaxed text-muted">{h.desc}</p>
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
      <div className="container-x flex flex-col items-center justify-between gap-6 md:flex-row">
        <Logo />
        <nav className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-[14px]" aria-label="頁尾選單">
          {nav.map(n => <a key={n.id} href={`#${n.id}`} className="hover:text-ink">{n.label}</a>)}
        </nav>
        <p className="text-[13px]">© {new Date().getFullYear()} {studio.name}</p>
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
        <AiBuild />
        <Services />
        <WebCard />
        <Works />
        <Process />
        <About />
        <Faq />
        <Contact />
      </main>
      <Footer />
    </MotionConfig>
  )
}

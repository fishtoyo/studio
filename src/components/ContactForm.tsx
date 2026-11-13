import { useState, type FormEvent } from 'react'
import { contact, studio } from '../content'

type Status = 'idle' | 'sending' | 'success' | 'error'

// 靜態網站表單：透過 Web3Forms 轉寄到信箱，不需要自己的後端
export function ContactForm() {
  const [status, setStatus] = useState<Status>('idle')
  const [services, setServices] = useState<string[]>([])
  const isPreview = !studio.formAccessKey

  const toggleService = (s: string) =>
    setServices(prev => (prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]))

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget
    const data = new FormData(form)

    // 防機器人：隱藏欄位被填寫就直接略過
    if (data.get('botcheck')) return

    setStatus('sending')

    // 預覽模式：尚未設定 access key，只模擬送出流程
    if (isPreview) {
      await new Promise(r => setTimeout(r, 800))
      setStatus('success')
      form.reset()
      setServices([])
      return
    }

    data.set('access_key', studio.formAccessKey)
    data.set('subject', `【${studio.name}】新的合作詢問：${data.get('name')}`)
    data.set('from_name', studio.name)
    data.set('需求類型', services.join('、') || '未選擇')

    try {
      const res = await fetch('https://api.web3forms.com/submit', { method: 'POST', body: data })
      const json = await res.json()
      if (json.success) {
        setStatus('success')
        form.reset()
        setServices([])
      } else {
        setStatus('error')
      }
    } catch {
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <div className="flex min-h-105 flex-col items-center justify-center rounded-3xl border border-line bg-white p-10 text-center shadow-[0_30px_60px_-30px_rgba(8,38,66,0.25)]">
        <span className="icon text-[56px]! text-brand">mark_email_read</span>
        <h3 className="mt-4 text-[22px] font-bold">已收到你的訊息！</h3>
        <p className="mt-2 text-muted">
          我們會在 {studio.responseTime}，請留意你的信箱。
          <br /><span className="text-[13px] text-muted/80">{studio.responseNote}</span>
          {isPreview && <><br /><span className="text-[13px] text-amber-600">（目前為預覽模式，表單尚未實際寄出）</span></>}
        </p>
        <button type="button" onClick={() => setStatus('idle')} className="btn btn-outline mt-8">
          再填一份
        </button>
      </div>
    )
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-3xl border border-line bg-white p-6 md:p-10 shadow-[0_30px_60px_-30px_rgba(8,38,66,0.25)]"
    >
      <input type="checkbox" name="botcheck" className="hidden" tabIndex={-1} autoComplete="off" />

      <div className="grid gap-5 md:grid-cols-2">
        <label className="block">
          <span className="mb-2 block text-[14px] font-bold">姓名 <span className="text-brand">*</span></span>
          <input name="name" required className="field" placeholder="王小明" autoComplete="name" />
        </label>
        <label className="block">
          <span className="mb-2 block text-[14px] font-bold">公司／品牌</span>
          <input name="company" className="field" placeholder="選填" autoComplete="organization" />
        </label>
        <label className="block">
          <span className="mb-2 block text-[14px] font-bold">Email <span className="text-brand">*</span></span>
          <input name="email" type="email" required className="field" placeholder="you@example.com" autoComplete="email" />
        </label>
        <label className="block">
          <span className="mb-2 block text-[14px] font-bold">電話／LINE</span>
          <input name="phone" className="field" placeholder="選填" autoComplete="tel" />
        </label>
      </div>

      <fieldset className="mt-6">
        <legend className="mb-3 text-[14px] font-bold">需求類型（可複選）</legend>
        <div className="flex flex-wrap gap-2">
          {contact.serviceOptions.map(s => {
            const active = services.includes(s)
            return (
              <button
                key={s}
                type="button"
                aria-pressed={active}
                onClick={() => toggleService(s)}
                className={`rounded-full border px-4 py-2 text-[14px] font-medium transition ${
                  active
                    ? 'border-brand bg-brand text-white'
                    : 'border-line bg-white text-ink/80 hover:border-brand hover:text-brand'
                }`}
              >
                {s}
              </button>
            )
          })}
        </div>
      </fieldset>

      <label className="mt-6 block">
        <span className="mb-2 block text-[14px] font-bold">方案與預算</span>
        <span className="relative block">
          <select name="budget" className="field appearance-none pr-10" defaultValue={contact.budgetOptions[0]}>
            {contact.budgetOptions.map(b => <option key={b}>{b}</option>)}
          </select>
          <span className="icon pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-muted">expand_more</span>
        </span>
      </label>

      <label className="mt-6 block">
        <span className="mb-2 block text-[14px] font-bold">需求說明 <span className="text-brand">*</span></span>
        <textarea
          name="message"
          required
          rows={3}
          className="field resize-y"
          placeholder="簡單描述你的網站需求、參考網站或預計上線時間…"
        />
      </label>

      {status === 'error' && (
        <p className="mt-4 text-[14px] text-red-600">送出失敗，請稍後再試{studio.email && <>，或直接來信 {studio.email}</>}。</p>
      )}

      <button type="submit" disabled={status === 'sending'} className="btn btn-primary mt-8 w-full md:w-auto disabled:opacity-60">
        {status === 'sending' ? '送出中…' : '送出需求'}
        <span className="icon text-[20px]!">send</span>
      </button>
    </form>
  )
}

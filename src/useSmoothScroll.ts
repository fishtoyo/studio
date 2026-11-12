import { useEffect } from 'react'
import Lenis from 'lenis'
import 'lenis/dist/lenis.css'

/** 滑鼠滾輪每一格的捲動倍率：數字越大，輕滾一下走得越遠（約 3 格就能到下一塊） */
const MOUSE_WHEEL_BOOST = 3

/**
 * 判斷是不是觸控板：觸控板會送出大量小幅度（常帶小數）的捲動，
 * 滑鼠滾輪則是一格約 100px 的整數。Chrome / Safari 另有 wheelDeltaY 可輔助判斷。
 * 觸控板不放大，避免一滑就衝太遠、難以控制。
 */
function isTrackpad(e: WheelEvent & { wheelDeltaY?: number }) {
  if (e.deltaMode !== 0) return false                       // 以「行」為單位：一定是滑鼠滾輪（Firefox）
  if (!Number.isInteger(e.deltaY)) return true              // 帶小數：觸控板
  if (e.wheelDeltaY) return e.wheelDeltaY === -3 * e.deltaY // Chrome / Safari 觸控板的特徵
  return Math.abs(e.deltaY) < 50
}

/**
 * 平滑捲動：滾輪捲動時帶慣性減速；滑鼠滾輪的位移加大，輕滾一下就順勢滑到下一塊附近。
 * 不會自動吸附或定位，停在哪裡完全由使用者決定。
 * - 手機觸控維持原生捲動（syncTouch 預設關閉）
 * - 系統開啟「減少動態效果」時自動改回一般捲動（respectReducedMotion 預設開啟）
 */
export function useSmoothScroll() {
  useEffect(() => {
    const lenis = new Lenis({
      lerp: 0.08,                             // 平滑程度：越小越滑順、越大越跟手（0～1）
      anchors: true,                          // 頁內錨點也用平滑捲動（避開 header 的距離沿用 CSS scroll-padding-top）
      autoRaf: true,
      virtualScroll: data => {
        if (data.event.type === 'wheel' && !isTrackpad(data.event as WheelEvent)) {
          data.deltaY *= MOUSE_WHEEL_BOOST
        }
        return true
      },
    })
    return () => lenis.destroy()
  }, [])
}

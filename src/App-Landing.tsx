// ============================================================
// RAISE — Interactive Presentation v5 «Deep Space»
// Тёмная база + одна световая вспышка. Пара Manrope/Inter.
// Библиотека анимаций, чередование композиции, крупные 3D-элементы,
// табы услуг, лента команды, чистые ассеты без «призраков».
// ============================================================
import React, { useEffect, useRef, useState } from 'react'
import {
  motion,
  AnimatePresence,
  useScroll,
  useSpring,
  useTransform,
  useReducedMotion,
  useInView,
  useMotionValueEvent,
} from 'framer-motion'

const NB = ' '
const nb = (t: string) => t.replace(/(^|[\s(«])(а|и|в|во|с|со|к|о|у|на|не|ни|но|по|за|до|от|из|для|это|как|или)\s/gi, (_m, p, w) => `${p}${w}\u00A0`)
const easeO = [0.22, 1, 0.36, 1] as const

// ---------- Иконки навигации ----------
const I = {
  home: (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>),
  problem: (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>),
  method: (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>),
  services: (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2 2 7l10 5 10-5-10-5z"/><path d="m2 17 10 5 10-5"/><path d="m2 12 10 5 10-5"/></svg>),
  team: (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>),
  cases: (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>),
  contact: (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>),
}
const NAV = [
  { id: 'intro', label: 'Интро', icon: I.home },
  { id: 'problem', label: 'Проблема', icon: I.problem },
  { id: 'method', label: 'Метод', icon: I.method },
  { id: 'services', label: 'Услуги', icon: I.services },
  { id: 'team', label: 'Команда', icon: I.team },
  { id: 'cases', label: 'Кейсы', icon: I.cases },
  { id: 'contact', label: 'Контакты', icon: I.contact },
]

// ---------- Крупные 3D-элементы мира питч-дека ----------
const g1 = 'url(#gA)'
const DeckDefs = () => (
  <defs>
    <linearGradient id="gA" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stopColor="#D94FC0" /><stop offset="1" stopColor="#EE8A4A" />
    </linearGradient>
  </defs>
)
const OBJ = {
  slide: (s = 150) => (
    <svg width={s} height={s * 0.72} viewBox="0 0 150 108" fill="none">
      <rect x="4" y="4" width="142" height="100" rx="10" stroke={g1} strokeWidth="2.5" />
      <rect x="18" y="22" width="70" height="9" rx="4.5" fill={g1} opacity="0.9" />
      <rect x="18" y="42" width="112" height="5" rx="2.5" stroke={g1} strokeWidth="1.6" opacity="0.55" />
      <rect x="18" y="56" width="96" height="5" rx="2.5" stroke={g1} strokeWidth="1.6" opacity="0.55" />
      <rect x="18" y="74" width="42" height="14" rx="7" stroke={g1} strokeWidth="2" />
    </svg>
  ),
  chart: (s = 130) => (
    <svg width={s} height={s} viewBox="0 0 130 130" fill="none">
      <path d="M10 120h110" stroke={g1} strokeWidth="2.5" opacity="0.6" />
      <rect x="20" y="78" width="20" height="42" rx="4" stroke={g1} strokeWidth="2.5" />
      <rect x="55" y="52" width="20" height="68" rx="4" stroke={g1} strokeWidth="2.5" />
      <rect x="90" y="20" width="20" height="100" rx="4" fill={g1} opacity="0.85" />
    </svg>
  ),
  ring: (s = 130) => (
    <svg width={s} height={s} viewBox="0 0 130 130" fill="none">
      <circle cx="65" cy="65" r="48" stroke={g1} strokeWidth="14" opacity="0.35" />
      <path d="M65 17a48 48 0 0 1 46 35" stroke={g1} strokeWidth="14" strokeLinecap="round" />
    </svg>
  ),
  arrow: (s = 140) => (
    <svg width={s} height={s} viewBox="0 0 140 140" fill="none">
      <path d="M18 122 84 56M60 34l46-14-14 46M84 56l22-22" stroke={g1} strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  deal: (s = 150) => (
    <svg width={s} height={s * 0.78} viewBox="0 0 150 117" fill="none">
      <rect x="6" y="6" width="106" height="105" rx="10" stroke={g1} strokeWidth="2.5" />
      <rect x="22" y="26" width="60" height="7" rx="3.5" fill={g1} opacity="0.9" />
      <rect x="22" y="44" width="74" height="4.5" rx="2" stroke={g1} strokeWidth="1.4" opacity="0.5" />
      <rect x="22" y="56" width="64" height="4.5" rx="2" stroke={g1} strokeWidth="1.4" opacity="0.5" />
      <path d="M22 88c10-10 18 6 30-6" stroke={g1} strokeWidth="3" strokeLinecap="round" />
      <circle cx="118" cy="86" r="24" stroke={g1} strokeWidth="3" />
      <path d="M107 86l8 8 16-17" stroke={g1} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
}

// Фоновое поле фигур (вдалеке, вращаются)
function DeckField() {
  const reduced = useReducedMotion()
  const { scrollYProgress } = useScroll()
  // три плана глубины + горизонтальный дрейф
  const y1 = useTransform(scrollYProgress, [0, 1], [0, -200])   // ближний
  const y2 = useTransform(scrollYProgress, [0, 1], [0, -420])   // средний
  const y3 = useTransform(scrollYProgress, [0, 1], [0, -760])   // дальний (быстрый)
  const x1 = useTransform(scrollYProgress, [0, 1], [0,  28])    // дрейф вправо
  const x2 = useTransform(scrollYProgress, [0, 1], [0, -22])    // дрейф влево
  if (reduced) return null
  return (
    <div className="deck-field" aria-hidden="true">
      <motion.div className="deck-el" style={{ top: '14%', left: '6%', y: y1, x: x1, opacity: 0.22 }}><div className="spin-a">{OBJ.slide(130)}</div></motion.div>
      <motion.div className="deck-el" style={{ top: '55%', left: '10%', y: y3, x: x2, opacity: 0.12 }}><div className="spin-b">{OBJ.ring(72)}</div></motion.div>
      <motion.div className="deck-el" style={{ top: '28%', right: '8%', y: y2, x: x2, opacity: 0.18 }}><div className="spin-c">{OBJ.chart(105)}</div></motion.div>
      <motion.div className="deck-el" style={{ top: '72%', right: '13%', y: y1, x: x1, opacity: 0.22 }}><div className="spin-a">{OBJ.arrow(95)}</div></motion.div>
      <motion.div className="deck-el" style={{ top: '40%', left: '50%', y: y3, x: x1, opacity: 0.08 }}><div className="spin-b">{OBJ.slide(60)}</div></motion.div>
    </div>
  )
}

// ---------- Библиотека анимаций (чередуем, не повторяя подряд) ----------
const VARIANTS: Record<string, any> = {
  up: { hidden: { opacity: 0, y: 36 }, show: { opacity: 1, y: 0 } },
  left: { hidden: { opacity: 0, x: -70 }, show: { opacity: 1, x: 0 } },
  right: { hidden: { opacity: 0, x: 70 }, show: { opacity: 1, x: 0 } },
  depth: { hidden: { opacity: 0, scale: 1.35 }, show: { opacity: 1, scale: 1 } },
  rise: { hidden: { opacity: 0, scale: 0.82, y: 50 }, show: { opacity: 1, scale: 1, y: 0 } },
  tilt: { hidden: { opacity: 0, rotate: -4, y: 40 }, show: { opacity: 1, rotate: 0, y: 0 } },
  wipe: { hidden: { opacity: 0, clipPath: 'inset(0 100% 0 0)' }, show: { opacity: 1, clipPath: 'inset(0 0% 0 0)' } },
  blur: { hidden: { opacity: 0, y: 22 }, show: { opacity: 1, y: 0 } },
  zoom: { hidden: { opacity: 0, scale: 0.6 }, show: { opacity: 1, scale: 1 } },
  flipX: { hidden: { opacity: 0, rotateX: 65, y: 30 }, show: { opacity: 1, rotateX: 0, y: 0 } },
  skew: { hidden: { opacity: 0, rotateX: -16, y: 36 }, show: { opacity: 1, rotateX: 0, y: 0 } },
  swipe: { hidden: { opacity: 0, x: -120, rotate: -2 }, show: { opacity: 1, x: 0, rotate: 0 } },
  maskUp: { hidden: { opacity: 0, clipPath: 'inset(100% 0 0 0)' }, show: { opacity: 1, clipPath: 'inset(0% 0 0 0)' } },
  drop: { hidden: { opacity: 0, y: -60, scale: 1.06 }, show: { opacity: 1, y: 0, scale: 1 } },
}
function Reveal({ children, v = 'up', i = 0, className }: { children: React.ReactNode; v?: keyof typeof VARIANTS; i?: number; className?: string }) {
  const reduced = useReducedMotion()
  if (reduced) return <div className={className}>{children}</div>
  return (
    <motion.div
      className={className}
      variants={VARIANTS[v]}
      initial="hidden"
      whileInView="show"
      transition={{ duration: 0.75, delay: i * 0.09, ease: easeO }}
      viewport={{ once: true, margin: '-70px' }}
    >
      {children}
    </motion.div>
  )
}

function Kicker({ text }: { text: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  const reduced = useReducedMotion()
  const [shown, setShown] = useState(reduced ? text : '')
  useEffect(() => {
    if (!inView || reduced) { if (inView) setShown(text); return }
    let i = 0
    const id = setInterval(() => { i += 1; setShown(text.slice(0, i)); if (i >= text.length) clearInterval(id) }, 32)
    return () => clearInterval(id)
  }, [inView, text, reduced])
  return <span className="kicker" aria-label={text}><span ref={ref} aria-hidden="true">{shown || ' '}</span></span>
}

const POOL = '0123456789₽€+№XZΔ#%'
function Scramble({ text, className, style }: { text: string; className?: string; style?: React.CSSProperties }) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  const reduced = useReducedMotion()
  const [out, setOut] = useState(reduced ? text : '')
  useEffect(() => {
    if (!inView) return
    if (reduced) { setOut(text); return }
    let frame = 0
    const total = Math.max(24, text.length * 3)
    const id = setInterval(() => {
      frame += 1
      const settled = Math.floor((frame / total) * text.length)
      let s = ''
      for (let i = 0; i < text.length; i++) {
        const ch = text[i]
        if (ch === ' ' || ch === NB) { s += ch; continue }
        s += i < settled ? ch : POOL[Math.floor(Math.random() * POOL.length)]
      }
      setOut(s)
      if (settled >= text.length) { setOut(text); clearInterval(id) }
    }, 34)
    return () => clearInterval(id)
  }, [inView, text, reduced])
  return <span className={className} style={style} aria-label={text}><span ref={ref} aria-hidden="true">{out || ' '}</span></span>
}

// ---------- Контент ----------
const OFFER_THESES = [
  { obj: OBJ.deal(210), text: <>Вы управляете бизнесом и{NB}параллельно пытаетесь собрать инвестиционные материалы</> },
  { obj: OBJ.slide(220), text: <>Презентация собирается из{NB}разрозненных кусков и{NB}не{NB}выдерживает проверки инвестором</> },
  { obj: OBJ.ring(200), text: <>Оффер не{NB}сформулирован, аргументация не{NB}выстроена, позиция не{NB}определена</> },
  { obj: OBJ.chart(210), text: <>Вместо системной подготовки — попытка «успеть собрать что-то к{NB}встрече»</> },
]
const WHY_THESES = [
  { obj: OBJ.ring(200), text: <>Инвестор может не{NB}понимать, что именно вы{NB}предлагаете</> },
  { obj: OBJ.chart(210), text: <>Может не{NB}видеть потенциал масштабирования</> },
  { obj: OBJ.deal(210), text: <>Может не{NB}видеть связи между продуктом, рынком и{NB}возвратом инвестиций</> },
]
const STEPS = [
  { obj: OBJ.slide(210), text: <><b className="grad-text" style={{ display: 'block', marginBottom: 8 }}>Шаг 1 — инвестиционный формат</b>Разбираем бизнес: за{NB}счет чего возникает возврат инвестиций и{NB}где потенциал роста</> },
  { obj: OBJ.chart(210), text: <><b className="grad-text" style={{ display: 'block', marginBottom: 8 }}>Шаг 2 — инвестиционная модель</b>Проверяем экономику и{NB}рынок. Убираем разрывы между продуктом, выручкой и{NB}ростом</> },
  { obj: OBJ.ring(200), text: <><b className="grad-text" style={{ display: 'block', marginBottom: 8 }}>Шаг 3 — аргументация и{NB}материалы</b>Каждый тезис работает на{NB}положительное решение инвестора</> },
  { obj: OBJ.deal(220), text: <><b className="grad-text" style={{ display: 'block', marginBottom: 8 }}>Шаг 4 — реальное взаимодействие</b>Позиция и{NB}коммуникация фаундера, ответы на{NB}вопросы, логика переговоров</> },
]
const REASONS = [
  { t: 'Разрыв в восприятии', d: 'Фаундер описывает продукт, а инвестору важно понять возврат, масштаб и риски. Проект звучит сложно, суть предложения не очевидна.' },
  { t: 'Инвестмодель не проработана', d: 'Не хватает подтвержденных показателей, масштабирование выглядит неопределенным, оценка рынка не связана с реальной выручкой.' },
  { t: 'Нет единой логики', d: 'Аргументы не связаны между собой, ключевые элементы раскрыты частично — инвестор не может быстро сформировать позицию.' },
  { t: 'Позиция не определена', d: 'Не ясно, что именно предлагается инвестору и на каких условиях. Оценка компании не соответствует стадии проекта.' },
]
const RESULTS = [
  { t: 'Ясность предложения', d: 'Инвестор понимает, что предлагается, какой формат сделки обсуждается и за счет чего формируется возврат.' },
  { t: 'Логика роста и экономики', d: 'Связка продукт — рынок — выручка прозрачна. Понятно, за счет чего проект масштабируется.' },
  { t: 'Простое решение', d: 'Вопросы проработаны заранее, аргументы выстроены — проект можно оценить без уточнений.' },
]
const SERVICES = [
  { t: 'Подготовка', items: ['Разбор бизнес-процессов', 'Описание инвест-задачи', 'Анализ бизнес-модели', 'Рекомендации по бизнес-модели'] },
  { t: 'Упаковка', items: ['Смысловая структура', 'Детальный мокап презентации', 'Дизайн презентации', 'Короткий и полный pitch-deck', 'Сценарий выступления'] },
  { t: 'Питч', items: ['Подготовка к выступлению', 'Психологическая подготовка', 'Ораторское искусство', 'Сопровождение на мероприятиях', 'Питчим за вас'] },
  { t: 'Исследования', items: ['Анализ бизнес-модели', 'Анализ рынка (TAM/SAM/SOM)', 'Анализ конкурентов РФ и мира'] },
  { t: 'Инвесторы', items: ['Поиск площадок и инвесторов', 'Сопровождение по поиску', 'Медиа-сопровождение'] },
  { t: 'Прочее', items: ['Консалтинг по мышлению', 'Юридическое сопровождение сделки'] },
]
const TEAM = [
  { name: 'Роман Юсупов', role: 'Маркетинг, продукт, методология', points: ['Основатель «Результхакеры»', 'Со-автор «Методологии» — 2 000+ предпринимателей', 'Директор по продукту в UNITS', 'Вырастил выручку до 20 млн ₽/мес'] },
  { name: 'Денис Бобленков', role: 'Смыслы и инвестиционная упаковка', points: ['11+ лет в упаковке сложных проектов', 'Привлек €200+ млн инвестиций', 'До 1 млрд ₽ выручки через переупаковку смыслов', 'Работает с государством и корпорациями'] },
  { name: 'Руслан Хуснутдинов', role: 'Арт-дирекшн и визуальная коммуникация', points: ['15+ лет визуальных систем', 'Государство, бренды, продукты', 'Смыслы → целостная коммуникация', 'Трижды номинирован в CSS Awards'] },
  { name: 'Леонид Горбунов', role: 'Режиссура и продакшн', points: ['10+ лет видеоконтента', '1000+ реализованных роликов', 'Монтаж самых кассовых фильмов страны', 'Видео усиливает инвестиционную историю'] },
  { name: 'Мария Светлорусова', role: 'Performance и CVM-маркетинг', points: ['Продуктолог бизнес-сообщества Финам', '7 лет: МегаФон, Билайн', 'CLUB 500, Команда А', 'NBO-стратегия: 9 предиктивных моделей'] },
]
type CaseT = { id: string; big: string; title: string; text: string; media: string[]; mock?: boolean }
const CASES: CaseT[] = [
  { id: 'qultura', big: `262${NB}млн${NB}₽`, title: 'инвестиций для премиального ресейлера', text: 'Срочная презентация для бренда «Qultura»: рынок ресейла РФ вырос со 99,4 до 156,7 млрд ₽ — показали инвесторам, как Qultura забирает эту динамику.', media: ['/assets/cases/q-window.png'], mock: true },
  { id: 'geekbrains', big: `№1 по${NB}конверсии`, title: 'упаковка программ GeekBrains', text: 'Упаковка новой программы «Разработчик» стала самой конверсионной посадочной страницей EdTech-компании.', media: ['/assets/cases/gb-b.png', '/assets/cases/gb-a.png'] },
  { id: 'ar', big: 'Первая в истории', title: 'AR-презентация для Правительства России', text: 'Дизайн презентации с дополненной реальностью для форума «Трансформация-3. Цифровая экономика», 2018.', media: ['/assets/cases/ar.png'] },
  { id: 'sber', big: 'Сбер', title: 'платформа «Деловая Среда»', text: 'Посадочная страница, ключевые визуальные элементы и интерфейсы образовательной платформы.', media: ['/assets/cases/sber.png'] },
  { id: 'gorki', big: '«Горки»', title: 'сайт, журнал и бренд-бук бизнес-школы', text: 'Айдентика, коммуникативный дизайн, мерч. Спецпроект — макеты для брендирования самолёта.', media: ['/assets/cases/gorki-a.png', '/assets/cases/gorki-b.png'] },
  { id: 'proauto', big: 'PRO.АВТО', title: 'продающая презентация автоцентра', text: '«Продайте вашу технику, не снимая с рейса, по реальной цене» — аргументация и дизайн для B2B-продаж.', media: ['/assets/cases/proauto-a.png', '/assets/cases/proauto-b.png'] },
  { id: 'gaz', big: '«ГАЗ»', title: 'предложение для концерна', text: 'Презентация Вилгуд и «Willgood IS 2.0»: сложный технический продукт — языком фактов и цифр. Система контролирует сеть из 100+ СТО.', media: ['/assets/cases/gaz-a.png', '/assets/cases/gaz-b.png'] },
]
const CHART = [{ v: 99.4, y: '2018' }, { v: 106.6, y: '2019' }, { v: 108.3, y: '2020' }, { v: 123.1, y: '2021' }, { v: 156.7, y: '2022' }]
const HUBS = [
  { t: 'Разборы питч-деков', d: 'Резиденты показывают презентации — команда дает развернутую обратную связь и точки роста.' },
  { t: 'Питч-деки для стартапов', d: 'Погружение в бизнес-модель, аудит юнит-экономики и Exit-стратегии. Deck, с которым не стыдно идти к фондам.' },
  { t: 'Методологии и шаблоны', d: 'Шаблоны презентаций для резидентов, мероприятия по подготовке питчей и аудиту бизнес-моделей.' },
  { t: 'Воркшопы и хакатоны', d: 'Интенсив на 3 дня: стартапы под руководством команды собирают свои питч-деки.' },
]
const LOGOS = ['moscow', 'onf', 'golf', 'geekbrains', 'getberg', 'niarmedic', 'amocrm', 'rusplenki', 'vilgud']
const LOGO_NAMES: Record<string, string> = { moscow: 'Правительство Москвы', onf: 'ОНФ', golf: 'Moscow City Golf Club', geekbrains: 'GeekBrains', getberg: 'Getberg', niarmedic: 'Ниармедик', amocrm: 'amoCRM', rusplenki: 'Руспленки', vilgud: 'Вилгуд' }

// ---------- Навигация ----------
function useActiveSection(ids: string[]) {
  const [active, setActive] = useState(ids[0])
  useEffect(() => {
    const obs = new IntersectionObserver(
      (es) => es.forEach((e) => { if (e.isIntersecting) setActive(e.target.id) }),
      { rootMargin: '-38% 0px -52% 0px' },
    )
    ids.forEach((id) => { const el = document.getElementById(id); if (el) obs.observe(el) })
    return () => obs.disconnect()
  }, [ids])
  return active
}
const goTo = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })

function SideNav({ active }: { active: string }) {
  return (
    <>
      <nav className="side-nav" aria-label="Разделы">
        {NAV.map((n) => (
          <button key={n.id} className={active === n.id ? 'active' : ''} onClick={() => goTo(n.id)} aria-label={n.label}>
            {n.icon}<span className="tip">{n.label}</span>
          </button>
        ))}
      </nav>
      <nav className="mobile-nav" aria-label="Разделы">
        {NAV.map((n) => (
          <button key={n.id} className={active === n.id ? 'active' : ''} onClick={() => goTo(n.id)}>
            {n.icon}<span>{n.label}</span>
          </button>
        ))}
      </nav>
    </>
  )
}

// ---------- HERO: заголовок один, подблоки по очереди ----------
const HERO_SUBS = [
  { b: 'Полный цикл', t: `от${NB}анализа бизнес-модели до${NB}юридического сопровождения сделок` },
  { b: 'РФ и Мир', t: `работаем с${NB}российскими и${NB}международными проектами` },
  { b: 'Запуск, масштабирование, Exit', t: `поможем на${NB}любой стадии развития проекта` },
]
function Hero() {
  const ref = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] })
  const [idx, setIdx] = useState(-1)
  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    setIdx(Math.min(HERO_SUBS.length - 1, Math.floor(v * (HERO_SUBS.length + 1) * 0.999) - 1))
  })
  if (reduced) {
    return (
      <div id="intro" className="section"><div className="container">
        <div className="hero-logo"><i /> РЕЙЗ</div>
        <h1 className="hero-title">Презентации <span className="grad-text">для привлечения инвестиций</span></h1>
        {HERO_SUBS.map((s) => <div key={s.b} className="hero-sub" style={{ minHeight: 0 }}><b>{s.b}</b><p>{s.t}</p></div>)}
      </div></div>
    )
  }
  return (
    <div id="intro" ref={ref} className="pin-track" style={{ height: `${(HERO_SUBS.length + 1.6) * 100}vh` }}>
      <div className="pin-view" style={{ gridTemplateRows: '1fr auto' }}>
        <div className="container" style={{ alignSelf: 'center', position: 'relative', zIndex: 2, width: '100%' }}>
          <motion.div className="hero-logo" initial={{ opacity: 0, y: -14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <i /> РЕЙЗ
          </motion.div>
          <motion.h1 className="hero-title" initial={{ opacity: 0, scale: 1.18 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1.05, delay: 0.1, ease: easeO }}>
            Презентации <span className="grad-text">для{NB}привлечения инвестиций</span>
          </motion.h1>
          <div className="hero-sub" style={{ position: 'relative' }}>
            <AnimatePresence mode="wait">
              {idx >= 0 && (
                <motion.div
                  key={idx}
                  style={{ position: 'absolute', inset: '0 auto auto 0', maxWidth: '100%' }}
                  initial={{ opacity: 0, scale: 1.45 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.78 }}
                  transition={{ duration: 0.5, ease: easeO }}
                >
                  <b>{HERO_SUBS[idx].b}</b>
                  <p>{HERO_SUBS[idx].t}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
        <div className="scroll-hint" aria-label="Скролл вниз">
          <svg width="22" height="34" viewBox="0 0 22 34" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <rect x="1" y="1" width="20" height="32" rx="10" stroke="currentColor" strokeOpacity="0.4" strokeWidth="1.5"/>
            <rect className="scroll-wheel" x="9.25" y="6" width="3.5" height="7" rx="1.75" fill="currentColor" fillOpacity="0.6"/>
          </svg>
        </div>
      </div>
    </div>
  )
}

// ---------- StepPin с крупным 3D-объектом сцены ----------
function StepPin({ id, kicker, title, items }: {
  id?: string; kicker: string; title: React.ReactNode
  items: { obj: JSX.Element; text: React.ReactNode }[]
}) {
  const ref = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] })
  const [idx, setIdx] = useState(0)
  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    setIdx(Math.max(0, Math.min(items.length - 1, Math.floor(v * items.length * 0.999))))
  })
  if (reduced) {
    return (
      <div id={id} className="section"><div className="container">
        <Kicker text={kicker} /><h2 className="h2">{title}</h2>
        {items.map((it, i) => <div key={i} className="pin-thesis" style={{ marginBottom: 28 }}>{it.text}</div>)}
      </div></div>
    )
  }
  return (
    <div id={id} ref={ref} className="pin-track" style={{ height: `${(items.length + 1) * 100}vh` }}>
      <div className="pin-view">
        <div className="container pin-head">
          <Kicker text={kicker} />
          <h2 className="h2">{title}</h2>
        </div>
        <div className="container pin-body">
          <AnimatePresence mode="wait">
            <motion.div
              key={idx}
              className="pin-thesis"
              style={{ position: 'absolute' }}
              initial={{ opacity: 0, scale: 1.6 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.72 }}
              transition={{ duration: 0.38, ease: easeO }}
            >
              {items[idx].text}
            </motion.div>
          </AnimatePresence>
          <AnimatePresence mode="wait">
            <motion.div
              key={`o${idx}`}
              className="pin-obj"
              initial={{ opacity: 0, scale: 0.5, rotate: -14 }}
              animate={{ opacity: 0.9, scale: 1, rotate: 0 }}
              exit={{ opacity: 0, scale: 1.5 }}
              transition={{ duration: 0.4, ease: easeO }}
            >
              {items[idx].obj}
            </motion.div>
          </AnimatePresence>
        </div>
        <div className="container pin-count">{String(idx + 1).padStart(2, '0')} / {String(items.length).padStart(2, '0')}</div>
      </div>
    </div>
  )
}

// ---------- Секции ----------
function Reasons() {
  return (
    <div className="section">
      <div className="container">
        <Reveal v="wipe"><Kicker text="Причины отказов" /></Reveal>
        <Reveal v="depth" i={1}><h2 className="h2">Основные причины отказов инвесторов</h2></Reveal>
        <div className="grid-2f">
          {REASONS.map((r, i) => (
            <Reveal key={r.t} v={i % 2 ? 'right' : 'left'} i={i}>
              <div className="free-item">
                <span className="idx">{String(i + 1).padStart(2, '0')}</span>
                <h3>{r.t}</h3>
                <p>{nb(r.d)}</p>
              </div>
            </Reveal>
          ))}
        </div>
        <Reveal v="blur" i={4}>
          <p className="lead" style={{ marginTop: 56, maxWidth: '38ch' }}>
            Решение принимается в{NB}неопределенности — чаще всего в{NB}сторону отказа
          </p>
        </Reveal>
      </div>
    </div>
  )
}

// Световая вспышка — единственный светлый акт
function FlashResults() {
  return (
    <div className="flash">
      <div className="section">
        <div className="container" style={{ textAlign: 'center' }}>
          <Reveal v="depth"><Kicker text="Результат" /></Reveal>
          <Reveal v="rise" i={1}>
            <h2 className="h2" style={{ marginInline: 'auto' }}>
              Вы получите структурированное инвестиционное предложение
            </h2>
          </Reveal>
          <Reveal v="blur" i={2}>
            <p className="lead" style={{ marginInline: 'auto', maxWidth: '40ch' }}>
              Инвесторы переходят к{NB}обсуждению условий, а{NB}не{NB}к{NB}прояснению базовых вопросов
            </p>
          </Reveal>
          <div className="grid-3f" style={{ textAlign: 'left' }}>
            {RESULTS.map((r, i) => (
              <Reveal key={r.t} v={['left', 'up', 'right'][i] as any} i={i}>
                <div className="free-item"><h3>{r.t}</h3><p>{nb(r.d)}</p></div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function Services() {
  const [tab, setTab] = useState(0)
  return (
    <>
      <div id="services" className="section">
        <div className="container">
          <Reveal v="zoom"><Kicker text="Услуги" /></Reveal>
          <Reveal v="left" i={1}><h2 className="h2">Состав услуг в{NB}работе над{NB}проектом</h2></Reveal>
          <Reveal v="up" i={2}>
            <div className="tabs" role="tablist" onKeyDown={(e) => { if (e.key === 'ArrowRight') setTab((tab + 1) % SERVICES.length); if (e.key === 'ArrowLeft') setTab((tab + SERVICES.length - 1) % SERVICES.length) }}>
              {SERVICES.map((s, i) => (
                <button key={s.t} id={`svc-tab-${i}`} role="tab" aria-selected={tab === i} aria-controls="svc-panel" className={tab === i ? 'on' : ''} onClick={() => setTab(i)}>{s.t}</button>
              ))}
            </div>
          </Reveal>
          <div className="tab-panel">
            <AnimatePresence mode="wait">
              <motion.ul
                key={tab}
                id="svc-panel"
                role="tabpanel"
                aria-labelledby={`svc-tab-${tab}`}
                initial={{ opacity: 0, x: 46 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -46 }}
                transition={{ duration: 0.4, ease: easeO }}
              >
                {SERVICES[tab].items.map((it) => <li key={it}>{it}</li>)}
              </motion.ul>
            </AnimatePresence>
          </div>
        </div>
      </div>
      <div className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <div className="alt-right">
            <Reveal v="right"><Kicker text="Границы работы" /></Reveal>
            <Reveal v="depth" i={1}><h2 className="h2">Где проходит граница нашей работы</h2></Reveal>
            <Reveal v="up" i={2}>
              <div className="free-item" style={{ marginBottom: 36 }}>
                <h3>Не{NB}подменяем операционную деятельность</h3>
                <p>Не{NB}участвуем в{NB}управлении бизнесом и{NB}не{NB}принимаем решения за{NB}команду.</p>
              </div>
              <div className="free-item">
                <h3>Не{NB}гарантируем привлечение инвестиций</h3>
                <p>Финальное решение всегда за{NB}инвестором: рынок, команда, момент.</p>
              </div>
            </Reveal>
            <Reveal v="blur" i={3}>
              <p className="lead" style={{ marginTop: 44, maxWidth: '38ch' }}>
                Наша задача — повлиять на{NB}то, как проект понимается и{NB}оценивается
              </p>
            </Reveal>
          </div>
        </div>
      </div>
    </>
  )
}

function Team() {
  const initials = (n: string) => n.split(' ').map((w) => w[0]).join('')
  const row = [...TEAM, ...TEAM] // бесшовная лента
  return (
    <div id="team" className="section">
      <div className="container">
        <Reveal v="left"><Kicker text="Команда" /></Reveal>
        <Reveal v="depth" i={1}><h2 className="h2">Команда Рейз</h2></Reveal>
      </div>
      <div className="marquee">
        <div className="marquee-track">
          {row.map((p, i) => (
            <div className="person" key={p.name + i} tabIndex={0}>
              <div className="person-photo"><span className="person-initials">{initials(p.name)}</span></div>
              <h3>{p.name}</h3>
              <div className="person-role">{p.role}</div>
              <ul className="person-dossier">{p.points.map((pt) => <li key={pt}>{nb(pt)}</li>)}</ul>
            </div>
          ))}
        </div>
      </div>
      <div className="container">
        <Reveal v="blur">
          <p className="lead" style={{ marginTop: 48, maxWidth: '44ch', fontSize: '1.15rem' }}>
            30+ специалистов в{NB}командах: аналитики, инвестиционные и{NB}GR-менеджеры, юристы — под{NB}вашу задачу
          </p>
        </Reveal>
      </div>
    </div>
  )
}

function Track() {
  return (
    <div className="section">
      <div className="container">
        <Reveal v="maskUp"><Kicker text="Опыт" /></Reveal>
        <Reveal v="left" i={1}><h2 className="h2">Проекты для государства и{NB}бизнеса любого масштаба</h2></Reveal>
        <Reveal v="depth" i={2}>
          <div className="orbit-wrap" style={{ ['--orbR' as any]: 'min(310px, 38vw)' }}>
            <div className="orbit-ring" />
            <div className="orbit-ring r2" />
            <div className="orbit-center">
              <Scramble className="num grad-text" text="420+" />
              <span>проектов — государство, бренды, стартапы</span>
            </div>
            <div className="orbit-belt">
              {LOGOS.map((l, i) => {
                const a = (360 / LOGOS.length) * i
                return (
                  <span key={l} className="orbit-pos" style={{ transform: `rotate(${a}deg) translate(var(--orbR))` }}>
                    <span className="orbit-upright">
                      <span className="orbit-logo" style={{ transform: `rotate(${-a}deg)` }}>
                        <img src={`/assets/logos/${l}.png`} alt={LOGO_NAMES[l]} loading="lazy" />
                      </span>
                    </span>
                  </span>
                )
              })}
            </div>
          </div>
        </Reveal>
        <div className="stats-row">
          <Reveal v="rise"><div className="stat"><Scramble className="num grad-text" text={`€200${NB}млн+`} /><span>привлеченных инвестиций для международного девелопера</span></div></Reveal>
          <Reveal v="tilt" i={1}><div className="stat"><Scramble className="num grad-text" text={`1${NB}млрд${NB}₽`} /><span>выручки edtech-компании через переупаковку смыслов</span></div></Reveal>
          <Reveal v="drop" i={2}><div className="stat"><Scramble className="num grad-text" text="2000+" /><span>предпринимателей обучены по нашей методологии</span></div></Reveal>
        </div>
        <Reveal v="blur">
          <p className="clients-line">
            Газпром, Mos.ru, Дом.рф, Нострой, Ноприз, Федерация Хоккея России, Автодор, Платон, Cadberry, Сбербанк, Промсвязьбанк, МТС, Elster, 1{NB}канал, ОККО, ИРИ, Start, НМГ-прокат, Централ Партнершип, Genesis, Karcher, Haier, AutoSpot, Esquier, Yappy
          </p>
        </Reveal>
      </div>
    </div>
  )
}

function CaseBig({ text }: { text: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  const reduced = useReducedMotion()
  return (
    <motion.div
      ref={ref}
      className="case-big grad-text"
      initial={reduced ? false : { opacity: 0, scale: 1.55, filter: 'blur(8px)' }}
      animate={inView ? { opacity: 1, scale: 1, filter: 'blur(0px)' } : {}}
      transition={{ duration: 0.75, ease: easeO }}
    >
      <Scramble text={text} />
    </motion.div>
  )
}

function CaseMedia({ media, alt, mock }: { media: string[]; alt: string; mock?: boolean }) {
  const [i, setI] = useState(0)
  const reduced = useReducedMotion()
  const boxRef = useRef<HTMLDivElement>(null)
  const boxIn = useInView(boxRef, { margin: '-10%' })
  const chartRef = useRef<HTMLDivElement>(null)
  const chartIn = useInView(chartRef, { once: true, margin: '-80px' })
  useEffect(() => {
    if (media.length < 2 || reduced || !boxIn) return
    const id = setInterval(() => setI((v) => (v + 1) % media.length), 4600)
    return () => clearInterval(id)
  }, [media.length, reduced, boxIn])
  const max = Math.max(...CHART.map((d) => d.v))
  if (mock) {
    return (
      <div className="media-stage" ref={chartRef}>
        <div className="glow" />
        <div className="mock-win">
          <div className="mock-bar"><i /><i /><i /></div>
          <div className="mock-body"><h4>Динамика российского рынка ресейла одежды, обуви и{NB}аксессуаров</h4></div>
          <div className="chart-live">
            {CHART.map((d, k) => (
              <motion.div
                key={d.y}
                className="bar"
                initial={{ scaleY: 0 }}
                animate={chartIn ? { scaleY: d.v / max } : {}}
                transition={{ duration: 0.9, delay: k * 0.12, ease: easeO }}
                style={{ height: '100%' }}
              >
                <b>{chartIn ? <Scramble text={String(d.v).replace('.', ',')} /> : null}</b>
                <span>{d.y}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    )
  }
  return (
    <div ref={boxRef}>
      <div className="media-stage">
        <div className="glow" />
        <div style={{ position: 'relative', overflow: 'hidden', borderRadius: 12 }}>
          <AnimatePresence mode="popLayout">
            <motion.img
              key={media[i]}
              src={media[i]}
              alt={alt}
              loading="lazy"
              initial={{ opacity: 0, scale: 1.1 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.92 }}
              transition={{ duration: 0.8, ease: easeO }}
            />
          </AnimatePresence>
        </div>
      </div>
      {media.length > 1 && <div className="media-dots">{media.map((m, k) => <button key={m} aria-label={`Слайд ${k + 1}`} className={k === i ? 'on' : ''} onClick={() => setI(k)} />)}</div>}
    </div>
  )
}

function Cases() {
  return (
    <div id="cases" className="section">
      <div className="container">
        <Reveal v="swipe"><Kicker text="Кейсы" /></Reveal>
        <Reveal v="depth" i={1}><h2 className="h2">Работы, которые уже принесли результат</h2></Reveal>
        {CASES.map((c, ci) => (
          <div key={c.id} className="case-block">
            <div className={`case-grid${ci % 2 ? ' flip' : ''}`}>
              <div>
                <Reveal v={ci % 2 ? 'right' : 'left'}>
                  <CaseBig text={c.big} />
                  <h3 className="case-title">{nb(c.title)}</h3>
                  <p className="case-text">{nb(c.text)}</p>
                </Reveal>
              </div>
              <Reveal v={['depth', 'rise', 'tilt'][ci % 3] as any} i={1}>
                <CaseMedia media={c.media} alt={c.title} mock={c.mock} />
              </Reveal>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function Final() {
  return (
    <>
      <div id="contact" className="section">
        <div className="container">
          <Reveal v="right"><Kicker text="Условия" /></Reveal>
          <Reveal v="left" i={1}><h2 className="h2">Условия работы</h2></Reveal>
          <div className="grid-2f">
            <Reveal v="left"><div className="free-item"><h3>Фиксированная стоимость</h3><p>Понятный объем работ и{NB}цена, определенные на{NB}старте.</p></div></Reveal>
            <Reveal v="right" i={1}><div className="free-item"><h3>Модель с{NB}привязкой к{NB}результату</h3><p>Часть вознаграждения привязана к{NB}достижению результата.</p></div></Reveal>
          </div>
          <Reveal v="blur" i={2}><p style={{ marginTop: 28, fontSize: 'var(--t-small)', color: 'var(--fg-soft)' }}>Условия определяются индивидуально под{NB}каждый проект</p></Reveal>
        </div>
      </div>

      <div className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <div className="alt-right">
            <Reveal v="right"><Kicker text="Следующий шаг" /></Reveal>
            <Reveal v="depth" i={1}><h2 className="h2">Рабочая встреча: проект → инвестиционная задача</h2></Reveal>
            <Reveal v="up" i={2}>
              <p className="lead" style={{ marginBottom: 28 }}>Zoom, 60–90{NB}минут</p>
              <div className="free-item">
                <p>Станет понятно: как привлекать деньги, что предлагать инвестору и{NB}где потенциал роста. По{NB}итогам — конкретное видение и{NB}варианты дальнейшей работы.</p>
              </div>
            </Reveal>
          </div>
        </div>
      </div>

      <div className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <Reveal v="flipX"><Kicker text="Для IT-хабов" /></Reveal>
          <Reveal v="left" i={1}><h2 className="h2">IT-хабам и{NB}стартап-акселераторам</h2></Reveal>
          <div className="grid-2f">
            {HUBS.map((h, i) => (
              <Reveal key={h.t} v={i % 2 ? 'right' : 'left'} i={i}>
                <div className="free-item"><h3 style={{ fontSize: '1.2rem' }}>{h.t}</h3><p>{nb(h.d)}</p></div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>

      <div className="section" style={{ paddingTop: 0, paddingBottom: 48 }}>
        <div className="container">
          <Reveal v="depth">
            <h2 className="h2" style={{ maxWidth: '18ch' }}>
              Пишите в{NB}любой мессенджер — запишем на{NB}первую встречу
            </h2>
            <p className="case-text">Первая встреча — знакомство, без{NB}обязательств.</p>
            <div className="contact-list">
              {/* TODO: реальные контакты RAISE */}
              <a href="tel:+70000000000">Телефон</a>
              <a href="https://t.me/raise" target="_blank" rel="noreferrer">Телеграм</a>
              <a href="mailto:hello@raise.ru">Почта</a>
            </div>
          </Reveal>
          <footer className="footer">
            <span>РЕЙЗ © 2026 — Презентации для привлечения инвестиций</span>
            <span>Полный цикл: от{NB}анализа бизнес-модели до{NB}сопровождения сделок</span>
          </footer>
        </div>
      </div>
    </>
  )
}

// ---------- Приложение ----------
export default function AppLanding() {
  const active = useActiveSection(NAV.map((n) => n.id))
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 26, restDelta: 0.001 })

  return (
    <div>
      <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden="true">{DeckDefs()}</svg>
      <div className="space-bg" aria-hidden="true" />
      <div className="aurora" aria-hidden="true"><i /><i /><i /></div>
      <DeckField />
      <motion.div className="progress-bar" style={{ scaleX }} />
      <SideNav active={active} />
      <main>
        <Hero />
        <StepPin
          id="problem"
          kicker="Проблема"
          title={<>Вы фокусируетесь на{NB}бизнесе, <span className="grad-text">а{NB}мы берем на{NB}себя</span> привлечение инвестиций</>}
          items={OFFER_THESES}
        />
        <div className="section" style={{ paddingTop: 0 }}>
          <div className="container">
            <Reveal v="depth">
              <p className="h2" style={{ maxWidth: '30ch' }}>
                Больше не{NB}придется <span className="grad-text">разрываться между бизнесом и{NB}поиском инвестиций</span>
              </p>
            </Reveal>
          </div>
        </div>

        <StepPin
          kicker="Почему возникают сложности"
          title={<>Отказ инвестора часто связан не{NB}с{NB}продуктом,{NB}<span className="grad-text">а{NB}с{NB}подачей</span></>}
          items={WHY_THESES}
        />
        <Reasons />

        <StepPin
          id="method"
          kicker="Метод"
          title={<>Как выстраивается работа с{NB}проектом в{NB}Рейз</>}
          items={STEPS}
        />

        <FlashResults />

        <Services />
        <Team />
        <Track />
        <Cases />
        <Final />
      </main>
    </div>
  )
}

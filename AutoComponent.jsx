import { useState, useEffect, useMemo } from "react";
import {
  Cpu, Smartphone, Globe, Lightbulb, Archive, Search, QrCode, Play, Pause, Github,
  AlertTriangle, Camera, Code2, Video, FlaskConical, Users, Repeat, Sparkles, Coins,
  Home, Boxes, Network, GraduationCap, MonitorPlay, Wifi, Heart, CheckCircle2,
} from "lucide-react";

const REPO_URL = "https://github.com/"; // ← pon aquí el enlace real del repositorio
const TOTAL = 85;
const COLS = 17;

const PARTS = [
  { name: "Resistencia 10k", drawer: 3, spec: "10 kΩ · 1/4 W · ±5%" },
  { name: "Resistencia 220", drawer: 4, spec: "220 Ω · 1/4 W · ±5%" },
  { name: "Capacitor electrolítico 100µF", drawer: 21, spec: "100 µF · 25 V" },
  { name: "Capacitor cerámico 104", drawer: 22, spec: "100 nF · 50 V" },
  { name: "555 Timer", drawer: 37, spec: "NE555 · DIP-8 · temporizador" },
  { name: "LM358", drawer: 38, spec: "Amplificador operacional doble" },
  { name: "LED 5mm rojo", drawer: 52, spec: "2 V · 20 mA" },
  { name: "Transistor 2N2222", drawer: 53, spec: "NPN · TO-92 · 800 mA" },
  { name: "Diodo 1N4007", drawer: 68, spec: "1 A · 1000 V" },
  { name: "Potenciómetro 10k", drawer: 70, spec: "10 kΩ · lineal" },
  { name: "Arduino Nano", drawer: 80, spec: "ATmega328P · 5 V" },
  { name: "ESP32 DevKit", drawer: 85, spec: "Wi-Fi + Bluetooth · 3.3 V" },
];
const CHIPS = ["Resistencia 10k", "Capacitor", "555 Timer", "Diodo"];

const STEPS = [
  { icon: Smartphone, title: "Usuario móvil", text: "Desde el celular, el estudiante o profesor abre la web y escribe el componente que necesita." },
  { icon: Globe, title: "Web (Vento AI)", text: "La aplicación busca el componente en el inventario y envía por internet la orden con el número de cajón." },
  { icon: Cpu, title: "ESP32", text: "La placa recibe la orden por Wi-Fi y decide qué LED de la tira debe encenderse." },
  { icon: Lightbulb, title: "Tira LED", text: "El LED que corresponde al cajón se ilumina en el estante, sin tener que revisar uno por uno." },
  { icon: Archive, title: "Cajón iluminado", text: "La persona ve la luz, abre el cajón y toma el componente en segundos." },
];

const TABS = [
  { id: "inicio", label: "Inicio", icon: Home },
  { id: "problema", label: "El problema", icon: AlertTriangle },
  { id: "arquitectura", label: "Arquitectura & ESP32", icon: Network },
  { id: "retos", label: "Retos & aprendizaje", icon: GraduationCap },
  { id: "demo", label: "Demostración", icon: MonitorPlay },
];

/* ---------- piezas reutilizables ---------- */

const Card = ({ children, className = "" }) => (
  <div className={`rounded-xl border border-[#1c2540] bg-[#0e1424] p-5 ${className}`}>{children}</div>
);

const Title = ({ children, sub }) => (
  <div className="mb-6">
    <h2 className="font-display text-2xl font-bold text-slate-100 sm:text-3xl">{children}</h2>
    {sub && <p className="mt-2 max-w-2xl text-slate-400">{sub}</p>}
  </div>
);

function DrawerGrid({ lit = [], onPick }) {
  return (
    <div className="grid gap-1" style={{ gridTemplateColumns: `repeat(${COLS}, minmax(0, 1fr))` }}>
      {Array.from({ length: TOTAL }, (_, i) => {
        const n = i + 1;
        const on = lit.includes(n);
        return (
          <button
            key={n}
            type="button"
            title={`Cajón ${n}`}
            aria-label={`Cajón ${n}${on ? ", encendido" : ""}`}
            onClick={() => onPick && onPick(n)}
            className={`flex aspect-[4/3] items-end justify-center rounded-[3px] border text-[7px] leading-none transition-colors sm:text-[9px] ${
              on ? "border-cyan-200 bg-cyan-300 font-bold text-[#06202a]" : "border-[#1c2540] bg-[#121a30] text-slate-600"
            }`}
            style={on ? { boxShadow: "0 0 10px #22d3ee, 0 0 24px #22d3ee88" } : undefined}
          >
            <span className="pb-px">{n}</span>
          </button>
        );
      })}
    </div>
  );
}

function FakeQR({ seed }) {
  const size = 11;
  const cells = useMemo(() => {
    let s = seed * 9301 + 49297;
    const rnd = () => ((s = (s * 9301 + 49297) % 233280) / 233280);
    return Array.from({ length: size * size }, (_, i) => {
      const x = i % size, y = Math.floor(i / size);
      const finder = (x < 4 && y < 4) || (x > 6 && y < 4) || (x < 4 && y > 6);
      if (finder) {
        const fx = x > 6 ? x - 7 : x, fy = y > 6 ? y - 7 : y;
        return fx === 0 || fx === 3 || fy === 0 || fy === 3 || (fx === 1 && fy === 1);
      }
      return rnd() > 0.5;
    });
  }, [seed]);
  return (
    <div className="grid w-32 gap-px rounded bg-white p-2" style={{ gridTemplateColumns: `repeat(${size}, 1fr)` }} aria-label={`Código QR del cajón ${seed}`}>
      {cells.map((c, i) => <div key={i} className={`aspect-square ${c ? "bg-[#0b1020]" : "bg-white"}`} />)}
    </div>
  );
}

/* ---------- secciones ---------- */

function Inicio({ go }) {
  const [heroLit, setHeroLit] = useState([18]);
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = setInterval(() => setHeroLit([1 + Math.floor(Math.random() * TOTAL)]), 1400);
    return () => clearInterval(id);
  }, []);

  const logros = [
    { icon: Wifi, t: "ESP32 conectado a la web", d: "La placa recibe órdenes de la aplicación desarrollada con ayuda de Vento AI." },
    { icon: Lightbulb, t: "LEDs que responden a tu búsqueda", d: "Al buscar un componente, su indicador se enciende en el prototipo." },
    { icon: QrCode, t: "85 códigos QR generados", d: "Cada uno guarda la información detallada de un componente." },
    { icon: Smartphone, t: "Control desde cualquier móvil", d: "Funciona con cualquier celular que tenga acceso a internet." },
  ];

  return (
    <>
      <section className="grid items-center gap-10 py-10 lg:grid-cols-2 lg:py-16">
        <div>
          <div className="mb-5 flex flex-wrap gap-2 text-sm">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-violet-400/40 bg-violet-400/10 px-3 py-1 text-violet-200">
              <Heart size={14} /> Proyecto Escolar Sin Fines de Lucro
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-400/40 bg-emerald-400/10 px-3 py-1 text-emerald-200">
              <CheckCircle2 size={14} /> Prototipo Funcional
            </span>
          </div>
          <h1 className="font-display text-5xl font-bold tracking-tight text-slate-50 sm:text-7xl">
            Auto<span className="text-cyan-300">Component</span>
          </h1>
          <p className="mt-4 text-lg text-slate-300">
            Un estante inteligente que enciende una luz en el cajón donde está el componente que buscas.
          </p>
          <p className="mt-3 text-slate-400">David Leonardo Garces Vesga &amp; Julian David Hernandez Quintero</p>
          <div className="mt-7 flex flex-wrap gap-3">
            <button onClick={() => go("demo")} className="inline-flex items-center gap-2 rounded-lg bg-cyan-300 px-5 py-2.5 font-semibold text-[#06202a] hover:bg-cyan-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-300">
              <Play size={18} /> Probar la simulación
            </button>
            <a href={REPO_URL} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-lg border border-[#2a3558] px-5 py-2.5 text-slate-200 hover:border-violet-400">
              <Github size={18} /> Ver código en GitHub
            </a>
          </div>
        </div>
        <Card className="p-4">
          <p className="mb-3 text-sm text-slate-400">Así se ve el estante final: 85 cajones, cada uno con su LED.</p>
          <DrawerGrid lit={heroLit} />
        </Card>
      </section>

      <Title sub="Lo que ya funciona hoy en el prototipo.">Logros técnicos</Title>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {logros.map(({ icon: I, t, d }) => (
          <Card key={t}>
            <I className="mb-3 text-cyan-300" size={26} />
            <h3 className="font-display text-lg font-semibold text-slate-100">{t}</h3>
            <p className="mt-1 text-sm text-slate-400">{d}</p>
          </Card>
        ))}
      </div>
    </>
  );
}

function Problema() {
  const pasos = [
    ["Busca", "Escribes el nombre del componente en la web, por ejemplo “Resistencia 10k”."],
    ["Localiza", "El estante enciende el LED del cajón donde está guardado."],
    ["Retira o guarda", "Tomas la pieza o la devuelves al mismo cajón, siempre en su lugar."],
  ];
  return (
    <>
      <Title sub="Un taller ordenado se usa más. Uno desordenado deja piezas olvidadas.">El problema y la solución</Title>
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="border-rose-400/30">
          <AlertTriangle className="mb-3 text-rose-300" />
          <h3 className="font-display text-xl font-semibold text-slate-100">El problema</h3>
          <p className="mt-2 text-slate-300">
            En el Taller de Electricidad y Electrónica del colegio, muchos componentes están sin usar y desorganizados. Encontrar uno toma tiempo, y a veces nadie sabe que existe.
          </p>
        </Card>
        <Card className="border-emerald-400/30">
          <Sparkles className="mb-3 text-emerald-300" />
          <h3 className="font-display text-xl font-semibold text-slate-100">La solución</h3>
          <p className="mt-2 text-slate-300">
            Un estante inteligente que almacena, gestiona y localiza los componentes de forma rápida e intuitiva. Es un proyecto del colegio, sin costo para nadie.
          </p>
        </Card>
      </div>
      <h3 className="font-display mt-10 mb-4 text-xl font-semibold text-slate-100">¿Cómo funciona la plataforma web?</h3>
      <div className="grid gap-4 md:grid-cols-3">
        {pasos.map(([t, d], i) => (
          <Card key={t}>
            <span className="mb-2 inline-flex h-8 w-8 items-center justify-center rounded-full bg-violet-400/15 font-semibold text-violet-200">{i + 1}</span>
            <h4 className="font-display text-lg font-semibold text-slate-100">{t}</h4>
            <p className="mt-1 text-sm text-slate-400">{d}</p>
          </Card>
        ))}
      </div>
    </>
  );
}

function Arquitectura() {
  const [active, setActive] = useState(0);
  const [playing, setPlaying] = useState(false);
  useEffect(() => {
    if (!playing) return;
    const id = setInterval(() => setActive((a) => (a + 1) % STEPS.length), 1800);
    return () => clearInterval(id);
  }, [playing]);
  const Cur = STEPS[active].icon;

  return (
    <>
      <Title sub="Toca cada etapa o pulsa reproducir para seguir el camino de una búsqueda.">Arquitectura de conexión</Title>
      <Card>
        <div className="flex items-center justify-between gap-2 overflow-x-auto pb-2">
          {STEPS.map(({ icon: I, title }, i) => (
            <div key={title} className="flex flex-1 items-center">
              <button
                onClick={() => { setActive(i); setPlaying(false); }}
                className={`flex min-w-[76px] flex-col items-center gap-2 rounded-lg p-2 text-center text-xs transition-colors sm:text-sm ${
                  i === active ? "text-cyan-200" : i < active ? "text-violet-300" : "text-slate-500"
                }`}
              >
                <span className={`flex h-12 w-12 items-center justify-center rounded-full border-2 ${i === active ? "border-cyan-300 bg-cyan-300/10" : i < active ? "border-violet-400/60" : "border-[#2a3558]"}`}
                  style={i === active ? { boxShadow: "0 0 18px #22d3ee66" } : undefined}>
                  <I size={22} />
                </span>
                {title}
              </button>
              {i < STEPS.length - 1 && <div className={`h-0.5 flex-1 ${i < active ? "bg-violet-400/60" : "bg-[#2a3558]"}`} />}
            </div>
          ))}
        </div>
        <div className="mt-4 flex items-start gap-4 rounded-lg bg-[#121a30] p-4">
          <Cur className="mt-1 shrink-0 text-cyan-300" size={28} />
          <div>
            <h4 className="font-display text-lg font-semibold text-slate-100">{STEPS[active].title}</h4>
            <p className="text-slate-300">{STEPS[active].text}</p>
          </div>
        </div>
        <button onClick={() => setPlaying((p) => !p)} className="mt-4 inline-flex items-center gap-2 rounded-lg border border-[#2a3558] px-4 py-2 text-sm text-slate-200 hover:border-cyan-300">
          {playing ? <Pause size={16} /> : <Play size={16} />} {playing ? "Pausar" : "Reproducir recorrido"}
        </button>
      </Card>

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        <Card>
          <Code2 className="mb-3 text-violet-300" />
          <h3 className="font-display text-lg font-semibold text-slate-100">Desarrollo con Vento AI</h3>
          <p className="mt-1 text-sm text-slate-400">La aplicación web se construyó con ayuda de Vento AI, que aceleró la interfaz de búsqueda y la comunicación con la placa.</p>
        </Card>
        <Card>
          <Cpu className="mb-3 text-cyan-300" />
          <h3 className="font-display text-lg font-semibold text-slate-100">El ESP32</h3>
          <p className="mt-1 text-sm text-slate-400">Es el cerebro del estante: se conecta al Wi-Fi, recibe el cajón buscado y controla la tira LED.</p>
        </Card>
        <Card>
          <Smartphone className="mb-3 text-emerald-300" />
          <h3 className="font-display text-lg font-semibold text-slate-100">Acceso multi-dispositivo</h3>
          <p className="mt-1 text-sm text-slate-400">Como todo viaja por internet, basta un smartphone con conexión para buscar y encender un cajón.</p>
        </Card>
      </div>
    </>
  );
}

function Retos() {
  const opciones = [
    { n: "Estante de madera (85 cajones)", costo: 95, dur: 90, note: "Resistente, pero demasiado costoso." },
    { n: "Cartón y reciclables", costo: 15, dur: 25, note: "Económico, pero frágil y fácil de dañar." },
  ];
  return (
    <>
      <Title sub="Lo que no salió como esperábamos también es parte del proyecto.">Retos y aprendizaje</Title>
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="border-amber-400/30">
          <Coins className="mb-3 text-amber-300" />
          <h3 className="font-display text-xl font-semibold text-slate-100">El desafío de los costos</h3>
          <p className="mt-2 text-slate-300">Construir un estante de madera para 85 cajones resultó demasiado caro. Probamos con cartón y materiales reciclables, pero eran muy frágiles.</p>
          <p className="mt-3 inline-flex items-center gap-2 rounded-full bg-amber-400/10 px-3 py-1 text-sm text-amber-200">
            <Repeat size={14} /> En resolución: fabricación del estante final
          </p>
        </Card>
        <Card className="border-violet-400/30">
          <GraduationCap className="mb-3 text-violet-300" />
          <h3 className="font-display text-xl font-semibold text-slate-100">Lo que aprendimos</h3>
          <p className="mt-2 text-slate-300">Hay que estimar y gestionar los costos, y elegir los materiales, desde las primeras etapas del proyecto. Un buen prototipo electrónico no basta si el mueble no se puede pagar.</p>
        </Card>
      </div>
      <Card className="mt-4">
        <h3 className="font-display mb-4 text-lg font-semibold text-slate-100">Materiales comparados (valores ilustrativos)</h3>
        {opciones.map((o) => (
          <div key={o.n} className="mb-5 last:mb-0">
            <p className="mb-2 text-slate-200">{o.n} <span className="text-sm text-slate-500">· {o.note}</span></p>
            {[["Costo", o.costo, "bg-rose-400"], ["Durabilidad", o.dur, "bg-emerald-400"]].map(([l, v, c]) => (
              <div key={l} className="mb-1 flex items-center gap-3 text-sm text-slate-400">
                <span className="w-24">{l}</span>
                <div className="h-2.5 flex-1 rounded-full bg-[#121a30]"><div className={`h-full rounded-full ${c}`} style={{ width: `${v}%` }} /></div>
              </div>
            ))}
          </div>
        ))}
      </Card>
    </>
  );
}

function Demo() {
  const [query, setQuery] = useState("");
  const [qrDrawer, setQrDrawer] = useState(null);

  const matches = useMemo(() => {
    const q = query.trim().toLowerCase();
    return q ? PARTS.filter((p) => p.name.toLowerCase().includes(q)) : [];
  }, [query]);
  const lit = matches.map((m) => m.drawer);
  const scanned = PARTS.find((p) => p.drawer === qrDrawer);

  const evidencias = [
    [Users, "Pruebas con usuarios"], [Camera, "Fotografías"], [Code2, "Código fuente"],
    [Video, "Vídeos"], [FlaskConical, "Resultados experimentales"], [Repeat, "Pruebas sucesivas"],
  ];

  return (
    <>
      <Title sub="Escribe o toca un componente y mira qué cajón se enciende. En el prototipo real la orden viaja al ESP32.">Simulación de búsqueda</Title>
      <Card>
        <label className="relative block">
          <Search className="absolute top-3 left-3 text-slate-500" size={18} />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Busca un componente, por ejemplo 555 Timer"
            className="w-full rounded-lg border border-[#2a3558] bg-[#0a1020] py-2.5 pr-3 pl-10 text-slate-100 placeholder:text-slate-500 focus:border-cyan-300 focus:outline-none"
          />
        </label>
        <div className="mt-3 flex flex-wrap gap-2">
          {CHIPS.map((c) => (
            <button key={c} onClick={() => setQuery(c)} className="rounded-full border border-[#2a3558] px-3 py-1 text-sm text-slate-300 hover:border-cyan-300 hover:text-cyan-200">{c}</button>
          ))}
          {query && <button onClick={() => setQuery("")} className="rounded-full px-3 py-1 text-sm text-slate-500 hover:text-slate-300">Limpiar</button>}
        </div>

        <div className="mt-5"><DrawerGrid lit={lit} onPick={setQrDrawer} /></div>

        <div className="mt-4 min-h-[3rem] text-sm text-slate-300" aria-live="polite">
          {!query && "Ningún LED encendido. Busca algo para empezar."}
          {query && matches.length === 0 && "No hay un componente con ese nombre. Prueba con otra palabra."}
          {matches.map((m) => (
            <p key={m.name}><Lightbulb className="mr-1 inline text-cyan-300" size={15} /> {m.name}: cajón <b className="text-cyan-200">{m.drawer}</b> · {m.spec}</p>
          ))}
        </div>
      </Card>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <Card>
          <QrCode className="mb-3 text-violet-300" />
          <h3 className="font-display text-lg font-semibold text-slate-100">Lectura de códigos QR</h3>
          <p className="mt-1 mb-4 text-sm text-slate-400">Toca un cajón de la cuadrícula para “escanear” su QR. En total hay 85, uno por componente.</p>
          {scanned ? (
            <div className="flex items-center gap-4">
              <FakeQR seed={scanned.drawer} />
              <div className="text-sm text-slate-300">
                <p className="font-semibold text-slate-100">{scanned.name}</p>
                <p>Cajón {scanned.drawer}</p>
                <p className="text-slate-400">{scanned.spec}</p>
              </div>
            </div>
          ) : qrDrawer ? (
            <div className="flex items-center gap-4">
              <FakeQR seed={qrDrawer} />
              <p className="text-sm text-slate-400">Cajón {qrDrawer}: sin componente cargado en esta demo.</p>
            </div>
          ) : (
            <p className="rounded-lg bg-[#121a30] p-4 text-sm text-slate-500">Aún no has tocado ningún cajón.</p>
          )}
        </Card>
        <Card>
          <Boxes className="mb-3 text-cyan-300" />
          <h3 className="font-display text-lg font-semibold text-slate-100">Prototipo actual (versión 1)</h3>
          <p className="mt-1 text-sm text-slate-400">Estante a escala con <b className="text-slate-200">25 LEDs</b> funcionales que se encienden al enviar una búsqueda desde la web. El estante final tendrá los 85 cajones.</p>
          <div className="mt-4 grid grid-cols-5 gap-1.5" aria-hidden="true">
            {Array.from({ length: 25 }, (_, i) => (
              <div key={i} className="aspect-square rounded-sm border border-[#1c2540] bg-[#121a30]" style={i === 12 ? { background: "#22d3ee", boxShadow: "0 0 12px #22d3ee" } : undefined} />
            ))}
          </div>
        </Card>
      </div>

      <h3 className="font-display mt-10 mb-4 text-xl font-semibold text-slate-100">Evidencias del proyecto</h3>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
        {evidencias.map(([I, t]) => (
          <Card key={t} className="flex items-center gap-3 p-4">
            <I className="shrink-0 text-violet-300" size={22} />
            <div>
              <p className="text-slate-200">{t}</p>
              <p className="text-xs text-slate-500">Agrega aquí tu material</p>
            </div>
          </Card>
        ))}
      </div>
    </>
  );
}

/* ---------- app ---------- */

export default function AutoComponent() {
  const [tab, setTab] = useState("inicio");
  const view = { inicio: <Inicio go={setTab} />, problema: <Problema />, arquitectura: <Arquitectura />, retos: <Retos />, demo: <Demo /> }[tab];

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-200">
      <header className="sticky top-0 z-10 border-b border-[#1c2540] bg-[#070b14]/90 backdrop-blur">
        <nav className="mx-auto flex max-w-6xl items-center gap-1 overflow-x-auto px-4 py-2" aria-label="Secciones">
          <span className="font-display mr-3 flex shrink-0 items-center gap-1.5 font-bold text-slate-100"><Lightbulb size={18} className="text-cyan-300" /> AutoComponent</span>
          {TABS.map(({ id, label, icon: I }) => (
            <button
              key={id}
              onClick={() => { setTab(id); window.scrollTo({ top: 0 }); }}
              aria-current={tab === id ? "page" : undefined}
              className={`inline-flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm transition-colors ${tab === id ? "bg-cyan-300/15 text-cyan-200" : "text-slate-400 hover:text-slate-100"}`}
            >
              <I size={15} /> {label}
            </button>
          ))}
        </nav>
      </header>
      <main className="mx-auto max-w-6xl px-4 pb-16">{view}</main>
      <footer className="border-t border-[#1c2540] px-4 py-6 text-center text-sm text-slate-500">
        AutoComponent · David Leonardo Garces Vesga &amp; Julian David Hernandez Quintero · Proyecto educativo del colegio, sin fines de lucro.
      </footer>
    </div>
  );
}

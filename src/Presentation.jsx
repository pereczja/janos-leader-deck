import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronLeft,
  ChevronRight,
  Circle,
  Maximize2,
  Minimize2,
  Grid3X3,
  MonitorOff,
  Monitor,
} from 'lucide-react';

// 1337 Brand Colors
const COLORS = {
  background: '#FBFAF4',
  surface: '#EAEBE4',
  text: '#111111',
  purple: '#783FF3',
  orange: '#FA7E00',
  stone: '#78716c',
  stoneDark: '#44403c',
  stoneBlack: '#1c1917',
  offWhite: '#FBFAF4',
  mutedOnDark: '#a8a29e',
};

const FONTS = {
  serif: 'Georgia, serif',
  mono: 'DM Mono, Consolas, ui-monospace, SFMono-Regular, Menlo, Monaco, "Liberation Mono", monospace',
};

// Subtle animations
const slideVariants = {
  enter: { opacity: 0 },
  center: { opacity: 1 },
  exit: { opacity: 0 },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const staggerItem = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0 },
};

// IMPORTANT: Use the actual PNG file, not inline SVG!
const Logo1337 = ({ invert = false, style = {} }) => (
  <img
    src="/assets/1337 logo.png"
    alt="1337"
    style={{
      height: 50,
      width: 'auto',
      filter: invert ? 'brightness(0) invert(1)' : 'none',
      ...style,
    }}
  />
);

// IMPORTANT: Use the actual PNG file, not inline SVG!
const Stamp = ({ invert = false, opacity = 0.6, style = {} }) => (
  <img
    src="/assets/1337 stamp.png"
    alt="The Intelligence Company"
    style={{
      width: 110,
      opacity,
      filter: invert ? 'brightness(0) invert(1)' : 'none',
      ...style,
    }}
  />
);

function useFullscreen() {
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const onChange = () => setIsFullscreen(Boolean(document.fullscreenElement));
    document.addEventListener('fullscreenchange', onChange);
    return () => document.removeEventListener('fullscreenchange', onChange);
  }, []);

  const toggle = useCallback(async () => {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
      } else {
        await document.exitFullscreen();
      }
    } catch {
      // ignore
    }
  }, []);

  return { isFullscreen, toggle };
}

const NavigationDots = ({ total, current, onChange, dark = false }) => (
  <div
    style={{
      position: 'absolute',
      bottom: 24,
      left: '50%',
      transform: 'translateX(-50%)',
      display: 'flex',
      gap: 10,
      alignItems: 'center',
      zIndex: 50,
    }}
  >
    {Array.from({ length: total }).map((_, i) => {
      const active = i === current;
      const stroke = dark
        ? active
          ? COLORS.purple
          : COLORS.mutedOnDark
        : active
          ? COLORS.purple
          : COLORS.stone;
      const fill = active ? COLORS.purple : 'transparent';

      return (
        <button
          key={i}
          onClick={() => onChange(i)}
          aria-label={`Go to slide ${i + 1}`}
          style={{
            cursor: 'pointer',
            background: 'transparent',
            border: 0,
            padding: 6,
          }}
        >
          <Circle size={9} fill={fill} stroke={stroke} strokeWidth={2} />
        </button>
      );
    })}
  </div>
);

const NavigationButtons = ({ onPrev, onNext, hasPrev, hasNext, dark = false }) => {
  const color = dark ? COLORS.mutedOnDark : COLORS.stone;
  const hover = dark ? COLORS.offWhite : COLORS.text;

  return (
    <>
      {hasPrev && (
        <button
          onClick={onPrev}
          aria-label="Previous slide"
          style={{
            position: 'absolute',
            left: 16,
            top: '50%',
            transform: 'translateY(-50%)',
            background: 'transparent',
            border: 0,
            padding: 10,
            cursor: 'pointer',
            color,
            zIndex: 50,
            transition: 'color 0.15s ease-out',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = hover)}
          onMouseLeave={(e) => (e.currentTarget.style.color = color)}
        >
          <ChevronLeft size={30} />
        </button>
      )}

      {hasNext && (
        <button
          onClick={onNext}
          aria-label="Next slide"
          style={{
            position: 'absolute',
            right: 16,
            top: '50%',
            transform: 'translateY(-50%)',
            background: 'transparent',
            border: 0,
            padding: 10,
            cursor: 'pointer',
            color,
            zIndex: 50,
            transition: 'color 0.15s ease-out',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = hover)}
          onMouseLeave={(e) => (e.currentTarget.style.color = color)}
        >
          <ChevronRight size={30} />
        </button>
      )}
    </>
  );
};

const TopRightControls = ({
  dark = false,
  onToggleOverview,
  overview,
  onToggleBlank,
  blank,
  onToggleFullscreen,
  isFullscreen,
}) => {
  const color = dark ? COLORS.mutedOnDark : COLORS.stone;
  const hover = dark ? COLORS.offWhite : COLORS.text;

  const Button = ({ onClick, label, children }) => (
    <button
      onClick={onClick}
      aria-label={label}
      title={label}
      style={{
        cursor: 'pointer',
        background: 'transparent',
        border: 0,
        padding: 10,
        color,
        transition: 'color 0.15s ease-out',
      }}
      onMouseEnter={(e) => (e.currentTarget.style.color = hover)}
      onMouseLeave={(e) => (e.currentTarget.style.color = color)}
    >
      {children}
    </button>
  );

  return (
    <div style={{ position: 'absolute', top: 10, right: 10, zIndex: 60, display: 'flex', gap: 2 }}>
      <Button onClick={onToggleOverview} label={overview ? 'Close overview (O)' : 'Open overview (O)'}>
        <Grid3X3 size={18} />
      </Button>
      <Button onClick={onToggleBlank} label={blank ? 'Unblank screen (B)' : 'Blank screen (B)'}>
        {blank ? <Monitor size={18} /> : <MonitorOff size={18} />}
      </Button>
      <Button onClick={onToggleFullscreen} label={isFullscreen ? 'Exit fullscreen (F)' : 'Fullscreen (F)'}>
        {isFullscreen ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
      </Button>
    </div>
  );
};

const SlideShell = ({ dark = false, children }) => (
  <div
    style={{
      height: '100vh',
      width: '100vw',
      background: dark ? COLORS.stoneBlack : COLORS.background,
      color: dark ? COLORS.offWhite : COLORS.text,
      position: 'relative',
      overflow: 'hidden',
    }}
  >
    {children}
  </div>
);

const DarkTitleSlide = () => (
  <SlideShell dark>
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="show"
      style={{
        height: '100%',
        padding: 80,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        gap: 18,
      }}
    >
      <motion.div variants={staggerItem} style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <div style={{ opacity: 0.95 }}>
          <Logo1337 invert />
        </div>
        <div
          style={{
            fontFamily: FONTS.mono,
            fontSize: 13,
            letterSpacing: 2,
            color: COLORS.purple,
            textTransform: 'uppercase',
          }}
        >
          Leader profile
        </div>
      </motion.div>

      <motion.h1
        variants={staggerItem}
        style={{
          fontFamily: FONTS.serif,
          fontSize: 56,
          fontWeight: 400,
          lineHeight: 1.05,
          margin: 0,
          maxWidth: 980,
        }}
      >
        Pereczes János
      </motion.h1>

      <motion.p
        variants={staggerItem}
        style={{
          fontFamily: FONTS.serif,
          fontSize: 24,
          lineHeight: 1.45,
          margin: 0,
          color: COLORS.mutedOnDark,
          maxWidth: 980,
        }}
      >
        CEO @ 1337 Partners, builder, investor, operator.
      </motion.p>

      <motion.div variants={staggerItem} style={{ marginTop: 22 }}>
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 10,
            padding: '10px 14px',
            borderRadius: 999,
            border: `1px solid rgba(251, 250, 244, 0.18)`,
            background: 'rgba(251, 250, 244, 0.04)',
            fontFamily: FONTS.mono,
            fontSize: 13,
            color: COLORS.offWhite,
          }}
        >
          <span style={{ color: COLORS.purple }}>We unlock 1337 in you</span>
          <span style={{ opacity: 0.65 }}>·</span>
          <span style={{ opacity: 0.8 }}>Budapest</span>
        </div>
      </motion.div>

      <motion.div variants={staggerItem} style={{ position: 'absolute', bottom: 36, right: 36 }}>
        <Stamp invert opacity={0.5} />
      </motion.div>
    </motion.div>
  </SlideShell>
);

const Card = ({ title, text, accent = 'purple' }) => {
  const accentColor = accent === 'orange' ? COLORS.orange : COLORS.purple;
  return (
    <div
      style={{
        background: COLORS.surface,
        borderRadius: 18,
        padding: 22,
        boxShadow: '0 10px 30px rgba(28, 25, 23, 0.06)',
        border: '1px solid rgba(17, 17, 17, 0.06)',
      }}
    >
      <div style={{ height: 3, width: 34, borderRadius: 999, background: accentColor, marginBottom: 14 }} />
      <div
        style={{
          fontFamily: FONTS.mono,
          fontSize: 12,
          letterSpacing: 1.2,
          color: COLORS.stone,
          textTransform: 'uppercase',
        }}
      >
        {title}
      </div>
      <div style={{ fontFamily: FONTS.serif, fontSize: 22, lineHeight: 1.35, marginTop: 10, color: COLORS.text }}>
        {text}
      </div>
    </div>
  );
};

const ContentSlide = ({ title, kicker, children, showStamp = false }) => (
  <SlideShell>
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="show"
      style={{ height: '100%', padding: 80, display: 'flex', flexDirection: 'column' }}
    >
      <motion.div variants={staggerItem} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          {kicker && (
            <div
              style={{
                fontFamily: FONTS.mono,
                fontSize: 13,
                letterSpacing: 2,
                textTransform: 'uppercase',
                color: COLORS.purple,
                marginBottom: 12,
              }}
            >
              {kicker}
            </div>
          )}
          <h2
            style={{
              fontFamily: FONTS.serif,
              fontSize: 44,
              fontWeight: 400,
              margin: 0,
              lineHeight: 1.1,
              color: COLORS.text,
            }}
          >
            {title}
          </h2>
        </div>
        <div style={{ opacity: 0.9 }}>
          <Logo1337 />
        </div>
      </motion.div>

      <motion.div variants={staggerItem} style={{ flex: 1, marginTop: 34 }}>
        {children}
      </motion.div>

      {showStamp && (
        <motion.div variants={staggerItem} style={{ position: 'absolute', bottom: 36, right: 36 }}>
          <Stamp opacity={0.45} />
        </motion.div>
      )}
    </motion.div>
  </SlideShell>
);

const Slide2 = () => (
  <ContentSlide title="Amit vezetek" kicker="Scope" showStamp>
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: 18,
        maxWidth: 1100,
      }}
    >
      <Card
        title="1337 Partners"
        text="AI strategy és implementation, The Intelligence Company. Consultingból tooling platform felé."
        accent="purple"
      />
      <Card
        title="AI Budapest"
        text="Builder közösség, lead-gen és talent pipeline. Közösséget építek, nem csak projekteket."
        accent="orange"
      />
      <Card
        title="First Principle Innovation"
        text="Korai fázisú befektetések. Döntések első elvekből, nem trendekből."
        accent="purple"
      />
      <Card
        title="Demján Sándor Tőkeprogram"
        text="Kurátóriumi szerep, KKV-k támogatása. Intelligens, felelős tőke."
        accent="orange"
      />
    </div>
  </ContentSlide>
);

const Slide3 = () => (
  <ContentSlide title="Vezetői operációs rendszer" kicker="How I lead">
    <div style={{ maxWidth: 1050 }}>
      <div
        style={{
          fontFamily: FONTS.serif,
          fontSize: 22,
          lineHeight: 1.7,
          color: COLORS.stoneDark,
          marginBottom: 26,
        }}
      >
        A célom egyszerű, tiszta irányt adni, majd egy olyan ritmust, ahol a csapat tud építeni.
        A fókusz a belső képességépítés, a világos döntések és a gyors visszacsatolás.
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
        <div
          style={{
            background: COLORS.surface,
            borderRadius: 18,
            padding: 18,
            border: '1px solid rgba(17,17,17,0.06)',
          }}
        >
          <div
            style={{
              fontFamily: FONTS.mono,
              fontSize: 12,
              letterSpacing: 1.6,
              textTransform: 'uppercase',
              color: COLORS.stone,
            }}
          >
            Ritmus
          </div>
          <div style={{ fontFamily: FONTS.serif, fontSize: 20, marginTop: 10, lineHeight: 1.35 }}>
            Hétvégi weekly plan, hétköznap MON–FRI TOP, és rendszeres check-in.
          </div>
        </div>

        <div
          style={{
            background: COLORS.surface,
            borderRadius: 18,
            padding: 18,
            border: '1px solid rgba(17,17,17,0.06)',
          }}
        >
          <div
            style={{
              fontFamily: FONTS.mono,
              fontSize: 12,
              letterSpacing: 1.6,
              textTransform: 'uppercase',
              color: COLORS.stone,
            }}
          >
            Döntés
          </div>
          <div style={{ fontFamily: FONTS.serif, fontSize: 20, marginTop: 10, lineHeight: 1.35 }}>
            Pattern recognition, majd hard prioritás. Kevesebb projekt, több befejezés.
          </div>
        </div>

        <div
          style={{
            background: COLORS.surface,
            borderRadius: 18,
            padding: 18,
            border: '1px solid rgba(17,17,17,0.06)',
          }}
        >
          <div
            style={{
              fontFamily: FONTS.mono,
              fontSize: 12,
              letterSpacing: 1.6,
              textTransform: 'uppercase',
              color: COLORS.stone,
            }}
          >
            Kultúra
          </div>
          <div style={{ fontFamily: FONTS.serif, fontSize: 20, marginTop: 10, lineHeight: 1.35 }}>
            Direkt kommunikáció, kevés fluff. Belső capability, nem külső dependency.
          </div>
        </div>
      </div>

      <div
        style={{
          marginTop: 18,
          background: 'rgba(120, 63, 243, 0.08)',
          border: '1px solid rgba(120, 63, 243, 0.18)',
          borderRadius: 18,
          padding: 18,
        }}
      >
        <div style={{ fontFamily: FONTS.mono, fontSize: 12, letterSpacing: 1.6, textTransform: 'uppercase', color: COLORS.purple }}>
          Default stance
        </div>
        <div style={{ fontFamily: FONTS.serif, fontSize: 22, marginTop: 10, lineHeight: 1.45, color: COLORS.text }}>
          Execution over planning, konkrét over absztrakt, működő over tökéletes.
        </div>
      </div>
    </div>
  </ContentSlide>
);

const TimelineItem = ({ year, title, detail, active }) => (
  <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: 18, alignItems: 'baseline' }}>
    <div style={{ fontFamily: FONTS.mono, fontSize: 14, color: active ? COLORS.purple : COLORS.stone }}>{year}</div>
    <div>
      <div style={{ fontFamily: FONTS.serif, fontSize: 22, color: COLORS.text, lineHeight: 1.2 }}>{title}</div>
      <div
        style={{
          fontFamily: FONTS.serif,
          fontSize: 18,
          color: COLORS.stoneDark,
          lineHeight: 1.45,
          marginTop: 6,
          maxWidth: 900,
        }}
      >
        {detail}
      </div>
    </div>
  </div>
);

const Slide4 = () => (
  <ContentSlide title="Track record" kicker="Proof" showStamp>
    <div style={{ maxWidth: 1080 }}>
      <div style={{ height: 2, background: COLORS.surface, borderRadius: 999, marginBottom: 22 }} />

      <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
        <TimelineItem
          year="MBH Bank"
          title="Egy nagy bank digitalizálása"
          detail="Operációs és termék szintű execution, nagy szervezetben, nagy tét mellett."
          active
        />
        <TimelineItem
          year="Fintechlab"
          title="MKB Fintechlab alapítás"
          detail="CEE régió korai banki fintech központja, platform gondolkodás, partner ökoszisztéma."
        />
        <TimelineItem year="Corvinus" title="Accounting and Finance" detail="Pénzügyi rigor, vállalati realitás, és döntésképesség számokkal." />
        <TimelineItem
          year="1337"
          title="Design partner delivery"
          detail="Dorsum, KAVOSZ, MKIK AK, MNB. AI stratégia és implementation, olyan formában, amit a csapat át tud venni."
          active
        />
      </div>

      <div style={{ marginTop: 22, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <div
          style={{
            background: COLORS.surface,
            borderRadius: 18,
            padding: 18,
            border: '1px solid rgba(17,17,17,0.06)',
          }}
        >
          <div style={{ fontFamily: FONTS.mono, fontSize: 12, letterSpacing: 1.6, textTransform: 'uppercase', color: COLORS.stone }}>
            Business direction
          </div>
          <div style={{ fontFamily: FONTS.serif, fontSize: 20, marginTop: 10, lineHeight: 1.35 }}>
            60M HUF jelenlegi bevétel, cél 1 Mrd HUF, consultingból tooling platform irányba.
          </div>
        </div>
        <div
          style={{
            background: COLORS.surface,
            borderRadius: 18,
            padding: 18,
            border: '1px solid rgba(17,17,17,0.06)',
          }}
        >
          <div style={{ fontFamily: FONTS.mono, fontSize: 12, letterSpacing: 1.6, textTransform: 'uppercase', color: COLORS.stone }}>
            Delivery stance
          </div>
          <div style={{ fontFamily: FONTS.serif, fontSize: 20, marginTop: 10, lineHeight: 1.35 }}>
            Outcome-based gondolkodás, tiszta scope, és belső képesség építése a megoldás mellett.
          </div>
        </div>
      </div>
    </div>
  </ContentSlide>
);

const Slide5 = () => (
  <ContentSlide title="Hogyan érdemes velem dolgozni" kicker="Collaboration" showStamp>
    <div
      style={{
        maxWidth: 1080,
        display: 'grid',
        gridTemplateColumns: '1.2fr 0.8fr',
        gap: 18,
        alignItems: 'start',
      }}
    >
      <div
        style={{
          background: COLORS.surface,
          borderRadius: 18,
          padding: 22,
          border: '1px solid rgba(17,17,17,0.06)',
        }}
      >
        <div style={{ fontFamily: FONTS.serif, fontSize: 24, lineHeight: 1.5, color: COLORS.text }}>
          Ha röviden kell összefoglalni, én akkor vagyok a leghasznosabb, amikor kell egy tiszta narratíva, egy működő
          operációs rendszer, és egy csapat, aki ezt végig is viszi.
        </div>

        <div style={{ marginTop: 18, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <div
            style={{
              padding: 14,
              borderRadius: 14,
              background: 'rgba(120, 63, 243, 0.08)',
              border: '1px solid rgba(120, 63, 243, 0.18)',
            }}
          >
            <div style={{ fontFamily: FONTS.mono, fontSize: 12, letterSpacing: 1.4, textTransform: 'uppercase', color: COLORS.purple }}>
              What you get
            </div>
            <div style={{ fontFamily: FONTS.serif, fontSize: 19, marginTop: 8, lineHeight: 1.35 }}>
              Döntés, prioritás, és végrehajtás keretrendszer.
            </div>
          </div>
          <div
            style={{
              padding: 14,
              borderRadius: 14,
              background: 'rgba(250, 126, 0, 0.08)',
              border: '1px solid rgba(250, 126, 0, 0.20)',
            }}
          >
            <div style={{ fontFamily: FONTS.mono, fontSize: 12, letterSpacing: 1.4, textTransform: 'uppercase', color: COLORS.orange }}>
              What I need
            </div>
            <div style={{ fontFamily: FONTS.serif, fontSize: 19, marginTop: 8, lineHeight: 1.35 }}>
              Tiszta cél, őszinte state, és gyors feedback.
            </div>
          </div>
        </div>

        <div style={{ marginTop: 18, fontFamily: FONTS.mono, fontSize: 14, color: COLORS.stoneDark }}>janos@1337.partners</div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div
          style={{
            background: COLORS.surface,
            borderRadius: 18,
            padding: 18,
            border: '1px solid rgba(17,17,17,0.06)',
          }}
        >
          <div style={{ fontFamily: FONTS.mono, fontSize: 12, letterSpacing: 1.6, textTransform: 'uppercase', color: COLORS.stone }}>
            Line I repeat
          </div>
          <div style={{ fontFamily: FONTS.serif, fontSize: 22, marginTop: 10, lineHeight: 1.25 }}>
            It&apos;s 1994 again. The window is now.
          </div>
        </div>

        <div
          style={{
            background: COLORS.surface,
            borderRadius: 18,
            padding: 18,
            border: '1px solid rgba(17,17,17,0.06)',
          }}
        >
          <div style={{ fontFamily: FONTS.mono, fontSize: 12, letterSpacing: 1.6, textTransform: 'uppercase', color: COLORS.stone }}>
            Shortcuts
          </div>
          <div style={{ marginTop: 10, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <div style={{ fontFamily: FONTS.mono, fontSize: 13, color: COLORS.stoneDark }}>
              <span style={{ color: COLORS.purple }}>F</span> fullscreen
            </div>
            <div style={{ fontFamily: FONTS.mono, fontSize: 13, color: COLORS.stoneDark }}>
              <span style={{ color: COLORS.purple }}>O</span> overview
            </div>
            <div style={{ fontFamily: FONTS.mono, fontSize: 13, color: COLORS.stoneDark }}>
              <span style={{ color: COLORS.purple }}>B</span> blank
            </div>
            <div style={{ fontFamily: FONTS.mono, fontSize: 13, color: COLORS.stoneDark }}>
              <span style={{ color: COLORS.purple }}>1-5</span> jump
            </div>
          </div>
        </div>

        <div style={{ opacity: 0.95, marginTop: 4 }}>
          <Logo1337 style={{ height: 44 }} />
        </div>
      </div>
    </div>
  </ContentSlide>
);

const OverviewGrid = ({ slidesMeta, onPick, onClose }) => (
  <div
    role="dialog"
    aria-label="Overview"
    style={{
      position: 'absolute',
      inset: 0,
      background: 'rgba(28, 25, 23, 0.85)',
      zIndex: 200,
      padding: 36,
      overflow: 'auto',
    }}
    onClick={onClose}
  >
    <div
      style={{
        maxWidth: 1200,
        margin: '0 auto',
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: 14,
      }}
      onClick={(e) => e.stopPropagation()}
    >
      {slidesMeta.map((s, idx) => (
        <button
          key={idx}
          onClick={() => onPick(idx)}
          style={{
            cursor: 'pointer',
            textAlign: 'left',
            border: '1px solid rgba(251, 250, 244, 0.16)',
            borderRadius: 16,
            padding: 16,
            background: 'rgba(251, 250, 244, 0.06)',
            color: COLORS.offWhite,
          }}
        >
          <div style={{ fontFamily: FONTS.mono, fontSize: 12, letterSpacing: 1.6, textTransform: 'uppercase', color: COLORS.mutedOnDark }}>
            Slide {idx + 1}
          </div>
          <div style={{ fontFamily: FONTS.serif, fontSize: 22, marginTop: 10, lineHeight: 1.2 }}>{s.title}</div>
          <div
            style={{
              fontFamily: FONTS.serif,
              fontSize: 16,
              marginTop: 10,
              lineHeight: 1.35,
              color: COLORS.mutedOnDark,
            }}
          >
            {s.subtitle}
          </div>
        </button>
      ))}
    </div>
  </div>
);

export default function Presentation() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [overview, setOverview] = useState(false);
  const [blank, setBlank] = useState(false);
  const { isFullscreen, toggle: toggleFullscreen } = useFullscreen();

  const slides = useMemo(
    () => [
      { component: <DarkTitleSlide />, title: 'Pereczes János', subtitle: 'CEO @ 1337 Partners', dark: true },
      { component: <Slide2 />, title: 'Amit vezetek', subtitle: 'Szerepek és építés', dark: false },
      { component: <Slide3 />, title: 'Vezetői operációs rendszer', subtitle: 'Ritmus, döntés, kultúra', dark: false },
      { component: <Slide4 />, title: 'Track record', subtitle: 'Bizonyítékok és output', dark: false },
      { component: <Slide5 />, title: 'Hogyan dolgozom', subtitle: 'Kollaboráció és ritmus', dark: false },
    ],
    []
  );

  const totalSlides = slides.length;

  const navigate = useCallback(
    (newIndex) => {
      if (newIndex >= 0 && newIndex < totalSlides) setCurrentSlide(newIndex);
    },
    [totalSlides]
  );

  const nextSlide = useCallback(() => navigate(currentSlide + 1), [currentSlide, navigate]);
  const prevSlide = useCallback(() => navigate(currentSlide - 1), [currentSlide, navigate]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (overview) {
        if (e.key === 'Escape' || e.key.toLowerCase() === 'o') {
          e.preventDefault();
          setOverview(false);
        }
        return;
      }

      switch (e.key) {
        case 'ArrowRight':
        case ' ':
        case 'Enter':
          e.preventDefault();
          if (!blank) nextSlide();
          break;
        case 'ArrowLeft':
          e.preventDefault();
          if (!blank) prevSlide();
          break;
        default: {
          const k = e.key.toLowerCase();
          if (k === 'f') {
            e.preventDefault();
            toggleFullscreen();
          }
          if (k === 'b') {
            e.preventDefault();
            setBlank((v) => !v);
          }
          if (k === 'o') {
            e.preventDefault();
            setOverview(true);
          }
          if (e.key >= '1' && e.key <= '9') {
            const idx = parseInt(e.key, 10) - 1;
            if (idx < totalSlides) {
              e.preventDefault();
              setBlank(false);
              navigate(idx);
            }
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [nextSlide, prevSlide, navigate, totalSlides, toggleFullscreen, overview, blank]);

  const currentMeta = slides[currentSlide];

  return (
    <div style={{ position: 'relative', width: '100vw', height: '100vh', background: COLORS.background }}>
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide + (blank ? '-blank' : '')}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.3, ease: 'easeOut' }}
          style={{ position: 'absolute', inset: 0 }}
        >
          {blank ? (
            <SlideShell dark>
              <div style={{ position: 'absolute', inset: 0, background: COLORS.stoneBlack }} />
            </SlideShell>
          ) : (
            currentMeta.component
          )}
        </motion.div>
      </AnimatePresence>

      <TopRightControls
        dark={currentMeta.dark}
        onToggleOverview={() => setOverview((v) => !v)}
        overview={overview}
        onToggleBlank={() => setBlank((v) => !v)}
        blank={blank}
        onToggleFullscreen={toggleFullscreen}
        isFullscreen={isFullscreen}
      />

      {!overview && !blank && (
        <>
          <NavigationButtons
            onPrev={prevSlide}
            onNext={nextSlide}
            hasPrev={currentSlide > 0}
            hasNext={currentSlide < totalSlides - 1}
            dark={currentMeta.dark}
          />

          <NavigationDots total={totalSlides} current={currentSlide} onChange={navigate} dark={currentMeta.dark} />

          <div
            style={{
              position: 'absolute',
              bottom: 22,
              right: 22,
              fontFamily: FONTS.mono,
              fontSize: 12,
              color: currentMeta.dark ? COLORS.mutedOnDark : COLORS.stone,
              opacity: 0.6,
              zIndex: 80,
            }}
          >
            ← → navigate, Space advance, F fullscreen, O overview, B blank
          </div>
        </>
      )}

      {overview && (
        <OverviewGrid
          slidesMeta={slides.map((s) => ({ title: s.title, subtitle: s.subtitle }))}
          onPick={(idx) => {
            setOverview(false);
            setBlank(false);
            navigate(idx);
          }}
          onClose={() => setOverview(false)}
        />
      )}
    </div>
  );
}

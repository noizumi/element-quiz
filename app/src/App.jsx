import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

/**
 * iPadOS/Safari が古い場合、Optional Chaining (?.) / Nullish Coalescing (??) などで
 * モジュールが読み込み時に落ち、"script error (module:-1144)" になることがあります。
 * このファイルでは、それらの構文を使わない実装にしています。
 */

function isNil(v) {
  return v === null || v === undefined;
}

function coalesce(v, fallback) {
  return isNil(v) ? fallback : v;
}

function clamp(n, min, max) {
  return Math.max(min, Math.min(max, n));
}

function shuffle(array) {
  const a = array.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const tmp = a[i];
    a[i] = a[j];
    a[j] = tmp;
  }
  return a;
}

function formatSeconds(sec) {
  const rounded = Math.round(sec * 10) / 10;
  return rounded.toFixed(1);
}

/**
 * 元素データ（1〜118）
 * 参照：IUPACの標準的な元素記号（H〜Og）
 */
const ELEMENTS = [
  { z: 1, symbol: "H" },
  { z: 2, symbol: "He" },
  { z: 3, symbol: "Li" },
  { z: 4, symbol: "Be" },
  { z: 5, symbol: "B" },
  { z: 6, symbol: "C" },
  { z: 7, symbol: "N" },
  { z: 8, symbol: "O" },
  { z: 9, symbol: "F" },
  { z: 10, symbol: "Ne" },
  { z: 11, symbol: "Na" },
  { z: 12, symbol: "Mg" },
  { z: 13, symbol: "Al" },
  { z: 14, symbol: "Si" },
  { z: 15, symbol: "P" },
  { z: 16, symbol: "S" },
  { z: 17, symbol: "Cl" },
  { z: 18, symbol: "Ar" },
  { z: 19, symbol: "K" },
  { z: 20, symbol: "Ca" },
  { z: 21, symbol: "Sc" },
  { z: 22, symbol: "Ti" },
  { z: 23, symbol: "V" },
  { z: 24, symbol: "Cr" },
  { z: 25, symbol: "Mn" },
  { z: 26, symbol: "Fe" },
  { z: 27, symbol: "Co" },
  { z: 28, symbol: "Ni" },
  { z: 29, symbol: "Cu" },
  { z: 30, symbol: "Zn" },
  { z: 31, symbol: "Ga" },
  { z: 32, symbol: "Ge" },
  { z: 33, symbol: "As" },
  { z: 34, symbol: "Se" },
  { z: 35, symbol: "Br" },
  { z: 36, symbol: "Kr" },
  { z: 37, symbol: "Rb" },
  { z: 38, symbol: "Sr" },
  { z: 39, symbol: "Y" },
  { z: 40, symbol: "Zr" },
  { z: 41, symbol: "Nb" },
  { z: 42, symbol: "Mo" },
  { z: 43, symbol: "Tc" },
  { z: 44, symbol: "Ru" },
  { z: 45, symbol: "Rh" },
  { z: 46, symbol: "Pd" },
  { z: 47, symbol: "Ag" },
  { z: 48, symbol: "Cd" },
  { z: 49, symbol: "In" },
  { z: 50, symbol: "Sn" },
  { z: 51, symbol: "Sb" },
  { z: 52, symbol: "Te" },
  { z: 53, symbol: "I" },
  { z: 54, symbol: "Xe" },
  { z: 55, symbol: "Cs" },
  { z: 56, symbol: "Ba" },
  { z: 57, symbol: "La" },
  { z: 58, symbol: "Ce" },
  { z: 59, symbol: "Pr" },
  { z: 60, symbol: "Nd" },
  { z: 61, symbol: "Pm" },
  { z: 62, symbol: "Sm" },
  { z: 63, symbol: "Eu" },
  { z: 64, symbol: "Gd" },
  { z: 65, symbol: "Tb" },
  { z: 66, symbol: "Dy" },
  { z: 67, symbol: "Ho" },
  { z: 68, symbol: "Er" },
  { z: 69, symbol: "Tm" },
  { z: 70, symbol: "Yb" },
  { z: 71, symbol: "Lu" },
  { z: 72, symbol: "Hf" },
  { z: 73, symbol: "Ta" },
  { z: 74, symbol: "W" },
  { z: 75, symbol: "Re" },
  { z: 76, symbol: "Os" },
  { z: 77, symbol: "Ir" },
  { z: 78, symbol: "Pt" },
  { z: 79, symbol: "Au" },
  { z: 80, symbol: "Hg" },
  { z: 81, symbol: "Tl" },
  { z: 82, symbol: "Pb" },
  { z: 83, symbol: "Bi" },
  { z: 84, symbol: "Po" },
  { z: 85, symbol: "At" },
  { z: 86, symbol: "Rn" },
  { z: 87, symbol: "Fr" },
  { z: 88, symbol: "Ra" },
  { z: 89, symbol: "Ac" },
  { z: 90, symbol: "Th" },
  { z: 91, symbol: "Pa" },
  { z: 92, symbol: "U" },
  { z: 93, symbol: "Np" },
  { z: 94, symbol: "Pu" },
  { z: 95, symbol: "Am" },
  { z: 96, symbol: "Cm" },
  { z: 97, symbol: "Bk" },
  { z: 98, symbol: "Cf" },
  { z: 99, symbol: "Es" },
  { z: 100, symbol: "Fm" },
  { z: 101, symbol: "Md" },
  { z: 102, symbol: "No" },
  { z: 103, symbol: "Lr" },
  { z: 104, symbol: "Rf" },
  { z: 105, symbol: "Db" },
  { z: 106, symbol: "Sg" },
  { z: 107, symbol: "Bh" },
  { z: 108, symbol: "Hs" },
  { z: 109, symbol: "Mt" },
  { z: 110, symbol: "Ds" },
  { z: 111, symbol: "Rg" },
  { z: 112, symbol: "Cn" },
  { z: 113, symbol: "Nh" },
  { z: 114, symbol: "Fl" },
  { z: 115, symbol: "Mc" },
  { z: 116, symbol: "Lv" },
  { z: 117, symbol: "Ts" },
  { z: 118, symbol: "Og" },
];

// 1〜20の日本語元素名
const NAME_JA_1_20 = {
  1: "水素",
  2: "ヘリウム",
  3: "リチウム",
  4: "ベリリウム",
  5: "ホウ素",
  6: "炭素",
  7: "窒素",
  8: "酸素",
  9: "フッ素",
  10: "ネオン",
  11: "ナトリウム",
  12: "マグネシウム",
  13: "アルミニウム",
  14: "ケイ素",
  15: "リン",
  16: "硫黄",
  17: "塩素",
  18: "アルゴン",
  19: "カリウム",
  20: "カルシウム",
};

function nameJaForZ(z) {
  const v = NAME_JA_1_20[z];
  return isNil(v) ? "元素（" + String(z) + "）" : v;
}

const MODES = {
  ATOMIC_NUMBER: "atomic_number",
  ELEMENT_NAME: "element_name",
  PERIODIC_TABLE: "periodic_table",
};

function modeMeta(mode) {
  if (mode === MODES.ELEMENT_NAME) {
    return {
      title: "元素名モード",
      detail: "元素名に合う元素記号をタップ",
      quizPrompt: "この元素の元素記号は？",
    };
  }
  if (mode === MODES.PERIODIC_TABLE) {
    return {
      title: "周期表モード",
      detail: "周期表で、正しいマスをタップ",
      quizPrompt: "周期表で場所をタップ",
    };
  }
  return {
    title: "原子番号モード",
    detail: "原子番号に合う元素記号をタップ",
    quizPrompt: "この原子番号の元素記号は？",
  };
}

function gradeForSeconds(sec) {
  if (sec <= 60) {
    return {
      grade: "S",
      title: "元素記号マスター!!",
      comment:
        "すごい！反射神経も知識もバッチリ。もうあなたは元素記号マスター！",
    };
  }
  if (sec <= 90) {
    return {
      grade: "A",
      title: "すばらしい！",
      comment: "とても良いペース！あと少しでSも見えてきます。",
    };
  }
  if (sec <= 120) {
    return {
      grade: "B",
      title: "順調!",
      comment: "迷った問題を復習すると、タイムがぐっと縮みます。",
    };
  }
  return {
    grade: "C",
    title: "これから伸びる",
    comment: "大丈夫、伸びしろたっぷり！まずは1〜10を完璧にしてみよう。",
  };
}

// ===== Best record (device-local) =====
function bestStorageKey(mode) {
  return "elemquiz_best_v1_" + String(mode);
}

function readBestRecord(mode) {
  try {
    if (typeof window === "undefined") return null;
    const ls = window.localStorage;
    if (!ls) return null;
    const raw = ls.getItem(bestStorageKey(mode));
    if (!raw) return null;
    const obj = JSON.parse(raw);
    if (!obj || typeof obj.sec !== "number" || !isFinite(obj.sec)) return null;
    return {
      sec: obj.sec,
      at: typeof obj.at === "number" ? obj.at : null,
    };
  } catch (e) {
    return null;
  }
}

function writeBestRecord(mode, sec) {
  try {
    if (typeof window === "undefined") return;
    const ls = window.localStorage;
    if (!ls) return;
    const payload = {
      sec: sec,
      at: Date.now(),
    };
    ls.setItem(bestStorageKey(mode), JSON.stringify(payload));
  } catch (e) {
    // ignore
  }
}

function clearAllBestRecords() {
  // 将来使う場合のために残す（UIは付けない）
  try {
    if (typeof window === "undefined") return;
    const ls = window.localStorage;
    if (!ls) return;
    ls.removeItem(bestStorageKey(MODES.ATOMIC_NUMBER));
    ls.removeItem(bestStorageKey(MODES.ELEMENT_NAME));
    ls.removeItem(bestStorageKey(MODES.PERIODIC_TABLE));
  } catch (e) {
    // ignore
  }
}

function sampleDistinctSymbols(count, excludeSymbol) {
  const pool = ELEMENTS.map(function (e) {
    return e.symbol;
  }).filter(function (s) {
    return s !== excludeSymbol;
  });
  const shuffled = shuffle(pool);
  return shuffled.slice(0, count);
}

/**
 * 周期表（1〜20, 遷移元素3〜12族を除く）
 */
const PT_GROUP_COLUMNS = [1, 2, 13, 14, 15, 16, 17, 18];
const PT_POS_1_20 = {
  1: { period: 1, group: 1 },
  2: { period: 1, group: 18 },
  3: { period: 2, group: 1 },
  4: { period: 2, group: 2 },
  5: { period: 2, group: 13 },
  6: { period: 2, group: 14 },
  7: { period: 2, group: 15 },
  8: { period: 2, group: 16 },
  9: { period: 2, group: 17 },
  10: { period: 2, group: 18 },
  11: { period: 3, group: 1 },
  12: { period: 3, group: 2 },
  13: { period: 3, group: 13 },
  14: { period: 3, group: 14 },
  15: { period: 3, group: 15 },
  16: { period: 3, group: 16 },
  17: { period: 3, group: 17 },
  18: { period: 3, group: 18 },
  19: { period: 4, group: 1 },
  20: { period: 4, group: 2 },
};

function ptColForGroup(group) {
  const idx = PT_GROUP_COLUMNS.indexOf(group);
  return idx >= 0 ? idx + 1 : null;
}

function ptCellKey(period, col) {
  return String(period) + "-" + String(col);
}

const PT_CELL_BY_POS = (function () {
  const map = new Map();
  for (let z = 1; z <= 20; z++) {
    const pos = PT_POS_1_20[z];
    if (!pos) continue;
    const col = ptColForGroup(pos.group);
    if (!col) continue;
    map.set(ptCellKey(pos.period, col), z);
  }
  return map;
})();

function ptZAt(period, col) {
  const v = PT_CELL_BY_POS.get(ptCellKey(period, col));
  return isNil(v) ? null : v;
}

function ptHasCell(period, col) {
  return ptZAt(period, col) != null;
}

function ptBorderClasses(period, col) {
  // マスの枠線。スマホの流体グリッドでも確実に視認できるよう、border を使用。
  // 共有辺は左/上を消して二重線を避ける。
  if (!ptHasCell(period, col)) return "";
  let cls = "border border-white/25";
  if (ptHasCell(period, col - 1)) cls += " border-l-0";
  if (ptHasCell(period - 1, col)) cls += " border-t-0";
  return cls;
}

function Pill(props) {
  return (
    <span className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/80">
      {props.children}
    </span>
  );
}

function OptionButton(props) {
  const label = props.label;
  const onClick = props.onClick;
  const disabled = props.disabled;
  const flashKind = props.flashKind;

  const styleObj = {};
  if (flashKind === "correct") {
    styleObj.outline = "2px solid rgba(52,211,153,0.95)";
    styleObj.outlineOffset = "-2px";
    styleObj.boxShadow = "0 0 0 4px rgba(52,211,153,0.18)";
  }
  if (flashKind === "wrong") {
    styleObj.outline = "2px solid rgba(251,113,133,0.95)";
    styleObj.outlineOffset = "-2px";
    styleObj.boxShadow = "0 0 0 4px rgba(251,113,133,0.18)";
  }

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      style={Object.keys(styleObj).length ? styleObj : undefined}
      className={
        "w-full rounded-2xl border px-4 py-5 text-center text-lg font-black shadow-sm transition active:scale-[0.99] focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40 " +
        (disabled
          ? "border-white/10 bg-white/5 text-white/35"
          : "border-white/10 bg-white/10 text-white hover:bg-white/15")
      }
    >
      {label}
    </button>
  );
}

function PeriodicCellButton(props) {
  const onClick = props.onClick;
  const disabled = props.disabled;
  const borderClass = props.borderClass;
  const ariaLabel = props.ariaLabel;
  const sizePx = props.sizePx;
  const flashKind = props.flashKind;

  const styleObj = {};
  if (sizePx) {
    styleObj.height = String(sizePx) + "px";
  }
  // Android/一部端末で border が視認しづらい場合があるため、outline（内側寄せ）も併用して確実に出す
  if (borderClass) {
    styleObj.outline = "1px solid rgba(255,255,255,0.28)";
    styleObj.outlineOffset = "-1px";
  }

  // タップしたマスを短時間ハイライト（正解=緑、不正解=赤）
  if (flashKind === "correct") {
    styleObj.outline = "2px solid rgba(52,211,153,0.95)";
    styleObj.outlineOffset = "-2px";
    styleObj.boxShadow = "0 0 0 4px rgba(52,211,153,0.22)";
  }
  if (flashKind === "wrong") {
    styleObj.outline = "2px solid rgba(251,113,133,0.95)";
    styleObj.outlineOffset = "-2px";
    styleObj.boxShadow = "0 0 0 4px rgba(43, 35, 36, 0.22)";
  }
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      style={Object.keys(styleObj).length ? styleObj : undefined}
      className={
        "w-full box-border rounded-none bg-white/10 transition active:scale-[0.99] focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40" +
        (sizePx ? "" : " aspect-square") +
        " " +
        (borderClass ? borderClass + " " : "") +
        (disabled
          ? "bg-white/5 opacity-60 cursor-not-allowed"
          : "hover:bg-white/15 cursor-pointer")
      }
    >
      <span className="sr-only">{ariaLabel}</span>
    </button>
  );
}

function Overlay(props) {
  const kind = props.kind;
  const text = props.text;
  const subText = coalesce(props.subText, "");

  const styles = {
    correct: "bg-emerald-500/15 border-emerald-400/30",
    wrong: "bg-rose-500/15 border-rose-400/30",
    finish: "bg-sky-500/15 border-sky-400/30",
  };
  const accent = {
    correct: "text-emerald-200",
    wrong: "text-rose-200",
    finish: "text-sky-200",
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-6"
      role="status"
      aria-live="polite"
    >
      <div
        className={
          "w-full max-w-sm rounded-3xl border backdrop-blur-xl " + styles[kind]
        }
      >
        <div className="px-6 py-8 text-center">
          <div className={"text-5xl font-black tracking-tight " + accent[kind]}>
            {text}
          </div>
          <div className="mt-2 text-sm text-white/70">{subText}</div>
        </div>
      </div>
    </motion.div>
  );
}

function HelpModal(props) {
  const onClose = props.onClose;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[60] flex items-center justify-center p-5"
      role="dialog"
      aria-modal="true"
      aria-label="あそび方"
      onClick={function () {
        onClose();
      }}
    >
      <div className="absolute inset-0 bg-black/60" aria-hidden="true" />
      <motion.div
        initial={{ y: 10, scale: 0.98 }}
        animate={{ y: 0, scale: 1 }}
        exit={{ y: 10, scale: 0.98 }}
        className="relative w-full max-w-md rounded-3xl border border-white/10 bg-slate-950/80 p-5 shadow-xl backdrop-blur-xl"
        onClick={function (e) {
          e.stopPropagation();
        }}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="text-sm font-semibold text-white/70">あそび方</div>
            <div className="text-lg font-black tracking-tight text-white">
              元素記号クイズ
            </div>
          </div>
          <button
            type="button"
            onClick={function () {
              onClose();
            }}
            className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-black text-white/80 hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
          >
            とじる
          </button>
        </div>

        <ul className="mt-4 space-y-2 text-sm text-white/80">
          <li>・スタート後、3→2→1→Go! のあとにクイズがはじまります。</li>
          <li>・正解をタップすると次の問題へ進みます。</li>
          <li>・まちがえたら、そのボタン（またはマス）がグレーになって続行します。</li>
          <li>・20問おわると、タイムと評価が出ます。</li>
          <li>・結果画面の「復習」で、まちがえた問題だけやり直せます。</li>
        </ul>

        <div className="mt-4 rounded-2xl border border-white/10 bg-white/5 p-4 text-xs text-white/70">
          ヒント：元素記号は大文字のみ（例:H）または大文字＋小文字（例：He）
        </div>
      </motion.div>
    </motion.div>
  );
}

function PeriodicTableModal(props) {
  const onClose = props.onClose;
  const imgSrc = props.imgSrc;
  const baseWidthPx = props.baseWidthPx;

  // 初期は「だいたい全体が見える」くらい。必要なら調整OK。
  const [zoom, setZoom] = useState(0.35);

  function setZoomSafe(v) {
    setZoom(clamp(v, 0.2, 1.6));
  }

  function dec() {
    setZoom(function (z) {
      return clamp(Math.round((z - 0.1) * 100) / 100, 0.2, 1.6);
    });
  }
  function inc() {
    setZoom(function (z) {
      return clamp(Math.round((z + 0.1) * 100) / 100, 0.2, 1.6);
    });
  }

  function openExternal() {
    // 外部の高機能周期表（軽め・日本語対応）
    const url = "https://artsexperiments.withgoogle.com/periodic-table/?exp=true&lang=ja";
    try {
      window.open(url, "_blank", "noopener,noreferrer");
    } catch (e) {
      // ignore
    }
  }

  const pct = String(Math.round(zoom * 100)) + "%";
  const wPx = Math.max(200, Math.round(baseWidthPx * zoom));

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[70] flex items-center justify-center p-5"
      role="dialog"
      aria-modal="true"
      aria-label="周期表"
      onClick={function () {
        onClose();
      }}
    >
      <div className="absolute inset-0 bg-black/60" aria-hidden="true" />

      <motion.div
        initial={{ y: 10, scale: 0.98 }}
        animate={{ y: 0, scale: 1 }}
        exit={{ y: 10, scale: 0.98 }}
        className="relative w-full max-w-4xl rounded-3xl border border-white/10 bg-slate-950/85 p-4 shadow-xl backdrop-blur-xl"
        onClick={function (e) {
          e.stopPropagation();
        }}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="text-sm font-semibold text-white/70">周期表</div>
            <div className="text-lg font-black tracking-tight text-white">
              拡大して確認できます
            </div>
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={function () {
                openExternal();
              }}
              className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-black text-white/80 hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
            >
              高機能版（外部）
            </button>

            <button
              type="button"
              onClick={function () {
                onClose();
              }}
              className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-black text-white/80 hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
            >
              とじる
            </button>
          </div>
        </div>

        {/* Controls */}
        <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
          <div className="text-xs text-white/60">
            操作：＋/−で拡大縮小、画像はスクロールで移動
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={function () {
                setZoomSafe(0.35);
              }}
              className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-black text-white/80 hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
            >
              初期
            </button>

            <button
              type="button"
              onClick={function () {
                setZoomSafe(1);
              }}
              className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-black text-white/80 hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
            >
              100%
            </button>

            <button
              type="button"
              onClick={dec}
              className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-black text-white/80 hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
            >
              −
            </button>

            <div className="min-w-[52px] text-center text-xs font-black text-white/80">
              {pct}
            </div>

            <button
              type="button"
              onClick={inc}
              className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-black text-white/80 hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
            >
              ＋
            </button>
          </div>
        </div>

        {/* Image area */}
        <div className="mt-3 h-[72vh] overflow-auto rounded-2xl border border-white/10 bg-black/20">
          <img
            src={imgSrc}
            alt="元素周期表"
            draggable={false}
            loading="lazy"
            style={{
              width: String(wPx) + "px",
              height: "auto",
              display: "block",
              maxWidth: "none",
            }}
          />
        </div>
      </motion.div>
    </motion.div>
  );
}


function ModeCard(props) {
  const title = props.title;
  const detail = props.detail;
  const accent = props.accent;
  const onClick = props.onClick;

  const border = "border-" + accent + "-400/30";
  const bg = "bg-" + accent + "-500/10";
  const ring = "focus-visible:ring-" + accent + "-300/40";

  // Tailwindの動的クラスが消えないようにサーフェス
  const safelist =
    "border-cyan-400/30 border-violet-400/30 border-amber-400/30 bg-cyan-500/10 bg-violet-500/10 bg-amber-500/10 focus-visible:ring-cyan-300/40 focus-visible:ring-violet-300/40 focus-visible:ring-amber-300/40";

  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileTap={{ scale: 0.99 }}
      className={
        "relative w-full rounded-3xl border p-4 text-left shadow-sm transition focus:outline-none focus-visible:ring-2 " +
        safelist +
        " " +
        border +
        " " +
        bg +
        " " +
        ring +
        " hover:bg-white/10"
      }
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-base font-black tracking-tight text-white">
            {title}
          </div>
          <div className="mt-2 text-xs text-white/55">{detail}</div>
        </div>
        <div className="mt-1 shrink-0 rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-bold text-white/80">
          スタート
        </div>
      </div>
    </motion.button>
  );
}

function BestSummaryCard(props) {
  const bestByMode = props.bestByMode || {};

  function cell(modeKey, label) {
    const rec = bestByMode[modeKey];
    const has = rec && typeof rec.sec === "number" && isFinite(rec.sec);
    const time = has ? formatSeconds(rec.sec) + "s" : "--.-s";
    const grade = has ? gradeForSeconds(rec.sec).grade : "-";

    return (
      <div className="flex flex-col items-center justify-center px-2 py-3">
        <div className="text-[10px] font-semibold text-white/60 whitespace-nowrap">
          {label}
        </div>
        <div className="mt-1 text-sm font-black text-white/90">{time}</div>
        <div className="mt-1 text-lg font-black text-white">{grade}</div>
      </div>
    );
  }

  return (
    <div className="relative w-full rounded-3xl border border-white/10 bg-white/5 p-4 text-left shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-base font-black tracking-tight text-white">
            ベスト記録
          </div>
          <div className="mt-2 text-xs text-white/55">この端末に保存</div>
        </div>
        <div className="mt-1 shrink-0 rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-bold text-white/80">
          BEST
        </div>
      </div>

      <div className="mt-3 overflow-hidden rounded-2xl border border-white/10 bg-white/5">
        <div className="grid grid-cols-3 divide-x divide-white/10">
          {cell(MODES.ATOMIC_NUMBER, "原子番号")}
          {cell(MODES.ELEMENT_NAME, "元素名")}
          {cell(MODES.PERIODIC_TABLE, "周期表")}
        </div>
      </div>
    </div>
  );
}

function ActionButton(props) {
  const children = props.children;
  const onClick = props.onClick;
  const variant = coalesce(props.variant, "primary");
  const disabled = props.disabled;
  const compact = !!props.compact;

  const base =
    "w-full rounded-2xl px-4 font-black shadow-sm transition active:scale-[0.99] focus:outline-none focus-visible:ring-2 focus-visible:ring-white/30 " +
    (compact ? "py-3.5 text-sm" : "py-4 text-base");

  if (variant === "primary") {
    return (
      <button
        type="button"
        onClick={onClick}
        disabled={disabled}
        className={
          base +
          " " +
          (disabled
            ? "bg-white/10 text-white/35"
            : "bg-white text-slate-950 hover:bg-white/95")
        }
      >
        {children}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={
        base +
        " border border-white/10 bg-white/5 text-white/85 hover:bg-white/10 " +
        (disabled ? "opacity-50" : "")
      }
    >
      {children}
    </button>
  );
}

function runSelfTests() {
  try {
    // clamp
    console.assert(clamp(5, 0, 10) === 5, "clamp basic");
    console.assert(clamp(-1, 0, 10) === 0, "clamp min");
    console.assert(clamp(99, 0, 10) === 10, "clamp max");

    // best key
    console.assert(
      bestStorageKey("x").indexOf("elemquiz_best_v1_") === 0,
      "bestStorageKey prefix"
    );

    // pt mapping
    console.assert(ptZAt(1, 1) === 1, "ptZAt H");
    console.assert(ptZAt(1, 8) === 2, "ptZAt He");
    console.assert(ptZAt(2, 1) === 3, "ptZAt Li");
    console.assert(ptZAt(4, 2) === 20, "ptZAt Ca");

    // distractors uniqueness
    const ds = sampleDistinctSymbols(7, "H");
    const set = new Set(ds);
    console.assert(set.size === ds.length, "distractors unique");
    console.assert(set.has("H") === false, "distractors exclude");
  } catch (e) {
    // テスト失敗はアプリ動作を止めない
    // eslint-disable-next-line no-console
    console.log("selftest error", e);
  }
}

export default function App() {
  const [screen, setScreen] = useState("home");
  const [countdownStep, setCountdownStep] = useState(0);

  const [mode, setMode] = useState(MODES.ATOMIC_NUMBER);
  const [phase, setPhase] = useState("main");

  const [order, setOrder] = useState([]);
  const [qIndex, setQIndex] = useState(0);

  const [options, setOptions] = useState([]);

  const [disabledSet, setDisabledSet] = useState(function () {
    return new Set();
  });

  const [overlay, setOverlay] = useState(null);
  const [cellFlash, setCellFlash] = useState(null);
  const [symFlash, setSymFlash] = useState(null);

  const [wrongCount, setWrongCount] = useState(0);
  const [missedSet, setMissedSet] = useState(function () {
    return new Set();
  });
  const [madeMistakeThisQuestion, setMadeMistakeThisQuestion] = useState(false);

  const startMsRef = useRef(null);

  const [lastResult, setLastResult] = useState(null);
  const [lastReview, setLastReview] = useState(null);

  const [showHelp, setShowHelp] = useState(false);

  // ===== Periodic table image (public/) =====
  const PT_IMAGE_VERSION = "2026-01-26"; // 画像差し替え時に変更（キャッシュ回避）
  const PT_IMAGE_SRC = "/periodic-table.png?v=" + PT_IMAGE_VERSION;
  const PT_IMAGE_BASE_W = 2048; // 画像の元の幅（今回のPNGは2048px幅）

  const [showPeriodicTable, setShowPeriodicTable] = useState(false);

  const [bestByMode, setBestByMode] = useState(function () {
    return {};
  });

  // iOS/iPadOSの見切れ対策用
  const [appHeightPx, setAppHeightPx] = useState(0);
  const [appWidthPx, setAppWidthPx] = useState(0);

  // 周期表のレイアウト最適化（PCで横スクロールが出ないように幅からセルサイズを自動調整）
  const [ptWrapWidth, setPtWrapWidth] = useState(0);
  const ptWrapRef = useRef(null);
  const [isCoarsePointer, setIsCoarsePointer] = useState(false);

  // self tests
  useEffect(function () {
    runSelfTests();
  }, []);

  function refreshBestFromStorage() {
    const next = {};
    const a = readBestRecord(MODES.ATOMIC_NUMBER);
    const n = readBestRecord(MODES.ELEMENT_NAME);
    const p = readBestRecord(MODES.PERIODIC_TABLE);
    if (a) next[MODES.ATOMIC_NUMBER] = a;
    if (n) next[MODES.ELEMENT_NAME] = n;
    if (p) next[MODES.PERIODIC_TABLE] = p;
    setBestByMode(next);
  }

  useEffect(function () {
    refreshBestFromStorage();
  }, []);

  const countdownLabels = useMemo(
    function () {
      return ["3", "2", "1", "Go!"];
    },
    []
  );

  const currentZ = useMemo(
    function () {
      const v = order[qIndex];
      return isNil(v) ? null : v;
    },
    [order, qIndex]
  );

  const correctSymbol = useMemo(
    function () {
      if (!currentZ) return null;
      const e = ELEMENTS[currentZ - 1];
      return e ? e.symbol : null;
    },
    [currentZ]
  );

  const isPeriodic = mode === MODES.PERIODIC_TABLE;
  const isQuizPeriodic = screen === "quiz" && isPeriodic;

  // 画面が低い端末（アドレスバー表示中のiPadなど）ではコンパクト表示
  const isCompact = appHeightPx > 0 && appHeightPx <= 760;
  const isQuizCompact = isCompact && screen === "quiz";

  // スマホ相当（タッチ主体かつ短辺が小さい）
  const minSidePx =
    appWidthPx > 0 && appHeightPx > 0
      ? Math.min(appWidthPx, appHeightPx)
      : 9999;
  const isPhoneLike = isCoarsePointer && minSidePx <= 520;

  // スマホ相当では、JSでpx固定レイアウトを詰めても端末の丸め誤差で
  // 右端が欠けたり横スクロールが出ることがあるため、幅100%の流体グリッドに切り替える。
  // さらにPC（fine pointer）では、初回計測とスクロールバー出現のタイミング差で
  // 右端が見切れることがあるため、同様に流体グリッドを使って常にフィットさせる。
  // iPad等のタッチ主体（coarse pointer, phone以外）はタップしやすさ優先でpx固定を維持。
  const ptIsFluid = isQuizPeriodic && (isPhoneLike || !isCoarsePointer);

  // 周期表モードはタップしやすさ優先でセルを大きめに。
  // ただし、画面幅が足りない場合はカード幅に合わせて縮小し、横スクロールを回避。
  const ptLabelColPx = isPhoneLike ? 44 : 52;
  const ptMaxCellPx = isQuizPeriodic
    ? isPhoneLike
      ? 42
      : isCompact
        ? 46
        : 52
    : isQuizCompact
      ? 38
      : 40;

  const ptMinCellPx = isQuizPeriodic
    ? isPhoneLike
      ? 28
      : isCoarsePointer
        ? isCompact
          ? 46
          : 48
        : 40
    : isQuizCompact
      ? 38
      : 40;

  const ptFitSafetyPx = isPhoneLike ? 22 : 6;
  const ptFitCellPx =
    ptWrapWidth > 0
      ? Math.floor((ptWrapWidth - ptLabelColPx - ptFitSafetyPx) / 8)
      : ptMaxCellPx;

  const ptCellPx = clamp(ptFitCellPx, ptMinCellPx, ptMaxCellPx);
  const ptGridWidth = ptLabelColPx + 8 * ptCellPx;
  const ptAllowScroll = ptIsFluid
    ? false
    : ptWrapWidth > 0
      ? ptGridWidth > ptWrapWidth + 2
      : true;

  const ptGroupLabelClass =
    "h-5 min-w-0 overflow-hidden flex items-end justify-center pb-0 font-black text-white/55 whitespace-nowrap tracking-tight leading-tight " +
    (isPhoneLike ? "text-[8px]" : "text-[9px]");

  const ptPeriodLabelClass =
    "min-w-0 overflow-hidden flex items-center justify-center pr-1 font-black text-white/55 tracking-tight leading-tight " +
    (isPhoneLike ? "text-[8px] leading-[9px]" : "text-[9px]");

  const promptMainText = useMemo(
    function () {
      if (!currentZ) return "";
      if (mode === MODES.ELEMENT_NAME) return nameJaForZ(currentZ);
      if (mode === MODES.PERIODIC_TABLE) return coalesce(correctSymbol, "");
      return String(currentZ);
    },
    [mode, currentZ, correctSymbol]
  );

  const promptSubText = useMemo(
    function () {
      const meta = modeMeta(mode);
      return meta.quizPrompt;
    },
    [mode]
  );

  function buildQuestion(nextIndex, nextOrder) {
    const baseOrder = nextOrder || order;
    const z = baseOrder[nextIndex];
    const correct = ELEMENTS[z - 1].symbol;

    if (mode === MODES.PERIODIC_TABLE) {
      setOptions([]);
      setDisabledSet(new Set());
      setMadeMistakeThisQuestion(false);
      setCellFlash(null);
      setSymFlash(null);
      return;
    }

    const distractors = sampleDistinctSymbols(7, correct);
    const opts = shuffle([correct, ...distractors]);
    setOptions(opts);
    setDisabledSet(new Set());
    setMadeMistakeThisQuestion(false);
    setSymFlash(null);
  }

  function resetSessionCommon() {
    setQIndex(0);
    setWrongCount(0);
    setMissedSet(new Set());
    setMadeMistakeThisQuestion(false);
    setOptions([]);
    setDisabledSet(new Set());
    setOverlay(null);
    setCellFlash(null);
    setSymFlash(null);
    startMsRef.current = null;
  }

  function startMain(selectedMode) {
    const m = selectedMode || MODES.ATOMIC_NUMBER;
    setMode(m);
    setPhase("main");
    setLastReview(null);

    const o = shuffle(
      Array.from({ length: 20 }, function (_, i) {
        return i + 1;
      })
    );
    setOrder(o);
    resetSessionCommon();

    setCountdownStep(0);
    setScreen("countdown");
  }

  function startReview() {
    if (!lastResult || !lastResult.missedZs || !lastResult.missedZs.length) return;

    setMode(lastResult.mode);
    setPhase("review");

    const o = shuffle(lastResult.missedZs);
    setOrder(o);
    resetSessionCommon();

    setCountdownStep(0);
    setScreen("countdown");
  }

  function backHome() {
    setScreen("home");
    setOverlay(null);
    setCellFlash(null);
    setSymFlash(null);
    setOptions([]);
    setDisabledSet(new Set());
    setOrder([]);
    setQIndex(0);
    setWrongCount(0);
    setMissedSet(new Set());
    setMadeMistakeThisQuestion(false);
    startMsRef.current = null;
  }

  // iOS/iPadOS Safari の 100vh 問題対策：innerHeight を CSS 変数に同期
  useEffect(function () {
    const setAppHeight = function () {
      const h = window.innerHeight;
      const w = window.innerWidth;
      setAppHeightPx(h);
      setAppWidthPx(w);
      document.documentElement.style.setProperty("--app-height", String(h) + "px");
    };

    setAppHeight();
    window.addEventListener("resize", setAppHeight);
    window.addEventListener("orientationchange", setAppHeight);

    return function () {
      window.removeEventListener("resize", setAppHeight);
      window.removeEventListener("orientationchange", setAppHeight);
    };
  }, []);

  // pointerがcoarse（=タッチ主体）かどうか
  useEffect(function () {
    const detect = function () {
      let coarse = false;
      try {
        if ("ontouchstart" in window) coarse = true;
        if (!coarse && window.matchMedia) {
          const m = window.matchMedia("(pointer: coarse)");
          if (m && m.matches) coarse = true;
        }
      } catch (e) {
        coarse = false;
      }
      setIsCoarsePointer(coarse);
    };

    detect();
  }, []);

  // 周期表のラッパー幅を計測
  useEffect(
    function () {
      const el = ptWrapRef.current;
      if (!el) return;

      let ro = null;
      let raf = 0;

      const measure = function () {
        if (!ptWrapRef.current) return;
        // clientWidth はスクロールバーの出現タイミング等でブレることがあるため、
        // 見た目の幅（border-box）を優先し、端末差の小数pxを切り捨てて安定化。
        let w = 0;
        try {
          const rect = ptWrapRef.current.getBoundingClientRect();
          if (rect && typeof rect.width === "number") {
            w = Math.floor(rect.width);
          }
        } catch (e) {
          w = 0;
        }
        if (!w) {
          w = ptWrapRef.current.clientWidth;
        }
        setPtWrapWidth(w);
      };

      if (typeof ResizeObserver !== "undefined") {
        ro = new ResizeObserver(function () {
          if (raf) cancelAnimationFrame(raf);
          raf = requestAnimationFrame(function () {
            measure();
          });
        });
        ro.observe(el);
      } else {
        measure();
        window.addEventListener("resize", measure);
        window.addEventListener("orientationchange", measure);
      }

      measure();

      return function () {
        if (raf) cancelAnimationFrame(raf);
        if (ro) ro.disconnect();
        window.removeEventListener("resize", measure);
        window.removeEventListener("orientationchange", measure);
      };
    },
    [screen, mode]
  );

  // bodyは固定し、アプリ内のみスクロール
  useEffect(function () {
    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";
    return function () {
      document.documentElement.style.overflow = "";
      document.body.style.overflow = "";
    };
  }, []);

  // カウントダウン
  useEffect(
    function () {
      if (screen !== "countdown") return;

      let cancelled = false;
      const tick = function (i) {
        if (cancelled) return;
        setCountdownStep(i);
        if (i >= 3) {
          window.setTimeout(function () {
            if (cancelled) return;
            setScreen("quiz");
          }, 900);
          return;
        }
        window.setTimeout(function () {
          tick(i + 1);
        }, 1000);
      };

      tick(0);

      return function () {
        cancelled = true;
      };
    },
    [screen]
  );

  // クイズ開始時に1問目生成 + タイマー開始（本番のみ）
  useEffect(
    function () {
      if (screen !== "quiz") return;
      if (!order.length) return;

      if (startMsRef.current == null) {
        if (phase === "main") {
          startMsRef.current = performance.now();
        }
        buildQuestion(0, order);
      }
    },
    [screen, order, phase, mode]
  );

  function finalizeSession() {
    if (phase === "main") {
      const endMs = performance.now();
      const startMs = startMsRef.current == null ? endMs : startMsRef.current;
      const sec = (endMs - startMs) / 1000;
      const safe = clamp(sec, 0, 9999);
      const missedZs = Array.from(missedSet);

      const prev = readBestRecord(mode);
      const prevSec = prev ? prev.sec : null;
      const isNewBest = prevSec == null ? true : safe < prevSec;

      if (isNewBest) {
        writeBestRecord(mode, safe);
        refreshBestFromStorage();
      }

      setLastResult({
        mode: mode,
        elapsedSec: safe,
        wrongCount: wrongCount,
        missedZs: missedZs,
        isNewBest: isNewBest,
        prevBestSec: prevSec,
      });
      setScreen("result");
      return;
    }

    const missedZs2 = Array.from(missedSet);
    setLastReview({
      mode: mode,
      wrongCount: wrongCount,
      missedZs: missedZs2,
    });
    setScreen("result");
  }

  function markIfMissedOnSolve() {
    if (!madeMistakeThisQuestion) return;
    setMissedSet(function (prev) {
      const n = new Set(prev);
      n.add(currentZ);
      return n;
    });
  }

  function handleCorrectAdvance() {
    setOverlay({ kind: "correct", text: "正解！", subText: "" });
    window.setTimeout(function () {
      setOverlay(null);
      const next = qIndex + 1;
      if (next >= order.length) {
        setOverlay({
          kind: "finish",
          text: phase === "main" ? "終了！" : "復習完了！",
          subText: phase === "main" ? "" : "結果を見てみよう",
        });
        window.setTimeout(function () {
          setOverlay(null);
          finalizeSession();
        }, 900);
      } else {
        setQIndex(next);
        buildQuestion(next);
      }
    }, 650);
  }

  function blurActiveElement() {
    const ae = document.activeElement;
    if (ae && ae.blur) ae.blur();
  }

  function handlePickSymbol(sym) {
    if (screen !== "quiz") return;
    if (!correctSymbol) return;
    if (overlay) return;
    if (disabledSet.has(sym)) return;

    blurActiveElement();

    // タップしたボタンが分かるように、短時間だけ強調表示
    const kindNow = sym === correctSymbol ? "correct" : "wrong";
    setSymFlash({ sym: sym, kind: kindNow });
    window.setTimeout(function () {
      setSymFlash(null);
    }, 520);

    if (sym === correctSymbol) {
      markIfMissedOnSolve();
      handleCorrectAdvance();
    } else {
      setWrongCount(function (v) {
        return v + 1;
      });
      setMadeMistakeThisQuestion(true);
      setOverlay({ kind: "wrong", text: "不正解", subText: "もう一度" });
      setDisabledSet(function (prev) {
        const n = new Set(prev);
        n.add(sym);
        return n;
      });
      window.setTimeout(function () {
        setOverlay(null);
      }, 420);
    }
  }

  function handlePickCell(zPicked) {
    if (screen !== "quiz") return;
    if (!currentZ) return;
    if (overlay) return;
    if (disabledSet.has(zPicked)) return;

    blurActiveElement();

    // タップしたマスが分かるように、短時間だけ強調表示
    const kindNow = zPicked === currentZ ? "correct" : "wrong";
    setCellFlash({ z: zPicked, kind: kindNow });
    window.setTimeout(function () {
      setCellFlash(null);
    }, 520);

    if (zPicked === currentZ) {
      markIfMissedOnSolve();
      handleCorrectAdvance();
    } else {
      setWrongCount(function (v) {
        return v + 1;
      });
      setMadeMistakeThisQuestion(true);
      setOverlay({ kind: "wrong", text: "不正解", subText: "別のマスをタップ" });
      setDisabledSet(function (prev) {
        const n = new Set(prev);
        n.add(zPicked);
        return n;
      });
      window.setTimeout(function () {
        setOverlay(null);
      }, 420);
    }
  }

  const result = useMemo(
    function () {
      if (!lastResult) return null;
      const g = gradeForSeconds(lastResult.elapsedSec);
      const missedCount = lastResult.missedZs ? lastResult.missedZs.length : 0;
      return {
        grade: g.grade,
        title: g.title,
        comment: g.comment,
        mode: lastResult.mode,
        time: formatSeconds(lastResult.elapsedSec),
        wrongCount: lastResult.wrongCount,
        missedCount: missedCount,
      };
    },
    [lastResult]
  );

  const headerText = useMemo(
    function () {
      if (screen === "home") {
        return {
          eyebrow: "元素記号クイズ（1〜20）",
          title: "モードをえらぼう",
          subtitle: "3つの練習モード",
        };
      }
      const m = modeMeta(mode);
      return {
        eyebrow: phase === "review" ? "復習" : "本番",
        title: m.title,
        subtitle: "",
      };
    },
    [screen, mode, phase]
  );

  const topPadBase = isPhoneLike ? "1rem" : "1.25rem";
  const bottomPadBase = isPhoneLike ? "1rem" : "1.25rem";
  const sidePadBase = isPhoneLike ? "0.75rem" : "1.25rem";

  const topPadding = "calc(" + topPadBase + " + env(safe-area-inset-top))";
  const bottomPadding =
    "calc(" + bottomPadBase + " + env(safe-area-inset-bottom))";
  const leftPadding = "calc(" + sidePadBase + " + env(safe-area-inset-left))";
  const rightPadding =
    "calc(" + sidePadBase + " + env(safe-area-inset-right))";

  // quiz/result の縦余白を自動で少し圧縮
  const mainGapClass = isCompact ? "mt-4" : "mt-6";

  const showReviewButton =
    screen === "result" &&
    phase === "main" &&
    lastResult &&
    lastResult.missedZs &&
    lastResult.missedZs.length > 0;

  const reviewCount =
    lastResult && lastResult.missedZs ? lastResult.missedZs.length : 0;

  return (
    <div
      className="w-full bg-gradient-to-b from-slate-950 via-slate-950 to-indigo-950 text-white"
      style={{ minHeight: "var(--app-height, 100vh)" }}
    >
      <div
        className={
          "mx-auto flex w-full flex-col " +
          (isPhoneLike ? "max-w-none" : "max-w-lg")
        }
        style={{
          height: "var(--app-height, 100vh)",
          paddingTop: topPadding,
          paddingBottom: bottomPadding,
          paddingLeft: leftPadding,
          paddingRight: rightPadding,
        }}
      >
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <div className="text-sm font-semibold text-white/70">
              {headerText.eyebrow}
            </div>
            <div className="text-xl font-black tracking-tight">
              {headerText.title}
            </div>
            {headerText.subtitle ? (
              <div className="mt-1 text-xs text-white/55">
                {headerText.subtitle}
              </div>
            ) : null}
          </div>
          <div className="flex gap-2">
            <Pill>20問</Pill>
            <Pill>1〜20</Pill>
          </div>
        </div>

        {/* Main */}
        <div
          className={
            mainGapClass + " flex flex-1 flex-col overflow-y-auto overscroll-contain"
          }
        >
          <AnimatePresence mode="wait">
            {screen === "home" && (
              <motion.div
                key="home"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex flex-1 flex-col"
              >
                <div className="rounded-3xl border border-white/10 bg-white/5 p-4 shadow-sm">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="text-sm font-black">あそび方</div>
                      <div className="mt-1 text-xs text-white/70">
                        3→2→1→Go! のあと開始。20問でタイム評価。
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={function () {
                        setShowHelp(true);
                      }}
                      className="shrink-0 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-black text-white/80 hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
                    >
                      くわしく
                    </button>
                  </div>
                </div>

                <div className="mt-3">
                  <ActionButton
                    variant="secondary"
                    onClick={function () {
                      setShowPeriodicTable(true);
                    }}
                  >
                    周期表を見る
                  </ActionButton>
                </div>

                <div className="mt-4 text-xs font-semibold text-white/60">
                  モードをえらぶ
                </div>

                <div className="mt-3 grid gap-3 sm:grid-cols-2">
                  <ModeCard
                    title="原子番号モード"
                    detail="原子番号に合う元素記号をタップ"
                    accent="cyan"
                    onClick={function () {
                      startMain(MODES.ATOMIC_NUMBER);
                    }}
                  />

                  <ModeCard
                    title="元素名モード"
                    detail="元素名に合う元素記号をタップ"
                    accent="violet"
                    onClick={function () {
                      startMain(MODES.ELEMENT_NAME);
                    }}
                  />

                  <ModeCard
                    title="周期表モード"
                    detail="周期表で、正しいマスをタップ"
                    accent="amber"
                    onClick={function () {
                      startMain(MODES.PERIODIC_TABLE);
                    }}
                  />

                  <BestSummaryCard bestByMode={bestByMode} />
                </div>

                <div className="mt-4 text-center text-xs text-white/45">
                  全モードでＳ評価を取って先生に見せるといいことがあるかも……？
                </div>
              </motion.div>
            )}

            {screen === "countdown" && (
              <motion.div
                key="countdown"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                className="flex flex-1 flex-col items-center justify-center"
              >
                <div className="text-sm font-semibold text-white/70">
                  {phase === "review" ? "復習をはじめるよ" : "はじめるよ"}
                </div>
                <motion.div
                  key={countdownStep}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="mt-3 text-7xl font-black tracking-tight"
                >
                  {countdownLabels[countdownStep]}
                </motion.div>

                <div className="mt-8 w-full">
                  <ActionButton
                    variant="secondary"
                    onClick={function () {
                      backHome();
                    }}
                  >
                    ホームへもどる
                  </ActionButton>
                </div>
              </motion.div>
            )}

            {screen === "quiz" && (
              <motion.div
                key="quiz"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex flex-1 flex-col"
              >
                {/* status */}
                <div className="flex items-center justify-between">
                  <div className="text-xs text-white/65">
                    <span className="font-semibold text-white/85">
                      {qIndex + 1}
                    </span>
                    <span className="text-white/45"> / {order.length}</span>
                    <span className="ml-2">ミス {wrongCount}</span>
                  </div>
                  <button
                    type="button"
                    onClick={function () {
                      backHome();
                    }}
                    className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-black text-white/80 hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
                  >
                    ホーム
                  </button>
                </div>

                {/* progress */}
                <div
                  className={
                    (isQuizCompact ? "mt-2" : "mt-3") +
                    " h-2 w-full overflow-hidden rounded-full bg-white/10"
                  }
                >
                  <div
                    className="h-full bg-white/70"
                    style={{
                      width:
                        String(((qIndex + 1) / Math.max(1, order.length)) * 100) +
                        "%",
                    }}
                    aria-hidden="true"
                  />
                </div>

                {/* prompt */}
                <div
                  className={
                    (mode === MODES.PERIODIC_TABLE
                      ? isQuizCompact
                        ? "mt-3"
                        : "mt-4"
                      : isQuizCompact
                        ? "mt-5"
                        : "mt-8") + " flex flex-col items-center"
                  }
                >
                  {isPeriodic ? null : (
                    <div className="text-sm font-semibold text-white/70">
                      {promptSubText}
                    </div>
                  )}

                  <div
                    className={
                      "mt-2 w-full rounded-3xl border border-white/10 bg-white/5 shadow-sm " +
                      (isQuizPeriodic
                        ? isQuizCompact
                          ? "px-5 py-4"
                          : "px-6 py-5"
                        : isQuizCompact
                          ? "px-5 py-5"
                          : "px-6 py-7")
                    }
                  >
                    <div
                      className={
                        "text-center font-black tracking-tight " +
                        (mode === MODES.PERIODIC_TABLE
                          ? isQuizCompact
                            ? "text-3xl"
                            : "text-4xl"
                          : isQuizCompact
                            ? "text-5xl"
                            : "text-6xl")
                      }
                    >
                      {promptMainText}
                    </div>
                  </div>
                </div>

                {/* choices */}
                {!isPeriodic ? (
                  <div
                    className={
                      (isQuizCompact ? "mt-6" : "mt-8") +
                      " grid grid-cols-2 gap-3 sm:grid-cols-4"
                    }
                  >
                    {options.map(function (sym) {
                      return (
                        <motion.div
                          key={String(qIndex) + "-" + sym}
                          whileTap={{ scale: disabledSet.has(sym) ? 1 : 0.99 }}
                        >
                          <OptionButton
                            label={sym}
                            disabled={disabledSet.has(sym)}
                            onClick={function () {
                              handlePickSymbol(sym);
                            }}
                            flashKind={
                              symFlash && symFlash.sym === sym
                                ? symFlash.kind
                                : null
                            }
                          />
                        </motion.div>
                      );
                    })}
                  </div>
                ) : (
                  <div className={(isQuizCompact ? "mt-4" : "mt-6") + ""}>
                    <div className="text-center text-xs text-white/60">
                      {promptSubText}（まちがえたマスはグレー）
                    </div>

                    <div className={(isQuizCompact ? "mt-3" : "mt-4") + ""}>
                      <div
                        className={
                          "w-full rounded-3xl border border-white/10 bg-white/5 shadow-sm " +
                          (isQuizCompact ? "p-3" : "p-4")
                        }
                      >
                        <div className="mb-1 text-[10px] font-black text-white/60">
                          周期表
                        </div>

                        <div
                          ref={ptWrapRef}
                          className={
                            (ptAllowScroll
                              ? "overflow-x-auto"
                              : "overflow-x-hidden") + " w-full max-w-full"
                          }
                        >
                          <div
                            className={
                              "grid gap-0 select-none " +
                              (ptIsFluid ? "w-full" : "mx-auto")
                            }
                            style={
                              ptIsFluid
                                ? {
                                    gridTemplateColumns:
                                      String(ptLabelColPx) +
                                      "px repeat(8, minmax(0, 1fr))",
                                  }
                                : {
                                    width: String(ptGridWidth) + "px",
                                    gridTemplateColumns:
                                      String(ptLabelColPx) +
                                      "px repeat(8," +
                                      String(ptCellPx) +
                                      "px)",
                                  }
                            }
                          >
                            {/* group labels */}
                            <div className="h-5" aria-hidden="true" />
                            {PT_GROUP_COLUMNS.map(function (g) {
                              return (
                                <div
                                  key={"g-" + String(g)}
                                  className={ptGroupLabelClass}
                                >
                                  {g}族
                                </div>
                              );
                            })}

                            {/* periods + cells */}
                            {(() => {
                              const nodes = [];
                              for (let period = 1; period <= 4; period++) {
                                nodes.push(
                                  <div
                                    key={"p-" + String(period)}
                                    style={
                                      ptIsFluid
                                        ? undefined
                                        : { height: String(ptCellPx) + "px" }
                                    }
                                    className={ptPeriodLabelClass}
                                  >
                                    {isPhoneLike ? (
                                      <div className="text-center">
                                        <div>{"第" + String(period)}</div>
                                        <div>周期</div>
                                      </div>
                                    ) : (
                                      "第" + String(period) + "周期"
                                    )}
                                  </div>
                                );

                                for (let col = 1; col <= 8; col++) {
                                  const z = ptZAt(period, col);
                                  if (!z) {
                                    nodes.push(
                                      <div
                                        key={
                                          "empty-" +
                                          String(period) +
                                          "-" +
                                          String(col)
                                        }
                                        style={
                                          ptIsFluid
                                            ? undefined
                                            : { height: String(ptCellPx) + "px" }
                                        }
                                        aria-hidden="true"
                                      />
                                    );
                                    continue;
                                  }

                                  const group = PT_GROUP_COLUMNS[col - 1];
                                  const ariaLabel =
                                    "第" +
                                    String(period) +
                                    "周期 " +
                                    String(group) +
                                    "族 のマス";

                                  nodes.push(
                                    <div
                                      key={
                                        "cell-" + String(period) + "-" + String(col)
                                      }
                                    >
                                      <PeriodicCellButton
                                        sizePx={ptIsFluid ? null : ptCellPx}
                                        disabled={disabledSet.has(z)}
                                        onClick={function () {
                                          handlePickCell(z);
                                        }}
                                        borderClass={ptBorderClasses(period, col)}
                                        ariaLabel={ariaLabel}
                                        flashKind={
                                          cellFlash && cellFlash.z === z
                                            ? cellFlash.kind
                                            : null
                                        }
                                      />
                                    </div>
                                  );
                                }
                              }
                              return nodes;
                            })()}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {!isPeriodic ? (
                  <div
                    className={
                      (isQuizCompact ? "mt-4" : "mt-6") +
                      " text-center text-xs text-white/45"
                    }
                  >
                    ヒント：元素記号は大文字＋小文字（例：He, Li, Na）
                  </div>
                ) : null}
              </motion.div>
            )}

            {screen === "result" && (
              <motion.div
                key="result"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex flex-1 flex-col"
              >
                <div className="rounded-3xl border border-white/10 bg-white/5 p-5 shadow-sm">
                  <div className="text-sm font-semibold text-white/70">
                    {phase === "review" ? "復習結果" : "結果"}
                  </div>

                  {phase === "main" && result ? (
                    <div className="mt-4">
                      {lastResult && lastResult.isNewBest ? (
                        <div className="mb-3 rounded-2xl border border-emerald-400/30 bg-emerald-500/10 px-4 py-3 text-sm font-black text-emerald-200">
                          ベスト更新！
                        </div>
                      ) : null}
                      <div className="text-3xl font-black tracking-tight">
                        {result.grade}
                      </div>
                      <div className="mt-1 text-lg font-black">{result.title}</div>
                      <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
                        <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                          <div className="text-xs text-white/60">タイム</div>
                          <div className="mt-1 text-2xl font-black">
                            {result.time}s
                          </div>
                        </div>
                        <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                          <div className="text-xs text-white/60">ミス</div>
                          <div className="mt-1 text-2xl font-black">
                            {result.wrongCount}
                          </div>
                        </div>
                      </div>
                      <div className="mt-4 text-sm text-white/75">
                        {result.comment}
                      </div>

                      {reviewCount > 0 ? (
                        <div className="mt-3 text-xs text-white/55">
                          間違えた（または迷った）問題：{reviewCount}問
                        </div>
                      ) : null}
                    </div>
                  ) : (
                    <div className="mt-4">
                      <div className="text-lg font-black">おつかれさま！</div>
                      <div className="mt-2 text-sm text-white/70">
                        復習モードが完了しました。
                      </div>
                      <div className="mt-3 text-xs text-white/55">
                        ミス：{wrongCount}／復習対象：
                        {lastResult && lastResult.missedZs
                          ? lastResult.missedZs.length
                          : 0}
                        問
                      </div>
                    </div>
                  )}
                </div>

                <div
                  className={(isCompact ? "mt-4" : "mt-6") + " grid grid-cols-2 gap-3"}
                >
                  {showReviewButton ? (
                    <ActionButton
                      compact={isCompact}
                      onClick={function () {
                        startReview();
                      }}
                    >
                      復習（{reviewCount}問）
                    </ActionButton>
                  ) : (
                    <ActionButton
                      compact={isCompact}
                      variant="secondary"
                      disabled={true}
                    >
                      復習
                    </ActionButton>
                  )}

                  <ActionButton
                    compact={isCompact}
                    variant="secondary"
                    onClick={function () {
                      // 同じモードで本番をやり直し
                      startMain(mode);
                    }}
                  >
                    もう一度
                  </ActionButton>

                  <div className="col-span-2">
                    <ActionButton
                      compact={isCompact}
                      variant="secondary"
                      onClick={function () {
                        backHome();
                      }}
                    >
                      ホームへ
                    </ActionButton>
                  </div>
                </div>

                {phase === "review" && lastReview ? (
                  <div className="mt-4 rounded-3xl border border-white/10 bg-white/5 p-5 text-sm text-white/75">
                    <div className="text-xs font-semibold text-white/60">復習メモ</div>
                    <div className="mt-2">
                      間違えた（または迷った）問題は、また本番で試してみよう。
                    </div>
                  </div>
                ) : null}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <AnimatePresence>
          {overlay ? (
            <Overlay kind={overlay.kind} text={overlay.text} subText={overlay.subText} />
          ) : null}
        </AnimatePresence>

        <AnimatePresence>
          {showHelp ? (
            <HelpModal
              onClose={function () {
                setShowHelp(false);
              }}
            />
          ) : null}
        </AnimatePresence>

        <AnimatePresence>
          {showPeriodicTable ? (
            <PeriodicTableModal
              imgSrc={PT_IMAGE_SRC}
              baseWidthPx={PT_IMAGE_BASE_W}
              onClose={function () {
                setShowPeriodicTable(false);
              }}
            />
          ) : null}
        </AnimatePresence>
      </div>
    </div>
  );
}

import React, { useEffect, useState, useRef } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  TimeScale,
  Tooltip,
} from 'chart.js';
import 'chartjs-adapter-date-fns';

/* register chart pieces */
Chart.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  TimeScale,
  Tooltip
);
Chart.register({
  id: 'lineGlow',
  beforeDraw(c) {
    c.ctx.save();
    c.ctx.shadowBlur = 8;
    c.ctx.shadowOffsetX = c.ctx.shadowOffsetY = 0;
  },
  afterDraw(c) {
    c.ctx.restore();
  },
});

/* ------------------------------------------------------------------ */

const COL = {
  bp:   'rgba(255,213,0,0.85)',
  hr:   '#ff0033',
  spo2: '#00CFFF',
};

// how many seconds of flat ECG at startup:
const ECG_FLAT_SEC = 3;

const WAVE = {
  bp: {
    period: 1500,
    inc:    0.35,
    amp:    10,
    jitter: 1.0,
    fun:    φ => 1 - 2 * ((φ / Math.PI) % 1),
  },
  hr: {
    period: 1000,
    inc:    0.5 ,
    amp:    70,
    jitter: 0,
    // full P-Q-R-S-T morphology
    fun: φ => {
      const x = (φ / (2 * Math.PI)) % 1;
      if (x < 0.10)       // P wave
        return 0.25 * Math.sin((x / 0.10) * Math.PI);
      if (x < 0.20)       // Q dip
        return -0.30 * ((x - 0.10) / 0.10);
      if (x < 0.22)       // R up
        return 1.00 * ((x - 0.20) / 0.02);
      if (x < 0.24)       // R down into S
        return 1.00 - 1.40 * ((x - 0.22) / 0.02);
      if (x < 0.30)       // S dip
        return -0.50 * ((x - 0.24) / 0.06);
      if (x < 0.40)       // T wave
        return 0.35 * Math.sin(((x - 0.30) / 0.10) * Math.PI);
      return 0;
    },
  },
  spo2: {
    period: 1700,
    inc:    0.15,
    amp:    1.0,
    jitter: 0.3,
    fun:    φ => Math.sin(φ),
  },
};

const WINDOW_SEC  = 15;
const SPEED       = 2;
const MASTER_TICK = WAVE.hr.period / SPEED;

const makeSeries = key => ({
  label: key,
  data:   [],
  borderColor:   COL[key],
  backgroundColor: 'transparent',
  borderWidth:   2.2,
  tension:       key === 'bp' ? 0.5 : 0,
  pointRadius:   0,
});
const makeLimits = (base, range) => ({
  min: base - range,
  max: base + range,
});

export default function VisualCharts({ bpSys, hr, spo2 }) {
  const startTimeRef = useRef(Date.now());
  // start hr-phase at 0 so our first real beat begins P-wave
  const phase = useRef({ bp: 0, hr: 0, spo2: 2 });
  const [sets, setSets] = useState({
    bp:   makeSeries('bp'),
    hr:   makeSeries('hr'),
    spo2: makeSeries('spo2'),
  });

  const limits = {
    bp:   makeLimits(bpSys, 20),
    hr:   makeLimits(hr,    30),
    spo2: makeLimits(spo2,   3),
  };

  useEffect(() => {
    const id = setInterval(() => {
      const now       = Date.now();
      const elapsed   = (now - startTimeRef.current) / 1000; // in sec

      setSets(prev => {
        const next = {};
        for (const key of ['bp','hr','spo2']) {
          const cfg = WAVE[key];
          const base = { bp: bpSys, hr, spo2 }[key];

          let y;
          if (key === 'hr' && elapsed < ECG_FLAT_SEC) {
            // initial flat baseline
            y = base;
          } else {
            // once past flat period, advance phase & generate wave
            if (key === 'hr') {
              const incPerTick = cfg.inc * (WAVE.hr.period / cfg.period);
              phase.current.hr += incPerTick;
            } else {
              // non-ECG still runs continuously
              phase.current[key] += cfg.inc;
            }
            y = base
              + cfg.fun(phase.current[key]) * cfg.amp
              + (Math.random() - 0.5) * cfg.jitter;
          }

          // keep only last WINDOW_SEC seconds of data
          const windowStart = now - WINDOW_SEC * 1000;
          const data = prev[key].data
            .filter(pt => pt.x >= windowStart)
            .concat({ x: now, y });

          next[key] = { ...prev[key], data };
        }
        return next;
      });
    }, MASTER_TICK);

    return () => clearInterval(id);
  }, [bpSys, hr, spo2]);

  const optsFor = key => {
    const now = Date.now();
    return {
      parsing: false,
      animation: false,
      maintainAspectRatio: false,
      layout: { padding: { top: 24 } },
      scales: {
        x: {
          type: 'time',
          time: { unit: 'second', tooltipFormat: 'HH:mm:ss' },
          grid: {
            display: true,
            color: 'rgba(0,0,0,0.05)',
            borderDash: [2,4],
          },
          ticks: { display: false },
          min: now - WINDOW_SEC * 1000,
          max: now,
        },
        y: {
          min: limits[key].min,
          max: limits[key].max,
          grid: {
            display: true,
            color: 'rgba(0,0,0,0.05)',
            borderDash: [2,4],
            drawTicks: false,
          },
          ticks: { display: false },
        },
      },
      plugins: {
        legend:  { display: false },
        tooltip: { enabled: false },
      },
    };
  };

  const latest = {
    bp:   sets.bp.data.at(-1)?.y.toFixed(0)   ?? '—',
    hr:   sets.hr.data.at(-1)?.y.toFixed(0)   ?? '—',
    spo2: sets.spo2.data.at(-1)?.y.toFixed(0) ?? '—',
  };

  const label = (txt, clr) => (
    <div style={{
      position:'absolute', left:8, top:4,
      fontSize:12, fontWeight:700, color:clr
    }}>{txt}</div>
  );
  const value = (val, unit, clr) => (
    <div style={{
      position:'absolute', right:8, top:4,
      fontSize:16, fontWeight:700, color:clr
    }}>{val} {unit}</div>
  );
  const pane = (key, unit, title) => (
    <div key={key} style={{
      position:'relative', height:140, marginBottom:22,
      background:'#fff', borderRadius:4
    }}>
      <Line data={{ datasets:[sets[key]] }} options={optsFor(key)} />
      {label(title, COL[key])}
      {value(latest[key], unit, COL[key])}
    </div>
  );

  return (
    <div style={{ width:'100%' }}>
      {pane('bp',   'mmHg', 'ART BP')}
      {pane('hr',   'bpm',  'ECG')}
      {pane('spo2', '%',    'SpO₂')}
    </div>
  );
}

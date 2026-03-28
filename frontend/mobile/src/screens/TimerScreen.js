import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import ScreenContainer from '../components/ScreenContainer';
import { TIMER_MODES, currentPhase, formatElapsed } from '../constants/timerPresets';

export default function TimerScreen() {
  const navigation = useNavigation();
  const [modeId, setModeId] = useState(TIMER_MODES[0].id);
  const mode = useMemo(() => TIMER_MODES.find((m) => m.id === modeId) || TIMER_MODES[0], [modeId]);
  const [running, setRunning] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const tickRef = useRef(null);

  useEffect(() => {
    if (!running) return;
    tickRef.current = setInterval(() => setElapsed((e) => e + 1), 1000);
    return () => clearInterval(tickRef.current);
  }, [running]);

  const { phase, index } = currentPhase(mode, elapsed);
  const lastEnd = mode.phases[mode.phases.length - 1].endSec;
  const progress = Math.min(1, elapsed / lastEnd);

  const reset = () => {
    setRunning(false);
    setElapsed(0);
  };

  return (
    <ScreenContainer title="Chronomaster timer">
      <Pressable onPress={() => navigation.goBack()} style={styles.back}>
        <Text style={styles.backText}>Back</Text>
      </Pressable>
      <Text style={styles.muted}>Green to Yellow to Red to Grace. Pause anytime.</Text>

        <View style={styles.modeRow}>
          {TIMER_MODES.map((m) => (
            <Pressable
              key={m.id}
              onPress={() => {
                reset();
                setModeId(m.id);
              }}
              style={[styles.modeChip, modeId === m.id ? styles.modeChipOn : null]}
            >
              <Text style={[styles.modeChipText, modeId === m.id ? styles.modeChipTextOn : null]}>{m.title}</Text>
            </Pressable>
          ))}
        </View>

        <View style={[styles.face, { borderColor: phase.color, backgroundColor: `${phase.color}22` }]}>
          <Text style={[styles.phaseLabel, { color: phase.color }]}>{phase.name.toUpperCase()}</Text>
          <Text style={styles.digits}>{formatElapsed(elapsed)}</Text>
          <View style={styles.barBg}>
            <View style={[styles.barFill, { width: `${progress * 100}%`, backgroundColor: phase.color }]} />
          </View>
          <Text style={styles.sub}>
            Phase {index + 1} of {mode.phases.length}
            {elapsed >= lastEnd ? ' — Past grace' : ` — Next at ${formatElapsed(phase.endSec)}`}
          </Text>
        </View>

        <View style={styles.btnRow}>
          <Pressable style={styles.btn} onPress={() => setRunning((r) => !r)}>
            <Text style={styles.btnText}>{running ? 'Pause' : 'Start'}</Text>
          </Pressable>
          <Pressable style={styles.btnGhost} onPress={reset}>
            <Text style={styles.btnGhostText}>Reset</Text>
          </Pressable>
        </View>

        <Text style={styles.listTitle}>Signals</Text>
        {mode.phases.map((p) => (
          <View key={p.name} style={styles.listRow}>
            <Text style={[styles.listName, { color: p.color }]}>{p.name}</Text>
            <Text style={styles.muted}>until {formatElapsed(p.endSec)}</Text>
          </View>
        ))}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  back: { alignSelf: 'flex-start', marginBottom: 8 },
  backText: { color: '#0b6cff', fontWeight: '800' },
  muted: { color: '#6c757d', marginBottom: 10 },
  modeRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 14 },
  modeChip: { paddingVertical: 8, paddingHorizontal: 12, borderRadius: 999, borderWidth: 1, borderColor: '#d2d9f0', backgroundColor: '#fff' },
  modeChipOn: { borderColor: '#0b6cff', backgroundColor: '#e3f2fd' },
  modeChipText: { fontWeight: '800', color: '#14213d' },
  modeChipTextOn: { color: '#0b6cff' },
  face: { borderRadius: 16, borderWidth: 3, padding: 20, alignItems: 'center', marginBottom: 14 },
  phaseLabel: { fontWeight: '900', fontSize: 12, letterSpacing: 1 },
  digits: { fontSize: 48, fontWeight: '900', color: '#14213d', marginTop: 6 },
  barBg: { width: '100%', height: 10, backgroundColor: '#e0e0e0', borderRadius: 5, marginTop: 12, overflow: 'hidden' },
  barFill: { height: '100%', borderRadius: 5 },
  sub: { marginTop: 10, fontSize: 12, color: '#6c757d', textAlign: 'center' },
  btnRow: { flexDirection: 'row', gap: 10, marginBottom: 16 },
  btn: { flex: 1, backgroundColor: '#0b6cff', borderRadius: 10, paddingVertical: 14, alignItems: 'center' },
  btnText: { color: '#fff', fontWeight: '900' },
  btnGhost: { flex: 1, borderWidth: 1, borderColor: '#0b6cff', borderRadius: 10, paddingVertical: 14, alignItems: 'center' },
  btnGhostText: { color: '#0b6cff', fontWeight: '900' },
  listTitle: { fontWeight: '900', marginBottom: 8, color: '#14213d' },
  listRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  listName: { fontWeight: '800' }
});

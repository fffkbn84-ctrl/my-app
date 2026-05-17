/**
 * カウンセラー管理画面で表示するための、診断結果ラベル定義。
 * user-site の src/lib/diagnosis.ts と src/app/kinda-note/data/weatherDescriptions.ts
 * の表示部分だけをコピーした軽量版。
 *
 * 詳細（説明文・カウンセラー向けアドバイス等）が必要になった時に
 * user-site と同期するか、共有モジュール化を検討する。
 */

export type KindaTypeKey = 'A' | 'B' | 'C' | 'D'

export const KINDA_TYPE_LABEL: Record<KindaTypeKey, {
  name: string
  /** 短い説明（カード裏面用） */
  description: string
  /** バッジ背景 */
  bg: string
  /** カウンセラー向けアドバイス（このタイプの方を担当する時の心がけ） */
  advice: string
}> = {
  A: {
    name: 'A 慎重分析タイプ',
    description: '情報が多いほど迷いやすい傾向。論理的に納得してから動きたい方',
    bg: 'linear-gradient(135deg,#E5DCC9,#C8B795)',
    advice: '結論を急がず、複数の選択肢の中から本人が決められるように整理して提示すると安心されます。',
  },
  B: {
    name: 'B 自信低下タイプ',
    description: '自分を後回しにしがち。プロセスを大事にしたい方',
    bg: 'linear-gradient(135deg,#E5D4C5,#C9AC92)',
    advice: '「あなたのペースで大丈夫」と繰り返し伝えてください。小さな成功体験を一緒に喜ぶ姿勢が効果的です。',
  },
  C: {
    name: 'C 環境影響タイプ',
    description: '周囲の状況や相手の反応に敏感。共感が必要な方',
    bg: 'linear-gradient(135deg,#D2DDD0,#A8BBA3)',
    advice: 'まず気持ちを受け止めてから次に進む流れを大事に。「どう感じたか」を丁寧に聞き出してください。',
  },
  D: {
    name: 'D 直感型',
    description: 'ピンと来た方向に動く。背中を押されるとさらに加速する方',
    bg: 'linear-gradient(135deg,#D5CFE0,#A89BC2)',
    advice: '理屈より「いいと思う」を肯定する関わりが合います。即決を尊重し、後追いの不安を出さないように。',
  },
}

/**
 * Kinda note の全 20 種類の天気ラベル（日本語名のみ・最小限）。
 * 詳細解説は user-site の weatherDescriptions.ts 参照。
 */
export const KINDA_NOTE_WEATHER: Record<string, string> = {
  morning_mist: '朝もや',
  pre_dawn: '夜明け前',
  flower_overcast: '花曇り',
  light_rain_start: '降り始め',
  light_rain: '小雨',
  rain_cloud: '雨雲',
  thunderstorm: '雷雨',
  sun_break: '晴れ間',
  angels_ladder: '天使の梯子',
  windy_day: '風の日',
  light_sunrise: '淡い朝焼け',
  wandering_clouds: '迷い雲',
  cold_wind: '冷たい風',
  windy_sunshine: '風のある晴れ',
  faint_sunlight: 'かすかな日差し',
  twilight: '夕暮れ',
  sunrise: '朝焼け',
  dissonance_wind: '違和感の風',
  quiet_overcast: '静かな曇り',
  mist: '霧',
}

/** 共有された天気を「○○ さんが共有」形式の文字列に整形 */
export function kindaNoteLabel(key: string | null | undefined): string {
  if (!key) return ''
  return KINDA_NOTE_WEATHER[key] ?? key
}

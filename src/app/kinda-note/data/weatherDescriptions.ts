/**
 * 全20タイプの天気解説データ
 *
 * 用途:
 * 1. Kinda note 結果画面の summary 直下に表示
 * 2. /note/weather/[slug] の SEO 用解説ページのコンテンツ
 * 3. 将来の DB 移行時に、そのまま seed データとして使える形
 */

export type WeatherKey =
  // pre
  | "morning_mist"
  | "pre_dawn"
  | "flower_overcast"
  // waiting
  | "light_rain_start"
  | "light_rain"
  | "rain_cloud"
  | "thunderstorm"
  // omiai
  | "sun_break"
  | "angels_ladder"
  | "windy_day"
  // date1
  | "light_sunrise"
  | "wandering_clouds"
  | "cold_wind"
  // multiple
  | "windy_sunshine"
  | "faint_sunlight"
  | "twilight"
  // kousai
  | "sunrise"
  | "dissonance_wind"
  | "quiet_overcast"
  | "mist";

export type RouteKey =
  | "pre"
  | "waiting"
  | "omiai"
  | "date1"
  | "multiple"
  | "kousai";

export type Scene = {
  /** 場面のタイトル（20-30字） */
  title: string;
  /** 本文 100-150字 */
  body: string;
};

export type Action = {
  /** アクションタイトル（15-25字） */
  title: string;
  /** 本文 80-100字 */
  body: string;
};

export type WeatherDescription = {
  /** 天気のキー（URLスラッグにも使う） */
  key: WeatherKey;
  /** 日本語名（表示用） */
  name_ja: string;
  /** 英語名（SEO用補助） */
  name_en: string;
  /** 所属するルート */
  route: RouteKey;
  /** 結果画面に表示する詩的な解説（40-60文字、2文構成） */
  description: string;
  /** タイプ名（Kinda 〇〇 の〇〇部分） */
  type_name: string;
  /** 旧: SEO 解説ページ用 meta description（互換のため残す） */
  seo_description?: string;

  /** URL用（"rain-cloud"等、ハイフン区切り英小文字） */
  slug: string;
  /** titleタグ用サブ説明（25-35字程度） */
  sub_title: string;
  /** 検索結果用 meta description（120-140字） */
  meta_description: string;

  /** ④この天気の正体（約400字、先行ページのみ） */
  body_essence?: string;
  /** ⑤こんな時にこの天気になる（3-4場面、先行ページのみ） */
  body_scenes?: Scene[];
  /** ⑥気持ちを言葉にすると（約300字、先行ページのみ） */
  body_science?: string;
  /** ⑦できる小さなこと（3つ、先行ページのみ） */
  body_actions?: Action[];

  /** ⑧近い気持ち（2-3個） */
  related_weather_keys: WeatherKey[];
  /** ⑨関連コラム slug（0-2個・SEO 用補助リンク） */
  related_columns?: string[];

  /**
   * この天気と 1:1 で対応する濃いコラム記事の slug。
   * 設定されている天気は /note/weather/[slug] の本文セクションを置かず、
   * コラム（/columns/{column_slug}）へ誘導する（カニバリ回避）。
   */
  column_slug?: string;
};

export const WEATHER_DESCRIPTIONS: Record<WeatherKey, WeatherDescription> = {
  // ─── preルート（3タイプ） ──────────────────────
  morning_mist: {
    key: "morning_mist",
    name_ja: "朝もや",
    name_en: "Morning Mist",
    slug: "morning-mist",
    route: "pre",
    type_name: "朝もや",
    description:
      "やわらかな霧が世界の輪郭をほどく朝。\nすべてがまだ決まっていない、その白さの中にあなたはいます。",
    sub_title: "まだ何も決めていない、入り口の前にいるあなたへ",
    meta_description:
      "結婚相談所や婚活をはじめるか迷っている時。まだ何も決まっていない朝もやのような気持ちを、急いで晴らさなくていい。Kinda noteの60秒で、いまの天気を確かめる。",
    body_essence:
      "朝もやは、一日のはじまりにそっと立ち上がる、やわらかな霧のことです。\n\n雨ではない。冷たくもない。ただ、世界の輪郭が白くほどけていて、何メートル先がどうなっているのか、まだ見えない。陽が昇るにつれて晴れていくものでもあるし、しばらく残ることもある。それが朝もやです。\n\n婚活や結婚相談所のことを「気になっているけれど、まだはじめていない」状態は、この天気にとても似ています。やりたいかと聞かれると、分からない。やめておきたいかと言われると、それも違う。検索バーに「結婚相談所」と打ち込んでみては、消す。そんな時間を過ごしている人は、たくさんいます。\n\n朝もやの中にいるのは、迷っているからではありません。まだ、決まっていないだけです。決まっていない時間そのものが悪いものではなく、これから決まっていくための準備時間でもあります。",
    body_scenes: [
      {
        title: "結婚相談所を調べはじめた頃",
        body: "ホームページを見比べてみる。資料請求のボタンに手をかけて、戻る。怖いわけじゃないけれど、押しきれない。",
      },
      {
        title: "周りの結婚や妊娠の知らせを受けた時",
        body: "おめでとうと心から思える。でも夜になって、自分はどうしようと思う。誰かに相談したいのか、ひとりで考えたいのか、それも分からない。",
      },
      {
        title: "「そろそろ」と言われた時",
        body: "家族から、友人から、自分から自分へ。「そろそろ」という言葉が増えていく。プレッシャーではないつもりでも、もやの濃さは少しずつ増す。",
      },
      {
        title: "昔の恋愛を、ふと思い返す時",
        body: "あの時こうしていたら、と考える夜がある。後悔ではなく、ただ確かめている。次に進むための、静かな振り返り。",
      },
    ],
    body_science:
      "朝もやの中で起きやすいのは、「決められない自分」を責めることです。\n\nある実験では、不安を感じている人に「いま自分が何を感じているか」を言葉にしてもらうと、不安そのものが小さくなることが分かっています。「決められない」と責める前に、「いま私は、まだ決まっていない場所にいる」と書いてみる。それだけで、自分を責める対象から、観察する対象に変わります。\n\n朝もやは、無理に晴らさなくていい天気です。陽が昇れば自然に薄れていくし、しばらく残ってもそこにいられる。決めるための時間が、いま流れている。それだけで十分なこともあります。",
    body_actions: [
      {
        title: "「結婚相談所」「婚活」と聞いて浮かぶ気持ちを、3つ書く",
        body: "ポジティブも、ネガティブも、両方ある方が自然です。怖い、興味ある、めんどう、希望、義務感。並べてみると、自分の現在地が少し見えます。",
      },
      {
        title: "今日は調べないでいい時間を作る",
        body: "朝もやの中にいる時、情報を集めすぎるとかえって視界が悪くなります。今日はスマホを置いて、好きな飲み物を淹れる。それだけの日があっていい。",
      },
      {
        title: "「まだ決めなくていい」と自分に言う",
        body: "やる/やらないの二択にしない。「まだ決まっていない」を選択肢として認める。それは保留ではなく、ひとつの状態です。",
      },
    ],
    related_weather_keys: ["pre_dawn", "flower_overcast", "wandering_clouds"],
    column_slug: "weather-morning-mist-konkatsu-start",
  },
  pre_dawn: {
    key: "pre_dawn",
    name_ja: "夜明け前",
    name_en: "Pre-Dawn",
    slug: "pre-dawn",
    route: "pre",
    type_name: "夜明け前",
    description:
      "一日でいちばん深い闇のあと、\n空がしずかに色を持ちはじめる時間。その境目にあなたはいます。",
    sub_title: "決めたのに動けない、その境目にいるあなたへ",
    meta_description:
      "結婚相談所に入ると決めたのに、申し込みボタンが押せない。それは迷いではなく、恐れに名前がついていないだけ。Kinda noteの60秒で、いまの天気を確かめる。",
    related_weather_keys: ["morning_mist", "flower_overcast", "light_sunrise"],
    column_slug: "weather-pre-dawn-konkatsu-ketsudan",
  },
  flower_overcast: {
    key: "flower_overcast",
    name_ja: "花曇り",
    name_en: "Flower Overcast",
    slug: "flower-overcast",
    route: "pre",
    type_name: "花曇り",
    description:
      "桜の咲く頃、空がうすく曇る日のこと。\n華やかさと静けさが同居する、その光の下にあなたはいます。",
    sub_title: "花曇りの天気にいるあなたへ",
    meta_description:
      "桜の咲く頃、空がうすく曇る日のような気持ち。華やかさと静けさが同居する場所にいるあなたへ。Kinda noteの60秒で、いまの天気を確かめる。",
    related_weather_keys: ["morning_mist", "pre_dawn", "faint_sunlight"],
  },

  // ─── waitingルート（4タイプ） ─────────────────
  light_rain_start: {
    key: "light_rain_start",
    name_ja: "降り始め",
    name_en: "Light Rain Start",
    slug: "light-rain-start",
    route: "waiting",
    type_name: "降り始め",
    description:
      "ぽつり、と最初のひと粒が落ちる瞬間。\nこれから何が来るのか、まだ誰も知らない時間にあなたはいます。",
    sub_title: "降り始めの天気にいるあなたへ",
    meta_description:
      "ぽつり、と最初のひと粒が落ちる瞬間。これから何が来るのか、まだ誰も知らない時間。Kinda noteの60秒で、いまの天気を確かめる。",
    related_weather_keys: ["light_rain", "rain_cloud", "thunderstorm"],
  },
  light_rain: {
    key: "light_rain",
    name_ja: "小雨",
    name_en: "Light Rain",
    slug: "light-rain",
    route: "waiting",
    type_name: "小雨",
    description:
      "傘をさすほどでもない、やさしい雨の日。\n音もなく地面を濡らしていく、そのしずかさの中にあなたはいます。",
    sub_title: "小雨の天気にいるあなたへ",
    meta_description:
      "傘をさすほどでもない、やさしい雨の日のような気持ち。音もなく地面を濡らしていくしずかさの中で。Kinda noteの60秒で、いまの天気を確かめる。",
    related_weather_keys: ["light_rain_start", "rain_cloud", "quiet_overcast"],
  },
  rain_cloud: {
    key: "rain_cloud",
    name_ja: "雨雲",
    name_en: "Rain Cloud",
    slug: "rain-cloud",
    route: "waiting",
    type_name: "雨雲",
    description:
      "空が低く、重たい色を抱えている時間。\nまだ降り出さない雲の下、その息をひそめた静けさにあなたはいます。",
    sub_title: "「重さ」を抱えたまま、続けているあなたへ",
    meta_description:
      "婚活や交際で、何かが重く感じる時。降り出す前の雨雲のような気持ちは、言葉にすると不思議と軽くなる。Kinda noteの60秒で、いまの天気を確かめる。",
    body_essence:
      "雨雲は、まだ降り出してはいない天気です。\n\n晴れているわけでも、嵐の中にいるわけでもない。ただ空が低く、何かを抱えている。動こうとすると体が重く、立ち止まると今度は時間が重くなる。そんな状態を、雨雲は表しています。\n\n婚活や交際の中で、この天気はよく現れます。やめたいわけではない。続けたいのかもよく分からない。やる気が出ないと言ってしまうと違う気がするけれど、進んでいる実感もない。\n\nそれは、サボっているのでも、向いていないのでもありません。雲が空を覆っているのは、いつか降るためです。あなたの中の重さも、いつか言葉になるための準備をしている時間かもしれません。",
    body_scenes: [
      {
        title: "お見合いやデートが続いた頃",
        body: "最初の数回は新鮮だったのに、いつのまにか「また会わなきゃ」が増えている。会うこと自体は嫌じゃないのに、準備の段階で気持ちが重くなる。",
      },
      {
        title: "期待されていると感じる時",
        body: "家族や友人、カウンセラーが応援してくれている。期待されているのは分かる。でも、その期待に応えなきゃと思うほど、自分の気持ちが見えなくなっていく。",
      },
      {
        title: "「うまくいっている」ように見える時",
        body: "周りからは順調に見える。でも自分の中で何かが詰まっている。何が詰まっているのかも分からないまま、ただ日が過ぎていく。",
      },
      {
        title: "結果が出始めた時こそ",
        body: "仮交際に進んだ、お見合いが組まれた、いい人かもしれない人に出会えた。良いはずなのに、なぜか心が動かない。期待していたものと違うのかもしれないけれど、それも分からない。",
      },
    ],
    body_science:
      "雨雲の重さは、見えないものを抱えているから重いのです。\n\n心理学の研究では、自分が感じているものに名前をつけるだけで、不安や戸惑いが扱える大きさに戻ることが分かっています。「重い」だけでは何も動かないけれど、「期待に応えなきゃと思って重い」と書き出した瞬間、それは雲の輪郭を持ちます。\n\n輪郭があるものは、降らせることも、待つことも、誰かに見せることもできる。雨雲のまま抱え続けるより、一度言葉という器に移してみる。それだけで、空気が少し変わります。",
    body_actions: [
      {
        title: "何が重いのかを、3つだけ書いてみる",
        body: "全部を整理しようとしないで大丈夫です。今日、何が重かったかを、3つだけ。書けなかったら2つでも、1つでも。",
      },
      {
        title: "「やめたい」と「続けたい」を別の紙に書く",
        body: "両方あっていい。雨雲の中にいる人は、たいてい両方持っています。どちらかを選ぶ必要はなくて、両方あることを認めるだけで、少し軽くなります。",
      },
      {
        title: "今日は何もしないことを、自分に許す",
        body: "雨雲が空を覆う日は、無理に晴れさせる必要はありません。雲がそこにあると認めて、お茶を飲んで、いつもより早く眠る。それで十分な日があります。",
      },
    ],
    related_weather_keys: ["thunderstorm", "light_rain", "mist"],
    column_slug: "weather-rain-cloud-konkatsu-tsukareta",
  },
  thunderstorm: {
    key: "thunderstorm",
    name_ja: "雷雨",
    name_en: "Thunderstorm",
    slug: "thunderstorm",
    route: "waiting",
    type_name: "雷雨",
    description:
      "空が音を立てて、自分の中のものを放つ夜。\n通り過ぎたあとに澄んだ空気が残る、その嵐の中にあなたはいます。",
    sub_title: "婚活で限界がきた、その夜にいるあなたへ",
    meta_description:
      "婚活で限界を感じた夜。お見合いが組まれない、断られ続けた。雷雨のような気持ちは我慢しなくていい。Kinda noteの60秒で、いまの天気を確かめる。",
    related_weather_keys: ["rain_cloud", "light_rain", "light_rain_start"],
    column_slug: "weather-thunderstorm-konkatsu-genkai",
  },

  // ─── omiaiルート（3タイプ） ───────────────────
  sun_break: {
    key: "sun_break",
    name_ja: "晴れ間",
    name_en: "Sun Break",
    slug: "sun-break",
    route: "omiai",
    type_name: "晴れ間",
    description:
      "雲の切れ目から、まっすぐに光が差し込む瞬間。\n世界が少しだけ明るく見える、そのまぶしさの中にあなたはいます。",
    sub_title: "お見合いで「いい人だった」と感じた、その日のあなたへ",
    meta_description:
      "お見合いで手応えがあった日の、晴れ間のような気持ち。期待していいのか怖いとき、その明るさを長く持つために。Kinda noteの60秒で、いまの天気を確かめる。",
    related_weather_keys: ["angels_ladder", "windy_day", "faint_sunlight"],
    column_slug: "weather-sun-break-omiai-tegotae",
  },
  angels_ladder: {
    key: "angels_ladder",
    name_ja: "天使の梯子",
    name_en: "Angel's Ladder",
    slug: "angels-ladder",
    route: "omiai",
    type_name: "天使の梯子",
    description:
      "雲の隙間から、幾筋もの光が静かに降りる現象。\n確信ではなく予感のような、そのやわらかな光の中にあなたはいます。",
    sub_title: "天使の梯子の天気にいるあなたへ",
    meta_description:
      "雲の隙間から、幾筋もの光が静かに降りる現象のような気持ち。確信ではなく予感のような、やわらかな光の中で。Kinda noteの60秒で、いまの天気を確かめる。",
    related_weather_keys: ["sun_break", "windy_day", "light_sunrise"],
  },
  windy_day: {
    key: "windy_day",
    name_ja: "風の日",
    name_en: "Windy Day",
    slug: "windy-day",
    route: "omiai",
    type_name: "風の日",
    description:
      "草も木も、すべてが同じ方向にゆれる日。\n心の中の何かが小さく動いている、その風の中にあなたはいます。",
    sub_title: "風の日の天気にいるあなたへ",
    meta_description:
      "草も木も、すべてが同じ方向にゆれる日のような気持ち。心の中の何かが小さく動いている、その風の中で。Kinda noteの60秒で、いまの天気を確かめる。",
    related_weather_keys: ["sun_break", "angels_ladder", "windy_sunshine"],
  },

  // ─── date1ルート（3タイプ） ───────────────────
  light_sunrise: {
    key: "light_sunrise",
    name_ja: "淡い朝焼け",
    name_en: "Light Sunrise",
    slug: "light-sunrise",
    route: "date1",
    type_name: "淡い朝焼け",
    description:
      "夜が明けるとき、空がそっと桃色をまとう時間。\nまだ太陽は昇りきらない、そのほのかな色の中にあなたはいます。",
    sub_title: "淡い朝焼けの天気にいるあなたへ",
    meta_description:
      "夜が明けるとき、空がそっと桃色をまとう時間のような気持ち。まだ太陽は昇りきらない、ほのかな色の中で。Kinda noteの60秒で、いまの天気を確かめる。",
    related_weather_keys: ["wandering_clouds", "cold_wind", "sunrise"],
  },
  wandering_clouds: {
    key: "wandering_clouds",
    name_ja: "迷い雲",
    name_en: "Wandering Clouds",
    slug: "wandering-clouds",
    route: "date1",
    type_name: "迷い雲",
    description:
      "ゆっくりと形を変えながら流れていく雲。\nどこへ行くかは決まっていない、そのたゆたう空の下にあなたはいます。",
    sub_title: "デートを続けるか迷う、その夜にいるあなたへ",
    meta_description:
      "デートを数回重ねたけれど、続けるべきか分からない。「好き」とも「違う」とも言い切れない迷い雲のような気持ち。Kinda noteの60秒で、いまの天気を確かめる。",
    related_weather_keys: ["light_sunrise", "cold_wind", "mist"],
    column_slug: "weather-wandering-clouds-date-mayoi",
  },
  cold_wind: {
    key: "cold_wind",
    name_ja: "冷たい風",
    name_en: "Cold Wind",
    slug: "cold-wind",
    route: "date1",
    type_name: "冷たい風",
    description:
      "頬にあたると、ふと我に返るような風。\n熱だけでは進めないことを教える、そのつめたさの中にあなたはいます。",
    sub_title: "デートの後、ひとりで冷たさを抱えるあなたへ",
    meta_description:
      "デートやお見合いの後、なぜか冷たい風が吹いた気がする時。その違和感を言葉にすると、いま起きていることが見えはじめる。Kinda noteの60秒で、今日の天気を確かめる。",
    body_essence:
      "冷たい風は、嵐ではない天気です。\n\n雨も雪も降っていない。空も明るい。ただ、ふっと吹いた風がいつもより冷たくて、首元が縮こまる。そんな天気です。冷たい風の不思議なところは、それを感じた時に「ああ、さっきはあたたかかったんだ」と気づくこと。\n\nデートやお見合いの後、この天気はよく訪れます。会っている間は楽しかった。話も弾んだ。なのに、ひとりになった瞬間、なぜか胸がすうっと冷えた。\n\nその冷たさは、相手が冷たかったわけではないかもしれません。あたたかい時間の後だから、温度差として感じているだけかもしれない。それでも、冷たさは確かにそこにあります。風が吹いたという事実は、なかったことにしなくていいのです。",
    body_scenes: [
      {
        title: "デートが終わって、ひとり家に帰る時",
        body: "楽しかった時間の余韻が、駅の改札を出た頃から少しずつ冷えていく。一人になると、急に静けさが大きく感じる。",
      },
      {
        title: "LINEの返信を待っている時間",
        body: "楽しかったね、と送った後の沈黙。すぐに返ってこないだけで、急に風の温度が下がる。本当は気にしなくていいのに、気になってしまう。",
      },
      {
        title: "相手の表情が、ふと気になった時",
        body: "笑っていたはず。話していたはず。でも、ふとした瞬間に見えた相手の顔が、自分の知らない場所を見ていた気がする。",
      },
      {
        title: "自分の話を、もっとすればよかったと思う時",
        body: "聞き役に回りすぎたのかもしれない。もっと自分を出すべきだったのかもしれない。家に帰ってから、後悔のかたちで風が吹く。",
      },
    ],
    body_science:
      "冷たい風の困るところは、温度を確かめる前に「気のせいだ」と片付けてしまえることです。\n\n言葉にできないものは、いつも実物より大きく感じます。でも一度書き出してみると「あ、これだけだったのか」と思うことがある。気持ちは形がないからこそ、輪郭をつけてあげると、ちょうどいい大きさに戻ります。\n\n「楽しかったけど、別れ際の顔が気になった」と書き出した瞬間、それは確認できることになります。次のデートで観察するか、カウンセラーに伝えるか、自分の中で待つか。選択肢が見えるようになります。",
    body_actions: [
      {
        title: "今日の冷たかった瞬間を、一行だけ書く",
        body: "何分頃、何があった時に冷たい風が吹いたか。それだけでいい。原因を分析しなくて大丈夫です。",
      },
      {
        title: "「楽しかった」と「冷たかった」を両方残す",
        body: "どちらか片方に塗り替えなくていい。両方あったまま記録しておくと、次に会った時の見え方が変わります。",
      },
      {
        title: "返信を待つ時間に、別のことをする",
        body: "冷たい風は、待っている時間ほど強く吹きます。返事を確認し続けるより、お湯を沸かしたり、別のことに手を動かしたり。風そのものに対する装備を変えてみる。",
      },
    ],
    related_weather_keys: ["wandering_clouds", "dissonance_wind", "light_sunrise"],
    column_slug: "weather-cold-wind-date-fuan",
  },

  // ─── multipleルート（3タイプ） ────────────────
  windy_sunshine: {
    key: "windy_sunshine",
    name_ja: "風の強い晴れ",
    name_en: "Windy Sunshine",
    slug: "windy-sunshine",
    route: "multiple",
    type_name: "風の強い晴れ",
    description:
      "日差しは明るいのに、風が止まらない日。\n光と揺らぎが同時にある、そのまぶしくも忙しない空にあなたはいます。",
    sub_title: "風の強い晴れの天気にいるあなたへ",
    meta_description:
      "日差しは明るいのに、風が止まらない日のような気持ち。光と揺らぎが同時にある、まぶしくも忙しない空の中で。Kinda noteの60秒で、いまの天気を確かめる。",
    related_weather_keys: ["faint_sunlight", "twilight", "windy_day"],
  },
  faint_sunlight: {
    key: "faint_sunlight",
    name_ja: "薄日",
    name_en: "Faint Sunlight",
    slug: "faint-sunlight",
    route: "multiple",
    type_name: "薄日",
    description:
      "雲ごしに、やわらかく届く太陽の光。\n強くはないけれど確かにそこにある、そのおだやかな明るさの中にあなたはいます。",
    sub_title: "薄日の天気にいるあなたへ",
    meta_description:
      "雲ごしに、やわらかく届く太陽の光のような気持ち。強くはないけれど確かにそこにある、おだやかな明るさの中で。Kinda noteの60秒で、いまの天気を確かめる。",
    related_weather_keys: ["windy_sunshine", "twilight", "sun_break"],
  },
  twilight: {
    key: "twilight",
    name_ja: "夕暮れ",
    name_en: "Twilight",
    slug: "twilight",
    route: "multiple",
    type_name: "夕暮れ",
    description:
      "空が一日でいちばんゆたかな色を見せる時間。\n明るさと暗さが混ざりあう、その揺らぎの中にあなたはいます。",
    sub_title: "夕暮れの天気にいるあなたへ",
    meta_description:
      "空が一日でいちばんゆたかな色を見せる時間のような気持ち。明るさと暗さが混ざりあう、その揺らぎの中で。Kinda noteの60秒で、いまの天気を確かめる。",
    related_weather_keys: ["windy_sunshine", "faint_sunlight", "sunrise"],
  },

  // ─── kousaiルート（4タイプ） ─────────────────
  sunrise: {
    key: "sunrise",
    name_ja: "朝焼け",
    name_en: "Sunrise",
    slug: "sunrise",
    route: "kousai",
    type_name: "朝焼け",
    description:
      "夜が完全にあけて、空が燃えるように色づく瞬間。\n一日のはじまりを告げる、そのあざやかな光の中にあなたはいます。",
    sub_title: "朝焼けの天気にいるあなたへ",
    meta_description:
      "夜が完全にあけて、空が燃えるように色づく瞬間のような気持ち。一日のはじまりを告げるあざやかな光の中で。Kinda noteの60秒で、いまの天気を確かめる。",
    related_weather_keys: ["quiet_overcast", "dissonance_wind", "light_sunrise"],
  },
  dissonance_wind: {
    key: "dissonance_wind",
    name_ja: "違和感の風",
    name_en: "Dissonance Wind",
    slug: "dissonance-wind",
    route: "kousai",
    type_name: "違和感の風",
    description:
      "草が思いがけない方向に揺れる、そんな風の日。\n理由はまだ言葉にならない、その小さなざわめきの中にあなたはいます。",
    sub_title: "「なんとなく」のざわめきを抱えるあなたへ",
    meta_description:
      "婚活や交際で、説明できない違和感を抱えている時。風のような小さなざわめきは、言葉にすると正体が見えはじめる。Kinda noteの60秒で、その風の名前を確かめる。",
    body_essence:
      "違和感の風は、嵐ではない天気です。\n\n雨が降っているわけでも、雲が重いわけでもない。ただ、いつもと違う方向から風が吹いていて、草が思いがけない揺れ方をする。それを見ているあなたも、「あれ?」と少しだけ立ち止まる。それが違和感の風です。\n\n婚活や交際の中で、この天気は予感のような形で訪れます。何が嫌だったかと聞かれても答えられない。でも、何かがいつもと違った気がする。それは気のせいかもしれないし、見落としてはいけない合図かもしれない。\n\n違和感は、言葉にされないままだと「気のせい」として処理されがちです。でも、風がそこに吹いていたことだけは確かです。理由が分からなくても、感じたことは、なかったことにはなりません。",
    body_scenes: [
      {
        title: "会った後に、なぜか気持ちが落ち着かない",
        body: "楽しい時間だったはず。会話も弾んだ。なのに帰り道、何かが胸に残っていて、お風呂に入っても消えない。",
      },
      {
        title: "相手の言葉のひとつが、後から思い出される",
        body: "その場では気にならなかった一言。でも夜になって、ふと蘇る。怒っているわけではないけれど、ひっかかっている。",
      },
      {
        title: "価値観の違いに、ふっと気づく",
        body: "お金の話、家族の話、休日の過ごし方。大きな対立じゃない。でも「あ、ここは違うんだ」と一瞬風が吹く。",
      },
      {
        title: "自分の選択を、後から疑いたくなる",
        body: "「いい人だ」「ちゃんとしている」と自分に言い聞かせている。言い聞かせなきゃいけないこと自体が、風の音かもしれない。",
      },
    ],
    body_science:
      "違和感は、言葉にされる前は「気のせい」と見分けがつきません。\n\n心理学では、自分の気持ちに名前をつけると、その瞬間、人はそれを「持っている自分」から「眺めている自分」に変わると言われています。研究者たちはこれを認知的距離と呼びます。\n\n違和感の風が吹いた時、その風を「お金の話で吹いた」「沈黙が長かった時に吹いた」と書き出してみる。気のせいかもしれないし、確かな合図かもしれない。どちらでも構いません。書いた時点で、それは扱えるものになります。",
    body_actions: [
      {
        title: "風が吹いた瞬間を、メモに残す",
        body: "判断しなくていい。「今日、相手の〇〇という言葉で風が吹いた」とだけ書いておく。後で見返した時に、同じ風が何度も吹いていたら、それは合図です。",
      },
      {
        title: "「気のせいかもしれない」を否定しない",
        body: "気のせいかどうかは、まだ分からなくていい。気のせいでも、そう感じたという事実は残ります。",
      },
      {
        title: "カウンセラーに、違和感のまま渡す",
        body: "言葉にならないまま伝えていいのです。「うまく言えないけど、最近こういうことで違和感がある」とだけ。整理されていなくても、相手はそれを受け取れます。",
      },
    ],
    related_weather_keys: ["mist", "rain_cloud", "quiet_overcast"],
    column_slug: "weather-dissonance-wind-iwakan",
  },
  quiet_overcast: {
    key: "quiet_overcast",
    name_ja: "静かな曇り",
    name_en: "Quiet Overcast",
    slug: "quiet-overcast",
    route: "kousai",
    type_name: "静かな曇り",
    description:
      "強い光も雨もない、ただ静かに灰色の空が続く日。\n何かが足りないわけではない、そのおだやかな曇り空の下にあなたはいます。",
    sub_title: "静かな曇りの天気にいるあなたへ",
    meta_description:
      "強い光も雨もない、ただ静かに灰色の空が続く日のような気持ち。何かが足りないわけではない、おだやかな曇り空の下で。Kinda noteの60秒で、いまの天気を確かめる。",
    related_weather_keys: ["mist", "dissonance_wind", "sunrise"],
  },
  mist: {
    key: "mist",
    name_ja: "霧",
    name_en: "Mist",
    slug: "mist",
    route: "kousai",
    type_name: "霧",
    description:
      "近くのものすら輪郭がぼやけて見える朝。\n先が見えないのではなく、いま見えるものを大切にする、その霧の中にあなたはいます。",
    sub_title: "先が見えない、けれど止まれないあなたへ",
    meta_description:
      "婚活や交際で「この先どうなるか分からない」と感じる時。霧の中にいる気持ちを言葉にすると、いま見えているものが少しずつ輪郭を持ちはじめる。Kinda noteの60秒で確かめる。",
    body_essence:
      "霧は、雨でも晴れでもない不思議な天気です。\n\n降ってもいないし、晴れているわけでもない。ただ世界の輪郭がぼやけて、何メートル先が見えているのか自分でも分からない。動けないわけじゃないけれど、進むスピードが分からない。それが霧の中です。\n\n婚活や交際の途中で、この天気はゆっくり立ち上がってきます。相手のことは嫌いじゃない。むしろ大切に思っている。でも、この先一緒にいる未来が見えているかと聞かれると、はっきり「見える」とは言えない。\n\nそれは、気持ちが冷めているわけでも、相手に問題があるわけでもありません。霧は、視界を奪うけれど、その場所自体は変わっていない。あなたが立っている地面は、いつも通りそこにあります。",
    body_scenes: [
      {
        title: "真剣交際に入った頃",
        body: "お付き合いから一歩進んで、結婚を意識した話が出はじめる。具体的になればなるほど、本当にこの人でいいのか分からなくなる時間が増える。",
      },
      {
        title: "周りが先に進んだ時",
        body: "友人が結婚した、同年代の同僚が産休に入った。自分のペースは間違っていないと頭では分かっていても、霧の濃さが急に増す日がある。",
      },
      {
        title: "親や家族から話題が出る時",
        body: "「あの人とはどうなの」「いつごろ決めるの」と聞かれる。答えなきゃいけないのに、自分の中に答えが見つからない。問われる度に、霧が深くなる。",
      },
      {
        title: "好きかどうかが分からない時",
        body: "嫌いではない。一緒にいて穏やか。でも、これが好きということなのか、ただ慣れているだけなのか、自分で見分けがつかない。",
      },
    ],
    body_science:
      "霧の中で困るのは、見えないことそのものより、「見えていないのに進まなきゃいけない」気がしてしまうことです。\n\nある実験では、不安を感じている人に「いま自分が何を感じているか」を言葉にしてもらうと、不安そのものが小さくなることが分かっています。霧は晴れさせなくていい。ただ「いま私は霧の中にいる」と言葉にした瞬間、それは状況になります。\n\n状況になれば、無理に進まなくてもいい理由ができる。少しずつ霧が薄れるのを待つ、という選択肢が手に入る。気持ちは、形にすると扱えるようになります。",
    body_actions: [
      {
        title: "「見えている近いもの」を書き出す",
        body: "未来全部を考えなくて大丈夫です。今日、相手と話して心地よかったこと、ひっかかったこと。手の届く範囲のことだけを書いてみる。",
      },
      {
        title: "「決めなくていい時間」を自分に許す",
        body: "霧の中で焦って決めた答えは、晴れたあとに違って見えることがあります。今週は決めない、と先に決めておくだけで、呼吸が変わります。",
      },
      {
        title: "カウンセラーに「霧の中にいる」と伝える",
        body: "うまく言葉にできないままでも、「いま霧みたいな状態です」と伝えるだけで、相手は無理に晴らそうとしなくなります。霧にいることを、まず誰かに知っておいてもらう。",
      },
    ],
    related_weather_keys: ["dissonance_wind", "quiet_overcast", "rain_cloud"],
    column_slug: "weather-mist-shinken-mayoi",
  },
};

/**
 * 天気キーから解説データを取得
 */
export function getWeatherDescription(
  key: WeatherKey
): WeatherDescription {
  return WEATHER_DESCRIPTIONS[key];
}

/**
 * ルート別に天気タイプ一覧を取得（SEO 用一覧ページで使用）
 */
export function getWeathersByRoute(route: RouteKey): WeatherDescription[] {
  return Object.values(WEATHER_DESCRIPTIONS).filter((w) => w.route === route);
}

/**
 * 全天気タイプを配列で取得（/note/weather 一覧ページで使用）
 */
export function getAllWeathers(): WeatherDescription[] {
  return Object.values(WEATHER_DESCRIPTIONS);
}

/**
 * slug から天気データを取得（個別ページで使用）
 */
export function findWeatherBySlug(slug: string): WeatherDescription | undefined {
  return Object.values(WEATHER_DESCRIPTIONS).find((w) => w.slug === slug);
}

/**
 * 全 slug を取得（generateStaticParams 用）
 */
export function getAllWeatherSlugs(): string[] {
  return Object.values(WEATHER_DESCRIPTIONS).map((w) => w.slug);
}

/** ルート別ラベル（一覧ページで使用） */
export const ROUTE_LABELS: Record<RouteKey, string> = {
  pre: "入会前",
  waiting: "待機中",
  omiai: "お見合い後",
  date1: "デート後",
  multiple: "複数交際中",
  kousai: "真剣交際中",
};

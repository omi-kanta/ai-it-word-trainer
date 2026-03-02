import { useMemo } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useAuth } from "../context/AuthContext";
import { useUserWordHistories } from "../hooks/useUserWordHistories";
import { useQuizSessions } from "../hooks/useQuizSessions";
import { Heading } from "../components/ui/Heading";
import { HeadingDetail } from "../components/ui/HeadingDetail";
import { ErrorMessage } from "../components/ui/ErrorMessage";

// YYYY-MM-DD 形式の文字列を返す
function toDateKey(date) {
  return date.toISOString().slice(0, 10);
}

// ソート済みの学習日数配列から連続日数（ストリーク）を計算する
function calcStreaks(sortedDateKeys) {
  if (sortedDateKeys.length === 0) return { current: 0, longest: 0 };

  let longest = 1;
  let run = 1;

  for (let i = 1; i < sortedDateKeys.length; i++) {
    const prev = new Date(sortedDateKeys[i - 1]);
    const curr = new Date(sortedDateKeys[i]);
    const diffDays = (curr - prev) / (1000 * 60 * 60 * 24);
    if (diffDays === 1) {
      run++;
      if (run > longest) longest = run;
    } else {
      run = 1;
    }
  }

  // 現在のストリーク: 最新日から今日まで遡って連続しているか
  const today = toDateKey(new Date());
  const yesterday = toDateKey(new Date(Date.now() - 86400000));
  const last = sortedDateKeys[sortedDateKeys.length - 1];

  let current = 0;
  if (last === today || last === yesterday) {
    current = 1;
    for (let i = sortedDateKeys.length - 2; i >= 0; i--) {
      const a = new Date(sortedDateKeys[i + 1]);
      const b = new Date(sortedDateKeys[i]);
      const diff = (a - b) / (1000 * 60 * 60 * 24);
      if (diff === 1) current++;
      else break;
    }
  }

  return { current, longest };
}

// 直近 N 日分の日付キーと件数マップを生成
function buildDailyData(histories, days = 30) {
  const countMap = {};
  for (const h of histories) {
    const d = h.createdAt?.toDate?.();
    if (!d) continue;
    const key = toDateKey(d);
    countMap[key] = (countMap[key] ?? 0) + 1;
  }

  const result = [];
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(Date.now() - i * 86400000);
    const key = toDateKey(d);
    result.push({ date: key.slice(5), count: countMap[key] ?? 0 });
  }
  return result;
}

function StatCard({ label, value, unit = "" }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 flex flex-col items-center gap-1">
      <span className="text-3xl font-bold text-indigo-600">
        {value}
        {unit && <span className="text-base font-medium ml-1">{unit}</span>}
      </span>
      <span className="text-xs text-gray-500 text-center">{label}</span>
    </div>
  );
}

export default function Statistics() {
  const { user } = useAuth();
  const userId = user?.uid ?? null;

  const { histories = [], loading: wLoading, error: wError } = useUserWordHistories(userId);
  const { sessions = [], loading: qLoading, error: qError } = useQuizSessions(userId);

  const stats = useMemo(() => {
    // 学習日（ユニーク日付）を昇順でソート
    const daySet = new Set();
    for (const h of histories) {
      const d = h.createdAt?.toDate?.();
      if (d) daySet.add(toDateKey(d));
    }
    const sortedDays = [...daySet].sort();

    const { current, longest } = calcStreaks(sortedDays);

    return {
      totalDays: sortedDays.length,
      currentStreak: current,
      longestStreak: longest,
      searchCount: histories.length,
      quizCount: sessions.length,
      dailyData: buildDailyData(histories),
    };
  }, [histories, sessions]);

  const loading = wLoading || qLoading;
  const error = wError || qError;

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-8">
      <div>
        <Heading>学習統計</Heading>
        <HeadingDetail>
          学習の積み重ねを確認しましょう。
        </HeadingDetail>
      </div>

      {loading && (
        <p className="text-gray-500 text-sm text-center">読み込み中...</p>
      )}

      <ErrorMessage
        message={error ? "統計データの取得に失敗しました。" : ""}
      />

      {!loading && (
        <>
          {/* 統計カード */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <StatCard label="総学習日数" value={stats.totalDays} unit="日" />
            <StatCard label="現在のストリーク" value={stats.currentStreak} unit="日" />
            <StatCard label="最長ストリーク" value={stats.longestStreak} unit="日" />
            <StatCard label="単語を検索した回数" value={stats.searchCount} unit="回" />
            <StatCard label="クイズを使用した回数" value={stats.quizCount} unit="回" />
          </div>

          {/* 日別学習グラフ */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
            <h3 className="text-sm font-semibold text-gray-700 mb-4">
              日別検索数（直近30日）
            </h3>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={stats.dailyData} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 10 }}
                  interval={4}
                  tickLine={false}
                />
                <YAxis
                  allowDecimals={false}
                  tick={{ fontSize: 10 }}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip
                  contentStyle={{ fontSize: 12 }}
                  formatter={(v) => [`${v} 回`, "検索数"]}
                />
                <Area
                  type="monotone"
                  dataKey="count"
                  stroke="#6366f1"
                  strokeWidth={2}
                  fill="url(#areaGrad)"
                  dot={false}
                  activeDot={{ r: 4 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </>
      )}
    </div>
  );
}

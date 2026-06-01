"use client";

/**
 * ModalErrorBoundary — モーダル内の描画エラーがアプリ全体を巻き込んで
 * 真っ黒にしてしまうのを防ぐための境界。
 * 子で例外が起きたら、閉じられるフォールバックを表示し、原因を console に出す。
 */
import { Component, type ReactNode } from "react";

type Props = {
  children: ReactNode;
  onClose: () => void;
};

type State = { hasError: boolean; message: string };

export default class ModalErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, message: "" };

  static getDerivedStateFromError(error: unknown): State {
    return {
      hasError: true,
      message: error instanceof Error ? error.message : String(error),
    };
  }

  componentDidCatch(error: unknown) {
    // 端末のコンソールで原因を確認できるようにする
    // eslint-disable-next-line no-console
    console.error("[ModalErrorBoundary] reel modal crashed:", error);
  }

  render() {
    if (!this.state.hasError) return this.props.children;
    return (
      <div
        role="dialog"
        aria-modal="true"
        onClick={this.props.onClose}
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 1000,
          background: "rgba(15,12,10,.92)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "0 24px",
        }}
      >
        <div
          onClick={(e) => e.stopPropagation()}
          style={{
            background: "#fff",
            borderRadius: 18,
            padding: "28px 24px",
            maxWidth: 360,
            width: "100%",
            textAlign: "center",
          }}
        >
          <p style={{ fontFamily: "var(--font-mincho)", fontSize: 16, color: "var(--ink)", marginBottom: 10 }}>
            うまく表示できませんでした
          </p>
          <p style={{ fontSize: 12, color: "var(--mid)", lineHeight: 1.8, marginBottom: 20 }}>
            お手数ですが、いったん閉じてからもう一度お試しください。
            <br />
            プロフィールページからは引き続きご覧いただけます。
          </p>
          <button
            type="button"
            onClick={this.props.onClose}
            style={{
              width: "100%",
              padding: "12px",
              borderRadius: 50,
              border: "none",
              background: "var(--accent)",
              color: "white",
              fontSize: 13,
              cursor: "pointer",
            }}
          >
            閉じる
          </button>
        </div>
      </div>
    );
  }
}

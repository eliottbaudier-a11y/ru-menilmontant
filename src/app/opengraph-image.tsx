import { ImageResponse } from "next/og";

export const alt = "Ru de Ménilmontant · Le ruisseau oublié de Paris";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#1B1D5E",
          color: "#F3F1EA",
          padding: "72px 80px",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: 26,
            letterSpacing: 6,
            color: "#63D0DE",
            textTransform: "uppercase",
          }}
        >
          Un parcours en 8 plaques · Paris
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              display: "flex",
              fontSize: 96,
              fontWeight: 800,
              lineHeight: 1.02,
              letterSpacing: -2,
            }}
          >
            Ru de Ménilmontant
          </div>
          <div
            style={{
              display: "flex",
              width: 160,
              height: 5,
              background: "#63D0DE",
              margin: "26px 0 22px",
            }}
          />
          <div style={{ display: "flex", fontSize: 42, color: "#C9C9E6" }}>
            Le ruisseau oublié de Paris
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            fontSize: 24,
            color: "#9C9FD6",
          }}
        >
          <div style={{ display: "flex" }}>De Belleville à la Seine</div>
          <div style={{ display: "flex" }}>ru-menilmontant.vercel.app</div>
        </div>
      </div>
    ),
    { ...size },
  );
}

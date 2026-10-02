import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#0B0F1A",
          borderRadius: 6,
        }}
      >
        <svg width="20" height="20" viewBox="0 0 24 24">
          <path d="M5 3.5h11.5A2.5 2.5 0 0 1 19 6v14.5H7.5A2.5 2.5 0 0 1 5 18V3.5Z" fill="#E9ECF4" />
          <path d="M9 3.5h10V11l-2.5-1.6L14 11V3.5H9Z" fill="#F2B14C" />
        </svg>
      </div>
    ),
    { ...size },
  );
}

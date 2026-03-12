import React from "react";
import Link from "next/link";

export default function Page500() {
  return (
    <main
      style={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        background: "#f8fafc",
        color: "#0f172a",
        padding: 24
      }}>
      <div
        style={{
          width: "100%",
          maxWidth: 560,
          border: "1px solid rgba(15, 23, 42, 0.08)",
          borderRadius: 24,
          background: "#ffffff",
          padding: 32,
          boxShadow: "0 16px 40px rgba(15, 23, 42, 0.06)",
          textAlign: "center"
        }}>
        <p
          style={{
            margin: 0,
            color: "#64748b",
            fontSize: 14,
            letterSpacing: "0.08em",
            textTransform: "uppercase"
          }}>
          500
        </p>
        <h1 style={{ margin: "12px 0 8px", fontSize: 36, lineHeight: 1.1 }}>
          Une erreur interne s’est produite
        </h1>
        <p style={{ margin: 0, color: "#475569", fontSize: 16, lineHeight: 1.6 }}>
          Le CRM rencontre un incident temporaire. Revenez à l’accueil ou réessayez dans quelques instants.
        </p>
        <div style={{ marginTop: 24 }}>
          <Link
            href="/dashboard"
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 999,
              padding: "12px 18px",
              background: "#0f172a",
              color: "#ffffff",
              textDecoration: "none",
              fontWeight: 600
            }}>
            Retour au dashboard
          </Link>
        </div>
      </div>
    </main>
  );
}

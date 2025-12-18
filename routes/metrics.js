// metrics.js
// metrics.js
import express from "express";
import { BetaAnalyticsDataClient } from "@google-analytics/data";

const router = express.Router();

const PROPERTY_ID = "510927002";

// Construimos el JSON desde variables de entorno
const gaCredentials = {
  type: process.env.GA_TYPE,
  project_id: process.env.GA_PROJECT_ID,
  private_key_id: process.env.GA_PRIVATE_KEY_ID,
  private_key: process.env.GA_PRIVATE_KEY?.replace(/\\n/g, "\n"),
  client_email: process.env.GA_CLIENT_EMAIL,
  client_id: process.env.GA_CLIENT_ID,
  auth_uri: process.env.GA_AUTH_URI,
  token_uri: process.env.GA_TOKEN_URI,
  auth_provider_x509_cert_url: process.env.GA_AUTH_PROVIDER_CERT_URL,
  client_x509_cert_url: process.env.GA_CLIENT_CERT_URL,
  universe_domain: process.env.GA_UNIVERSE_DOMAIN,
};

// Cliente GA4
const analyticsDataClient = new BetaAnalyticsDataClient({
  credentials: gaCredentials,
});

/* ============================================================
    MÉTRICAS PRINCIPALES (overview)
   ============================================================ */
router.get("/overview", async (req, res) => {
  try {
    const [response] = await analyticsDataClient.runReport({
      property: `properties/${PROPERTY_ID}`,
      dateRanges: [{ startDate: "30daysAgo", endDate: "today" }],
      metrics: [
        { name: "sessions" },
        { name: "screenPageViews" },
      ],
    });

    if (!response.rows || response.rows.length === 0) {
      return res.json({
        sessions: 0,
        pageViews: 0
      });
    }

    const row = response.rows[0];

    res.json({
      sessions: Number(row.metricValues[0]?.value || 0),
      pageViews: Number(row.metricValues[1]?.value || 0),
    });

  } catch (err) {
    console.error("Error en /overview:", err);
    res.status(500).json({ error: "Error retrieving GA4 metrics" });
  }
});


/* ============================================================
    PRODUCTOS MÁS VISTOS
   ============================================================ */
router.get("/top-products", async (req, res) => {
  try {
    const [response] = await analyticsDataClient.runReport({
      property: `properties/${PROPERTY_ID}`,
      dateRanges: [{ startDate: "30daysAgo", endDate: "today" }],
      dimensions: [{ name: "pagePath" }],
      metrics: [{ name: "screenPageViews" }],
      limit: 10,
      orderBys: [
        {
          metric: { metricName: "screenPageViews" },
          desc: true,
        },
      ],
    });

    if (!response.rows || response.rows.length === 0) {
      return res.json([]);
    }

    const filtered = response.rows
      .filter(
        (row) =>
          row?.dimensionValues?.[0]?.value?.startsWith("/producto/")
      )
      .map((row) => {
        const path = row.dimensionValues[0].value;

        // 🔑 limpiar ID correctamente
        const id = path
          .replace("/producto/", "")
          .split("?")[0]
          .replace("/", "");

        return {
          url: path,
          views: Number(row.metricValues?.[0]?.value || 0),
          id,
        };
      })
      .slice(0, 4);

    res.json(filtered);

  } catch (err) {
    console.error("Error en /top-products:", err);
    res.status(200).json([]);
  }
});


/* ============================================================
    VISITAS POR DÍA
   ============================================================ */
router.get("/visits-by-day", async (req, res) => {
  try {
    const [response] = await analyticsDataClient.runReport({
      property: `properties/${PROPERTY_ID}`,
      dateRanges: [
        {
          startDate: "30daysAgo",
          endDate: "today",
        },
      ],
      dimensions: [{ name: "date" }],
      metrics: [{ name: "screenPageViews" }],
      orderBys: [
        {
          dimension: {
            dimensionName: "date",
            orderType: "NUMERIC",
          },
        },
      ],
    });

    const rows = response?.rows || [];

    const data = rows.map((r) => ({
      date: r.dimensionValues?.[0]?.value || "00000000",
      visits: Number(r.metricValues?.[0]?.value || 0),
    }));

    res.json(data);

  } catch (err) {
    console.error("Error en /visits-by-day:", err);
    res.status(200).json([]);
  }
});

export default router;

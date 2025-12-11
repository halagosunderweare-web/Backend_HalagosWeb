import express from "express";
import { BetaAnalyticsDataClient } from "@google-analytics/data";
import path from "path";

const router = express.Router();

const PROPERTY_ID = "510927002";

// Cliente GA4
const analyticsDataClient = new BetaAnalyticsDataClient({
  keyFilename: path.join(process.cwd(), "credentials/ga-service-account.json"),
});

/* ============================================================
    MÉTRICAS PRINCIPALES 
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

    // Si GA4 no regresa datos, devolvemos ceros para evitar crasheo
    if (!response.rows || response.rows.length === 0) {
      return res.json({
        sessions: 0,
        pageViews: 0
      });
    }

    const row = response.rows[0];

    const sessions = Number(row.metricValues[0]?.value || 0);
    const pageViews = Number(row.metricValues[1]?.value || 0);

    res.json({ sessions, pageViews });

  } catch (err) {
    console.error("❌ Error en /overview:", err);
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

    const filtered = response.rows
      .filter((row) => row.dimensionValues[0].value.startsWith("/producto/"))
      .slice(0, 4)
      .map((row) => ({
        url: row.dimensionValues[0].value,
        views: Number(row.metricValues[0].value),
        id: row.dimensionValues[0].value.split("/")[2],
      }));

    res.json(filtered);
  } catch (err) {
    console.error("❌ Error en /top-products:", err);
    res.status(500).json({ error: "Error retrieving GA4 product metrics" });
  }
});

/* ============================================================
    VISITAS POR DÍA (PARA RECHARTS)
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

    const rows = response.rows || [];

    const data = rows.map((r) => ({
      date: r.dimensionValues[0].value, // YYYYMMDD
      visits: Number(r.metricValues[0].value),
    }));

    res.json(data);
  } catch (err) {
    console.error("❌ Error en /visits-by-day:", err);
    res.status(500).json({ error: "Failed to fetch visits by day" });
  }
});

export default router;

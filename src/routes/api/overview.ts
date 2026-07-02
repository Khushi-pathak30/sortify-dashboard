import { createFileRoute } from "@tanstack/react-router";
import { generateBins, generateDevices, generateAlerts, generatePredictions, WASTE_TYPES } from "@/lib/mock";
import { json, optionsHandler } from "./_cors";

export const Route = createFileRoute("/api/overview")({
  server: {
    handlers: {
      OPTIONS: optionsHandler,
      GET: async () => {
        const bins = generateBins();
        const devices = generateDevices();
        const alerts = generateAlerts(100, devices);
        const preds = generatePredictions(500, devices);
        const online = devices.filter((d) => d.status === "online").length;
        const offline = devices.filter((d) => d.status === "offline").length;
        const activeAlerts = alerts.filter((a) => !a.resolved).length;
        const avgFill = Math.round(bins.reduce((s, b) => s + b.fill, 0) / bins.length);
        const totalWeight = +bins.reduce((s, b) => s + b.weightKg, 0).toFixed(1);
        const avgInference = Math.round(preds.reduce((s, p) => s + p.inferenceMs, 0) / preds.length);
        const accuracy = +(preds.reduce((s, p) => s + p.confidence, 0) / preds.length * 100).toFixed(1);
        const perType = WASTE_TYPES.map((t) => ({
          type: t,
          kg: +bins.filter((b) => b.type === t).reduce((s, b) => s + b.weightKg, 0).toFixed(1),
        }));
        return json({
          kpis: {
            wasteTodayKg: totalWeight,
            objectsClassified: preds.length * 25,
            aiAccuracy: accuracy,
            connectedDevices: online,
            offlineDevices: offline,
            activeAlerts,
            avgProcessingMs: avgInference,
            trucksActive: 9,
            avgFillLevel: avgFill,
            systemHealth: 98,
          },
          perType,
          timestamp: Date.now(),
        });
      },
    },
  },
});
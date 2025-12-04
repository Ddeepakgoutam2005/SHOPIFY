import { runSyncForTenant } from "../services/syncService.js";

export async function manualSync(req, res) {
  const tenantId = req.tenantId;
  await runSyncForTenant(tenantId);
  res.json({ synced: true });
}

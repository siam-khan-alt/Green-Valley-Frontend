import { registerMock } from "./adapter";
import "@/features/projects/services/projects.mock";
import "@/features/schedule/services/schedule.mock";
import "@/features/work-packages/services/work-packages.mock";
import "@/features/boq/services/boq.mock";
import "@/features/materials/services/materials.mock";
import "@/features/suppliers/services/suppliers.mock";
import "@/features/contractors/services/contractors.mock";
import "@/features/procurement/services/procurement.mock";
import "@/features/labor/services/labor.mock";
import "@/features/machinery/services/machinery.mock";
import "@/features/operations/services/dpr.mock";
import "@/features/quality/services/inspections.mock";
import "@/features/billing/services/billing.mock";
import "@/features/variations/services/variations.mock";
import "@/features/expenses/services/expenses.mock";
import "@/features/profitability/services/profitability.mock";
import "@/features/reports/services/reports.mock";
import "@/features/users/services/users.mock";

registerMock("get", "/meta", async () => ({
  status: 200,
  data: {
    service: "green-valley-frontend",
    mock: true,
    version: "0.1.0",
  },
}));
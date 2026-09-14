import { registerMock } from "./adapter";
import "@/features/projects/services/projects.mock";

registerMock("get", "/meta", async () => ({
  status: 200,
  data: {
    service: "green-valley-frontend",
    mock: true,
    version: "0.1.0",
  },
}));
import type {
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";

type MockHandler = (
  config: InternalAxiosRequestConfig,
  params: Record<string, string>
) => Promise<{ status: number; data: unknown }>;

interface MockEntry {
  method: string;
  pattern: RegExp;
  paramKeys: string[];
  handler: MockHandler;
}

const registry: MockEntry[] = [];

function compile(pattern: string) {
  const paramKeys: string[] = [];
  const parts = pattern.split(/\{([^{}/]+)\}/);
  const source = parts
    .map((part, index) => {
      if (index % 2 === 1) {
        paramKeys.push(part);
        return "([^/]+)";
      }
      return part.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    })
    .join("");
  return { pattern: new RegExp(`^${source}$`), paramKeys };
}

export function registerMock(
  method: string,
  pattern: string,
  handler: MockHandler
) {
  registry.push({
    method: method.toLowerCase(),
    ...compile(pattern),
    handler,
  });
}

export function clearMocks() {
  registry.length = 0;
}

export function isMockEnabled() {
  return (process.env.NEXT_PUBLIC_USE_MOCK ?? "true") !== "false";
}

export async function mockAdapter(
  config: InternalAxiosRequestConfig
): Promise<AxiosResponse> {
  const method = (config.method ?? "get").toLowerCase();
  const url = config.url ?? "";
  const path = url.replace(/^\/api\/v1(?=\/|$)/, "");

  for (const entry of registry) {
    if (entry.method !== method) continue;
    entry.pattern.lastIndex = 0;
    const match = entry.pattern.exec(path);
    if (!match) continue;

    const params: Record<string, string> = {};
    entry.paramKeys.forEach((key, index) => {
      params[key] = decodeURIComponent(match[index + 1]);
    });

    const { status, data } = await entry.handler(config, params);
    return {
      data,
      status,
      statusText: status >= 400 ? "Client Error" : "OK",
      headers: {},
      config,
    };
  }

  return {
    data: { detail: `Mock not implemented: ${method.toUpperCase()} ${path}` },
    status: 501,
    statusText: "Not Implemented",
    headers: {},
    config,
  };
}
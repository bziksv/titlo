import type {
  ClusterDemoPollBody,
  ClusterDemoResponse,
  ClusterDemoRunBody,
  DemoErrorBody,
} from "@/lib/demo/types";
import { CLUSTER_DEMO_MODULE, CLUSTER_DEMO_POLL_MAX, CLUSTER_DEMO_POLL_MS } from "@/lib/demo/cluster-demo";

const MODULE = CLUSTER_DEMO_MODULE;
const RUN_PATH = `/api/demo/${MODULE}/run/`;
const POLL_PATH = `/api/demo/${MODULE}/poll/`;

async function postJson<T>(path: string, body: unknown): Promise<{ res: Response; json: T }> {
  const res = await fetch(path, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify(body),
  });
  const json = (await res.json()) as T;
  return { res, json };
}

export async function runClusterDemo(
  body: ClusterDemoRunBody
): Promise<
  | { ok: true; data: ClusterDemoResponse }
  | { ok: false; status: number; error: DemoErrorBody }
> {
  const endpoints = [RUN_PATH, `/api/lk/api/demo/${MODULE}/run/`];

  for (const path of endpoints) {
    const { res, json } = await postJson<ClusterDemoResponse | DemoErrorBody>(path, body);
    if (res.status === 404 || res.status === 502) continue;
    if (!res.ok) {
      return { ok: false, status: res.status, error: json as DemoErrorBody };
    }
    return { ok: true, data: json as ClusterDemoResponse };
  }

  return {
    ok: false,
    status: 503,
    error: {
      error: "unavailable",
      message: "Демо временно недоступно. Убедитесь, что кабинет (:3002) и очереди кластера запущены.",
    },
  };
}

export async function pollClusterDemo(
  body: ClusterDemoPollBody
): Promise<
  | { ok: true; data: ClusterDemoResponse }
  | { ok: false; status: number; error: DemoErrorBody }
> {
  const endpoints = [POLL_PATH, `/api/lk/api/demo/${MODULE}/poll/`];

  for (const path of endpoints) {
    const { res, json } = await postJson<ClusterDemoResponse | DemoErrorBody>(path, body);
    if (res.status === 404 || res.status === 502) continue;
    if (!res.ok) {
      return { ok: false, status: res.status, error: json as DemoErrorBody };
    }
    return { ok: true, data: json as ClusterDemoResponse };
  }

  return {
    ok: false,
    status: 503,
    error: { error: "unavailable", message: "Не удалось получить статус демо." },
  };
}

export async function runClusterDemoWithPoll(
  body: ClusterDemoRunBody,
  onProgress?: (progress: ClusterDemoResponse) => void
): Promise<
  | { ok: true; data: ClusterDemoResponse }
  | { ok: false; status: number; error: DemoErrorBody }
> {
  const started = await runClusterDemo(body);
  if (!started.ok) return started;

  let current = started.data;
  onProgress?.(current);

  const progressId = current.progress_id;
  if (!progressId) {
    return started;
  }

  for (let i = 0; i < CLUSTER_DEMO_POLL_MAX; i++) {
    if (current.status === "complete" && current.result) {
      return { ok: true, data: current };
    }

    await new Promise((r) => setTimeout(r, CLUSTER_DEMO_POLL_MS));

    const polled = await pollClusterDemo({ progress_id: progressId });
    if (!polled.ok) return polled;

    current = polled.data;
    onProgress?.(current);

    if (current.status === "complete" && current.result) {
      return { ok: true, data: current };
    }
  }

  return {
    ok: false,
    status: 504,
    error: {
      error: "timeout",
      message: "Анализ занял слишком много времени. Попробуйте меньше фраз или откройте полный кабинет.",
    },
  };
}

import { proxyCabinetDemoPost } from "@/lib/demo/proxy-cabinet-demo";

export async function POST(request: Request) {
  return proxyCabinetDemoPost("api/demo/tipy-saitov-v-vydache/run", request);
}

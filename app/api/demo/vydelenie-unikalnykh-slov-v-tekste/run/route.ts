import { proxyCabinetDemoPost } from "@/lib/demo/proxy-cabinet-demo";

export async function POST(request: Request) {
  return proxyCabinetDemoPost("api/demo/vydelenie-unikalnykh-slov-v-tekste/run", request);
}

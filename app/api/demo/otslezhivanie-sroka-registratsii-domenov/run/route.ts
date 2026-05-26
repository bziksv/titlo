import { proxyCabinetDemoPost } from "@/lib/demo/proxy-cabinet-demo";

export async function POST(request: Request) {
  return proxyCabinetDemoPost("api/demo/otslezhivanie-sroka-registratsii-domenov/run", request);
}

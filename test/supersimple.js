import http from "k6/http";
import { check, sleep } from "k6";

export const options = {
  duration: "5m",
  vus: 5,
};

export default function () {
  const res = http.get("https://ceiq-shop.vercel.app/");
  check(res, { "status was 200": (r) => r.status === 200 });
  sleep(Math.random() * 5);
}

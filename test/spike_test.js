import http from "k6/http";
import { check, sleep } from "k6";

export const options = {
  stages: [
    { duration: "10s", target: 100 },
    { duration: "1m", target: 100 },
    { duration: "10s", target: 1400 },
    { duration: "3m", target: 1400 },
    { duration: "10s", target: 100 },
    { duration: "3m", target: 100 },
    { duration: "10s", target: 0 },
  ],
};

export default function () {
  const res = http.get("http://localhost:3000/");
  check(res, { "status was 200": (r) => r.status === 200 });
  sleep(1);
}

import nc from "next-connect";
import { isAuth } from "../../../utils/auth";

const handler = nc();
handler.use(isAuth);
handler.get(async (req, res) => {
  res.send(process.env.PAGOPLUX_SANDBOX_ID || "sb"); // sb significa sandbox - modo pruebas en desarrollo
});

export default handler;

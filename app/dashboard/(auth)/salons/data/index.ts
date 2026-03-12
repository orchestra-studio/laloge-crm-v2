import { promises as fs } from "fs";
import path from "path";
import { z } from "zod";

import { salonSchema } from "./schema";

export const SALONS_TOTAL_COUNT = 1707;

export async function getSalons() {
  const data = await fs.readFile(
    path.join(process.cwd(), "app/dashboard/(auth)/salons/data/salons.json")
  );

  return z.array(salonSchema).parse(JSON.parse(data.toString()));
}

export async function getSalonById(id: string) {
  const salons = await getSalons();
  return salons.find((salon) => salon.id === id) ?? null;
}

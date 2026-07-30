// app/rendering-demo/isr/actions.js
"use server";

import { revalidatePath } from "next/cache";

export async function refreshISRPage() {
  revalidatePath("/rendering-demo/isr");
}

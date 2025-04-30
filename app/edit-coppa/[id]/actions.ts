'use server';

import { db } from "@/app/db";
import { campionato, giornata } from "@/app/db/schema";
import { eq } from "drizzle-orm";

export async function salvaOrdineGiornate(ordine: {id: number, order: number}[]) {
    ordine.forEach(async (g) => {
        await db.update(giornata).set({
            order: g.order
        }).where(eq(giornata.id, g.id));
    });
}

export async function salvaJSON(idCamp: number, json: any) {
    await db.update(campionato).set({
        config: json
    }).where(eq(campionato.id, idCamp));
}
import { db } from "@/app/db";
import { campionato, giornata, partita, squadra } from "@/app/db/schema";
import { eq, sql } from "drizzle-orm";
import { alias } from "drizzle-orm/pg-core";
import CoppaComposer from "./composer";
import TitleBar from "@/app/components/TitleBar";

export interface DettPartitaEditCoppa {
    id: number;
    abbrSquadra1: string;
    abbrSquadra2: string;
    idGiornata: number;
    nomeGiornata: string;
    orderGiornata: number;
    assigned: boolean;
}
export interface GiornataEditCoppa {
    id: number;
    nome: string;
    order: number;
    partite: DettPartitaEditCoppa[];
    assigned: boolean;
}

export default async function EditRecordPage({ params }: { params: Promise<{ id: number }> }) {
    const { id } = await params;

    const coppaDetails = await db
        .select()
        .from(campionato)
        .where(eq(campionato.id, id))
        .then((res) => res[0]);

    const squadra1 = alias(squadra, "squadra1");
    const squadra2 = alias(squadra, "squadra2");
    
    const giornate: DettPartitaEditCoppa[] = await db
        .select({
            id: partita.id,
            abbrSquadra1: sql<string>`COALESCE(${squadra1.abbr}, ${squadra1.abbrFisr})`,
            abbrSquadra2: sql<string>`COALESCE(${squadra2.abbr}, ${squadra2.abbrFisr})`,
            idGiornata: giornata.id,
            nomeGiornata: sql<string>`COALESCE(${giornata.nome}, ${giornata.nomeFisr})`,
            orderGiornata: giornata.order,
            assigned: sql<boolean>`false`
        })
        .from(partita)
        .innerJoin(giornata, eq(partita.fkGiornata, giornata.id))
        .innerJoin(squadra1, eq(partita.fkSquadra1, squadra1.id))
        .innerJoin(squadra2, eq(partita.fkSquadra2, squadra2.id))
        .where(eq(giornata.fkCampionato, id));

    const formattedResult = giornate.reduce((acc, row) => {
        if (!acc[row.idGiornata]) {
            acc[row.idGiornata] = [];
        }
        acc[row.idGiornata].push(row);
        return acc;
    }, {} as any);

    const calendarioArray: GiornataEditCoppa[] = Object.values(formattedResult).map((list: any) => {
        return {
            id: list.length > 0 ? list[0].idGiornata : null,
            nome: list.length > 0 ? list[0].nomeGiornata : null,
            order: list.length > 0 ? list[0].orderGiornata : null,
            partite: list,
            assigned: false
        }
    }).sort((a: any, b: any) => a.order - b.order);

    return (
        <>
            <TitleBar title={"coppa / " + coppaDetails.nome} />
            <div className="container-fluid p-2">
                <CoppaComposer id={id} cal={calendarioArray} />
            </div>
        </>
    )
}
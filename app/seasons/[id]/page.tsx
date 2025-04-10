import { db } from '@/app/db';
import { stagione, campionato, league, tipoCampionato } from '@/app/db/schema';
import { desc, eq, sql, asc } from 'drizzle-orm';
import React from 'react';
import TitleBar from '@/app/components/TitleBar';
import CampionatiTable from './table';

export default async function SeasonsPage({ params }: { params: Promise<{ id: number }>}) {

    const { id } = await params;

    const res = await db.select({nome: stagione.stagione}).from(stagione).where(eq(stagione.idFisr, id)).limit(1);
    if (!res.length || res.length !== 1 || !res[0].nome) {
        return <p>Stagione not found</p>;
    }
    
    const campionati = await db
        .select({
            nome: campionato.nome,
            nfisr: campionato.nomeFisr,
            id: campionato.id,
            idFisr: campionato.idcFisr,
            lega: league.abbr,
            tipo: tipoCampionato.nome,
        })
        .from(campionato)
        .innerJoin(league, eq(league.id, campionato.fkLeague))
        .leftJoin(tipoCampionato, eq(tipoCampionato.id, campionato.fkTipoCamp))
        .where(eq(campionato.fkStagione, id))
        .orderBy(asc(campionato.id))

        
    return (
        <>
            <TitleBar title={"stagioni / " + res[0].nome} />
            <div className="container-fluid pt-3">
                <div className="row g-3">
                    <div className="col-8">
                        <div className="card card-body shadow">
                            <h4>Campionati recuperati</h4>
                            <CampionatiTable campionati={campionati} />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};
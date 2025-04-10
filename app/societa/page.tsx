import { db } from '@/app/db';
import { societa, stagione } from '@/app/db/schema';
import { asc, desc } from 'drizzle-orm';
import React from 'react';
import TitleBar from '@/app/components/TitleBar';

export default async function SocietaPage() {
    
    const seasons = await db
        .select({
            nome: societa.nome,
            fisr: societa.idFisr,
        })
        .from(societa)
        .orderBy(asc(societa.nome));

    return (
        <>
            <TitleBar title={"società"} />
            <div className="container-fluid pt-3">
                <div className="row g-3">
                    {seasons.map((season: any, i) => (
                        <div key={i} className="col-12 col-md-6 col-lg-4 col-xl-3">
                            <a className="card border-warning shadow border-2 rounded c-pointer no-underline" href={"/societa/" + season.fisr}>
                                <div className="card-body">
                                    <h4>{season.nome}</h4>
                                    <p className="mb-0 text-muted sora">{season.fisr}</p>
                                </div>
                            </a>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
};
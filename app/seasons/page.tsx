import { NextResponse } from 'next/server';
import { db } from '@/app/db';
import { stagione } from '@/app/db/schema';
import { desc } from 'drizzle-orm';
import React from 'react';
import TitleBar from '@/app/components/TitleBar';

export default async function SeasonsPage() {
    
    const seasons = await db
        .select({
            nome: stagione.stagione,
            id: stagione.id,
            fisr: stagione.idFisr,
            anno: stagione.anno,
        })
        .from(stagione)
        .orderBy(desc(stagione.anno));

    return (
        <>
            <TitleBar title={"stagioni"} />
            <div className="container-fluid pt-3">
                <div className="row g-3">
                    {seasons.map((season: any, i) => (
                        <div key={i} className="col-12 col-md-6 col-lg-4 col-xl-3">
                            <a className="card border-warning shadow border-2 rounded c-pointer no-underline" href={"/seasons/" + season.fisr}>
                                <div className="card-body">
                                    <h4>{season.nome}</h4>
                                    <p className="mb-0 text-muted sora">Anno {season.anno} </p>
                                </div>
                            </a>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
};
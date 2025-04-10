// /app/edit-record/page.tsx
import { db } from "@/app/db";
import { league, stagione, campionato, tipoCampionato } from "@/app/db/schema";
import { desc, eq, asc } from "drizzle-orm";

import { updateRecord } from "./actions";

import TitleBar from "@/app/components/TitleBar";
import BackButtonWrapper from "@/app/components/BackButton";

export default async function EditRecordPage({ params }: { params: Promise<{ id: number }> }) {
    const { id } = await params;

    const camp = await db
        .select()
        .from(campionato)
        .where(eq(campionato.id, id))
        .then((res) => res[0]);

    const stagioni = await db
        .select({
            nome: stagione.stagione,
            id: stagione.id,
            fisr: stagione.idFisr,
            anno: stagione.anno,
        })
        .from(stagione)
        .orderBy(desc(stagione.anno));

    const tipiCamp = await db
        .select({
            id: tipoCampionato.id,
            label: tipoCampionato.nome,
        })
        .from(tipoCampionato)
        .orderBy(asc(tipoCampionato.id));

    const leghe = await db
        .select({
            id: league.id,
            label: league.nome,
        })
        .from(league)
        .orderBy(asc(league.order));

  // const tipiCamp = await db.select().from(tipoCampionato);
  // const leghe = await db.select().from(league);
  // const stagioni = await db.select().from(stagione);

    return (
        <>
            <TitleBar title={"campionato / " + camp.nome} />
            <div className="container mt-3">
                <form action={updateRecord}>
                    <div className="card card-body shadow">
                        <div className="row g-3 mb-3">
                            <div className="col-6">
                                <label className="form-label">Nome custom</label>
                                <input
                                    className="form-control"
                                    name="nome"
                                    defaultValue={camp.nome || ""}
                                />
                            </div>

                            <div className="col-2">
                                <label className="form-label">ID FISR</label>
                                <input
                                    className="form-control"
                                    name="id_fisr"
                                    defaultValue={camp.idcFisr || ""}
                                />
                            </div>

                            <div className="col-2">
                                <label className="form-label">ID</label>
                                <input
                                    className="form-control"
                                    defaultValue={camp.id || ""}
                                    disabled
                                />
                            </div>

                            <div className="col-2">
                                <label className="form-label">Stagione</label>
                                <select
                                    className="form-select"
                                    name="fk_stagione"
                                    defaultValue={camp.fkStagione || ""}
                                >
                                    {stagioni.map(opt => <option key={opt.id} value={opt.id}>{opt.nome}</option> )}
                                </select>
                            </div>
                        </div>

                        <div className="row g-3 mb-3">
                            <div className="col-6">
                                <label className="form-label">Nome FISR</label>
                                <input
                                    className="form-control"
                                    name="nome_fisr"
                                    defaultValue={camp.nomeFisr || ""}
                                />
                            </div>

                            <div className="col-2">
                                <label className="form-label">Lega</label>
                                <select
                                    className="form-select"
                                    name="fk_league"
                                    defaultValue={camp.fkLeague || ""}
                                >
                                {leghe.map(opt =>  <option key={opt.id} value={opt.id}>{opt.label}</option> )}
                                </select>
                            </div>

                            <div className="col-2">
                                <label className="form-label">Tipo Campionato</label>
                                <select
                                    className="form-select"
                                    name="fk_tipo_camp"
                                    defaultValue={camp.fkTipoCamp || ""}
                                >
                                    {tipiCamp.map(opt => <option key={opt.id} value={opt.id}>{opt.label}</option> )}
                                </select>
                            </div>
                        </div>

                        <div className="row g-3">
                            <div className="col-6">
                                <label className="form-label">Config (JSON)</label>
                                <textarea
                                    name="config"
                                    className="form-control"
                                    rows={10}
                                    defaultValue={JSON.stringify(camp.config, null, 2)}
                                ></textarea>
                            </div>

                            <div className="col-2">
                                <label className="form-label">Visibile</label>
                                <div className="btn-group w-100" role="group" aria-label="Visibility toggle button group">
                                    <input
                                        type="radio"
                                        className="btn-check w-50"
                                        name="show"
                                        id="show-true"
                                        value="true"
                                        defaultChecked={camp.show === true}
                                    />
                                    <label className="btn btn-outline-primary" htmlFor="show-true">
                                        Visibile
                                    </label>

                                    <input
                                        type="radio"
                                        className="btn-check w-50"
                                        name="show"
                                        id="show-false"
                                        value="false"
                                        defaultChecked={camp.show === false}
                                    />
                                    <label className="btn btn-outline-primary" htmlFor="show-false">
                                        Nascosto
                                    </label>
                                </div>
                            </div>

                            <div className="col-2">
                                <label className="form-label">Ordine</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    name="ordine"
                                    defaultValue={camp.order || 1}
                                />
                            </div>
                        </div>

                        <div className="d-flex justify-content-between mt-4">
                            <BackButtonWrapper classes="btn btn-secondary px-4">
                                Indietro
                            </BackButtonWrapper>

                            <button className="btn btn-primary px-4" type="submit">
                                Salva
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </>
    );
}

import TitleBar from "@/app/components/TitleBar";
import { db } from "@/app/db";
import { league, societa, squadra } from "@/app/db/schema";
import { asc, desc, eq, sql } from "drizzle-orm";

export default async function EditRecordPage({ params }: { params: Promise<{ id: number }> }) {
    const { id } = await params;

    const soc = await db
        .select()
        .from(societa)
        .where(eq(societa.idFisr, id))
        .then((res) => res[0]);

    const squadre = await db
        .select({
            nome: sql<string>`COALESCE(${squadra.full}, ${squadra.nomeFisr})`,
            id: squadra.id,
            lega: league.nome,
        })
        .from(squadra)
        .innerJoin(league, eq(league.id, squadra.fkLeague))
        .where(eq(squadra.fkSocieta, id))
        .orderBy(asc(squadra.fkLeague));

    const logo = (soc.logo.indexOf("https") == -1) ? "https://sidgad.cloud/fisr/images/logos_clubes/" + soc.logo : soc.logo;

    return (
        <>
            <TitleBar title={"societa / " + soc.idFisr} />
            <div className="container mt-3">
                <div className="card card-body shadow mb-3">
                    <div className="row">
                        <div className="col-4 text-center">
                            <img src={logo} className="img-fluid" alt="Logo" />
                            <br />
                            <input 
                                type="text" 
                                name="logo" 
                                className="form-control mt-3" 
                                defaultValue={soc.logo}
                            />
                        </div>
                        <div className="col-8">
                            <input 
                                type="text"
                                name="nome"
                                className="form-control form-control-lg" 
                                defaultValue={soc.nome} 
                                style={{ fontSize: "1.5rem" }} 
                            />
                            <br />

                            <div className="row g-3">
                                <div className="col-6">
                                    <label className="form-label">Città</label>
                                    <input 
                                        type="text" 
                                        name="citta" 
                                        className="form-control" 
                                        defaultValue={soc.citta} 
                                    />
                                </div>

                                <div className="col-6">
                                    <label className="form-label">Pista</label>
                                    <input 
                                        type="text" 
                                        name="pista" 
                                        className="form-control" 
                                        defaultValue={soc.pista} 
                                    />
                                </div>
                            </div>

                        </div>
                    </div>

                    <hr />

                    <div className="input-group">
                        <span className="input-group-text">
                            <i className="bi bi-globe"></i>
                        </span>
                        <input 
                            type="text" 
                            className="form-control" 
                            placeholder="Sito web ufficiale" 
                            name="sito"
                            defaultValue={soc.sito}
                        />
                    </div>

                    <div className="input-group mt-3">
                        <span className="input-group-text">
                            <i className="bi bi-facebook"></i>
                        </span>
                        <input 
                            type="text" 
                            className="form-control" 
                            placeholder="Pagina facebook" 
                            name="fb"
                            defaultValue={soc.fb}
                        />
                    </div>

                    <div className="input-group mt-3">
                        <span className="input-group-text">
                            <i className="bi bi-instagram"></i>
                        </span>
                        <input 
                            type="text" 
                            className="form-control" 
                            placeholder="Pagina instagram" 
                            name="instagram"
                        />
                    </div>

                    <div className="input-group mt-3">
                        <span className="input-group-text">
                            <i className="bi bi-wikipedia"></i>
                        </span>
                        <input 
                            type="text" 
                            className="form-control" 
                            placeholder="Pagina Wikipedia" 
                            name="wikipedia"
                        />
                    </div>
                </div>

                <div className="row g-3">
                    {squadre.map((s: any, i) => (
                        <div key={i} className="col-12 col-md-6 col-lg-4 col-xl-3">
                            <a className="card border-warning shadow border-2 rounded c-pointer no-underline" href={"/squadra/" + s.id}>
                                <div className="card-body">
                                    <h4>{s.nome}</h4>
                                    <p className="mb-0 text-muted sora">{s.lega}</p>
                                </div>
                            </a>
                        </div>
                    ))}
                </div>
            </div>
        </>
    )

}
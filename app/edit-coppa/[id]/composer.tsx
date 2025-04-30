"use client"

import { Fragment, useRef, useState } from "react";
import { Configuration, EmptyConfig, PlayOffA1, Supercoppa } from "./configurations"
import { GiornataEditCoppa } from "./page";
import { salvaJSON, salvaOrdineGiornate } from "./actions";

export default function CoppaComposer({ id, cal }: { id: number, cal: GiornataEditCoppa[] }) {

    const config = useRef<Configuration>(new EmptyConfig());
    const calendario = useRef<GiornataEditCoppa[]>(cal);

    const [, forceRender] = useState(0);

    const [draggedId, setDraggedId] = useState<number | null>(null);
    const handleDragStart = (id: number) => {
        setDraggedId(id);
    };

    const handleDrop = (id: string) => {
        if (draggedId !== null) {
            const elem = config.current.getElemById(id);
            if (!elem) return;
            if (elem.full()) {
                alert("Elemento pieno");
                return;
            }
            if (elem.current.includes(draggedId)) {
                alert("Elemento già presente");
                return;
            }
            elem.current.push(draggedId);

            const g = getElemById(draggedId);
            if(g) g.assigned = true;

            forceRender(n => n + 1);
            
            setDraggedId(null);
        }
    };

    const getRowStyle = (elem: any) => ({
        border: elem.assigned ? "2px solid green" : "1px solid #ccc",
        cursor: elem.assigned ? "default" : "grab",
    });

    const getElemById = (id: number) => {
        for (let i = 0; i < calendario.current.length; i++) {
            const g = calendario.current[i];
            if (g.id == id) {
                return g;
            }
            for (let j = 0; j < g.partite.length; j++) {
                const p = g.partite[j];
                if (p.id == id) {
                    return p;
                }
            }
        }
        return null;
    }

    const getNameFromID = (id: number) => {
        let elem = getElemById(id);
        if (!elem) return "";
        if (Object.keys(elem).includes("nome")) return (elem as any).nome;
        else return (elem as any).abbrSquadra1 + " - " + (elem as any).abbrSquadra2;
    }

    const handleSaveJson = async () => {
        try {
            const json = config.current.getJson();
            await salvaJSON(id, json);
            alert("JSON salvato con successo!");
        } catch (error) {
            console.error("Errore durante il salvataggio del JSON:", error);
            alert("Errore durante il salvataggio del JSON.");
        }
    }

    const handleSaveOrder = async () => {
        try {
            const updatedOrder = calendario.current.map((g, i) => {return {id: g.id, order: i+1}});
            await salvaOrdineGiornate(updatedOrder);
            alert("Ordine salvato con successo!");
        } catch (error) {
            console.error("Errore durante il salvataggio dell'ordine:", error);
            alert("Errore durante il salvataggio dell'ordine.");
        }
    };

    return (
        <>
            <div className="row g-2">
                <div className="col-3">
                    <div className="card card-body shadow p-2">
                        <h5 className="sora">Giornate</h5>
                        <div style={{maxHeight:  750}} className="overflow-auto">
                            {calendario.current.map((g, i) => (
                                <Fragment key={"a" + i}>

                                    {!config.current.usePartite && <div
                                        className="row g-0 mb-2 p-1 rounded"
                                        key={g.id}
                                        draggable={!g.assigned}
                                        onDragStart={() => handleDragStart(g.id)}
                                        style={getRowStyle(g)}
                                    >
                                        <div className="col-2"> {g.id} </div>
                                        <div className="col-8"> {g.nome} </div>
                                    </div>}
                                    {config.current.usePartite && <div className="row g-0 mb-2">
                                        <div className="col-2"> {g.id} </div>
                                        <div className="col-8"> {g.nome} </div>
                                    </div>}

                                    {config.current.usePartite && g.partite.map((p: any, j: number) => (
                                        <div
                                            className="row g-0 mb-2 p-1 rounded"
                                            key={p.id}
                                            draggable={!p.assigned}
                                            onDragStart={() => handleDragStart(p.id)}
                                            style={getRowStyle(p)}
                                        >
                                            <div className="col-1"></div>
                                            <div className="col-2"> {p.id} </div>
                                            <div className="col-7">
                                                {p.abbrSquadra1} - {p.abbrSquadra2}
                                            </div>
                                        </div>
                                    ))}
                                </Fragment>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="col-6">
                    <div className="card card-body p-2 shadow mb-2">
                        <h5 className="sora">Seleziona configurazione</h5>
                        <div className="dropdown">
                            <button
                                className="btn btn-warning dropdown-toggle"
                                type="button"
                                id="configDropdown"
                                data-bs-toggle="dropdown"
                                aria-expanded="false"
                            >
                                Configurazione &nbsp;&nbsp;
                            </button>
                            <ul className="dropdown-menu" aria-labelledby="configDropdown">
                                <li>
                                    <button
                                        className="dropdown-item"
                                        onClick={() => {
                                            config.current = new PlayOffA1();
                                            forceRender(n => n + 1);
                                        }}
                                    >
                                        PlayOff A1
                                    </button>
                                </li>
                                <li>
                                    <button
                                        className="dropdown-item"
                                        onClick={() => {
                                            config.current = new Supercoppa();
                                            forceRender(n => n + 1);
                                        }}
                                    >
                                        Supercoppa
                                    </button>
                                </li>
                            </ul>
                        </div>
                    </div>

                    <div className="card card-body p-2 shadow">
                        {config.current.fields.map((f, i) => (
                            <div className="w-100 mb-2" key={"c" + i}>
                                <h6 className="sora">{f.name}</h6>
                                <div className="row g-1">
                                    {f.elems.map((el, j) => (
                                        <div className="col-3" key={j}>
                                            <div
                                                className={"p-2 pb-1 border rounded text-center" + (el.full() ? " border-2 border-success" : "")}
                                                onDragOver={(e) => e.preventDefault()}
                                                onDrop={() => handleDrop(el.id)}
                                                style={{ minHeight: 50 }}
                                            >
                                                {el.current.map((e, k) => (
                                                    <div className="alert p-2 py-1 m-0 mb-1 d-inline-block alert-secondary sora" key={k} style={{ width: "100%", fontSize: "0.8rem", lineHeight: "0.8em" }}>
                                                        <div className="d-flex flex-row align-items-center">
                                                            <div className="me-1">{e}</div>
                                                            <div className="flex-grow-1">{getNameFromID(e)}</div>
                                                            <i className="bi bi-trash fs-5 c-pointer" onClick={() => { alert("elimina")}}></i>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="card card-body p-2 shadow mt-2">
                        <h5 className="sora">Anteprima JSON</h5>
                        <textarea
                            readOnly
                            className="form-control"
                            style={{height: "200px", overflow: "auto" }}
                            value={JSON.stringify(config.current.getJson(), null, 2)}
                        ></textarea>
                        <div className="text-end">
                            <button className="btn btn-warning mt-2" onClick={handleSaveJson}>
                                Salva JSON
                            </button>
                        </div>
                    </div>
                </div>

                <div className="col-3">
                    <div className="card card-body p-2 shadow">
                        <h5 className="sora">
                            Ordine giornate
                        </h5>

                        <div style={{ maxHeight: 700 }} className="overflow-auto">
                            {calendario.current.map((g, index) => (
                                <div
                                    key={g.id}
                                    className="p-2 mb-2 border rounded bg-light"
                                    draggable
                                    onDragStart={() => setDraggedId(g.id)}
                                    onDragOver={(e) => e.preventDefault()}
                                    onDrop={() => {
                                        if (draggedId === null || draggedId === g.id) return;
                                        const draggedIndex = calendario.current.findIndex(x => x.id === draggedId);
                                        const targetIndex = calendario.current.findIndex(x => x.id === g.id);
                                        const moved = calendario.current.splice(draggedIndex, 1)[0];
                                        calendario.current.splice(targetIndex, 0, moved);
                                        forceRender(n => n + 1);
                                        setDraggedId(null);
                                    }}
                                    style={{ cursor: "move" }}
                                >
                                    {g.nome} (ID: {g.id})
                                </div>
                            ))}
                        </div>
                        
                        <div className="text-end">
                            <button className="btn btn-warning mt-2" onClick={handleSaveOrder}>
                                Salva ordine
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
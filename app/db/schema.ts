import { pgTable, serial, integer, varchar, smallint, timestamp, boolean, text, date, pgView, pgSequence, json } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"
import { forbidden } from "next/navigation";
import { isGelSchema } from "drizzle-orm/gel-core";


export const societaIdSeq = pgSequence("societa_id_seq", {  startWith: "1", increment: "1", minValue: "1", maxValue: "2147483647", cache: "1", cycle: false })
export const squadraIdSeq = pgSequence("squadra_id_seq", {  startWith: "1", increment: "1", minValue: "1", maxValue: "2147483647", cache: "1", cycle: false })

export const stagione = pgTable("stagione", {
	id: serial().primaryKey().notNull(),
	anno: integer().notNull(),
	stagione: varchar({ length: 10 }).notNull(),
	idFisr: smallint("id_fisr").notNull(),
});

export const designazione = pgTable("designazione", {
	id: serial().primaryKey().notNull(),
	fkPartita: integer("fk_partita").notNull(),
	arbitro: varchar({ length: 50 }).notNull(),
});

export const mapSquadraFisr = pgTable("map_squadra_fisr", {
	idFisr: integer("id_fisr").notNull(),
	idSquadra: integer("id_squadra").notNull(),
});

export const partita = pgTable("partita", {
	id: serial().primaryKey().notNull(),
	idFisr: integer("id_fisr").notNull(),
	data: timestamp({ mode: 'string' }),
	risultato: varchar({ length: 10 }).notNull(),
	fkSquadra1: integer("fk_squadra_1").notNull(),
	fkSquadra2: integer("fk_squadra_2").notNull(),
	fkGiornata: integer("fk_giornata").notNull(),
	urlLive: varchar("url_live", { length: 250 }),
	urlHighlights: varchar("url_highlights", { length: 250 }),
	show: boolean().default(true).notNull(),
});

export const sessions = pgTable("sessions", {
	key: varchar().notNull(),
	execution: timestamp({ mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	total: integer(),
	ok: integer(),
	ko: integer(),
	errors: text(),
});

export const squadra = pgTable("squadra", {
	id: integer().default(sql`nextval('squadra_id_seq'::regclass)`).primaryKey().notNull(),
	nomeFisr: varchar("nome_fisr", { length: 100 }).notNull(),
	abbrFisr: varchar("abbr_fisr", { length: 10 }),
	full: varchar({ length: 100 }),
	short: varchar({ length: 50 }),
	abbr: varchar({ length: 10 }),
	logo: varchar({ length: 50 }),
	show: boolean().default(true).notNull(),
	fkLeague: integer("fk_league"),
	fkSocieta: integer("fk_societa"),
	fkStagione: integer("fk_stagione"),
});

export const league = pgTable("league", {
	id: serial().primaryKey().notNull(),
	nome: varchar({ length: 25 }).notNull(),
	logo: varchar({ length: 200 }),
	abbr: varchar({ length: 5 }),
	stato: varchar({ length: 5 }),
	order: integer().default(1).notNull(),
});

export const campionato = pgTable("campionato", {
	id: serial().primaryKey().notNull(),
	nomeFisr: varchar("nome_fisr", { length: 50 }).notNull(),
	nome: varchar({ length: 50 }),
	show: boolean().default(true).notNull(),
	fkTipoCamp: integer("fk_tipo_camp"),
	fkLeague: integer("fk_league"),
	fkStagione: integer("fk_stagione"),
	idcFisr: integer("idc_fisr").notNull(),
	fkMainCampionato: integer("fk_main_campionato"),
	order: integer().default(0).notNull(),
	config: json("config"),
});

export const partitaJson = pgTable("partita_json", {
	fkPartita: integer("fk_partita").notNull(),
	fkCampionato: integer("fk_campionato").notNull(),
	last: timestamp({ mode: 'string' }).notNull(),
	times: integer().default(1).notNull(),
});

export const giornata = pgTable("giornata", {
	id: serial().primaryKey().notNull(),
	nomeFisr: varchar("nome_fisr", { length: 50 }).notNull(),
	nome: varchar({ length: 50 }),
	show: boolean().default(true).notNull(),
	fkCampionato: integer("fk_campionato").notNull(),
});

export const giocatore = pgTable("giocatore", {
	id: serial().primaryKey().notNull(),
	idFisr: integer("id_fisr").notNull(),
	nome: varchar({ length: 100 }).notNull(),
	cognome: varchar({ length: 100 }).notNull(),
	dataNascita: date("data_nascita").notNull(),
	show: boolean().notNull(),
	fkSocieta: integer("fk_societa").notNull(),
});

export const tipoCampionato = pgTable("tipo_campionato", {
	id: serial().primaryKey().notNull(),
	nome: varchar({ length: 50 }).notNull(),
});

export const partecipazione = pgTable("partecipazione", {
	id: serial().primaryKey().notNull(),
	fkPartita: integer("fk_partita").notNull(),
	fkSquadra: integer("fk_squadra").notNull(),
	fkGiocatore: integer("fk_giocatore").notNull(),
	titolare: boolean(),
	gol: integer(),
	assist: integer(),
	rigoriTirati: integer("rigori_tirati"),
	rigoriSegnati: integer("rigori_segnati"),
	direttiTirati: integer("diretti_tirati"),
	direttiSegnati: integer("diretti_segnati"),
	blu: integer(),
	rosso: integer(),
	show: boolean().default(true).notNull(),
});

export const societa = pgTable("societa", {
	id: integer().default(sql`nextval('societa_id_seq'::regclass)`).primaryKey().notNull(),
	idFisr: integer("id_fisr").notNull(),
	nome: varchar({ length: 100 }).notNull(),
	logo: varchar({ length: 250 }).notNull(),
	citta: varchar({ length: 100 }).notNull(),
	pista: varchar({ length: 200 }).notNull(),
	sito: varchar({ length: 250 }).notNull(),
	fb: varchar({ length: 250 }).notNull(),
	ig: varchar({ length: 250 }).notNull(),
	wiki: varchar({ length: 250 }).notNull(),
});

export const viewListaCampionati = pgView("view_lista_campionati", {	leagueId: integer("league_id"),
	league: varchar({ length: 25 }),
	logo: varchar({ length: 200 }),
	campId: integer("camp_id"),
	stagioneId: integer("stagione_id"),
	campionato: varchar({ length: 50 }),
}).as(sql`SELECT l.id AS league_id, l.nome AS league, l.logo, c.id AS camp_id, c.fk_stagione AS stagione_id, CASE WHEN c.nome IS NOT NULL THEN c.nome ELSE c.nome_fisr END AS campionato FROM league l JOIN campionato c ON l.id = c.fk_league`);
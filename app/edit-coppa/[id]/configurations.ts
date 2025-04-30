export abstract class Configuration {
    levels: LevelDetail[] = [];
    usePartite: boolean = false;
    fields: LevelElement[] = [];
    type: string = "";

    constructor() { }

    init() {
        this.levels.sort((a, b) => a.order - b.order);
        this.fields = this.levels.map((level, i) => {
            return {
                name: level.name,
                elems: Array.from({ length: level.num }, (_, j) => new SingleElement(`${level.name}-${j}`, level.max))
            }
        });
    }

    getElemById = (id: string): SingleElement | null => {
        for (const field of this.fields) {
            const element = field.elems.find((elem) => elem.id === id);
            if (element) {
                return element;
            }
        }
        return null;
    }

    getJson(): Object {
        const result: any = {};
        result["type"] = this.type;

        this.fields.forEach((field) => {
            let childs = field.elems.map((el) => {
                if(el.current.length == 0) 
                    return null;
                if (el.current.length == 1) {
                    return el.current[0];
                }
                return el.current;
            });
            if(childs.every((el) => el === null)) {
                result[field.name] = null;
            }
            else if (childs.length == 1) {
                result[field.name] = childs[0];
            }
            else {
                result[field.name] = childs.filter((el) => el !== null);
            }
        });

        return result;
    };
}

interface LevelDetail {
    name: string;
    num: number;
    order: number;
    max: number;
}

interface LevelElement {
    name: string;
    elems: SingleElement[];
}

class SingleElement {
    id: string;
    current: number[];
    max: number;

    constructor(id: string, max: number) {
        this.id = id;
        this.max = max;
        this.current = [];
    }

    full() { return this.current.length >= this.max; }
}

export class EmptyConfig extends Configuration {}

export class PlayOffA1 extends Configuration {
    constructor() {
        super();
        this.levels = [
            { name: "finale", num: 1, order: 1, max: 5 },
            { name: "semifinale", num: 2, order: 2, max: 5 },
            { name: "quarti", num: 4, order: 3, max: 3 },
            { name: "preliminari", num: 2, order: 4, max: 2 },
        ];
        this.type = "playoff_a1"
        this.usePartite = true;
        this.init();
    }
}

export class Supercoppa extends Configuration {
    constructor() {
        super();
        this.levels = [
            { name: "andata", num: 1, order: 1, max: 1 },
            { name: "ritorno", num: 1, order: 2, max: 1 },
        ];
        this.type = "supercoppa";
        this.init();
    }
}
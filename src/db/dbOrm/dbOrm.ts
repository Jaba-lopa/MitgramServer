import { Client } from 'pg';

// const ConumlTypes = {
//     "string": "TEXT",
//     "number": "INTEGER",
//     "json": "JSON",
//     "jsonb": "JSONB",
// }
// export class DBUtils {
//     returnColumnType () {

//     }
// }

class DBActions {
    private db: Client;
    private table: string;

    constructor(db: Client, table: string) {
        this.db = db;
        this.table = table;
    }
    // Utils
    private getConditionsString (conditions: {}) {
        let conditionsString = '';
        const parameters = Object.keys(conditions);
        for (let i = 0; i < parameters.length; i++) {
            conditionsString = conditionsString + `${parameters[i]}='${conditions[parameters[i]]}'`;
            if (parameters[i+1]) conditionsString = conditionsString + ' AND '
        }
        return conditionsString;
    }

    private getValuesString(values: {}) {
        let valuesString = '';
        const parameters = Object.keys(values);
        for (let i = 0; i < parameters.length; i++) {
            valuesString = valuesString + `SET ${parameters[i]} = $${i+1}`;
            if (parameters[i+1]) valuesString = valuesString + ' , '
        }
        return valuesString;
    }

    // Utils ^^^
    async getRow<T>(conditions: {}): Promise<T> {
        const conditionsString = this.getConditionsString(conditions);
        const row = await (await this.db.query(`SELECT * FROM ${this.table} ${conditionsString ? `WHERE ${conditionsString}` : ''}`)).rows[0];
        return row;
    }

    async getRowsLimit(offset: number = 0, limit: number = 0) {
        const rows = await (await this.db.query(`SELECT * FROM ${this.table} OFFSET ${offset} LIMIT ${limit}`)).rows;
        return rows;
    }

    async getRows(conditions: {} = {}) {
        const conditionsString = this.getConditionsString(conditions);
        const rows = await (await this.db.query(`SELECT * FROM ${this.table} ${conditionsString ? `WHERE ${conditionsString}` : ''}`)).rows;
        return rows;
    }

    async addRow<T>(values: T[]) {
        const fieldsString = values.map((value, index) => `$${index+1}`).join(',');
        const row = await (await this.db.query(`INSERT INTO ${this.table} VALUES(${fieldsString}) RETURNING *`, values)).rows[0];
        return row;
    }

    async removeRow(conditions: {} = {}) {
        let conditionsString = this.getConditionsString(conditions);
        if (conditionsString) {
            const row = await (await this.db.query(`DELETE FROM ${this.table} * WHERE ${conditionsString} RETURNING *`)).rows[0];
            return row;
        }
        return null;
    }

    async updateRow(values: {} ,conditions: {}) {
        const conditionsString = this.getConditionsString(conditions);
        const valuesString = this.getValuesString(values);
        let arrayValues = Object.values(values);
        //
        if (Array.isArray(arrayValues[0])) arrayValues[0] = `[${arrayValues[0]}]`
        const row = await (await this.db.query(`UPDATE ${this.table} ${valuesString} WHERE ${conditionsString} RETURNING *`, arrayValues)).rows[0];
        return row;
    }
}

export default class DBOrm {
    private db: Client;

    constructor(db: any) {
        this.db = db;
    }

    in(table: string) {
        return new DBActions(this.db, table)
    }
}
import mongoose from 'mongoose';

export interface SchemaOptions {
    name: string,
    model: mongoose.SchemaDefinition
}

export class Database {
    private schemas: Map<string, Schema> = new Map();

    constructor(...schemas: Schema[]) {
        for (const schema of schemas) {
            this.schemas.set(schema.name, schema);
        }
    }

    public async connect(uri: string): Promise<typeof mongoose> {
        return mongoose.connect(uri, { keepAlive: true });
    }

    public get(name: string): Schema | undefined {
        return this.schemas.get(name);
    }
}

export class Schema {
    public readonly name: string;
    public readonly model: mongoose.Model<any>;

    constructor(options: SchemaOptions) {
        this.name = options.name;
        this.model = mongoose.model(options.name, new mongoose.Schema(options.model));
    }
}
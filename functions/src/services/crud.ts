import { adminApp } from "../admin";
import { CollectionNames } from "../types/collections";
import ICrud from "../types/crud";

export class AdminCrud<T> implements ICrud<T> {

    constructor(public collection: CollectionNames, public sub?: { doc: string, collection: CollectionNames }) { }

    async GetOne(id: string): Promise<T | undefined> {
        let itemDoc = adminApp
            .firestore()
            .collection(this.collection);

        if (this.sub) {
            itemDoc = itemDoc.doc(this.sub.doc).collection(this.sub.collection);
        }

        const doc = await itemDoc.doc(id).get();

        if (!doc.exists) return undefined;

        return doc.data() as T;
    }

    async GetAll({
        order,
        limit: L,
    }: { order?: { name: string; desc: boolean }; limit?: number } = {}): Promise<
        T[]
    > {
        if (!order && !L) {
            let itemDocs = adminApp
                .firestore()
                .collection(this.collection);

            if (this.sub) {
                itemDocs = itemDocs.doc(this.sub.doc).collection(this.sub.collection);
            }

            const docsReq = await itemDocs.get()

            return docsReq.docs.map((doc) => ({ id: doc.id, ...(doc.data() as T) }));
        }
        let connection:
            | FirebaseFirestore.Query<FirebaseFirestore.DocumentData>
            | FirebaseFirestore.CollectionReference<FirebaseFirestore.DocumentData> =
            adminApp.firestore().collection(this.collection);

        if (this.sub) {
            connection = (connection as FirebaseFirestore.CollectionReference<FirebaseFirestore.DocumentData>).doc(this.sub.doc).collection(this.sub.collection);
        }

        if (order) {
            connection = connection.orderBy(order.name, order.desc ? "desc" : "asc");
        }
        if (L) {
            connection = connection.limit(L);
        }

        const itemDocs = await connection.get();

        return itemDocs.docs.map((doc) => ({ id: doc.id, ...(doc.data() as T) }));
    }

    async Create(data: T, id?: string): Promise<T> {
        let collection = adminApp
            .firestore()
            .collection(this.collection)

        if (this.sub) {
            collection = collection.doc(this.sub.doc).collection(this.sub.collection);
        }

        if (id) {
            await collection
                .doc(id)
                .create(data as never)
        } else {
            await collection
                .add(data as never);
        }

        return data;
    }

    async Update(data: Partial<T> & { id: string }): Promise<Partial<T>> {
        let col = adminApp
            .firestore()
            .collection(this.collection);

        if (this.sub) {
            col = col.doc(this.sub.doc).collection(this.sub.collection);
        }

        await col
            .doc(data.id)
            .update(data);

        return data;
    }

    async Delete(id: string): Promise<boolean> {
        let col = adminApp.firestore().collection(this.collection);

        if (this.sub) {
            col = col.doc(this.sub.doc).collection(this.sub.collection);
        }
        
        await col.doc(id).delete();

        return true;
    }
}

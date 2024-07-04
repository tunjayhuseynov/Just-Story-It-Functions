export default interface ICrud<T> {
    // collection: string;
    GetOne: (id: string) => Promise<T | undefined>;
    // GetAll: ({
    //   limit,
    //   order,
    // }: {
    //   order?: { name: string; desc: boolean };
    //   limit?: number;
    // }) => Promise<T[]>;
    Create: (data: T) => Promise<T>;
    Update: (data: Partial<T> & { id: string }) => Promise<Partial<T>>;
    Delete: (id: string) => Promise<boolean>;
}

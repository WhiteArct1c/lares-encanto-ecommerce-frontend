export type ResponseAPI<T> = {
    code: string,
    message: string,
    data: T[]
}
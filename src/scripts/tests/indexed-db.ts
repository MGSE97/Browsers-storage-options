import { Test, TestStatus } from "../const"

// @ts-ignore - TS doesn't know about specific implementations
export const indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB

export const openDb = async (test: Test, name: string, schema: (db: IDBDatabase) => void) => new Promise<IDBDatabase>((resolve, reject) => {
    if(indexedDB  
        && typeof indexedDB.open === 'function'
        && typeof indexedDB.deleteDatabase === 'function')
    {
        try {
            const request = indexedDB.open(name)
            
            request.onupgradeneeded = async () => {
                if(!request.result) 
                {
                    test.details.unshift(`Database ${name} opened without IDBDatabase object`)
                    reject()
                    return
                }

                test.details.unshift(`Creating database ${name} schema...`)
                await schema(request.result)
            }

            request.onerror = () => {
                test.details.unshift(`Failed to open database ${name}<br/>${request.error?.message}`)
                reject()
            }
            
            request.onsuccess = () => {
                if(!request.result) 
                {
                    test.details.unshift(`Database ${name} opened without IDBDatabase object`)
                    reject()
                    return
                }

                resolve(request.result)
            }
        }
        catch(ex) {
            test.details.unshift(`Failed to open database ${name}<br/>${(ex as Error)?.message}`)
            reject()
        }
        return
    }

    test.details.unshift('IndexedDB is not available')
    reject()
}).catch(() => undefined)

export const dropDb = async (test: Test, name: string, db: IDBDatabase) => new Promise<void>((resolve, reject) => {
    if(db)
    {
        try {
            db.close()
            test.details.unshift(`Closed database ${name}`)
        }
        catch(ex) {
            test.details.unshift(`Failed to close database ${name}<br/>${(ex as Error)?.message}`)
            reject()
        }
    }

    if(indexedDB  
        && typeof indexedDB.deleteDatabase === 'function')
    {
        try {
            const request = indexedDB.deleteDatabase(name)
            
            request.onerror = () => {
                test.details.unshift(`Failed to delete database ${name}<br/>${request.error?.message}`)
                reject()
            }
            
            request.onsuccess = (event: any) => {
                if(event.result) {
                    test.details.unshift(`Database ${name} was deleted, but result has value: ${event.result}`)
                    reject()
                    return
                }

                test.details.unshift(`Database ${name} deleted`)
                resolve()
            }
        }
        catch(ex) {
            test.details.unshift(`Failed to delete database ${name}<br/>${(ex as Error)?.message}`)
            reject()
        }
        return
    }

    test.details.unshift('IndexedDB deleteDatabase is not available')
    reject()
}).then(() => true).catch(() => false)

export const createTransaction = async (test: Test, db: IDBDatabase, name: string) => new Promise<IDBTransaction>((resolve, reject) => {
    if(db && typeof db.transaction === 'function')
    {
        try {
            const transaction = db.transaction(name, 'readwrite')
            test.details.unshift(`Transaction for store ${name} created`)
            resolve(transaction)
        }
        catch(ex) {
            test.details.unshift(`Failed to create transaction for store ${name}<br/>${(ex as Error)?.message}`)
            reject()
        }
        return
    }

    test.details.unshift('IndexedDB transaction is not available')
    reject()
}).catch(() => undefined)

export const waitForTransaction = async (test: Test, trx: IDBTransaction) => new Promise<void>((resolve, reject) => {
    trx.oncomplete = () => {
        test.details.unshift(`Transaction comitted`)
        resolve()
    }
    
    trx.onabort = () => {
        test.details.unshift(`Transaction aborted`)
        reject()
    }

    trx.onerror = () => {
        test.details.unshift(`Transaction error: ${trx.error?.message}`)
        reject()
    }
}).then(() => true).catch(() => false)

export const createStore = async (test: Test, db: IDBDatabase, name: string) => new Promise<IDBObjectStore>((resolve, reject) => {
    if(db && typeof db.createObjectStore === 'function')
    {
        try {
            const store = db.createObjectStore(name)
            test.details.unshift(`Store ${name} created`)
            resolve(store)
        }
        catch(ex) {
            test.details.unshift(`Failed to create store ${name}<br/>${(ex as Error)?.message}`)
            reject()
        }
        return
    }

    test.details.unshift('IndexedDB createObjectStore is not available')
    reject()
}).catch(() => undefined)

export const openStore = async (test: Test, trx: IDBTransaction, name: string) => new Promise<IDBObjectStore>((resolve, reject) => {
    if(trx && typeof trx.objectStore === 'function')
    {
        try {
            const store = trx.objectStore(name)
            test.details.unshift(`Store ${name} opened`)
            resolve(store)
        }
        catch(ex) {
            test.details.unshift(`Failed to open store ${name}<br/>${(ex as Error)?.message}`)
            reject()
        }
        return
    }

    test.details.unshift('IndexedDB objectStore is not available')
    reject()
}).catch(() => undefined)

export const writeToStore = async <T>(test: Test, store: IDBObjectStore, key: IDBValidKey | undefined, value: T) => new Promise<void>((resolve, reject) => {
    if(store && typeof store.put === 'function')
    {
        try {
            store.put(value, key)
            test.details.unshift(`Pair ${key}: ${value} written to store ${store.name}`)
            resolve()
        }
        catch(ex) {
            test.details.unshift(`Failed to write pair ${key}: ${value} to store ${store.name}<br/>${(ex as Error)?.message}`)
            reject()
        }
        return
    }

    test.details.unshift('IndexedDB put is not available')
    reject()
}).then(() => true).catch(() => false)



export const readFromStore = async <T>(test: Test, store: IDBObjectStore, key: IDBValidKey) => new Promise<T>((resolve, reject) => {
    if(store && typeof store.get === 'function')
    {
        try {
            const request = store.get(key)
            request.onsuccess = () => {
                if(request.result) {
                    test.details.unshift(`Pair ${key}: ${request.result} read from store ${store.name}`)
                    resolve(request.result)
                }
                else {
                    test.details.unshift(`Failed to read ${key} from store ${store.name}, result is falsy`)
                    reject()
                }
            }
            request.onerror = () => {
                test.details.unshift(`Failed to read ${key} from store ${store.name}<br/>${request.error?.message}`)
                reject()
            }
        }
        catch(ex) {
            test.details.unshift(`Failed to read ${key} from store ${store.name}<br/>${(ex as Error)?.message}`)
            reject()
        }
        return
    }

    test.details.unshift('IndexedDB put is not available')
    reject()
}).catch(() => false)
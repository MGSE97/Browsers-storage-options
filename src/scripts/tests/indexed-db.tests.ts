import { Test, TestStatus } from "../const"
import { createTransaction, openDb, dropDb, createStore, waitForTransaction, openStore, writeToStore, readFromStore } from './indexed-db';

const availabilityTest = new Test({
    id: 'idb-availability',
    name: 'Available',
    result: TestStatus.Running,
    details: ['Checking availability...'],
    desc: 'Checks if IndexedDB is available to be used.',
    test: (test) => new Promise<void>((resolve, reject) => {
        if(indexedDB  
            && typeof indexedDB.open === 'function'
            && typeof indexedDB.deleteDatabase === 'function')
        {
            test.details.unshift('Available')
            resolve()
        }
        else
        {
            test.details.unshift('Not available')
            reject()
        }
    })
})



const openDbTest = new Test({
    id: 'idb-open',
    name: 'Open database',
    result: TestStatus.Running,
    details: ['Opening database...'],
    desc: 'Tries to open a new database.',
    test: (test) => new Promise<void>(async (resolve, reject) => {
        const name = 'test-idb-open'
        const schema = (idb: IDBDatabase) => idb;
        const db = await openDb(test, name, schema)
        if(db)
        {
            test.details.unshift('Opened database')
            if(await dropDb(test, name, db))
            {
                test.details.unshift('Successfully opened database')
                resolve()
                return
            }
        }

        test.details.unshift('Failed to open database')
        reject()
    })
})

const writeTest = new Test({
    id: 'idb-write',
    name: 'Write to object store',
    result: TestStatus.Running,
    details: ['Writing to object store...'],
    desc: 'Tries to write to an object store.',
    test: (test) => new Promise<void>(async (resolve, reject) => {
        const names = {
            db: 'test.idb-write',
            store: 'test.idb-write.store'
        } 
        const schema = (idb: IDBDatabase) => {
            const store = createStore(test, idb, names.store)
            test.details.unshift('Created database schema')
        };

        const db = await openDb(test, names.db, schema)
        if(db)
        {
            test.details.unshift(`Opened database ${names.db}`)

            let testStatus = false
            const trx = await createTransaction(test, db, names.store)
            if(trx)
            {
                const trxWait = waitForTransaction(test, trx)
                test.details.unshift('Created write transaction')

                const store = await openStore(test, trx, names.store)
                if(store)
                {
                    if(await writeToStore(test, store, "key", "value"))
                    {
                        trx.commit()
                    }
                    else
                    {
                        trx.abort()
                    }
                }
                else
                {
                    trx.abort()
                }
                
                if(await trxWait)
                {
                    // Success
                    testStatus = true
                }
                else
                {
                    // Failure
                    testStatus = false
                }
            }

            if(await dropDb(test, names.db, db) && testStatus)
            {
                test.details.unshift('Successfully written to object store')
                resolve()
                return
            }
        }

        test.details.unshift('Failed to write into object store')
        reject()
    })
})

const readTest = new Test({
    id: 'idb-read',
    name: 'Read from object store',
    result: TestStatus.Running,
    details: ['Reading from object store...'],
    desc: 'Tries to read from object store.',
    test: (test) => new Promise<void>(async (resolve, reject) => {
        const names = {
            db: 'test.idb-read',
            store: 'test.idb-read.store'
        } 
        const schema = (idb: IDBDatabase) => {
            const store = createStore(test, idb, names.store)
            test.details.unshift('Created database schema')
        };
        const data = {
            key: 'key',
            value: 'value'
        }

        const db = await openDb(test, names.db, schema)
        if(db)
        {
            test.details.unshift(`Opened database ${names.db}`)

            let testStatus = false
            let trx = await createTransaction(test, db, names.store)
            if(trx)
            {
                // Write data to store
                const trxWait = waitForTransaction(test, trx)
                test.details.unshift('Created write transaction')

                const store = await openStore(test, trx, names.store)
                if(store)
                {
                    if(await writeToStore(test, store, data.key, data.value))
                    {
                        trx.commit()
                    }
                    else
                    {
                        trx.abort()
                    }
                }
                else
                {
                    trx.abort()
                }
                
                if(await trxWait)
                {
                    // Success
                    testStatus = true
                }
                else
                {
                    // Failure
                    testStatus = false
                }
            }

            if(testStatus)
            {
                // Read data from store
                // Transaction is required
                let trx = await createTransaction(test, db, names.store)
                if(trx)
                {
                    const trxWait = waitForTransaction(test, trx)
                    test.details.unshift('Created read transaction')

                    const store = await openStore(test, trx, names.store)
                    if(store)
                    {
                        const value = await readFromStore<string>(test, store, data.key)
                        if(value)
                        {
                            if(value === data.value)
                            {
                                trx.commit()
                            }
                            else
                            {

                                test.details.unshift('Read value is different')
                                trx.abort()
                            }
                        }
                        else
                        {
                            test.details.unshift('Read value is null')
                            trx.abort()
                        }
                    }
                    else
                    {
                        trx.abort()
                    }

                    if(await trxWait)
                    {
                        // Success
                        testStatus = true
                    }
                    else
                    {
                        // Failure
                        testStatus = false
                    }
                }
            }

            if(await dropDb(test, names.db, db) && testStatus)
            {
                test.details.unshift('Successfully read from object store')
                resolve()
                return
            }
        }

        test.details.unshift('Failed to write into object store')
        reject()
    })
})


export const indexedDBTests = [
    availabilityTest,
    openDbTest,
    writeTest,
    readTest
]
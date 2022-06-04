import { Test, TestStatus } from '../const'

const sessionStorage = window.sessionStorage

const availabilityTest = new Test({
    id: 'ss-availability',
    name: 'Available',
    result: TestStatus.Running,
    details: ['Checking availability...'],
    desc: 'Checks if session storage is available to be used.',
    test: (test) => new Promise<void>((resolve, reject) => {
        if(sessionStorage 
            && typeof sessionStorage.getItem === 'function' 
            && typeof sessionStorage.setItem === 'function') 
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

const setTest = new Test({
    id: 'ss-set',
    name: 'Set value',
    result: TestStatus.Running,
    details: ['Setting value...'],
    desc: 'Tries to set a value into session storage.',
    test: (test) => new Promise<void>((resolve, reject) => {
        if(sessionStorage
            && typeof sessionStorage.setItem === 'function'
            && typeof sessionStorage.removeItem === 'function')
        {
            try {
                sessionStorage.setItem('test.ss-set', 'test')
                test.details.unshift('Successfully set value')

                sessionStorage.removeItem('test.ss-set')
                
                resolve()
            }
            catch(ex) {
                test.details.unshift(`Failed to set value<br/>${(ex as Error)?.message}`)
                reject()
            }
            return;
        }

        test.details.unshift('Session Storage is not available')
        reject()
    }),
})

const getTest = new Test({
    id: 'ss-get',
    name: 'Get value',
    result: TestStatus.Running,
    details: ['Getting value...'],
    desc: 'Tries to get a value from session storage.',
    test: (test) => new Promise<void>((resolve, reject) => {
        if(sessionStorage
           && typeof sessionStorage.setItem === 'function'
           && typeof sessionStorage.getItem === 'function'
           && typeof sessionStorage.removeItem === 'function')
        {
            const key = "test.ss-get"
            const value = "test"
            try {
                sessionStorage.setItem(key, value)
                test.details.unshift('Successfully set value')
            }
            catch(ex) {
                test.details.unshift(`Failed to set value<br/>${(ex as Error)?.message}`)
                reject()
                return;
            }

            try {
                const result = sessionStorage.getItem(key)
                sessionStorage.removeItem(key)

                if(!result)
                {
                    test.details.unshift('Failed to get value')
                }
                else if(result === value)
                {
                    test.details.unshift('Successfully got value')
                    resolve()
                }
                else
                {
                    test.details.unshift('Value has changed')
                }

                reject()
                return;
            }
            catch(ex) {
                test.details.unshift(`Failed to get value<br/>${(ex as Error)?.message}`)
                reject()
                return;
            }
        }

        test.details.unshift('Session Storage is not available')
        reject()
    }),
})

export const sessionStorageTests = [
    availabilityTest,
    setTest,
    getTest
]
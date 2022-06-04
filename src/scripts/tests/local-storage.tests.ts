import { Test, TestStatus } from '../const'

const localStorage = window.localStorage

const availabilityTest = new Test({
    id: 'ls-availability',
    name: 'Available',
    result: TestStatus.Running,
    details: ['Checking availability...'],
    desc: 'Checks if local storage is available to be used.',
    test: (test) => new Promise<void>((resolve, reject) => {
        if(localStorage 
            && typeof localStorage.getItem === 'function' 
            && typeof localStorage.setItem === 'function') 
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
    id: 'ls-set',
    name: 'Set value',
    result: TestStatus.Running,
    details: ['Setting value...'],
    desc: 'Tries to set a value into local storage.',
    test: (test) => new Promise<void>((resolve, reject) => {
        if(localStorage 
            && typeof localStorage.setItem === 'function'
            && typeof localStorage.removeItem === 'function')
        {
            try {
                localStorage.setItem('test.ls-set', 'test')
                test.details.unshift('Successfully set value')

                localStorage.removeItem('test.ls-set')
                resolve()
            }
            catch(ex) {
                test.details.unshift(`Failed to set value<br/>${(ex as Error)?.message}`)
                reject()
            }
            return;
        }

        test.details.unshift('LocalStorage is not available')
        reject()
    }),
})

const getTest = new Test({
    id: 'ls-get',
    name: 'Get value',
    result: TestStatus.Running,
    details: ['Getting value...'],
    desc: 'Tries to get a value from local storage.',
    test: (test) => new Promise<void>((resolve, reject) => {
        if(localStorage
           && typeof localStorage.setItem === 'function'
           && typeof localStorage.getItem === 'function'
           && typeof localStorage.removeItem === 'function')
        {
            const key = "test.ls-get"
            const value = "test"
            try {
                localStorage.setItem(key, value)
                test.details.unshift('Successfully set value')
            }
            catch(ex) {
                test.details.unshift(`Failed to set value<br/>${(ex as Error)?.message}`)
                reject()
                return;
            }

            try {
                const result = localStorage.getItem(key)
                localStorage.removeItem(key)
                
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

        test.details.unshift('Local Storage is not available')
        reject()
    }),
})

export const localStorageTests = [
    availabilityTest,
    setTest,
    getTest
]
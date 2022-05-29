import { Test, TestStatus } from '../const'

const localStorage = window.localStorage

const availabilityTest = new Test({
    id: 'ls-availability',
    name: 'Available',
    result: TestStatus.Running,
    details: 'Checking availability...',
    desc: 'Checks if local storage (window.localStorage) is available to be used.',
    test: (test) => new Promise<void>((resolve, reject) => {
        if(localStorage 
            && typeof localStorage.getItem === 'function' 
            && typeof localStorage.setItem === 'function') 
        {
            test.details = 'Available'
            test.result = TestStatus.Passed
            resolve()
        }
        else
        {
            test.details = 'Not available'
            test.result = TestStatus.Failed
            resolve()
        }
    })
})

const setTest = new Test({
    id: 'ls-set',
    name: 'Set value',
    result: TestStatus.Running,
    details: 'Setting value...',
    desc: 'Tries to set a value into local storage.',
    test: (test) => new Promise<void>((resolve, reject) => {
        if(localStorage 
            && typeof localStorage.setItem === 'function'
            && typeof localStorage.removeItem === 'function')
        {
            try {
                localStorage.setItem('test.ls-set', 'test')
                test.details = 'Successfully set value'
                test.result = TestStatus.Passed

                localStorage.removeItem('test.ls-set')
            }
            catch(ex) {
                test.details = `Failed to set value<br/>${(ex as Error)?.message}`
                test.result = TestStatus.Failed
            }
            resolve()
            return;
        }

        test.details = 'LocalStorage is not available'
        test.result = TestStatus.Failed
        resolve()
    }),
})

const getTest = new Test({
    id: 'ls-get',
    name: 'Get value',
    result: TestStatus.Running,
    details: 'Getting value...',
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
                test.details = 'Successfully set value'
            }
            catch(ex) {
                test.details = `Failed to set value<br/>${(ex as Error)?.message}`
                test.result = TestStatus.Failed
                resolve()
                return;
            }

            try {
                const result = localStorage.getItem(key)
                if(!result)
                {
                    test.details = 'Failed to get value'
                    test.result = TestStatus.Failed
                }
                else if(result === value)
                {
                    test.details = 'Successfully got value'
                    test.result = TestStatus.Passed
                }
                else {
                    test.details = 'Value has changed'
                    test.result = TestStatus.Failed
                }

                localStorage.removeItem(key)
                
                resolve()
                return;
            }
            catch(ex) {
                test.details = `Failed to get value<br/>${(ex as Error)?.message}`
                test.result = TestStatus.Failed
                resolve()
                return;
            }
        }

        test.details = 'Local Storage is not available'
        test.result = TestStatus.Failed
        resolve()
    }),
})

export const localStorageTests = [
    availabilityTest,
    setTest,
    getTest
]
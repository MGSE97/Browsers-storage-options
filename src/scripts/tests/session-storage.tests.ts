import { Test, TestStatus } from '../const'

const sessionStorage = window.sessionStorage

const availabilityTest = new Test({
    id: 'ss-availability',
    name: 'Available',
    result: TestStatus.Running,
    details: 'Checking availability...',
    desc: 'Checks if session storage (window.sessionStorage) is available to be used.',
    test: (test) => new Promise<void>((resolve, reject) => {
        if(sessionStorage 
            && typeof sessionStorage.getItem === 'function' 
            && typeof sessionStorage.setItem === 'function') 
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
    id: 'ss-set',
    name: 'Set value',
    result: TestStatus.Running,
    details: 'Setting value...',
    desc: 'Tries to set a value into session storage.',
    test: (test) => new Promise<void>((resolve, reject) => {
        if(sessionStorage
            && typeof sessionStorage.setItem === 'function'
            && typeof sessionStorage.removeItem === 'function')
        {
            try {
                sessionStorage.setItem('test.ss-set', 'test')
                test.details = 'Successfully set value'
                test.result = TestStatus.Passed

                sessionStorage.removeItem('test.ss-set')
            }
            catch(ex) {
                test.details = `Failed to set value<br/>${(ex as Error)?.message}`
                test.result = TestStatus.Failed
            }
            resolve()
            return;
        }

        test.details = 'Session Storage is not available'
        test.result = TestStatus.Failed
        resolve()
    }),
})

const getTest = new Test({
    id: 'ss-get',
    name: 'Get value',
    result: TestStatus.Running,
    details: 'Getting value...',
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
                test.details = 'Successfully set value'
            }
            catch(ex) {
                test.details = `Failed to set value<br/>${(ex as Error)?.message}`
                test.result = TestStatus.Failed
                resolve()
                return;
            }

            try {
                const result = sessionStorage.getItem(key)
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
                
                sessionStorage.removeItem(key)

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

        test.details = 'Session Storage is not available'
        test.result = TestStatus.Failed
        resolve()
    }),
})

export const sessionStorageTests = [
    availabilityTest,
    setTest,
    getTest
]
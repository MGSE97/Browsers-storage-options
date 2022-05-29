import { Test } from './const'
import { localStorageTests } from './tests/local-storage.tests'
import { sessionStorageTests } from './tests/session-storage.tests'

export const tests: {[key: string]: Test[]} = {
    "Local Storage": localStorageTests,
    "Session Storage": sessionStorageTests,
}
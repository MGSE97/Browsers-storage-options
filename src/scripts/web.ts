import { renderTests, updateTest } from './renderer';
import { tests } from './tests';

// Run all tests on load
window.onload = () => {
    for (const api in tests) {
        if (Object.prototype.hasOwnProperty.call(tests, api)) {
            const testSet = tests[api];

            renderTests('#apis', api, testSet);

            testSet.forEach(test => {
                test.test(test).then(() => {
                    updateTest('#apis', test);
                })
            })
        }
    }
};
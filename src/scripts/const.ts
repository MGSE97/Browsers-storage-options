export enum TestStatus {
    Passed = 'pass',
    Failed = 'fail',
    Running = 'running'
}

export interface ITest {
    id: string
    name: string
    result: TestStatus
    details: string
    desc: string
    test: (test: ITest) => Promise<void>
}

export class Test implements ITest {
    id: string
    name: string
    result: TestStatus
    details: string
    desc: string
    test: (test: ITest) => Promise<void>

    constructor(options: ITest) {
        this.id = options.id
        this.name = options.name
        this.result = options.result
        this.details = options.details
        this.desc = options.desc
        this.test = options.test
    }
}
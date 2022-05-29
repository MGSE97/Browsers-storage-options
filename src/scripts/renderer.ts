import { Test, TestStatus } from './const';

const createElement = (tag: string, text?: string, props?: {[key: string]: string | number}) => {
    const el = document.createElement(tag)
    if(props) Object.keys(props).forEach(k => el.setAttribute(k, props[k]?.toString()))
    if(text) el.innerText = text
    return el
}

const testResultToText = (result: TestStatus) => { 
    switch(result) {
        case TestStatus.Passed: return '✔'
        case TestStatus.Failed: return '❌'
        case TestStatus.Running: return '🔥'
    }
}

export const renderTests = (selector: string, name: string, tests: Test[]) => {
    const container = document.querySelector(selector)
    if(!container) {
        console.error(`No element found for ${selector}`)
        return
    }

    const api = createElement('article')

    const title = createElement('h3', name)

    const table = createElement('table')
    
    const header = createElement('tr')
    header.appendChild(createElement('th', 'Test'))
    header.appendChild(createElement('th', 'Result'))
    header.appendChild(createElement('th', 'Details'))
    
    table.appendChild(header)

    if(tests) {
        tests.forEach(test => {
            const row = createElement('tr', undefined, { id: test.id })
            row.appendChild(createElement('td', test.name))
            row.appendChild(createElement(
                'td', 
                testResultToText(test.result), 
                {class: test.result}
            ))
            row.appendChild(createElement('td', test.details))

            const desc = createElement('tr', undefined, {class: 'desc'})
            desc.appendChild(createElement('td', test.desc , {colspan: 3}))
            
            table.appendChild(row) 
            table.appendChild(desc)

            const spacer = createElement('tr', undefined, {class: 'spacer'})
            spacer.appendChild(createElement('td', undefined, {colspan: 3}))
            table.appendChild(spacer)
        });
        table.removeChild(table.lastChild as Node)
    }

    api.appendChild(title)
    api.appendChild(table)

    container.appendChild(api)
}

export const updateTest = (selector: string, test: Test) => {
    const testSelector = `${selector} tr#${test.id}`
    const container = document.querySelector(testSelector)
    if(!container) {
        console.error(`No element found for ${testSelector}`)
        return
    }

    const name = container.children[0] as HTMLElement | null
    const result = container.children[1] as HTMLElement | null
    const details = container.children[2] as HTMLElement | null
    const desc = container.nextSibling?.childNodes[0] as HTMLElement | null

    if(name) name.innerText = test.name
    if(result) {
        result.innerText = testResultToText(test.result)
        result.className = test.result
    }
    if(details) details.innerText = test.details
    if(desc) desc.innerText = test.desc

    container.classList.toggle('changed')
    setTimeout(() => {
        container.classList.toggle('changed')
    }, 1000)
}
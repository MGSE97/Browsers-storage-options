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

            const [currDetail, ...prevDetails] = test.details
            const details = createElement('td', undefined, { 'data-length': test.details.length })
            details.appendChild(createElement('span', currDetail))
            details.appendChild(createElement('br'))
            details.appendChild(createElement('small', prevDetails.join('<br/>')))
            row.appendChild(details)

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

    let changed = false
    if(name && name.innerText !== test.name) {
        name.innerText = test.name
        changed = true
    } 
    if(result && result.className !== test.result) {
        result.innerText = testResultToText(test.result)
        result.className = test.result
        changed = true
    }
    if(details && details.getAttribute('data-length') !== test.details.length.toString()) {
        details.setAttribute('data-length', test.details.length.toString())
        const [currDetail, ...prevDetails] = test.details
        details.children[0].innerHTML = currDetail
        details.children[2].innerHTML = prevDetails.join('<br/>')
        changed = true
    } 
    if(desc && desc.innerText !== test.desc) {
        desc.innerText = test.desc
        changed = true
    } 

    if(changed)
    {
        container.classList.toggle('changed')
        setTimeout(() => {
            container.classList.toggle('changed')
        }, 1000)
    }
}
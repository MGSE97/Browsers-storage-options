const createElement = (tag, text, props) => {
    const el = document.createElement(tag)
    if(props) Object.keys(props).forEach(k => el.setAttribute(k, props[k]))
    if(text) el.innerText = text
    return el
}

const testResultToText = (result) => { 
    switch(result) {
        case 'pass': return '✔'
        case 'fail': return '❌'
        case 'running': return '🔥'
    }
}

const renderAPI = (selector, name, tests) => {
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
            const row = createElement('tr', null, { id: test.id })
            row.appendChild(createElement('td', test.name))
            row.appendChild(createElement(
                'td', 
                testResultToText(test.result), 
                {class: test.result}
            ))
            row.appendChild(createElement('td', test.details))

            const desc = createElement('tr', null, {class: 'desc'})
            desc.appendChild(createElement('td', test.desc , {colspan: 3}))
            
            table.appendChild(row) 
            table.appendChild(desc)

            const spacer = createElement('tr', null, {class: 'spacer'})
            spacer.appendChild(createElement('td', null, {colspan: 3}))
            table.appendChild(spacer)
        });
        table.removeChild(table.lastChild)
    }

    api.appendChild(title)
    api.appendChild(table)

    container.appendChild(api)
}

const updateTest = (selector, testid, test) => {
    const testSelector = `${selector} tr#${testid}`
    const container = document.querySelector(testSelector)
    if(!container) {
        console.error(`No element found for ${testSelector}`)
        return
    }

    const name = container.children[0]
    const result = container.children[1]
    const details = container.children[2]
    const desc = container.nextSibling.children[0]

    name.innerText = test.name
    result.innerText = testResultToText(test.result)
    result.className = test.result
    details.innerText = test.details
    desc.innerText = test.desc

    container.classList.toggle('changed')
    setTimeout(() => {
        container.classList.toggle('changed')
    }, 1000)
}
const searchStateForm = document.querySelector('#select-state-form')
const searchStateInput = document.querySelector('#select-state')
const brewListH1 = document.querySelector('h1')
const filterForm = document.querySelector('#filter-by-type-form')
const filterInput = document.querySelector('#filter-by-type')
const breweriesUL = document.querySelector('#breweries-list')

// TODO: Expand and split State to clear thing up 
//       and to make writing functions easier.
const state = {
    type_filter: ['micro', 'regional', 'brewpub'],
    city_filter: [],
    breweries: []
}

function listenToStateSearchForm() {
    searchStateForm.addEventListener('submit', (e) => {
        e.preventDefault()
        fetchAndRender(searchStateInput.value)
        searchStateForm.reset()
    })
}

function listenToFilterForm() {
    filterForm.addEventListener('change', () => {
        // This is the filter function for the filter section on the side
        const breweriesFilteredByType = state.breweries.filter(brew => brew.brewery_type.includes(filterInput.value))
        render(breweriesFilteredByType)
    })
}

function listenToBrewSearchForm() {
    const form = document.getElementById('search-breweries-form')
    const input = document.getElementById('search-breweries')
    const brewery = document.getElementsByTagName('li')
    form.addEventListener('keyup', (e) => {
        // this is the search feature that shows specific breweries loaded on page
        e.preventDefault()
        for (let i = 0; i < state.breweries.length; i++) {
            const name = state.breweries[i].name
            const txt = input.value.toUpperCase()
            if (name.toUpperCase().indexOf(txt) > -1) {
                brewery[i].style.display = ''
            } else {
                brewery[i].style.display = 'none'
            }
        }
        console.log(input.value)
    })
}

function fetchAndRender(usState) {
    fetch(`https://api.openbrewerydb.org/breweries?by_state=${usState}&per_page=20`)
    .then(resp => resp.json())
    .then((data) => {
        // This is the API filter when searching
        const breweriesFilteredByType = data.filter(brew => state.type_filter.some(type => brew.brewery_type.includes(type)))
        state.breweries = breweriesFilteredByType
        render(state.breweries)
    })
}

// DONE: Extension 1
function createSearchBrewForm() {
    const form = document.createElement('form')
    const label = document.createElement('label')
    const h2 = document.createElement('h2')
    const input = document.createElement('input')

    form.setAttribute('id', 'search-breweries-form')
    form.setAttribute('autocomplete', 'off')
    form.append(label, input)

    label.setAttribute('for', 'search-breweries')
    label.append(h2)
    h2.textContent = 'Search breweries:'

    input.setAttribute('id', 'search-breweries')
    input.setAttribute('name', 'search-breweries')
    input.setAttribute('type', 'text')

    return form
}

function createSearchBreweries() {
    const searchBrewSect = document.createElement('section')
    const form = createSearchBrewForm()
    searchBrewSect.classList.add('search-bar')
    searchBrewSect.append(form)
    return searchBrewSect
}

function renderSearchBreweries() {
    const section = createSearchBreweries()
    brewListH1.insertAdjacentElement('afterend', section)
}

// TODO: extension 2
function createCityFilter(breweries) {
    const div = document.createElement('div')
    const h3 = document.createElement('h3')
    const btn = document.createElement('button')
    const form = document.createElement('form')
    const input = document.createElement('input')
    const label = document.createElement('label')

    div.classList.add('filter-by-city-heading')
    div.append(h3, btn)

    h3.textContent = 'Cities'
    btn.textContent = 'clear all'
    btn.classList.add('clear-all-btn')

    form.setAttribute('id', 'filter-by-city-form')
    form.append(input, label)

    // input.setAttribute('type', 'checkbox')
    input.type = 'checkbox'
    input.name = 'chardon'
    input.value = 'chardon'

    label.setAttribute('for', 'chardon')
    label.textContent = 'Chardon'

    filterForm.insertAdjacentElement('afterend', div)
    div.insertAdjacentElement('afterend', form)
}

function createBreweryLiAddress(brewery) {
    const address = document.createElement('section')
    const addressH3 = document.createElement('h3')
    const addressStreet = document.createElement('p')
    const addressStateZip = document.createElement('p')

    address.classList.add('address')
    addressH3.textContent = 'Address:'
    addressStreet.textContent = brewery.street
    addressStateZip.textContent = brewery.state + ", " + brewery.postal_code
    addressStateZip.style.fontWeight = 'bold'
    
    address.append(addressH3, addressStreet, addressStateZip)
    return address
}

function createBreweryLiPhone(brewery) {
    const phone = document.createElement('section')
    const phoneH3 = document.createElement('h3')
    const phoneNum = document.createElement('p')

    phone.classList.add('phone')
    phoneH3.textContent = 'Phone:'
    if (brewery.phone == null) {
        phoneNum.textContent = 'N/A'
    } else {phoneNum.textContent = brewery.phone}

    phone.append(phoneH3, phoneNum)
    return phone
}

function createBreweryLiLink(brewery) {
    const link = document.createElement('section')
    link.classList.add('link')

    if (brewery.website_url == null) {
        console.log(`${brewery.name} has no website`)
    } else {
        const linkAnchor = document.createElement('a')
        linkAnchor.href = brewery.website_url
        linkAnchor.setAttribute('target', '_blank')
        linkAnchor.textContent = 'Visit Webiste'
        link.append(linkAnchor)
    }
    return link
}

function createBreweryLI(brewery) {
    const li = document.createElement('li')
    const heading = document.createElement('h2')
    const type = document.createElement('div')
    const address = createBreweryLiAddress(brewery)
    const phone = createBreweryLiPhone(brewery)
    const link = createBreweryLiLink(brewery)

    li.setAttribute('id', brewery.id)
    heading.textContent = brewery.name
    type.classList.add('type')
    type.textContent = brewery.brewery_type

    li.append(heading, type, address, phone, link)
    return li
}

function renderBrewery(breweries) {
    breweriesUL.innerHTML = ""
    breweries.forEach(brewery => {
        const li = createBreweryLI(brewery)
        breweriesUL.append(li)
    })
}

function render(breweries) {
    renderBrewery(breweries)
    createCityFilter(breweries)
}

function init() {
    renderSearchBreweries()
    listenToBrewSearchForm()
    listenToFilterForm()
    listenToStateSearchForm()
}
init()
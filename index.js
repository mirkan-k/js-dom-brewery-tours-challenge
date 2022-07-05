const searchForm = document.querySelector('#select-state-form')
const searchInput = document.querySelector('#select-state')
const filterForm = document.querySelector('#filter-by-type-form')
const filterInput = document.querySelector('#filter-by-type')
const breweriesUL = document.querySelector('#breweries-list')

const state = {
    breweries: []
}

function listenToSearchForm() {
    searchForm.addEventListener('submit', (e) => {
        e.preventDefault()
        fetchAndRender(searchInput.value)
        searchForm.reset()
    })
}

function listenToFilterForm() {
    filterForm.addEventListener('change', () => {
        const breweriesFilteredByType = state.breweries.filter(brew => brew.brewery_type.includes(filterInput.value))
        render(breweriesFilteredByType)
    })
}

function fetchAndRender(usState) {
    fetch(`https://api.openbrewerydb.org/breweries?by_state=${usState}&per_page=20`)
    .then(resp => resp.json())
    .then((data) => {
        console.log('api data', data)
        const typeFilter = ['micro', 'regional', 'brewpub']
        const breweriesFilteredByType = data.filter(brew => typeFilter.some(type => brew.brewery_type.includes(type)))
        state.breweries = breweriesFilteredByType
        console.log('state', state.breweries)
        render(state.breweries)
    })
}

function render(breweries) {
    breweriesUL.innerHTML = ""
    breweries.forEach(brewery => breweriesUL.innerHTML += `
    <li id="${brewery.id}">
        <h2>${brewery.name}</h2>
        <div class="type">${brewery.brewery_type}</div>
        <section class="address">
            <h3>Address:</h3>
            <p>${brewery.street}</p>
            <p><strong>${brewery.state}, ${brewery.postal_code}</strong></p>
        </section>
        <section class="phone">
            <h3>Phone:</h3>
            <p>${brewery.phone == null ? 'N/A' : brewery.phone}</p>
        </section>
        <section class="link">
            ${brewery.website_url == null ? '' : `<a href="${brewery.website_url}" target="_blank">Visit Website</a>`}
        </section>
    </li>
    `)
}
listenToFilterForm()
listenToSearchForm()
// fetchAndRender()
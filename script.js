let root = document.documentElement;
let darkMode = true
var countries = []
let page = 1

fetch("https://restcountries.eu/rest/v2/all").then(response => response.json().then(json => {
    countries = json
    setCountriesCards(countries)
    setPage()
}))

function setCountriesCards(list) {
    let section = document.querySelector("section .container")
    section.innerHTML = ""
    list.map(country => {
        section.insertAdjacentHTML("beforeend", `
                    <div class="card" onclick="setPage(${country.callingCodes})">
                        <div class="card-img" data-url-image="${country.flag}"></div>
                        <div class="detail">
                            <h2>${country.name}</h2>
                            <p>Population: <span>${maskPopulationValue(country.population.toString())}</span></p>
                            <p>Region: <span>${country.region}</span></p>
                            <p>capital: <span>${country.capital}</span></p>
                        </div>
                    </div>`)
    })

    Array.from(document.querySelectorAll(".card-img")).map(cardImg => {
        cardImg.style.backgroundImage = `url(${cardImg.dataset.urlImage})`
    })
}

function toggleMode() {
    darkMode = !darkMode
    if (darkMode) {
        document.querySelector(".nav-icon").setAttribute("name", "moon")
        root.style.setProperty('--background', 'hsl(207, 26%, 17%)')
        root.style.setProperty('--elements-background', 'hsl(209, 23%, 22%)')
        root.style.setProperty('--text-color', 'hsl(0, 0%, 100%)')
    } else {
        document.querySelector(".nav-icon").setAttribute("name", "moon-outline")
        root.style.setProperty('--background', 'hsl(0, 0%, 97%)')
        root.style.setProperty('--elements-background', 'hsl(0, 0%, 100%)')
        root.style.setProperty('--text-color', 'hsl(200, 15%, 8%)')
    }
}

function setPage(id = null) {
    let country = countries.find(c => parseInt(c.callingCodes) == parseInt(id))
    if (!country) {
        document.querySelector("section.list").style.display = "grid"
        document.querySelector("section.detail").style.display = "none"
        document.querySelector(".inputs").style.display = "flex"
    } else {
        document.querySelector("section.detail .content").innerHTML = ""

        let borders = country.borders.map(b => ("<span class='badge'>" + (countries.find(c => c.alpha3Code == b)).name + "</span>"))

        document.querySelector("section.detail .content").insertAdjacentHTML("beforeend", `
                <div class="image-country">
                    <img src="${country.flag}" alt="">
                </div>
                <div class="informations">
                    <h2>${country.name}</h2>
                    <div class="info-detail">
                        <div>
                            <p>Native Name: <span>${country.nativeName}</span></p>
                            <p>Population: <span>${maskPopulationValue(country.population.toString())}</span></p>
                            <p>Region: <span>${country.region}</span></p>
                            <p>Sub Region: <span>${country.subregion}</span></p>
                            <p>Capital: <span>${country.capital}</span></p>
                        </div>
                        <div>
                            <p>Top Level Domain: <span>${country.topLevelDomain}</span></p>
                            <p>Currencies: <span>${country.currencies.map(c => (c.name))}</span></p>
                            <p>Languages: <span>${country.languages.map(l => (l.name))}</span></p>
                        </div>
                    </div>
                    <p class="borders">Border Countries: ${borders.join(" ")}</p>
                </div>
                `)

        document.querySelector(".inputs").style.display = "none"
        document.querySelector("section.list").style.display = "none"
        document.querySelector("section.detail").style.display = "grid"
    }
}

toggleMode()

function setRegionSelect() {
    let list = countries.filter(c => c.region == document.getElementById("region-select").value)
    setCountriesCards(list)
}

function maskPopulationValue(value) {
    if (value.length > 9) {
        return value.substring(0, value.length - 9) + "," + value.slice(-9, -6) + "," + value.slice(-6, -3) + "," + value.substring(value.length - 3)
    } else if (value.length > 6) {
        return value.substring(0, value.length - 6) + "," + value.slice(-6, -3) + "," + value.substring(value.length - 3)
    } else if (value.length > 3) {
        return value.substring(0, value.length - 3) + "," + value.substring(value.length - 3)
    }
}

document.getElementById("search").addEventListener("keyup", e => {
    if (e.target.value.length == 0) {
        setCountriesCards(countries)
        return
    }
    let list = countries.filter(c => c.name.toLowerCase().includes(e.target.value.toLowerCase()))
    setCountriesCards(list)
})
const container = document.querySelector(".container")
const themeIconBtn = document.querySelector(".theme-icon-btn")
const input = document.querySelector("#input")
const select = document.querySelector(".select")
const showMore = document.querySelector(".show-more")

let incr = 8

showMore.addEventListener("click", () => {
    incr += 8
    console.log(incr)
    getCountres()
})

themeIconBtn.innerHTML = `<img src="./icon-sun.svg"></img>`

themeIconBtn.addEventListener("click", () => {
    if (localStorage.getItem('theme') === 'dark') {
        localStorage.removeItem('theme');
    } else {
        localStorage.setItem('theme', 'dark')
    }
    addDarkClassToHTML()
})

function addDarkClassToHTML() {
    try {
        if (localStorage.getItem('theme') === 'dark') {
            document.querySelector('html').classList.add('dark');
            themeIconBtn.innerHTML = `<img class="theme-icon-btn-img" src="./icon-sun.svg"></img>`
        } else {
            document.querySelector('html').classList.remove('dark');
            themeIconBtn.innerHTML = `<img class="theme-icon-btn-img" src="./icon-moon1.svg"></img>`
        }
    } catch (err) {}
}

addDarkClassToHTML();

let countryNames = []

async function getCountres() {
    const data = await fetch(`https://restcountries.com/v3.1/all`)
    const results = await data.json()
    let sorted = results.sort((a, b) => a.name.common > b.name.common? 1 : -1)
    localStorage.setItem("storage", JSON.stringify(sorted))
    displayCountres(sorted.slice(0, incr))
}

getCountres()

async function getCountresForSelector() {
    const data = await fetch(`https://restcountries.com/v3.1/all`)
    const results = await data.json()

    let countryRegion = results.map((country) => {
        return country.region
    })

    function getUniqueRegion(countryRegion) {
        let uniqueRegion = []

        countryRegion.forEach(region => {
            if (!uniqueRegion.includes(region)) {
                uniqueRegion.push(region)
            }
        })
        return uniqueRegion
    }

    countryNames = getUniqueRegion(countryRegion)

    function createSelect(arr) {
        for (let i = 0; i < arr.length; i++) {
            const element = arr[i];
            select.innerHTML +=
                `<option value = "${element}">${element}</option>`
        }
    }
    createSelect(countryNames)
}

getCountresForSelector()

function displayCountres(results) {
    container.innerHTML = ""
    results.forEach(country => {
        const {
            name: {
                common
            },
            flags: {
                svg,
                alt
            },
            population,
            region,
            capital
        } = country

        container.innerHTML +=
            `
        <a href="./detailed-page.html?countryName=${common}">
        <div class="card">
            <div class="card-img"><img src="${svg}" alt="${alt}"></div>
            <div class="card-discription">
                <h3>${common}</h3>
                <div class="discription"><b>Population: </b><p>${population.toLocaleString("en-US")}</p></div>
                <div class="discription"><b>Region: </b><p>${region}</p></div>
                <div class="discription"><b>Capital: </b><p>${capital}</p></div>
            </div>
        </div>
        `
    });
}

input.addEventListener("input", (e) => {
    e.preventDefault()
    const inputValue = input.value
    if (inputValue == "") {
        getCountres()
        showMore.style.display = "block"
    } else {
        searchCountry(inputValue)
        showMore.style.display = "none"
    }
})

function searchCountry(searchName) {
    const search = JSON.parse(localStorage.getItem('storage'))
    console.log(search)
    let filtred = search.filter((item) =>
        item.name.common.toLowerCase().includes(searchName.toLowerCase())
    )
    if (filtred == "") {
        container.innerHTML = `<h2 class="preloading">Not found</h2>`
    } else {
        displayCountres(filtred)
    }
}

select.addEventListener("change", (event) => {
    let regionSelected = event.target.value
    selectRegion(regionSelected)
    showMore.style.display = "none"
})

async function selectRegion(region) {
    const data = await fetch(`https://restcountries.com/v3.1/region/${region}`)
    const results = await data.json()
    displayCountres(results)
}
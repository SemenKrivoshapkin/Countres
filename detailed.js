document.addEventListener("DOMContentLoaded", () => {
    let currentUrlStr = window.location.href;
    let currentUrl = new URL(currentUrlStr);
    let common = currentUrl.searchParams.get("countryName");
    const countryDetails = document.querySelector(".country-details")
    const themeIconBtn = document.querySelector(".theme-icon-btn")

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

    searchCountry(common)

    async function searchCountry(name) {
        const data = await fetch(`https://restcountries.com/v3.1/name/${name}?fullText=true`)
        const results = await data.json()
        console.log(results)
        displayCountres(results)
    }

    function displayCountres(results) {
        countryDetails.innerHTML = ""
            const {
                name: {
                    common,
                    nativeName
                },
                flags: {
                    svg,
                    alt
                },
                population,
                region,
                subregion,
                capital,
                tld,
                currencies,
                languages,
                borders
            } = results[0]

            countryDetails.innerHTML +=
                `
            <div class="card">
                <div><img src="${svg}" alt="${alt}"></div>
                <div class="discription">
                    <div class="title"><h3>${common}</h3></div>
                    <div class="information">
                        <div>
                            <div class="information-item"><b>Native Name: </b><p>${Object.values(nativeName)[0].official}</p></div>
                            <div class="information-item"><b>Population: </b><p>${population.toLocaleString("en-US")}</p></div>
                            <div class="information-item"><b>Region: </b><p>${region}</p></div>
                            <div class="information-item"><b>Sub Region: </b><p>${subregion}</p></div>
                            <div class="information-item"><b>Capital: </b><p>${capital}</p></div>
                        </div>
                        <div class="information-right">
                            <div class="information-item"><b>Top Level Domain: </b><p>${Object.values(tld)[0]}</p></div>
                            <div class="information-item"><b>Currencies: </b><p>${Object.values(currencies)[0].name}</p></div>
                            <div class="information-item"><b>Languages: </b><p>${Object.values(languages).join(', ')}</p></div>
                        </div>
                    </div>
                    <div class="btn-container">
                        <div><b>Border Countries: </b></div>
                        <div><span class="btns"></span></div>
                    </div>
                </div>
            </div>
            `
            searchCountryByCode(borders)
    }

    async function searchCountryByCode(border) {
        
        const btnCountry = document.querySelector(".btns")
        
    try { border.forEach(async code => {
        btnCountry.innerHTML = ""
            const data = await fetch(`https://restcountries.com/v3.1/alpha/${code}`)
            const results = await data.json()
            console.log(results)
                const {
                    name: {
                        common
                    },
                    population,
                    region,
                    capital
                } = results[0]

                btnCountry.innerHTML += 
                `
                <a href="./detailed-page.html?countryName=${common}">
                    <button data-id="${common}" class="contry-btn">${common}
                    <span class="tooltiptext">
                        <h4>${common}</h4>
                        <p>Population: ${population.toLocaleString("en-US")}</p>
                        <p>Region: ${region}</p>
                        <p>Capital: ${capital}</p>
                    </span>
                    </button>
                </a>
                `
        })
    } catch (err) {
        console.log(err.massage)
    }
    }
})
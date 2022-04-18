let list
let pokemon
let blurLevel
window.onload = () => {
    document.querySelector('body > button').addEventListener('click', setNewPokemon)
    document.querySelector('body section button:first-of-type').addEventListener("click", showSilhouette)
    document.querySelector('body section button + button').addEventListener("click", addDexEntry)
    document.querySelector('body section button + button + button').addEventListener("click", revealPokemon)
    document.addEventListener('keydown', keyPressed)
    list = document.querySelector('ul')
    setNewPokemon()
}

let setNewPokemon = () => {
    let image = document.querySelector('img')
    image.style.visibility = "hidden"
    image.style['max-height'] = '5px'
    image.style.filter = 'blur(40px)'
    image.src = '#'
    
    let button = document.querySelector('body section button:first-of-type')
    button.textContent = 'Show silhouette'
    button.removeEventListener('click', unblur)
    button.addEventListener('click', showSilhouette)

    blurLevel = 50
    let number = Math.ceil(Math.random() * 905)
    const url = `https://pokeapi.co/api/v2/pokemon-species/${number}/`
    fetch(url)
      .then(res => res.json()) // parse response as JSON
      .then(data => {
          while (list.lastChild) {
              list.removeChild(list.lastChild)
          }
        document.querySelector('h3').textContent = ''
          pokemon = data
          let dexEntries = data.flavor_text_entries.filter(entry => entry.language.name === 'en')
          dexEntries = dexEntries.map(entry => {
              entry = entry.flavor_text.replace(new RegExp(data.name, 'gi'), '[redacted]')
              entry = entry.replace(new RegExp('\n|\f', 'g'), ' ')
              return entry
          })

          pokemon.flavor_text_entries = dexEntries.filter((entry, i) => {
              if (entry.includes("impossible to open")) console.log(viewSanitizedVersion(entry), i)
            const indexOfDuplicateEntry = dexEntries.findIndex(possibleCopy => viewSanitizedVersion(entry) === viewSanitizedVersion(possibleCopy))
            return (indexOfDuplicateEntry === i)
        })

        let genus = data.genera.find(entry => entry.language.name === 'en').genus
        document.querySelector('body h2').textContent = genus
          console.log(dexEntries.size, 'after')
          addDexEntry()
      })
      .catch(err => {
          console.log(`error ${err}`)
      })
}

let viewSanitizedVersion = entry => entry.toLowerCase().replace(new RegExp(' ', 'g'), '')


let revealPokemon = () => {
    if (!pokemon) alert('push da button first')
    else {
        if (document.querySelector('img').getAttribute('src') === '#') getImage()
        let image = document.querySelector('img')
        image.style.visibility = "visible"
        image.style['max-height'] = "500px"
        image.style.filter = "blur(0px)"
        document.querySelector('h3').textContent = pokemon.name
        let button = document.querySelector('body section button + button')
        button.removeEventListener('click', showSilhouette)
    }
}

let showSilhouette = () => {
    let image = document.querySelector('img')
    console.log(image)
    if (image.getAttribute('src') === '#') getImage()
    image.style.visibility = "visible"
    image.style.filter = `blur(${blurLevel}px)`
    image.style['max-height'] = "500px"
    let button = document.querySelector('body section button')
    button.textContent = 'Unblur more'
    button.removeEventListener('click', showSilhouette)
    button.addEventListener('click', unblur)
}

let unblur = () => {
    let image = document.querySelector('img')
    blurLevel -= 12
    let button = document.querySelector('body section button')
    if (blurLevel < 6) {
        blurLevel = 0
        button.removeEventListener('click', unblur)
    }
    image.style.filter = `blur(${blurLevel}px)`
}

let getImage = () => {
    const url = `https://pokeapi.co/api/v2/pokemon/${pokemon.id}/`
    fetch(url)
      .then(res => res.json()) // parse response as JSON
      .then(data => {
          console.log('sldfjkd')
          let image = document.querySelector('img')
          image.src = data.sprites.other['official-artwork'].front_default
      })
      .catch(err => {
          console.log(`error ${err}`)
      })
}



let addDexEntry = () => {
    let entry = pokemon.flavor_text_entries.shift()
    if (entry) {
    let li = document.createElement('li')
    let elem = document.createElement('p')
    elem.textContent = entry
    li.appendChild(elem)
    list.insertBefore(li, list.firstChild)
    }
}

let keyPressed = event => {
    if (event.keyCode === 32) {
        event.preventDefault()
        addDexEntry()
    }
    else if (event.keyCode === 13) {
        event.preventDefault()
        revealPokemon()
    }
    else if (event.keyCode === 66) {
        unblur()
    }
}
let setEngrams = length => {
    engrams = {}
    Object.entries(pokemonData).slice(0, 900).forEach(pokemon => {
        let sentences = convertToListOfSanitizedSentences(pokemon[1])
        sentences.forEach(sentence => {
            processSentence(sentence, length, engrams)
        })
    })
}

let getStartingPoint = (word, engrams) => {
    let possibleEngrams  = Object.entries(engrams).filter(key => key[0].split(' ')[0] === word.toLowerCase())
    return weightedRandom(possibleEngrams.map(possible => possible[0]), possibleEngrams.map(possible => possible[1]))
}





let startingWords = ['its', 'it']
let currentWord = 'it'

let makeDexEntry = (word) => {
    word = word || 'it'
    let result = []
    let engram = getStartingPoint(word, engrams)
    for (let i = 0; i < 40; i++) {
        if (engram === '.')
        return `${result.join(' ')}.`
        let engramList = engram.split(' ')
        result.push(engramList[0])
        engram = getNextEngram(engramList.slice(1).join(' '))
    }
    return `${result.join(' ')}.`
}


let getNextEngram = input => {
    let possibles = retrieveEngrams(input)
    if(possibles.length === 0) return '.'
    let chosenEngram = weightedRandom(possibles.map(possible => possible[0]), possibles.map(possible => possible[1])).split(' ')
    return chosenEngram.join(' ')
}




let retrieveEngrams = input => {
    return Object.entries(engrams).filter(engram => {
        return engram[0].split(' ').slice(0, -1).join(' ') === input})
}


//take an array of dex entries.
let convertToListOfSanitizedSentences = entries => {
    let punctuationFree = entries.map(entry => {
        let sentences = entry.replace(/--/g, '. ').split(/[."!;:?]/g)
        sentences.pop()
        return sentences.map(sentence => sentence.replace(/,/g, '').trim())
    })
    return punctuationFree.flat()
}


let processSentence = (sentence, n, engramsObject) => {
    engramsObject = engramsObject || {}
    let words = sentence.toLowerCase().split(' ')
    for (let i = n; i < words.length; i++) {
        let precursorStrng = words.slice(i-n, i).join(' ')
        engramsObject[precursorStrng] = engramsObject[precursorStrng] ? engramsObject[precursorStrng] + 1 : 1
    }
    return engramsObject
}

let weightedRandom = (items, weights) => {
    let i

    for (i = 0; i < weights.length; i++)
        weights[i] += weights[i - 1] || 0
    
    var random = Math.random() * weights[weights.length - 1]
    
    for (i = 0; i < weights.length; i++)
        if (weights[i] > random)
            break
    
    return items[i]
}
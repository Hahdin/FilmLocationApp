const fs = require('fs')
const _path = require('path')
/**
 * Read a file and return the data
 * 
 * @param {string} path Path to file
 * @param {string} file File name
 */
const readFile = (path, file) => {
  return new Promise((resolve, reject) => {
    let final = []
    let fullpath = `${path}/${file}`
    let data = null
    try {
      data = fs.readFileSync(fullpath, 'utf8')
    }
    catch (err) {
      console.log('err', err)
      return reject(err)
    }
    let lines = data.replace(/\r/g, '').split('\n')
    /**
     * This little dance is to resolve the issue of commas embedded in double quoted strings within a CSV file format
     */
    let patt = new RegExp('("[^"]+[^,]")')//test strings in full quotes, remove the commas
    lines.forEach(line => {
      //replace commas inside full quotes with spaces
      let t = patt.exec(line)
      let lastIndex = -1
      while (t) {
        let newText = t[0].replace(/,/g, ' ')
        lastIndex = t.index
        line = line.slice(0, t.index) + newText + line.slice(t.index + t[0].length)
        //keep checking the remainder of the line for more text in quotes with embedded commas
        let newSearch = patt.exec(line.slice(t.index + t[0].length))
        if (!newSearch || newSearch[0].search(/,/g) < 0) {
          t = null
        } else {
          let i = t[0].length
          t = newSearch
          t.index += (lastIndex + i)
          lastIndex = t.index
        }
      }
      //Now we can split on commas
      let la = line.split(',').map(item => item)
      if (la !== undefined)
        final.push(la)
    })
    resolve({ data: final, name: file })
  })
}
/**
 * Get the films from the file
 * 
 * @param {string} file CSV file name
 */
const getFilms = async (file) => {
  let path = _path.resolve(__dirname, 'datasource')
  try {
    let films = await readFile(path, `${file}.csv`).catch(reason => {
      console.log('get films error', reason)
      return reason
    })
    return films
  } catch (error) {
    throw Error(error)
  }

}
/**
 * 
 * @param {string} title Fetch a movie by its title
 */
const getFilm = async (title) => {
  try {
    let films = await getFilms('Film_Locations_in_San_Francisco').catch(reason => {
      console.log(`get film ${title}: error - ${reason}`)
      return reason
    })
    let _film = {}
    films.data.forEach((film, i) => {
      let t = title.toLowerCase()
      if (film[0].toLowerCase() === t) {
        _film = [...film]
      }
    })
    return _film
  } catch (error) {
    throw Error(error)
  }

}
module.exports = {
  getFilms,
  getFilm,
}
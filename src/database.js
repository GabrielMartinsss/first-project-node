import fs from 'node:fs/promises'

const databasePath = new URL('../db.js', import.meta.url)

export class Database {
  #database = {}

  constructor() {
    fs.readFile(databasePath, 'utf8')
      .then(data => this.#database = JSON.parse(data))
      .catch(() => this.#persist())
  }

  #persist() {
    fs.writeFile(databasePath, JSON.stringify(this.#database))
  }

  select(table) {
    const data = this.#database[table] ?? []

    return data
  }

  insert(table, data){
    if(Array.isArray(this.#database[table])){
      this.#database[table].push(data)
    } else {
      this.#database[table] = [data]
    }

    this.#persist()

    return data
  }

  delete(table, id){
    const rowIndex = this.#database[table].findIndex(row => row.id === id)

    if (rowIndex > -1){
      this.#database[table].splice(rowIndex, 1)
      this.#persist()
    }
  }

  update(table, newData, id){
    const rowIndex = this.#database[table].findIndex(row => row.id === id)
        
    if (rowIndex > -1){
      const currentData = this.#database[table][rowIndex]

      this.#database[table][rowIndex] = {
        id, 
        ...currentData,
        ...newData,
        updatedAt: new Date(), 
      }
      this.#persist()
    }
  }

  complete(table, id) {
    const rowIndex = this.#database[table].findIndex(row => row.id === id)

    if (rowIndex > -1){
      const currentData = this.#database[table][rowIndex]

      this.#database[table][rowIndex] = {
        id, 
        ...currentData,
        completedAt: new Date()
      }
      this.#persist()
    }
  }
}
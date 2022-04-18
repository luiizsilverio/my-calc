class CalcController {
  #displayEl
  #dataEl
  #horaEl

  constructor() {
    this.#displayEl = document.querySelector('#display')
    this.#dataEl = document.querySelector('#data')
    this.#horaEl = document.querySelector('#hora')
    this.initialize()
  }

  initialize() {
    this.setDisplayDateTime()

    setInterval(() => {
      this.setDisplayDateTime()
    }, 1000)
  }

  setDisplayDateTime() {
      this.displayDate = this.dataAtual.toLocaleDateString("pt-BR", {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
      })
      this.displayTime = this.dataAtual.toLocaleTimeString("pt-BR")
  }

  get displayCalc() {
    return this.#displayEl.innerHTML
  }

  set displayCalc(value) {
    this.#displayEl.innerHTML = value
  }

  get dataAtual() {
    return new Date()
  }

  get displayDate() {
    return this.#dataEl.innerHTML
  }

  get displayTime() {
    return this.#horaEl.innerHTML
  }

  set displayDate(value) {
    this.#dataEl.innerHTML = value
  }

  set displayTime(value) {
    this.#horaEl.innerHTML = value
  }
}

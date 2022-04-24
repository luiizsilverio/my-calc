class CalcController {
  #displayEl
  #dataEl
  #horaEl
  #operation = []
  #lastOperator = ''
  #lastNumber = ''
  #audioOn = false
  #audio

  constructor() {
    this.#displayEl = document.querySelector('#display')
    this.#dataEl = document.querySelector('#data')
    this.#horaEl = document.querySelector('#hora')
    this.#audio = new Audio('click.mp3')
    this.initialize()
  }

  initialize() {
    this.initKeyboard()
    this.pasteFromClipboard()
    this.initButtonsEvents()
    this.setDisplayDateTime()

    // ao clicar 2x no botão AC, ativa ou desativa o som
    document.querySelectorAll('.btn-ac').forEach((btn) => {
      btn.addEventListener('dblclick', (e) => {
        this.toggleAudio()
      })
    })

    setInterval(() => {
      this.setDisplayDateTime()
    }, 1000)

    this.showDisplay()
  }

  setDisplayDateTime() {
      this.displayDate = this.dataAtual.toLocaleDateString("pt-BR", {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
      })
      this.displayTime = this.dataAtual.toLocaleTimeString("pt-BR")
  }

  toggleAudio() {
    this.#audioOn = !this.#audioOn
  }

  playAudio() {
    if (this.#audioOn) {
      this.#audio.currentTime = 0
      this.#audio.play()
    }
  }

  initKeyboard() {
    document.addEventListener('keyup', (ev) => {
      this.playAudio()

      switch (ev.key) {
        case 'Escape':
          this.clearAll()
          break;

        case 'Backspace':
          this.clearEntry()
          break;

        case '+':
        case '-':
        case '*':
        case '/':
        case '%':
          this.addOperation(ev.key)
          break;

        case '.':
        case ',':
          this.addPonto()
          break;

        case '=':
        case 'Enter':
          this.calcula()
          break;

        case '0':
        case '1':
        case '2':
        case '3':
        case '4':
        case '5':
        case '6':
        case '7':
        case '8':
        case '9':
          this.addOperation(+ev.key)
          break;

        case 'c':
          if (ev.ctrlKey) this.copyToClipboard()
          break
      }
    })
  }

  copyToClipboard() {
    let input = document.createElement('input')

    input.value = this.displayCalc

    document.body.appendChild(input)

    input.select() // seleciona o conteúdo do input

    document.execCommand("copy") // copia para a área de trabalho

    input.remove()
  }

  pasteFromClipboard() {
    document.addEventListener('paste', (ev) => {

      const text = ev.clipboardData.getData('Text')

      this.displayCalc = parseFloat(text)
    })
  }

  get displayCalc() {
    return this.#displayEl.innerHTML
  }

  set displayCalc(value) {
    if (value.toString().length > 10) {
      this.setError()
      return
    }

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

  clearAll() {
    this.#operation = []
    this.#lastNumber = ''
    this.#lastOperator = ''
    this.showDisplay()
  }

  clearEntry() {
    this.#operation.pop()
    this.showDisplay()
  }

  getLastOperation() {
    return this.#operation[this.#operation.length -1]
  }

  isOperator(value) {
    return ['+', '-', '*', '/', '%'].indexOf(value) >= 0
  }

  setLastOperation(value) {
    this.#operation[this.#operation.length -1] = value
  }

  getResult() {
    try {
      return eval(this.#operation.join(""))
    }
    catch(erro) {
      setTimeout(() => {
        this.setError()
      }, 1)
    }
  }

  calcula() {
    let last = ''

    this.#lastOperator = this.getLastItem()

    if (this.#operation.length < 3) {
      let firstItem = this.#operation[0]
      this.#operation = [firstItem, this.#lastOperator, this.#lastNumber]
    }

    if (this.#operation.length > 3) {
      last = this.#operation.pop()
      this.#lastNumber = this.getResult()
    }

    else if (this.#operation.length === 3) {
      this.#lastNumber = this.getResult(false)
    }

    let result = this.getResult()

    if (last === '%') {

      result /= 100
      this.#operation = [result]

    } else {
      this.#operation = [result]

      if (last) this.#operation.push(last)
    }

    this.showDisplay()
  }

  pushOperation(value) {
    this.#operation.push(value)

    if (this.#operation.length > 3) {
      this.calcula()
    }
  }

  getLastItem(isOperator = true) {
    let lastItem = ""

    for (let i = this.#operation.length -1; i >= 0; i--) {
      if (this.isOperator(this.#operation[i]) === isOperator) {
        lastItem = this.#operation[i]
        break
      }
    }

    if (!lastItem) {
      lastItem = isOperator ? this.#lastOperator : this.#lastNumber
    }

    return lastItem
  }

  showDisplay() {
    let lastNumber = this.getLastItem(false)

    if (!lastNumber) lastNumber = 0

    // limita o número de casas decimais
    const strnum = lastNumber.toString() //.substring(0, 10);

    this.displayCalc = +strnum // lastNumber
  }

  addOperation(value) {
    if (isNaN(this.getLastOperation())) {
      if (this.isOperator(value) && this.#operation.length > 0) {
        this.setLastOperation(value)   // trocar o operador

      } else {
        this.pushOperation(value)
        this.showDisplay()
      }

    } else {
      // digitou número
      if (this.isOperator(value)) {
        this.pushOperation(value)

      } else {
        const newValue = this.getLastOperation().toString() + value.toString()
        this.setLastOperation(newValue)

        // atualizar display
        this.showDisplay()
      }
    }
  }

  setError() {
    this.displayCalc = "Error"
  }

  addPonto() {
    const lastOperation = this.getLastOperation()

    if (typeof lastOperation === 'string' && lastOperation.includes('.')) return

    if (this.isOperator(lastOperation) || !lastOperation) {
      this.pushOperation('0.')

    } else {
      this.setLastOperation(lastOperation.toString() + '.')
    }

    this.showDisplay()
  }

  execBtn(value) {
    this.playAudio()

    switch (value) {
      case 'ac':
        this.clearAll()
        break;

      case 'ce':
        this.clearEntry()
        break;

      case 'soma':
        this.addOperation('+')
        break;

      case 'subtracao':
        this.addOperation('-')
        break;

      case 'divisao':
        this.addOperation('/')
        break;

      case 'multiplicacao':
        this.addOperation('*')
        break;

      case 'porcento':
        this.addOperation('%')
        break;

      case 'ponto':
        this.addPonto()
        break;

      case 'igual':
        this.calcula()
        break;

      case '0':
      case '1':
      case '2':
      case '3':
      case '4':
      case '5':
      case '6':
      case '7':
      case '8':
      case '9':
        this.addOperation(+value)
        break;

      default:

        this.setError()
    }
  }

  addEventListenerAll(element, events, fn) {
    events.split(' ').forEach(event => {
      element.addEventListener(event, fn, false)
    })
  }

  initButtonsEvents() {
    let buttons = document.querySelectorAll("#buttons > g, #parts > g")

    buttons.forEach((btn) => {
      this.addEventListenerAll(btn, 'click drag', (ev) => {
        let textBtn = btn.className.baseVal.replace('btn-', '')

        this.execBtn(textBtn)
      })

      this.addEventListenerAll(btn, 'mouseover', (ev) => {
        btn.style.cursor = "pointer"
      })
    })
  }
}

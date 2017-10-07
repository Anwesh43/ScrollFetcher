const w = window.innerWidth,h = window.innerHeight
class InfiniteScollComponent extends HTMLElement {
    constructor() {
        super()
        const shadow = this.attachShadow({mode:'open'})
        this.div = document.createElement('div')
        shadow.appendChild(this.div)
    }
    createDiv(text,color,i) {
        const div = document.createElement('div')
        div.style.width = w
        div.style.height = h
        div.style.background = color
        div.innerHTML = `<span style="position:relative;top:45%">${text}</span>`
        div.style.fontSize = Math.min(w,h)/8
        div.style.textAlign = 'center'
        div.style.position = 'absolute'
        div.style.top = `${i*h}px`
        this.div.appendChild(div)
    }
    connectedCallback() {
        if(this.children.length >= 2) {
            for(var i=0;i<this.children.length;i++) {
                const child = this.children[i]
                if(child.tagName.toLowerCase() == 'block') {
                    this.createDiv(child.innerHTML,child.getAttribute('color'),i)
                }
            }
        }
    }
}
customElements.define('infinite-scroll',InfiniteScollComponent)

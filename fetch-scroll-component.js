const w = window.innerWidth,h = window.innerHeight
class ScrollFetcherComponent extends HTMLElement {
    constructor() {
        super()
        const shadow = this.attachShadow({mode:'open'})
        this.div = document.createElement('div')
        shadow.appendChild(this.div)
    }
    createDiv(text,color,i) {
        const div = document.createElement('div')
        div.style.width = w
        div.style.height = h*1.1
        div.style.background = color
        div.innerHTML = `<span style="position:relative;top:45%">${text}</span>`
        div.style.fontSize = Math.min(w,h)/8
        div.style.textAlign = 'center'
        div.style.position = 'absolute'
        div.style.top = `${i*h}px`
        return div
    }
    connectedCallback() {
        const divs = []
        for(var i=0;i<this.children.length;i++) {
            const div = this.createDiv(this.children[i].innerHTML,this.children[i].getAttribute('color'),i)
            divs.push(div)
        }
        this.scrollFetcher = new ScrollFetcher(divs,this.div)
        this.scrollFetcher.enableScrolling()
    }
}
class ScrollFetcher {
    constructor(divs,parent) {
        this.divs = divs
        this.parent = parent
        parent.appendChild(divs[0])
        this.index = 0
    }
    enableScrolling() {

        window.onscroll = (event) => {
            const lastDiv = this.divs[this.index]
            const maxY = lastDiv.offsetTop+0.05*h
            console.log(maxY)
            console.log(window.scrollY)
            if(window.scrollY > maxY && this.index < this.divs.length-1) {
                this.parent.appendChild(this.divs[this.index+1])
                this.index++
            }
        }
    }
}
customElements.define('scroll-fetcher',ScrollFetcherComponent)

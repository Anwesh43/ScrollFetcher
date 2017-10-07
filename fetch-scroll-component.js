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
        this.loading = false
    }
    enableScrolling() {

        window.onscroll = (event) => {
            const lastDiv = this.divs[this.index]
            const maxY = lastDiv.offsetTop+0.05*h
            console.log(maxY)
            console.log(window.scrollY)
            if(window.scrollY > maxY && this.index < this.divs.length-1) {
                if(!this.loading) {
                  this.loading = true
                  Loader.start(()=>{
                      this.loading = false
                      this.parent.appendChild(this.divs[this.index+1])
                      this.index++
                  },this.parent,lastDiv.offsetTop+lastDiv.offsetHeight)
              }
            }
        }
    }
}
class Loader {
    static start(stopcb,parent,y) {
        var time = 0
        const canvas = document.createElement('canvas')
        canvas.style.position = 'absolute'
        canvas.style.left = w/2
        canvas.style.top = y
        const size = w/15
        canvas.width = size
        canvas.height = size
        const context = canvas.getContext('2d')
        context.strokeStyle = 'orange'
        parent.appendChild(canvas)
        const interval = setInterval(()=>{
            context.clearRect(0,0,size,size)
            context.globalAlpha = 0
            context.fillRect(0,0,size,size)
            context.globalAlpha = 1
            context.lineWidth = size/10
            context.save()
            context.translate(size/2,size/2)
            context.rotate(time*Math.PI/15)
            context.beginPath()
            for(var i=0;i<180;i+=5) {
                const x = size*0.4*Math.cos(i*Math.PI/180),y = size*0.4*Math.sin(i*Math.PI/180)
                if(i == 0) {
                    context.moveTo(x,y)
                }
                else {
                    context.lineTo(x,y)
                }
            }
            context.stroke()
            context.restore()
            time++
            if(time == 30) {
                clearInterval(interval)
                parent.removeChild(canvas)
                stopcb()
            }
        },70)
    }
}
customElements.define('scroll-fetcher',ScrollFetcherComponent)

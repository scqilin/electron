
const provincePos = {
    "贵阳": { cx: "543.685112", cy: "378.135892" },
    "毕节": { cx: "376.685112", cy: "366.135892" },
    "安顺": { cx: "407.685112", cy: "514.135892" },
    "六盘水": { cx: "270.685112", cy: "473.135892" },
    "遵义": { cx: "582.685112", cy: "247.135892" },
    "铜仁": { cx: "760.685112", cy: "241.135892" },
    "凯里": { cx: "738.685112", cy: "435.135892" },
    "都匀": { cx: "582.685112", cy: "533.135892" },
    "兴义": { cx: "341.685112", cy: "637.135892" },
}


class Mapguizhou {
    svg
    domdiv
    __id = (new Date()).getTime();
    divWidth = 1000;
    divHeight = 800;
    defsvgwidth = 1000;
    defsvgheight = 800;

    defOption = {
        fontSize: 16,
        colors: ['#F6E464', '#F6E464', '#F6E464']  //可以自定义
    }
    highlightColor = '#BC3E19'
    defColor = '#0c1757'
    nodataColor = '#455971'
    set1
    setout1
    setout2
    setout3

    svg3
    proviceArr = []
    provincePath = {}
    cordefs
    svgPoint
    svg3g
    mapsvgg
    keeptime = 4000; //大于2s
    svgDiv

    constructor(div, option) {
        this.domdiv = div;
        this.divWidth = div.offsetWidth
        this.divHeight = div.offsetWidth; //div.offsetHeight 保持比例2：1

        div.style.fontSize = this.defOption.fontSize + 'px';

        this.svg = d3.select(div).append('svg')
            .style('position', 'absolute')

        this.cordefs = this.svg.append('defs').attr('class', 'cordefs');

        let defs = this.svg.append('defs');
        let lig3 = defs.append('linearGradient').attr('id', `grad_${this.__id}`)
            .attr("x1", "0%").attr("x2", "100%").attr("y1", "0%").attr("y2", "0%")
        lig3.append("stop").attr("offset", "0%").attr("stop-color", `#FFFFFF`)
            .attr("stop-opacity", 0.5)
        lig3.append("stop").attr("offset", "50%").attr("stop-color", `#FFFFFF`)
            .attr("stop-opacity", 0.1)
        lig3.append("stop").attr("offset", "100%").attr("stop-color", `#EEEEEE`)
            .attr("stop-opacity", 0.5)


        const svgPoint = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        div.appendChild(svgPoint)
        svgPoint.innerHTML = mapsvg;
        this.svgPoint = d3.select(svgPoint);
        this.svgPoint
            .attr('width', this.defsvgwidth)
            .attr('height', this.defsvgheight)
            .style('position', 'absolute')

        const that = this;
        this.mapsvgg = this.svgPoint.selectAll('g').filter(function (d) {
            return d3.select(this).attr('id') == 'guizhoumap';
        })
        var citystr = '遵义 毕节 都匀 兴义 六盘水 安顺 凯里 铜仁 贵阳'
        this.svgPoint.selectAll('path').each(function () {
            const name = d3.select(this).attr('id')
            if (name != " " && citystr.includes(name)) {
                that.provincePath[name] = d3.select(this);
            }

        })


        this.svg3 = d3.select(div).append('svg')
            .attr('width', this.divWidth)
            .attr('height', this.divHeight)
            .style('position', 'absolute')

        this.svg3g = this.svg3.append('g');

        for (const key in provincePos) {
            let g = this.svg3g.append('g')
                .attr('class', key)
                .attr('transform', `translate(${provincePos[key].cx} ${provincePos[key].cy})`)
            // g.append('circle')
            //     .attr('class', 'circle')
            //     .attr('r', '0.5em')
            //     .attr('fill', '#fff')
            this.proviceArr[key] = g;
        }

        this.svgDiv = d3.select(this.domdiv)
            .append('div')
            .attr('width', this.defsvgwidth)
            .attr('height', this.defsvgheight)
            .style('position', 'absolute')
        let strhtml = ""
        Object.keys(option.legend || {}).forEach(key => {
            strhtml += `
            <div style="padding-top: 8px;">
            <span style="width:10px;height:10px;display:inline-block; background-color: ` + option.legend[key] + `;"></span>
            <em style="font-style: normal;">`+ key + `</em>
        </div>
            `
        })

        d3.select(this.domdiv)
            .append('div')
            .attr('width', this.defsvgwidth)
            .attr('height', this.defsvgheight)
            .style('position', 'absolute')
            .style('color', '#fff')
            .style('top', '100px')
            .style('left', '200px')
            .style('font-size',"12px")
            .html(strhtml)

    }
    drawtips(city) {
        this.divHeight = this.domdiv.offsetHeight;
        this.divWidth = this.domdiv.offsetWidth;

        const info = city.info;
        const title = info.title || '';
        const data = info.data || {};
        const lists = [];
        const tags = [];
        Object.keys(data).forEach((key, i) => {
            if (i < 2) {
                lists[i] = data[key] || [];
                tags[i] = key;
            }
        })
        lists.forEach((item, i) => {
            if (item.length > 6) {
                item.length = 6;
                item.push('...')
            }
        })

        let listhtml = ``;
        let listhtml2 = ``;
        if (lists[0]) {
            let list = lists[0];
            for (let i = 0; i < list.length; i++) {
                listhtml += `<div class="node-name">${list[i]}</div>`
            }
        }
        if (lists[1]) {
            let list = lists[1];
            for (let i = 0; i < list.length; i++) {
                listhtml2 += `<div class="node-name">${list[i]}</div>`
            }
        }


        this.svgDiv.append('div')
            .style('position', 'absolute')
            .style("transform", `translate(${this.divWidth * city.dx}px,${this.divHeight * city.dy}px)`)
            .style('color', '#fff')
            // .style('pointer-events', 'none')
            .attr('tid', city.name)
            .html(`
            <div class="modal">
                    <div class="top-decoration-line" style="box-shadow: 0px 0px 3px 1px ${this.highlightColor}, 0px 0px 3px 0px ${this.highlightColor};"></div>
                    <div class="modal-header">${title}</div>
                        <div class="modal-body" style="display:${lists[0].length>0?'black':'none'}">${listhtml}
                            <div class="offline">
                                    <span class="circle"></span>
                                    <span>${tags[0] || ""}</span>
                            </div>
                        </div>
                        <div class="modal-body2" style="display:${lists[1].length>0?'black':'none'}">${listhtml2}
                            <div class="offline">
                                    <span class="circle2"></span>
                                    <span>${tags[1] || ""}</span>
                            </div>
                        </div>
                    </div>
            </div>
            `)
    }
    removetips(city) {
        this.svgDiv.selectAll('div').filter(function (d) {
            return d3.select(this).attr('tid') == city.name;
        }).remove();
    }
    removetipsall() {
        this.svgDiv.selectAll('div').remove();
    }

    clearMap() {
        this.set1 && clearInterval(this.set1);
        this.setout1 && clearTimeout(this.setout1);
        this.setout2 && clearTimeout(this.setout2);
        this.setout3 && clearTimeout(this.setout3);
        this.removetipsall();
        this.removeBarAll();

    }
    removeBar(name) {
        let g = this.proviceArr[name];
        if (!g) return;
        g.selectAll('circle').remove();
        g.selectAll('line').remove();
        // this.provincePath[name] && this.provincePath[name].attr('fill', this.defColor)
    }
    removeBarAll() {
        for (const key in provincePos) {
            this.removeBar(key)
            this.provincePath[key] && this.provincePath[key]
                .attr('fill', this.nodataColor)
        }
    }
    drawBar(info) {
        this.divHeight = this.domdiv.offsetHeight;
        this.divWidth = this.domdiv.offsetWidth;
        let scale = this.divWidth / this.defsvgwidth;
        let g = this.proviceArr[info.name];
        g.attr('transform', `translate(${this.divWidth * info.dx} ${this.divHeight * info.dy}) scale(${scale})`)
        this.removeBar(info.name);
        if (!g) return;
        g.append('circle')
            .attr('r', '.4em')
            .attr('fill', 'none')
            .attr('stroke', info.color)
            .attr('stroke-width', 1.5)
            .attr('opacity', 0)
            .transition()
            .ease(d3.easeLinear)
            .duration(700)
            .attr('r', '6em')
            .attr('opacity', 1)
            .attr('stroke-dasharray', '20 30')
            .attr('stroke-dashoffset', '0')
            .transition()
            .ease(d3.easeLinear)
            .duration(this.keeptime)
            .attr('stroke-dashoffset', '200')
            .attr('stroke-dasharray', '20 30')



        g.append('circle')
            .attr('r', '.4em')
            .attr('fill', '#fff')
            .attr('fill-opacity', 0.1)
            .attr('stroke', info.color)
            .attr('stroke-width', 1, 5)
            .transition()
            .ease(d3.easePolyOut)
            .duration(700)
            .attr('r', '4em')

        g.append('circle')
            .attr('r', '.4em')
            .attr('fill', '#fff')
            .attr('fill-opacity', 0.1)
            .attr('stroke', info.color)
            .attr('stroke-width', 2)
            .transition()
            .ease(d3.easePolyOut)
            .duration(700)
            .attr('r', '2em')

        g.append('line')
            .attr('x1', 0)
            .attr('y1', 0)
            .attr('x2', '4.24em') // 6/根号二 
            .attr('y2', '-4.24em')
            .attr('stroke', info.color)
            .attr('stroke-width', 1)

        g.append('line')
            .attr('x1', '4.24em')
            .attr('y1', '-4.24em')
            .attr('x2', '8.5em')
            .attr('y2', '-4.24em')
            .attr('stroke', info.color)
            .attr('stroke-width', 1)



        g.append('circle')
            .attr('r', '0.4em')
            .attr('fill', '#fff')
            .attr('stroke', info.color)
            .attr('stroke-width', 1.5)
    }

    updateData(datas) {

        if (typeof datas == "undefined" || datas === null || datas === "") return;
        let oldseries = datas.series;
        if (typeof oldseries == "undefined" || oldseries === null || oldseries === "") return;
        let oldlen = oldseries.length;
        if (oldlen === undefined || oldlen < 1) return;
        this.clearMap();
        let series = [];
        for (let i = 0; i < oldlen; i++) {
            if (provincePos.hasOwnProperty(oldseries[i].name)) {
                series.push(oldseries[i])
            }
        }
        let values = [];
        for (let i = 0; i < series.length; i++) {
            series[i].id = i; //增加id 
            if (series[i].value === undefined) {
                series[i].value = 0;
            }
            if (series[i].name === undefined) {
                series[i].name = "";
            }
            if (series[i].color === undefined) {
                series[i].color = this.defColor;
            }
            series[i].dx = provincePos[series[i].name].cx / this.defsvgwidth;
            series[i].dy = provincePos[series[i].name].cy / this.defsvgheight;
            values.push(series[i].value)
        }
        series.forEach(item => {
            this.provincePath[item.name] && this.provincePath[item.name]
                .attr('fill', item.color)
        })
        this.setout1 = setTimeout(() => {
            let _i = 0, len = series.length;

            const run = () => {
                this.highlightColor = series[_i].color;
                this.drawtips(series[_i]);
                this.drawBar(series[_i]);
                
                this.setout2 = setTimeout(() => {
                    this.removeBar(series[_i].name)
                    this.removetips(series[_i]);
                }, this.keeptime);
            }

            run();

            this.set1 = setInterval(() => {
                _i++;
                if (_i >= len) {
                    _i = 0;
                }
                run();
            }, this.keeptime + 100);

        }, 100);



    }


    deepCopy(obj, obj2) {
        let newObj = Object.assign({}, obj);
        for (let key in obj2) {
            if ("object" != typeof obj[key] || null === obj[key] || Array.isArray(obj[key])) {
                if (void 0 !== obj2[key]) {
                    newObj[key] = obj2[key];
                }
            } else {
                newObj[key] = this.deepCopy(obj[key], obj2[key]);
            }
        }
        return newObj
    }
    /* 销毁整个svg */
    dispose() {
        this.set1 && clearInterval(this.set1);
        this.setout1 && clearTimeout(this.setout1);
        this.setout2 && clearTimeout(this.setout2);
        this.setout3 && clearTimeout(this.setout3);
        this.svg.remove()
    }
    reSize() {
        this.divHeight = this.domdiv.offsetHeight;
        this.divWidth = this.domdiv.offsetWidth;

        this.svg.attr('width', this.divWidth).attr('height', this.divHeight);
        this.svg3.attr('width', this.divWidth)
            .attr('height', this.divHeight)
        this.svgPoint.attr('width', this.divWidth)
            .attr('height', this.divHeight)

        this.mapsvgg.attr("transform", "scale(" + this.divWidth / this.defsvgwidth + "," + (this.divHeight / this.defsvgheight) + ")");

    }


}




// ==UserScript==
// @name         dmhy-bangumi-current-season
// @name:zh-CN   动漫花园新番索引更新脚本
// @namespace    https://github.com/VegeHime/dmhy-bangumi-current-season
// @version      0.3.0
// @description  update data of new season bangumi on dmhy
// @description:zh-CN 更新动漫花园新番列表及搜索关键词
// @author       Vegehime
// @match        *://dmhy.org/*
// @match        *://www.dmhy.org/*
// @match        *://share.dmhy.org/*
// @match        *://dmhy.anoneko.com/*
// @match        *://dmhy.ye1213.com/*
// @match        *://share.dongmanhuayuan.com/*
// @grant        none
// ==/UserScript==

(function () {
    'use strict';
    Element.prototype.empty = function () {
        while (this.firstChild) this.removeChild(this.firstChild);
        return this;
    }
    function createElementWithAttr(TagName, Attrs, Text) {
        let element = document.createElement(TagName);
        if (Attrs) {
            for (let attr in Attrs)
                element[attr] = Attrs[attr];
        }
        if (Text)
            element.textContent = Text;
        return element;
    }
    function loadJS(url, callback) {
        let script = document.createElement('script'),
            fn = callback || function () { };
        script.type = 'text/javascript';
        script.onload = function () {
            fn();
        };
        script.src = url;
        document.querySelector('head').appendChild(script);
    }
    let ShowAllBangumi = localStorage.ShowAllBangumi !== "false";
    let day = new Date().getDay();
    let trs = [];
    let panel = document.querySelector(".jmd");
    function bangumiRefresh() {
        panel.empty();
        if (ShowAllBangumi)
            trs.forEach((item) => { panel.appendChild(item); });
        else {
            for (let i = 5; i <= 8; ++i)
                panel.appendChild(trs[(day + i) % 7]);
            panel.appendChild(trs[7]);
        }
        panel.childNodes.forEach((item, index) => {
            if (index % 2) item.classList.add("odd");
            else item.classList.add("even");
        });
    }
    document.querySelector("div[id$='_ad']").removeAttribute('align');
    loadJS('https://cdn.jsdelivr.net/gh/VegeHime/dmhy-bangumi-current-season@master/data.js', function () {
        let bangumi_data = data['data'];
        let week_name = ['週日（日）', '週一（月）', '週二（火）', '週三（水）', '週四（木）', '週五（金）', '週六（土）', '非週更'];
        for (let i = 0; i < bangumi_data.length; i++) {
            let td = document.createElement('td');
            for (let j = 0; j < bangumi_data[i].length; j++) {
                let name = bangumi_data[i][j][0];
                let keyword = bangumi_data[i][j][1] || name;
                let link = createElementWithAttr('a', {
                    'href': `/topics/list?keyword=${encodeURIComponent(keyword)}`
                }, name);
                td.appendChild(link);
            }
            let tr = document.createElement('tr');
            let th = createElementWithAttr('th', null, week_name[i]);
            tr.appendChild(th);
            tr.appendChild(td);
            trs.push(tr);
        }
        trs[day].classList.add('today');
        let switchButton = createElementWithAttr('a', {
            'href': "javascript:;",
            'style': "margin-right:2px;"
        }, '顯示切換');
        switchButton.onclick = () => {
            ShowAllBangumi = !ShowAllBangumi;
            localStorage.ShowAllBangumi = ShowAllBangumi;
            bangumiRefresh();
        };
        let block = document.querySelector('span.fr');
        block.insertBefore(switchButton, block.firstChild);
        bangumiRefresh();
    });
})();
// ==UserScript==
// @name         dmhy-bangumi-current-season
// @namespace    https://github.com/VegeHime/dmhy-bangumi-current-season
// @version      0.2.5
// @description  update data of new season bangumi on dmhy
// @author       Vegehime
// @match        *://share.dmhy.org/*
// @match        *://dmhy.anoneko.com/*
// @match        *://dmhy.ye1213.com/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    function loadJS(url, callback){
        var script = document.createElement('script'),
            fn = callback || function(){};
        script.type = 'text/javascript';
        //IE
        if(script.readyState){
            script.onreadystatechange = function(){
                if( script.readyState == 'loaded' || script.readyState == 'complete' ){
                    script.onreadystatechange = null;
                    fn();
                }
            };
        }else{
            //其他浏览器
            script.onload = function(){
                fn();
            };
        }
        script.src = url;
        document.getElementsByTagName('head')[0].appendChild(script);
    }
    loadJS('https://cdn.jsdelivr.net/gh/VegeHime/dmhy-bangumi-current-season@master/data.js', function(){
        let bangumi_data = data['data'];
        let week_name = ['週日（日）','週一（月）','週二（火）','週三（水）','週四（木）','週五（金）','週六（土）', '非週更'];
        let trs = [];
        for (let i = 0; i < bangumi_data.length; i++)
        {
            let td = $('<td></td>');
            for(let j = 0; j < bangumi_data[i].length; j++)
            {
                let name = bangumi_data[i][j][0];
                let keyword = bangumi_data[i][j][1]||name;
                td.append(`<a href="/topics/list?keyword=${encodeURIComponent(keyword)}">${name}</a>`)
            }
            let tr = $(`<tr><th>${week_name[i]}</th></tr>`).append(td);
            trs.push(tr);
        }
        $(".jmd").ready(function(){
            let d = new Date();
            let day = d.getDay();
            $(".jmd")
                .empty()
                .append(trs[(day + 5) % 7])
                .append(trs[(day + 6) % 7])
                .append(trs[day].addClass('today'))
                .append(trs[(day + 1) % 7])
                .append(trs[7]);
            $(".jmd tr:even").addClass("even");
            $(".jmd tr:odd").addClass("odd");
            $(".jmd tr:odd").addClass("odd");
            $("div[id$='_ad']").removeAttr('align');
        });
    });
})();
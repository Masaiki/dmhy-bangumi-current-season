let bangumi_data = data['data'];
let week_name = ['週日（日）','週一（月）','週二（火）','週三（水）','週四（木）','週五（金）','週六（土）'];
let trs = [];
for (let i = 0; i < week_name.length; i++)
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
        .append(trs[(d.getDay() + 5) % 7])
        .append(trs[(d.getDay() + 6) % 7])
        .append(trs[d.getDay()].addClass('today'))
        .append(trs[(d.getDay() + 1) % 7]);
    $(".jmd tr:even").addClass("even");
    $(".jmd tr:odd").addClass("odd");
});
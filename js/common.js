// 进度条（依赖nprogress）
(function () {
    NProgress.configure({
        showSpinner: false
    });
    NProgress.set(.2);
    let interval = setInterval(function () {
        NProgress.inc(.03);
    }, 400);
    $(window).on('load', function () {
        clearInterval(interval);
        NProgress.done();
    });
})();

// 加载头部公共页面
$('#nav').load('./common/nav.html',function(){
    // 初始化分类
	initCate();
});

// 时间格式化（依赖moment）
function data_format(data, format = 'YYYY-MM-DD hh:mm:ss') {
    return moment(data).format(format);
}

// 获取当前地址中的查询字符串
function getquerystr() {
    let querystr = location.search.slice(1) || '';
    let params = {};
    querystr && querystr.split('&').forEach(v => {
        let [key, value] = v.split('=');
        params[key] = decodeURIComponent(value);
    });
    return params;
}

// 初始化分类（依赖layer，axios）
async function initCate() {
    let data = await axios.get('/cate');
    let navHtml = '';
    data.forEach(v => {
        let { cate_id, cate_name } = v;
        navHtml += `<li><a href="/cate.html?cate_id=${cate_id}">${cate_name}</a></li>`;
    });
    $('#nav_cate').html(navHtml);
}

// 初始化文章（依赖layer，axios）
async function initArt(cate_id) {
    var index = layer.load(1, {
        shade: [0.2, '#fff'] //0.1透明度的白色背景
    });
    let url = `/article?page=${page}&limit=${limit}`;
    cate_id && (url += `&cate_id=${cate_id}`);
    let data = await axios.get(url);
    layer.close(index);
    if (!data.length) {
        layer.msg('已经到底啦！');
        return;
    }
    let oldHtml = $('#artlist').html();
    let newHtml = '';
    data.forEach(v => {
        let { art_id, art_title, cover, author, content, added_time, cate_name } = v;
        !cover && (cover = 'http://placehold.it/200x130/666/fff?text=no+image')
        added_time = data_format(added_time, 'YYYY-MM-DD');
        newHtml += `<div class='item row'>
                <div class="col-md-2">
                    <img src="${cover}" alt="">
                </div>
                <div class="col-md-10">
                    <div class="title"><a href="/detail.html?art_id=${art_id}">${art_title}</a></div>
                    <div class="date">作者：${author} &nbsp; &nbsp; 发布于：${added_time} &nbsp; &nbsp; 分类：${cate_name}</div>
                    <div class="intro">这是介绍中vscode这是介绍中vscode这是介绍中vscode...</div>
                </div>
                <hr>
            </div>`;
    });
    $('#artlist').html(oldHtml + newHtml);
    if (cate_id) {
        let crumbsHtml = `当前位置：<a href="/">首页</a> / <a href="/">所有分类</a> / ${data[0].cate_name}`;
        $('#crumbs').html(crumbsHtml);
    }
}
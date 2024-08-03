// ==UserScript==
// @name         组卷网试卷处理下载打印
// @version      1.0.0
// @namespace
// @description  【2024/8/3】自动处理组卷网试卷，并打印。
// @author       nuym
// @match        https://zujuan.xkw.com/zujuan
// @match        https://zujuan.xkw.com/*.html
// @icon         https://zujuan.xkw.com/favicon.ico
// @grant        GM_registerMenuCommand
// @grant        GM_notification
// @homepage https://github.com/bzyzh/xkw-zujuan-script
// @license      GNU Affero General Public License v3.0
// ==/UserScript==

(function() {
    'use strict';
    console.log("✅ 程序加载成功");

    // 获取用户信息
    var username = document.getElementsByClassName('user-nickname')[0].innerText;
    var usertype = document.getElementsByClassName('user-type plus')[0].innerText;
    var endtime = document.getElementsByClassName('end-time')[0].innerText;

    console.log("-----------------------------------------------");
    console.log("🔹版本：1.0.0");
    console.log("🔹作者：nuym");
    console.log("🔹开源地址：https://github.com/bzyzh/xkw-zujuan-script");
    console.log("🔹学校网站：https://www.bzyzh.com");
    console.log("🔹组卷网用户： %s", username);
    console.log("🔹组卷网等级： %s", usertype);
    console.log("🔹组卷网到期时间： %s", endtime);
    console.log("-----------------------------------------------");

    // 去除广告
    var adElement = document.getElementsByClassName("aside-pop activity-btn")[0];
    if (adElement) {
        adElement.remove();
        console.log("✅ 去除广告成功");
    }

    // 注册菜单命令以处理后自动刷新
    GM_registerMenuCommand("处理后自动刷新", () => {
        var autoRefreshStatus = localStorage.getItem("EnableAutoRefresh");
        if (autoRefreshStatus === 'N') {
            localStorage.setItem("EnableAutoRefresh", 'Y');
            GM_notification("处理后自动刷新：已开启");
        } else {
            localStorage.setItem("EnableAutoRefresh", 'N');
            GM_notification("处理后自动刷新：已关闭");
        }
    });

    // 初始化处理后自动刷新状态
    if (localStorage.getItem("EnableAutoRefresh") == null) {
        localStorage.setItem("EnableAutoRefresh", 'Y');
    }

    console.log("🔹 创建按钮对象...");
    var printButton = document.createElement('a');
    printButton.className = "btnTestDown link-item anchor-font3";
    printButton.innerHTML = `<i class="icon icon-download1"></i><span>打印试卷</span>`;

    // 打印按钮点击事件
    printButton.onclick = function() {
        var enableAutoRefresh = localStorage.getItem("EnableAutoRefresh") === 'Y';

        // 删除指定类名的元素
        function deleteElementByClassName(className) {
            while (true) {
                var elements = document.getElementsByClassName(className);
                if (elements.length === 0) break;
                elements[0].remove();
            }
        }

        // 删除指定ID的元素
        function deleteElementById(id) {
            var element = document.getElementById(id);
            if (element) element.remove();
        }

        // 根据类名移除元素边框
        function removeBorderByClassName(className) {
            var elements = document.getElementsByClassName(className);
            for (var i = 0; i < elements.length; i++) {
                elements[i].setAttribute('style', 'margin-bottom: 0;');
            }
        }

        // 根据类名改变元素的CSS
        function changeCssByClassName(className, css) {
            var elements = document.getElementsByClassName(className);
            for (var i = 0; i < elements.length; i++) {
                elements[i].setAttribute('style', css);
            }
        }

        // 获取试卷信息
        var paperTitle = document.getElementsByClassName('title-txt')[9].innerText;
        var subject = document.getElementsByClassName('subject-menu__title')[0].innerText;

        // 删除不必要的元素
        deleteElementByClassName('header');
        deleteElementByClassName('bread-nav');
        deleteElementByClassName('fiexd-nav');
        deleteElementByClassName('footer');
        deleteElementByClassName('other-info');
        deleteElementByClassName('info-list');
        deleteElementByClassName('tools');
        deleteElementByClassName('exam-item__info');
        deleteElementByClassName('add-sec-ques');
        deleteElementById('paperAnalyze');
        deleteElementByClassName('exam-analyze');

        // 修改指定元素的CSS
        changeCssByClassName('selected-maskt', 'opacity: 1;');

        // 通知并打印
        console.log("✅ 处理成功！");
        GM_notification(subject + '| ' + paperTitle + "\n ✅ 试卷处理成功！");
        window.print();

        // 自动刷新
        if (enableAutoRefresh) {
            window.location.reload();
        }
    };

    console.log("🔹 查找将要添加的位置...");
    // 查找目标元素并将打印按钮添加到目标位置
    var targetElement = document.getElementsByClassName('link-box')[0] || document.getElementsByClassName('btn-box clearfix')[0];
    if (targetElement) {
        targetElement.appendChild(printButton);
        console.log("✅ 程序已就绪!");
    } else {
        console.error("❌ 无法找到将要添加的位置，程序现在将停止");
        alert('❌ 出错了\n脚本无法找到将要添加的位置，程序现在将停止。请联系脚本作者更新!');
    }
})();
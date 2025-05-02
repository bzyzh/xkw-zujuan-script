// ==UserScript==
// @name         组卷网学科网试卷处理下载打印
// @version      2.1.2
// @namespace
// @description  【2024/11/16】✨ 自动处理组卷网学科网试卷，并打印，支持去广告，答案分离。
// @author       nuym
// @match        https://zujuan.xkw.com/zujuan
// @match        https://zujuan.xkw.com/*.html
// @match        https://zujuan.xkw.com/gzsx/zhineng/*
// @match        https://zujuan.xkw.com/share-paper/*
// @icon         https://zujuan.xkw.com/favicon.ico
// @grant        GM_notification
// @grant        GM_setValue
// @grant        GM_getValue
// @require      https://cdn.jsdelivr.net/npm/sweetalert2@11
// @homepage     https://github.com/bzyzh/xkw-zujuan-script
// @license      GNU Affero General Public License v3.0
// ==/UserScript==

(function() {
    'use strict';
    console.log("✅ 程序加载成功");

    // 获取用户信息
    var username = document.getElementsByClassName('user-nickname')[0].innerText;
    //var usertype = document.getElementsByClassName('user-type plus')[0].innerText;
    //var endtime = document.getElementsByClassName('end-time')[0].innerText;

    console.log("-----------------------------------------------");
    console.log("🔹版本：2.0.0");
    console.log("🔹作者：nuym");
    console.log("🔹开源地址：https://github.com/bzyzh/xkw-zujuan-script");
    console.log("🔹学校网站：https://www.bzyzh.com");
    console.log("🔹组卷网用户： %s", username);
    console.log("🔹亳州一中学生作品~", username);
    //console.log("🔹组卷网等级： %s", usertype);
    //console.log("🔹组卷网到期时间： %s", endtime);
    console.log("-----------------------------------------------");

    // 去除广告
    var adElement = document.getElementsByClassName("aside-pop activity-btn")[0];
    if (adElement) {
        adElement.remove();
        console.log("✅ 去除广告成功");
    }

    // 签到 TODO:代码逻辑问题(来源于https://greasyfork.org/zh-CN/scripts/497198-%E7%BB%84%E5%8D%B7%E7%BD%91%E8%87%AA%E5%8A%A8%E7%AD%BE%E5%88%B0%E8%84%9A%E6%9C%AC/code)
        function checkIn() {
        var signInBtn = document.querySelector('a.sign-in-btn');
        var daySignInBtn = document.querySelector('a.day-sign-in');

        if (signInBtn) {
            signInBtn.click();
        }

        if (daySignInBtn) {
            daySignInBtn.click();
        }
    }

    function canCheckIn() {
        var signedInLink = document.querySelector('.user-assets-box a.assets-method[href="/score_task/"]');

        // 如果找到了表示已签到的链接，且其文本包含“已签到”，则返回false，否则返回true
        return !signedInLink || signedInLink.textContent !== '已签到';
    }

    function signInLogic() {
        if (canCheckIn()) {
            checkIn();
        }
    }


    function debug() {
        console.log('检查是否可以签到：', canCheckIn());
        console.log('执行签到逻辑：', signInLogic());
    }


    window.addEventListener('load', function() {
        debug();
    }, false);


    // 应用CSS样式
    var style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = `
        #zujuanjs-reformatted-content {
            background: white;
        }
        .zujuanjs-question {
            margin-bottom: 10px;
            padding: 10px;
        }
        .zujuanjs-question .left-msg {
            margin-bottom: 5px;
            font-size: 0.8em;
            color: #666;
        }
        #page-title {
            text-align: center;
            font-size: 2em;
            font-weight: bold;
            margin: 20px 0;
        }
        #zujuanjs-reformatted-content {
            background: white;
            font-family: var(--custom-font) !important;
        }   
    `;

    document.head.appendChild(style);

    // 查找目标元素并将打印按钮添加到目标位置
    console.log("🔹 查找将要添加的位置...");
    var targetElement = document.getElementsByClassName('link-box')[0] || document.getElementsByClassName('btn-box clearfix')[0];
    if (targetElement) {
        console.log("🔹 创建试卷打印按钮对象...");
        var printButton = document.createElement('a');
        printButton.className = "btnTestDown link-item anchor-font3";
        printButton.innerHTML = `<i class="icon icon-download1"></i><span>打印试卷</span>`;
        targetElement.appendChild(printButton);

        // 绑定点击事件给 printButton
        printButton.onclick = printButtonClickHandler;

        //createFontSelector();
        console.log("🔹 创建字体选择按钮对象...");
        var fontSelectButton = document.createElement('a');
        fontSelectButton.className = "btnTestDown link-item anchor-font3";
        fontSelectButton.innerHTML = `<i class="icon icon-download1"></i><span>字体选择</span>`;
        targetElement.appendChild(fontSelectButton);

        fontSelectButton.onclick = fontSelectButtonClickHandler;
        //fontSelectButtonClickHandler();

        const Toast = Swal.mixin({
            toast: true,
            position: "top-end",
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
            didOpen: (toast) => {
                toast.onmouseenter = Swal.stopTimer;
                toast.onmouseleave = Swal.resumeTimer;
            },
        });
        Toast.fire({
            icon: "success",
            title: "程序已就绪!",
        });
        console.log("✅ 程序已就绪!");
    } else {
        var targetElementInOtherPlace = document.getElementsByClassName('btn donwload-btn')[0];
        if(targetElementInOtherPlace){
            // 创建新的按钮并添加到试卷下载按钮旁边
            var newPrintButton = document.createElement('a');
            newPrintButton.id = "print-exam";
            newPrintButton.className = "btn";
            newPrintButton.innerHTML = `<i class="icon icon-download"></i><span>打印试卷</span>`;

            // 添加新的按钮到现有的按钮容器中
            var btnBox = document.querySelector('.btn-box');
            if (btnBox) {
            btnBox.appendChild(newPrintButton);

            // 绑定点击事件给 newPrintButton
            newPrintButton.onclick = printButtonClickHandler;
            }
        }else{

            console.error("❌ 无法找到将要添加的位置，程序现在将停止");
            const Toast = Swal.mixin({
                toast: true,
                position: "top-end",
                showConfirmButton: false,
                timer: 3000,
                timerProgressBar: true,
                didOpen: (toast) => {
                    toast.onmouseenter = Swal.stopTimer;
                    toast.onmouseleave = Swal.resumeTimer;
                },
            });
            Toast.fire({
                icon: "error",
                title: "无法找到将要添加的位置，程序现在将停止",
            });
        }
    }

    /* “打印试卷”按钮 */
function printButtonClickHandler() {
    Swal.fire({
        title: "是否需要打印答案?",
        showDenyButton: true,
        showCancelButton: true,
        confirmButtonText: "单独打印",
        denyButtonText: `和试题一起打印`,
        cancelButtonText:"仅打印试题",
    }).then((result) => {
        let includeQuestions = false;
        let includeAnswers = false;
        var checkboxSpan = document.querySelector('.tklabel-checkbox.show-answer');

        // 如果找不到答案显示的复选框
        if (!checkboxSpan) {
            includeQuestions = true;
            includeAnswers = false;
            const Toast = Swal.mixin({
                toast: true,
                position: "top-end",
                showConfirmButton: false,
                timer: 3000,
                timerProgressBar: true,
                didOpen: (toast) => {
                    toast.onmouseenter = Swal.stopTimer;
                    toast.onmouseleave = Swal.resumeTimer;
                },
            });
            Toast.fire({
                icon: "error",
                title: "当前页面不支持打印答案，如果需要，请点击分享试卷后打开链接。",
            });
        } else {
            includeAnswers = true;
        }

        // 处理弹窗按钮点击的结果
        if (result.isDenied) {
            // 选中了"和试题一起打印"（即拒绝按钮），但没有答案复选框
            if (!checkboxSpan) {
                includeQuestions = true;
                includeAnswers = false;
                const Toast = Swal.mixin({
                    toast: true,
                    position: "top-end",
                    showConfirmButton: false,
                    timer: 3000,
                    timerProgressBar: true,
                    didOpen: (toast) => {
                        toast.onmouseenter = Swal.stopTimer;
                        toast.onmouseleave = Swal.resumeTimer;
                    },
                });
                Toast.fire({
                    icon: "error",
                    title: "当前页面不支持打印答案，如果需要，请点击分享试卷后打开链接。",
                });
            } else {
                includeQuestions = true;
            }
        } else if (result.isConfirmed) {
            // 如果点击了确认按钮"单独打印"
            if (checkboxSpan) {
                includeQuestions = false;
                includeAnswers = true;
            } else {
                includeQuestions = true;
                includeAnswers = false;
            }
        } else if (result.dismiss === Swal.DismissReason.cancel) {
            // 点击了"取消"按钮，不打印答案，只打印试题
            includeQuestions = true;
            includeAnswers = false;
        }

        // 最终调用打印处理
        handlePrint(includeQuestions, includeAnswers);
    });
}

    // 在创建打印按钮后添加字体选择器
    function fontSelectButtonClickHandler() {
        Swal.fire({
            title: '设置题目字体',
            html: 
                '<input id="swal-font" class="swal2-input" placeholder="字体名称（如宋体）">'
                + '<input id="swal-size" class="swal2-input" placeholder="字号（如14px）">',
            confirmButtonText: "保存",
            focusConfirm: false,
            preConfirm: () => {
                return {
                    font: document.getElementById('swal-font').value,
                    size: document.getElementById('swal-size').value
                }
            }
        }).then((result) => {
            if (result.isConfirmed) {
                GM_setValue('questionFont', result.value.font);
                GM_setValue('questionSize', result.value.size);
                Swal.fire('已保存！', '', 'success');
            }
        });
    };

    function handlePrint(includeQuestions, includeAnswers) {
        if (includeAnswers) {// 修复这里的条件，确保不会无意中赋值
            clickShowAnswersButton(); //如果需要答案,先点击显示答案的按钮
        }
        var intervalId = window.setInterval(function() {
            if (document.readyState === "complete") { //页面完全加载后执行
                clearInterval(intervalId);
                var newPageBody = getReformattedContent(includeQuestions, includeAnswers);
                var titleElement = document.querySelector('.exam-title .title-txt');
                var subject = document.getElementsByClassName('subject-menu__title')[0].innerText;

                if (titleElement) { //如果有标题
                    var pageTitle = titleElement.textContent.trim();
                    var titleDiv = document.createElement('div');
                    titleDiv.id = 'page-title';
                    titleDiv.textContent = pageTitle;
                    newPageBody.insertBefore(titleDiv, newPageBody.firstChild);//将标题插入到页面的第一个元素之前
                } else {
                    console.log('Title element not found');
                }

                document.body.innerHTML = '';//先清空原页面所有内容
                document.body.appendChild(newPageBody);//插入新的内容，方便打印
                console.log("✅ 处理成功！");
                GM_notification(subject + ' | ' + pageTitle + "\n ✅ 试卷处理成功！");
                print();
            }
        }, 2000);
    }

    function getReformattedContent(includeQuestions, includeAnswers) {
        var newPageBody = document.createElement('div');
        newPageBody.id = 'zujuanjs-reformatted-content';

        // 获取存储的字体设置
        var customFont = GM_getValue('questionFont', '');
        var customSize = GM_getValue('questionSize', '');

        // 获取所有的题目元素
        var questions = document.querySelectorAll('.tk-quest-item.quesroot');

        // 遍历每个题目元素
        questions.forEach(function(question) {
            var newQuestionDiv = document.createElement('div');
            newQuestionDiv.className = 'zujuanjs-question';

             // 应用自定义字体
            if(customFont) newQuestionDiv.style.fontFamily = customFont;
            if(customSize) newQuestionDiv.style.fontSize = customSize;

            if (includeQuestions) {
                var questionContentDiv = question.querySelector('.wrapper.quesdiv');
                if (questionContentDiv) {

                    var clonedContent = questionContentDiv.cloneNode(true);
                    // 处理子元素字体
                    if (customFont) clonedContent.style.fontFamily = customFont + ' !important';
                    if (customSize) clonedContent.style.fontSize = customSize + ' !important';

                    //newQuestionDiv.appendChild(questionContentDiv.cloneNode(true));
                    var clonedContent = questionContentDiv.cloneNode(true);
                    if (customFont) clonedContent.style.fontFamily = customFont + ' !important';
                    if (customSize) clonedContent.style.fontSize = customSize + ' !important';
                    newQuestionDiv.appendChild(clonedContent);
                }
            }



            newPageBody.appendChild(newQuestionDiv);
        });

        return newPageBody;
    }

    function clickShowAnswersButton() {
        var checkboxSpan = document.querySelector('.tklabel-checkbox.show-answer');
        if (checkboxSpan) {
            var checkbox = checkboxSpan.querySelector('input[type="checkbox"]');
            if (checkbox && !checkbox.checked) {
                var label = checkboxSpan.querySelector('label');
                if (label) {
                    label.click();
                }
            }
        }
    }

    // 监听键盘事件--debug用
    document.addEventListener('keydown', function(e) {
        if (e.code === "Escape") {
            var newPageBody = getReformattedContent(true, false);
            var titleElement = document.querySelector('.exam-title .title-txt');
            if (titleElement) {
                var pageTitle = titleElement.textContent.trim();
                var titleDiv = document.createElement('div');
                titleDiv.id = 'page-title';
                titleDiv.textContent = pageTitle;
                newPageBody.insertBefore(titleDiv, newPageBody.firstChild);
            } else {
                console.log('❌ 无法找到题目');
            }
            document.body.innerHTML = '';
            document.body.appendChild(newPageBody);
        }
    });
})();

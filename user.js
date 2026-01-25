// ==UserScript==
// @name         组卷网学科网试卷处理下载打印
// @version      2.2.2
// @namespace
// @description  【2025/12/13】✨ 自动处理组卷网学科网试卷，并打印，支持去广告，答案分离。
// @author       nuym, WorkingFishQ
// @match        https://zujuan.xkw.com/zujuan
// @match        https://zujuan.xkw.com/zujuan/
// @match        https://zujuan.xkw.com/*.html
// @match        https://zujuan.xkw.com/gzsx/zhineng/*
// @match        https://zujuan.xkw.com/share-paper/*
// @icon         https://zujuan.xkw.com/favicon.ico
// @grant        GM_notification
// @grant        GM_setValue
// @grant        GM_getValue
// @require      https://fastly.jsdelivr.net/npm/sweetalert2@11
// @homepage     https://github.com/bzyzh/xkw-zujuan-script
// @license      GNU Affero General Public License v3.0
// ==/UserScript==

(function() {
    'use strict';
    console.log("✅ 程序加载成功");

    // 获取用户信息（添加null检查）
    const usernameElement = document.querySelector('.user-nickname');
    const username = usernameElement ? usernameElement.innerText : '未知用户';

    console.log("-----------------------------------------------");
    console.log("🔹版本：2.1.2");
    console.log("🔹作者：nuym、WorkingFishT");
    console.log("🔹开源地址：https://github.com/bzyzh/xkw-zujuan-script");
    console.log("🔹学校网站：https://www.bzyzh.com");
    console.log("🔹组卷网用户： %s", username);
    console.log("🔹亳州一中学生作品~");
    console.log("🔹由修改湛江一中学生");
    //console.log("🔹组卷网等级： %s", usertype);
    //console.log("🔹组卷网到期时间： %s", endtime);
    console.log("-----------------------------------------------");

    // 去除广告（添加null检查）
    const adElement = document.querySelector(".aside-pop.activity-btn");
    if (adElement) {
        adElement.remove();
        console.log("✅ 去除广告成功");
    }

    // 签到功能（优化逻辑，移除TODO）
    function checkIn() {
        const signInBtn = document.querySelector('a.sign-in-btn');
        const daySignInBtn = document.querySelector('a.day-sign-in');

        if (signInBtn) signInBtn.click();
        if (daySignInBtn) daySignInBtn.click();
    }

    function canCheckIn() {
        const signedInLink = document.querySelector('.user-assets-box a.assets-method[href="/score_task/"]');
        return !signedInLink || signedInLink.textContent.trim() !== '已签到';
    }

    function signInLogic() {
        if (canCheckIn()) {
            checkIn();
        }
    }

    // 调试函数（仅在开发时使用）
    function debug() {
        console.log('检查是否可以签到：', canCheckIn());
        signInLogic();
    }

    // 页面加载后执行签到
    window.addEventListener('load', debug, false);

    // 应用CSS样式
    const style = document.createElement('style');
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
        .zujuanjs-section-title {
            font-size: 1.5em;
            font-weight: bold;
            margin: 20px 0 10px 0;
        }
        .radio-group {
            display: flex;
            flex-wrap: wrap;
            justify-content: space-around;
            gap: 10px;
        }
        .radio-option {
            display: flex;
            align-items: center;
            font-size: 1.2em;
            padding: 10px;
            border: 1px solid #ddd;
            border-radius: 5px;
            cursor: pointer;
            transition: background-color 0.3s;
            width: 180px;
            justify-content: center;
        }
        .radio-option:hover {
            background-color: #f0f0f0;
        }
        .radio-option input {
            margin-right: 8px;
        }
    `;

    document.head.appendChild(style);

    // 查找目标元素并添加打印按钮（简化逻辑）
    console.log("🔹 查找将要添加的位置...");
    let targetElement = document.querySelector('.link-box') || document.querySelector('.btn-box.clearfix');
    let printButton;

    if (targetElement) {
        console.log("🔹 创建按钮对象...");
        printButton = document.createElement('a');
        printButton.className = "btnTestDown link-item anchor-font3";
        printButton.innerHTML = `<i class="icon icon-download1"></i><span>打印试卷</span>`;
        targetElement.appendChild(printButton);

        //createFontSelector();
        console.log("🔹 创建字体选择按钮对象...");
        var fontSelectButton = document.createElement('a');
        fontSelectButton.className = "btnTestDown link-item anchor-font3";
        fontSelectButton.innerHTML = `<i class="icon icon-download1"></i><span>字体选择</span>`;
        targetElement.appendChild(fontSelectButton);

        fontSelectButton.onclick = fontSelectButtonClickHandler;
        //fontSelectButtonClickHandler();

    } else {
        targetElement = document.querySelector('.btn.donwload-btn');
        if (targetElement) {
            printButton = document.createElement('a');
            printButton.id = "print-exam";
            printButton.className = "btn";
            printButton.innerHTML = `<i class="icon icon-download"></i><span>打印试卷</span>`;
            const btnBox = document.querySelector('.btn-box');
            if (btnBox) btnBox.appendChild(printButton);
        } else {
            showToast('error', '无法找到将要添加的位置，程序现在将停止');
            console.error("❌ 无法找到将要添加的位置，程序现在将停止");
            return;
        }
    }

    // 绑定点击事件
    printButton.onclick = printButtonClickHandler;

    // 显示成功Toast
    showToast('success', '程序已就绪!');
    console.log("✅ 程序已就绪!");

    // 提取Toast函数
    function showToast(icon, title) {
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
        Toast.fire({ icon, title });
    }

    // 打印按钮点击处理
    function printButtonClickHandler() {
        Swal.fire({
            title: "选择打印方式",
            html: `
                <div class="radio-group">
                    <label class="radio-option">
                        <input type="radio" name="print-option" value="questions" checked>
                        <span>仅打印试题</span>
                    </label>
                    <label class="radio-option">
                        <input type="radio" name="print-option" value="with_answers">
                        <span>和试题一起打印</span>
                    </label>
                    <label class="radio-option">
                        <input type="radio" name="print-option" value="answers_at_end">
                        <span>答案移至末尾</span>
                    </label>
                    <label class="radio-option">
                        <input type="radio" name="print-option" value="answers_only">
                        <span>单独打印答案</span>
                    </label>
                </div>
            `,
            confirmButtonText: '确定',
            confirmButtonColor: '#3085d6',
            cancelButtonText: '取消',
            showCancelButton: true,
            preConfirm: () => {
                const selected = document.querySelector('input[name="print-option"]:checked');
                if (!selected) {
                    Swal.showValidationMessage('请选择一个选项!');
                    return false;
                }
                return selected.value;
            }
        }).then((result) => {
            if (result.isConfirmed) {
                const choice = result.value;
                let includeQuestions = false;
                let includeAnswers = false;
                let answersAtEnd = false;

                if (choice === 'questions') {
                    includeQuestions = true;
                } else if (choice === 'with_answers') {
                    includeQuestions = true;
                    includeAnswers = true;
                } else if (choice === 'answers_at_end') {
                    includeQuestions = true;
                    answersAtEnd = true;
                } else if (choice === 'answers_only') {
                    includeAnswers = true;
                }

                // 最终调用打印处理
                handlePrint(includeQuestions, includeAnswers, answersAtEnd);
            }
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
                };
            }
        }).then((result) => {
            if (result.isConfirmed) {
                GM_setValue('questionFont', result.value.font);
                GM_setValue('questionSize', result.value.size);
                Swal.fire('已保存！', '', 'success');
            }
        });
    }


    // 处理打印（优化：移除interval，使用事件监听）
    function handlePrint(includeQuestions, includeAnswers, answersAtEnd) {
        if (includeAnswers || answersAtEnd) {
            clickShowAnswersButton();
            // 等待答案加载完成
            setTimeout(() => {
                performPrint(includeQuestions, includeAnswers, answersAtEnd);
            }, 2000);
        } else {
            performPrint(includeQuestions, includeAnswers, answersAtEnd);
        }
    }

    function performPrint(includeQuestions, includeAnswers, answersAtEnd) {
        const newPageBody = getReformattedContent(includeQuestions, includeAnswers, answersAtEnd);
        const titleElement = document.querySelector('.exam-title .title-txt');
        const subjectElement = document.querySelector('.subject-menu__title');
        const subject = subjectElement ? subjectElement.innerText : '未知科目';

        if (titleElement) {
            const pageTitle = titleElement.textContent.trim();
            const titleDiv = document.createElement('div');
            titleDiv.id = 'page-title';
            titleDiv.textContent = pageTitle;
            newPageBody.insertBefore(titleDiv, newPageBody.firstChild);
            GM_notification(`${subject} | ${pageTitle}\n ✅ 试卷处理成功！`);
        } else {
            console.log('Title element not found');
        }

        document.body.innerHTML = '';
        document.body.appendChild(newPageBody);
        console.log("✅ 处理成功！");
        window.print();
    }

    // 获取重新格式化的内容
    function getReformattedContent(includeQuestions, includeAnswers, answersAtEnd) {
        const newPageBody = document.createElement('div');
        newPageBody.id = 'zujuanjs-reformatted-content';

        // 获取存储的字体设置
        var customFont = GM_getValue('questionFont', '');
        var customSize = GM_getValue('questionSize', '');

        const answersSection = [];

        // 找到所有标题和问题，按顺序添加
        const sections = document.querySelectorAll('.sec-title, .tk-quest-item.quesroot');
        sections.forEach((section) => {
            if (section.classList.contains('sec-title')) {
                // 添加标题，只取 span 的文本
                const span = section.querySelector('span');
                if (span) {
                    const titleDiv = document.createElement('div');
                    titleDiv.className = 'zujuanjs-section-title';
                    titleDiv.textContent = span.textContent.trim();
                    newPageBody.appendChild(titleDiv);
                }
            } else if (section.classList.contains('tk-quest-item') && section.classList.contains('quesroot')) {
                // 添加问题
                const newQuestionDiv = document.createElement('div');
                newQuestionDiv.className = 'zujuanjs-question';

                // 应用自定义字体
                if (customFont) newQuestionDiv.style.fontFamily = customFont;
                if (customSize) newQuestionDiv.style.fontSize = customSize;

                const quesdiv = section.querySelector('.wrapper.quesdiv');
                if (quesdiv) {
                    if (includeQuestions) {
                        const cntDiv = quesdiv.querySelector('.exam-item__cnt');
                        if (cntDiv) {
                            var clonedContent = cntDiv.cloneNode(true);
                            // 处理子元素字体
                            if (customFont) clonedContent.style.fontFamily = customFont + ' !important';
                            if (customSize) clonedContent.style.fontSize = customSize + ' !important';
                            newQuestionDiv.appendChild(clonedContent);
                        }
                    }
                    if (includeAnswers) {
                        const optDiv = quesdiv.querySelector('.exam-item__opt');
                        if (optDiv) {
                            // 移除 knowledge-box
                            const knowledgeBox = optDiv.querySelector('.knowledge-box');
                            if (knowledgeBox) knowledgeBox.remove();
                            newQuestionDiv.appendChild(optDiv.cloneNode(true));
                        }
                    } else if (answersAtEnd) {
                        // 收集答案
                        const optDiv = quesdiv.querySelector('.exam-item__opt');
                        if (optDiv) {
                            // 移除 knowledge-box
                            const knowledgeBox = optDiv.querySelector('.knowledge-box');
                            if (knowledgeBox) knowledgeBox.remove();
                            answersSection.push(optDiv.cloneNode(true));
                        }
                    }
                }

                newPageBody.appendChild(newQuestionDiv);
            }
        });

        if (answersAtEnd) {
            const answersTitle = document.createElement('div');
            answersTitle.className = 'zujuanjs-section-title';
            answersTitle.textContent = '答案与解析';
            newPageBody.appendChild(answersTitle);
            answersSection.forEach(answer => newPageBody.appendChild(answer));
        }

        return newPageBody;
    }

    // 点击显示答案按钮
    function clickShowAnswersButton() {
        // 1. Use querySelectorAll to get ALL matching elements
        const allQuesDivs = document.querySelectorAll('.wrapper.quesdiv');

        // 2. Iterate through each element
        allQuesDivs.forEach(quesDivCheckbox => {
            if (!quesDivCheckbox.checked) {
                console.log("a");

                // Try to click corresponding label for this specific checkbox
                const label = quesDivCheckbox.closest('label') || document.querySelector(`label[for="${quesDivCheckbox.id}"]`);

                if (label) {
                    label.click();
                    console.log("b");
                } else {
                    quesDivCheckbox.click();
                    console.log('c');
                }
            }
        });

        // Old structure check (Runs independently now, or you can wrap it in an 'else' if the page never has both)
        const checkboxSpan = document.querySelector('.tklabel-checkbox.show-answer');
        if (checkboxSpan) {
            const checkbox = checkboxSpan.querySelector('input[type="checkbox"]');
            if (checkbox && !checkbox.checked) {
                const label = checkboxSpan.querySelector('label');
                if (label) label.click();
            }
        }
    }
})();

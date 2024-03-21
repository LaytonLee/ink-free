"use strict";

/**
 * this script is modified from: https://www.dannyguo.com/blog/how-to-add-copy-to-clipboard-buttons-to-code-blocks-in-hugo/
 */
document.addEventListener("DOMContentLoaded", () => {
    if (navigator && navigator.clipboard) {
        addCopyButtons(navigator.clipboard);
    } else {
        var script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/clipboard-polyfill/2.7.0/clipboard-polyfill.promise.js';
        script.integrity = 'sha256-waClS2re9NUbXRsryKoof+F9qc1gjjIhc2eT7ZbIv94=';
        script.crossOrigin = 'anonymous';
        script.onload = function() {
            addCopyButtons(clipboard);
        };
    
        document.body.appendChild(script);
    }
});

function addCopyButtons(clipboard) {
    document.querySelectorAll('pre > code').forEach(function (codeBlock) {
        var button = document.createElement('button');
        button.className = 'copy-code-button';
        button.type = 'button';
        button.innerHTML = feather.icons.copy.toSvg();

        // remove extra \n create by <span style="display:flex;">
        var codeText = codeBlock.innerText;
        var preparedCode = codeText.replace(/\n\n/g, "\n");

        button.addEventListener('click', function () {
            clipboard.writeText(preparedCode).then(function () {
                /* Chrome doesn't seem to blur automatically,
                   leaving the button in a focused state. */
                button.blur();

                button.innerHTML = feather.icons.check.toSvg({'color': 'green'});

                setTimeout(function () {
                    button.innerHTML = feather.icons.copy.toSvg();
                }, 2000);
            }, function (error) {
                button.innerText = 'Error';
            });
        });

        var pre = codeBlock.parentNode;
        if (pre.parentNode.classList.contains('highlight')) {
            var highlight = pre.parentNode;
            highlight.appendChild(button);
        } else {
            pre.parentNode.insertBefore(button, pre);
        }
    });
}
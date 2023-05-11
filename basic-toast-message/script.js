/* 
    * by default, the div#toast will be empty,
    * you must set the div.toast for it through parameters of function
*/
function toast({ title = '', message = '', type = 'info', duration = 3000 }) {
    const main = document.getElementById('toast');
    if (main) {
        const toast = document.createElement('div');

        const autoRemove = setTimeout(function() {
            main.removeChild(toast);
        }, duration + 1000);

        toast.onclick = function(e) {
            if (e.target.closest('.toast__close')) {
                main.removeChild(toast);
                clearTimeout(autoRemove);
            }
        }

        const icon = {
            success : 'fa-check-circle',
            info : 'fa-info-circle',
            warning : 'fa-exclamation-circle',
            error : 'fa-exclamation-circle',
        }
        const correspondingIcon = icon[type];

        toast.classList.add('toast', `toast--${type}`);
        toast.style.animation = `slide-from-left ease 2s, fade-out linear 1s ${duration/1000}s forwards`;
        toast.innerHTML = `
            <div class="toast__icon">
                <i class="fas ${correspondingIcon}"></i>
            </div>
            <div class="toast__body">
                <h3 class="toast__title">${title}</h3>
                <p class="toast__msg">${message}</p>
            </div>
            <div class="toast__close">
                <i class="fas fa-times"></i>
            </div>
        `
        main.appendChild(toast);
    }
}

function showSuccessToast() {
    toast({
        title: 'Success',
        message: 'This is success toast message',
        type: 'success',
        duration: 3000,
    })
}

function showErrorToast() {
    toast({
        title: 'Error',
        message: 'This is error toast message',
        type: 'error',
        duration: 3000,
    })
}


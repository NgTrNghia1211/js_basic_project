/* 
    * bind() function can help an object borrow a method from another object.
    * use bind(document) to $ means that $ can replace document.querySelector
    * {
    *   document.querySelector has been bind to document then assign to $ ?
    * }
*/
const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

/* 
    * get all tags that have class tab-item and tab-pane;
*/
const tabs = $$('.tab-item');
const panes = $$('.tab-pane');

//  * check if success
console.log(tabs, panes);

//  * js for the underline
const activeTab = $('.tab-item.active');
const line = $('.tabs .line')

line.style.left = activeTab.offsetLeft;
line.style.width = activeTab.offsetWidth + 'px';


/* 
    * each tab relate to a specific pane so can use index of tab to active pane
*/

tabs.forEach((tab, index) => {
    const pane = panes[index];
    tab.onclick = function() {
        $('.tab-item.active').classList.remove('active');
        $('.tab-pane.active').classList.remove('active');

        this.classList.add('active');
        pane.classList.add('active');
        line.style.left = this.offsetLeft + 'px';
        line.style.width = this.offsetWidth + 'px';
        // console.log(tab);
    }
})
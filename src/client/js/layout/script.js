/*Function to stay navigation bar allways on top screen */

window.onscroll = function navScroll() {
 //debugger;

    var navbar = document.getElementById("navbar");
    var header = document.getElementById("head");
    var stickyhead = header.clientHeight;
    var sticky = navbar.offsetTop;

    if (window.pageYOffset - stickyhead <=sticky) {
      navbar.classList.remove("sticky");
    }else{
      navbar.classList.add("sticky")
   }
}

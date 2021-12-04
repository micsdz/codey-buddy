// Menu Hidden
const navMenu = document.getElementById('nav-menu'),
    navToggle = document.getElementById('nav-toggle'),
    navClose = document.getElementById('nav-close')
// Menu Show 
if(navToggle){
    navToggle.addEventListener('click', () =>{
        navMenu.classList.add('show-menu');
    })
}
// Menu Hidden
if(navClose){ 
    navClose.addEventListener('click', () =>{
        navMenu.classList.remove('show-menu');
    })
}
// Remove Mobile Menu
const navLink = document.querySelectorAll('.nav_link')

function linkAction(){
    const navMenu = document.getElementById('nav-menu')
    // When we click on each nav__link, we remove the show-menu class
    navMenu.classList.remove('show-menu')
}
navLink.forEach(n => n.addEventListener('click', linkAction))

// Autocomplete widget
$(function () {
    var languageNames = [
      'Argus',
      'BETA',
      'C',
      'C#',
      'C++',
      'CSS',
      'Dart',
      'Express.js',
      'Git',
      'Go',
      'HTML',
      'Java',
      'JavaScript',
      'jQuery',
      'JSON',
      'Kotlin',
      'MATLAB',
      'MySQL',
      'Node.js',
      'NoSQL',
      'Pearl',
      'PHP',
      'Python',
      'R',
      'React',
      'Ruby',
      'Rust',
      'Scala',
      'Swift',
      'Typescript',
    ];
    $('#search-here').autocomplete({
      source: languageNames,
    });
  });
// $(".nav-item a").on('click', function(){
//     $(".nav-item a").removeClass("active");
//     $(this).addClass("active");
// });
// $(".tab-pane").on('click', function(){
//     $(".tab-pane").removeClass("show active");
//     $(this).addClass("show active");
// })
$(document).ready(function() {
    var navItems = document.querySelector('.nav.nav-tabs').children;
    var tabPanes = document.querySelectorAll('.tab-pane');
    for(let i=0; i < navItems.length; i++) {
    navItems[i].addEventListener('click', navItemClick);
    }
    
    function navItemClick() {
    for(let i=0; i < navItems.length; i++) {
    navItems[i].children[0].classList.remove('active');
    tabPanes[i].classList.remove('in');
    tabPanes[i].classList.remove('show');
    tabPanes[i].classList.remove('active');
    console.log(tabPanes[i]);
    }
    this.children[0].classList.add('active');
    let attr = this.children[0].getAttribute('href');
    $(attr).addClass('in show active');
    }
    });
/* About the Developers Swiper */
let swiperPortfolio = new Swiper('.portfolio_container', {
    cssMode: true,
    loop: true,

    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
    pagination: {
      el: '.swiper-pagination',
      clickable: true,
    },
})
/* Active Links */
const sections = document.querySelectorAll('section[id]')

function scrollActive(){
    const scrollY = window.pageYOffset

    sections.forEach(current =>{
        const sectionHeight = current.offsetHeight
        const sectionTop = current.offsetTop - 50;
        sectionId = current.getAttribute('id')

        if(scrollY > sectionTop && scrollY <= sectionTop + sectionHeight){
            document.querySelector('.nav_menu a[href*=' + sectionId + ']').classList.add('active-link')
        }else{
            document.querySelector('.nav_menu a[href*=' + sectionId + ']').classList.remove('active-link')
        }
    })
}
window.addEventListener('scroll', scrollActive)

/* Background Header */ 
function scrollHeader(){
    const nav = document.getElementById('header');
    if(this.scrollY >= 80) nav.classList.add('scroll-header'); else nav.classList.remove('scroll-header');
}
window.addEventListener('scroll', scrollHeader)

/* Scroll Top Icon */ 
function scrollTop(){
    let scrollTop = document.getElementById('scroll-top');
    // When the scroll is higher than 560 viewport height, add the show-scroll class to the a tag with the scroll-top class
    if(this.scrollY >= 200) scrollTop.classList.add('show-scroll'); else scrollTop.classList.remove('show-scroll')
}
window.addEventListener('scroll', scrollTop)


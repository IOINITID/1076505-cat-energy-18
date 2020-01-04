'use strict';

let navigation = document.querySelector('.navigation');
let navigationToggle = document.querySelector('.navigation__toggle');

navigation.classList.add('navigation--closed');

navigationToggle.addEventListener('click', function (evt) {
  evt.preventDefault();
  if (navigation.classList.contains('navigation--closed')) {
    navigation.classList.remove('navigation--closed');
    navigation.classList.add('navigation--opened');
  } else {
    navigation.classList.add('navigation--closed');
    navigation.classList.remove('navigation--opened');
  }
});

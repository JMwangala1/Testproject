// Make navbar background change when scrolling

window.addEventListener('scroll', () => {
  const body = document.body;
  if (window.scrollY > 50) {
    body.classList.add('scrolled');
  } else {
    body.classList.remove('scrolled');
  }
});

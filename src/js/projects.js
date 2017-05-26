(function () {
  var expandBtns = document.querySelectorAll('.click-to-expand')
  var thumbnails = document.querySelectorAll('.thumbnails img')

  expandBtns.forEach(function (el) {
    el.onclick = function () {
      expandProject(el.dataset.project)
    }
  })

  thumbnails.forEach(function (img) {
    img.onclick = function () {
      var parentContainer = img.closest('.project')
      var activeScreenshot = parentContainer.querySelector('.img-container.ss img')
      var newScreenshotSrc = img.src.replace('-thumbnail.jpg', '.png')
      var newThumbnailSrc = activeScreenshot.src.replace('.png', '-thumbnail.jpg')

      activeScreenshot.src = newScreenshotSrc
      img.src = newThumbnailSrc
    }
  })

  function expandProject (project) {
    var projectEls = document.querySelectorAll('.project')
    var activeProject = document.getElementById(project)

    projectEls.forEach(function (el) {
      el.classList.remove('active')
    })
    activeProject.classList.add('active')

    var closeBtns = document.querySelectorAll('.click-to-close')
    closeBtns.forEach(function (btn) {
      btn.onclick = function ()  {
        closeProject(btn.dataset.project, btn)
      }
    })
  }

  function closeProject (project, closeBtn) {
    var projectEl = document.getElementById(project)
    projectEl.classList.remove('active')
  }
})()
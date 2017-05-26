(function () {
  var expandBtns = document.querySelectorAll('.click-to-expand')

  expandBtns.forEach(function (el) {
    el.onclick = function () {
      expandProject(el.dataset.project)
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
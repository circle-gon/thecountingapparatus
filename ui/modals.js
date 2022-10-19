const modal = document.getElementById("modal")
const content = document.getElementById("content")
const close = document.getElementById("close")

const exampleModals = {
  ex: "123 456 789 012"
}

close.onclick = function () {
  hideModal()
}
export function showModal(i) {
  modal.style.display = "block"
  content.innerHTML = exampleModals[i]
}

export function hideModal() {
  modal.style.display = "none"
}

window.showModal = showModal
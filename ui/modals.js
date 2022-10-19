const modal = document.getElementById("modal")
const content = document.getElementById("content")
const close = document.getElementById("close")

const exampleModals = {
  ex: "123 456 789 012"
}

close.onclick = () => {
  modal.style.display = "none"
}
export function showModal(i) {
  modal.style.display = "block"
  content.innerHTML = exampleModals[i]
}

window.showModal = showModal
// Majors data with descriptions and slugs
const majors = [
  { name: "Biomedical Engineering", slug: "biomedical.html", short: "Medical devices, bio-systems and healthcare tech." },
  { name: "Chemical Engineering", slug: "chemical.html", short: "Process design, materials, and energy." },
  { name: "Civil Engineering", slug: "civil.html", short: "Infrastructure, structures, and environmental design." },
  { name: "Electrical Engineering", slug: "electrical.html", short: "Circuits, power systems, and electronics." },
  { name: "Materials Engineering", slug: "materials.html", short: "Materials science, testing and development." },
  { name: "Mechanical Engineering", slug: "mechanical.html", short: "Mechanics, design, and thermal systems." }
]

function renderMajors(filter = ''){
  const container = document.getElementById('majors-container')
  container.innerHTML = ''
  const q = filter.trim().toLowerCase()
  majors.filter(m => !q || (m.name+ ' ' + (m.short||'')).toLowerCase().includes(q))
    .forEach(m => {
      const a = document.createElement('a')
      a.className = 'card'
      a.href = m.slug
      a.innerHTML = `
        <strong>${m.name}</strong>
        <div class="muted">${m.short}</div>
      `
      container.appendChild(a)
    })
}

document.addEventListener('DOMContentLoaded', ()=>{
  renderMajors()
  const search = document.getElementById('search')
  if(search){
    search.addEventListener('input', (e)=> renderMajors(e.target.value))
  }
})

// Biomedical circle menu interactions
document.addEventListener('DOMContentLoaded', ()=>{
  const main = document.getElementById('bio-circle-main')
  const buttons = document.getElementById('bio-circle-buttons')
  if(!main || !buttons) return

  main.addEventListener('click', ()=>{
    const open = buttons.classList.toggle('open')
    buttons.setAttribute('aria-hidden', (!open).toString())
  })

  buttons.addEventListener('click', (e)=>{
    const btn = e.target.closest('.circle-btn')
    if(!btn) return
    const targetId = btn.dataset.target
    if(!targetId) return

    // hide other panels
    document.querySelectorAll('.bio-panel').forEach(p=> p.classList.remove('active'))
    const panel = document.getElementById(targetId)
    if(panel){
      panel.classList.add('active')
      panel.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  })
})

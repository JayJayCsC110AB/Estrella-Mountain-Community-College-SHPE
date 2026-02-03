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
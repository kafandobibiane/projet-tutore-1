const matrice_sans_action = [
  [0.65, 0.20, 0.10, 0.05],
  [0.25, 0.45, 0.20, 0.10],
  [0.10, 0.20, 0.40, 0.30],
  [0.00, 0.00, 0.00, 1.00]
]

const matrice_avec_actions = [
  [0.80, 0.12, 0.05, 0.03],
  [0.40, 0.35, 0.15, 0.10],
  [0.20, 0.25, 0.35, 0.20],
  [0.00, 0.00, 0.00, 1.00]
]

function arrondir(x){
  return Math.round((x + Number.EPSILON) * 100) / 100
}

function simuler(clients, matrice, nombreMois){
  const etats = []
  let current = clients.map(x=>Number(x))
  etats.push({mois:0,fidele:arrondir(current[0]),passif:arrondir(current[1]),aRisque:arrondir(current[2]),perdu:arrondir(current[3]),total:arrondir(current.reduce((s,v)=>s+v,0))})
  for(let m=1;m<=nombreMois;m++){
    const next = [0,0,0,0]
    for(let i=0;i<4;i++){
      for(let j=0;j<4;j++){
        next[j] += current[i]*matrice[i][j]
      }
    }
    current = next
    etats.push({mois:m,fidele:arrondir(current[0]),passif:arrondir(current[1]),aRisque:arrondir(current[2]),perdu:arrondir(current[3]),total:arrondir(current.reduce((s,v)=>s+v,0))})
  }
  return etats
}

let dernierSans = null
let dernierAvec = null

function afficherTable(resultats){
  const tbody = document.querySelector('#tableResultats tbody')
  tbody.innerHTML = ''
  resultats.forEach((r,i)=>{
    const tr = document.createElement('tr')
    if(i===resultats.length-1){tr.style.fontWeight='700'}
    tr.innerHTML = `<td style="text-align:center">${r.mois}</td><td>${r.fidele.toFixed(2)}</td><td>${r.passif.toFixed(2)}</td><td>${r.aRisque.toFixed(2)}</td><td>${r.perdu.toFixed(2)}</td><td>${r.total.toFixed(2)}</td>`
    tbody.appendChild(tr)
  })
}

function afficherComparaison(sans,avec){
  dernierSans = sans[sans.length-1]
  dernierAvec = avec[avec.length-1]
  const tbody = document.querySelector('#tableComparaison tbody')
  tbody.innerHTML = ''
  const totalSans = dernierSans.total
  const totalAvec = dernierAvec.total
  const rowSans = document.createElement('tr')
  rowSans.innerHTML = `<td style="text-align:left">Sans action</td><td>${dernierSans.fidele.toFixed(2)}</td><td>${dernierSans.passif.toFixed(2)}</td><td>${dernierSans.aRisque.toFixed(2)}</td><td>${dernierSans.perdu.toFixed(2)}</td><td>${totalSans.toFixed(2)}</td>`
  const rowAvec = document.createElement('tr')
  rowAvec.innerHTML = `<td style="text-align:left">Avec actions</td><td>${dernierAvec.fidele.toFixed(2)}</td><td>${dernierAvec.passif.toFixed(2)}</td><td>${dernierAvec.aRisque.toFixed(2)}</td><td>${dernierAvec.perdu.toFixed(2)}</td><td>${totalAvec.toFixed(2)}</td>`
  const diffF = (dernierAvec.fidele - dernierSans.fidele)
  const diffP = (dernierAvec.passif - dernierSans.passif)
  const diffA = (dernierAvec.aRisque - dernierSans.aRisque)
  const diffX = (dernierAvec.perdu - dernierSans.perdu)
  const rowDiff = document.createElement('tr')
  const tdF = `<td>${diffF.toFixed(2)}</td>`
  const tdP = `<td>${diffP.toFixed(2)}</td>`
  const tdA = `<td>${diffA.toFixed(2)}</td>`
  const tdX = `<td>${diffX.toFixed(2)}</td>`
  rowDiff.innerHTML = `<td style="text-align:left">Différence</td>${tdF}${tdP}${tdA}${tdX}<td>${(totalAvec-totalSans).toFixed(2)}</td>`
  tbody.appendChild(rowSans)
  tbody.appendChild(rowAvec)
  tbody.appendChild(rowDiff)
  const cells = rowDiff.querySelectorAll('td')
  const valF = diffF
  const valP = diffP
  const valA = diffA
  const valX = diffX
  if(valF>0){cells[0].style.color='green'}else{cells[0].style.color='red'}
  if(valP<0){cells[1].style.color='green'}else{cells[1].style.color='red'}
  if(valA<0){cells[2].style.color='green'}else{cells[2].style.color='red'}
  if(valX<0){cells[3].style.color='green'}else{cells[3].style.color='red'}
}

function lireParams(){
  const fidele = Number(document.getElementById('fidele').value)
  const passif = Number(document.getElementById('passif').value)
  const aRisque = Number(document.getElementById('aRisque').value)
  const perdu = Number(document.getElementById('perdu').value)
  const mois = Number(document.getElementById('mois').value)
  return {clients:[fidele,passif,aRisque,perdu],mois}
}

let dernierResultSans = null
let dernierResultAvec = null

document.getElementById('btnSans').addEventListener('click',()=>{
  const p = lireParams()
  const res = simuler(p.clients,matrice_sans_action,p.mois)
  dernierResultSans = res
  afficherTable(res)
  if(dernierResultAvec){afficherComparaison(res,dernierResultAvec)}
})

document.getElementById('btnAvec').addEventListener('click',()=>{
  const p = lireParams()
  const res = simuler(p.clients,matrice_avec_actions,p.mois)
  dernierResultAvec = res
  afficherTable(res)
  if(dernierResultSans){afficherComparaison(dernierResultSans,res)}
})
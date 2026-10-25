/* Atlas des manifs : logique du site (aucune dépendance) */
(function(){
"use strict";

var D = window.ATLAS || {mouvements:[], manifs:[], pancartes:[], tactiques:[]};
var FACETS = {
  registre:{label:"Registre", values:["Jeu de mots","Revendication","Cri de colère","Ironie","Mème et culture web","Détournement","Témoignage","Question rhétorique"]},
  procede:{label:"Procédé", values:["Paronymie","Homonymie","Double sens","Antithèse","Rime","Parallélisme","Bilinguisme","Formule détournée"]},
  sujet:{label:"Sujet", values:["Moyens","Effectifs","Profs absents","Bâtiments","Parcoursup","Violences policières","Gouvernement","Génération","Démocratie","Vie chère","Climat","Féminisme","Travail","Logement"]},
  forme:{label:"Forme", values:["Carton au marqueur","Peinture","Dessin","Collage","Banderole","Costume","Objet détourné","Inscription","Non précisée"]},
  references:{label:"Références", values:["Pop culture","Histoire de l’art","TikTok et web","Slogans historiques"]}
};
var TYPES = ["Blocus","Manifestation lycéenne","Manifestation nationale","Journée interprofessionnelle","Journée de mobilisation","Grève interprofessionnelle","Marche pour le climat","Manifestation féministe","Rassemblement","Autre"];
var FAMILLES = [
  {id:"costumes", label:"Costumes et personnages", color:"#2346C2"},
  {id:"gonflables", label:"Objets gonflables et détournés", color:"#C9A800"},
  {id:"banderoles", label:"Banderoles et accrochages", color:"#16804A"},
  {id:"performance", label:"Danse, musique, performance", color:"#7A4FD0"},
  {id:"numerique", label:"Numérique", color:"#0F8FA8"},
  {id:"blocage", label:"Blocage et occupation", color:"#13213F"},
  {id:"protection", label:"Protection et soin", color:"#2E9E63"},
  {id:"documentation", label:"Documenter", color:"#5470C9"}
];

var S = {
  f:{q:"", manif:null, type:null, mouvement:null, ville:"", registre:[], procede:[], sujet:[], forme:[], references:[]},
  sort:"date", tq:"", tfam:null, mtype:null, bigIdx:-1
};

function $(id){return document.getElementById(id);}
function esc(s){return String(s==null?"":s).replace(/[&<>"']/g,function(c){return {"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;"}[c];});}
function arr(x){return Array.isArray(x)?x:(x?[x]:[]);}
function hash(s){var h=0;for(var i=0;i<s.length;i++){h=(h*31+s.charCodeAt(i))|0;}return Math.abs(h);}
function safeUrl(u){u=String(u||"").trim(); return /^https?:\/\//i.test(u)?u:"";}
var MOIS=["janvier","février","mars","avril","mai","juin","juillet","août","septembre","octobre","novembre","décembre"];
function fmtDate(d,short){ if(!d) return ""; var p=String(d).split("-"); if(p.length<3) return d; return (+p[2])+" "+MOIS[+p[1]-1]+(short?"":" "+p[0]); }
function famOf(id){for(var i=0;i<FAMILLES.length;i++) if(FAMILLES[i].id===id) return FAMILLES[i]; return {id:id,label:id||"Autre",color:"#4A5878"};}
function manif(slug){for(var i=0;i<D.manifs.length;i++) if(D.manifs[i].slug===slug) return D.manifs[i]; return null;}
function mouvement(id){for(var i=0;i<D.mouvements.length;i++) if(D.mouvements[i].id===id) return D.mouvements[i]; return null;}
function pMouvement(p){ var m=manif(p.manif); return p.mouvement || (m&&m.mouvement) || ""; }
function pType(p){ var m=manif(p.manif); return m?m.type:""; }
function pDate(p){ var m=manif(p.manif); return p.date || (m&&m.date) || ""; }
function htagLink(p){
  var m=manif(p.manif);
  if(m) return '<a class="htag" href="#manifs/'+esc(m.slug)+'">'+esc(m.hashtag)+'</a>';
  var mv=mouvement(pMouvement(p));
  if(mv) return '<a class="htag" href="#manifs">'+esc(mv.hashtag)+'</a>';
  return "";
}
function countFor(slug){ return D.pancartes.filter(function(p){return p.manif===slug;}).length; }

/* ---------- routing ---------- */
var TABS=["pancartes","manifs","tactiques","contribuer","ressources"];
function route(){
  var h=decodeURIComponent((location.hash||"").replace("#","")), parts=h.split("/"), t=parts[0];
  if(TABS.indexOf(t)<0) t="pancartes";
  TABS.forEach(function(x){
    $("v-"+x).classList.toggle("on",x===t);
    var a=document.querySelector('nav.tabs a[data-tab="'+x+'"]');
    if(a){ if(x===t) a.setAttribute("aria-current","page"); else a.removeAttribute("aria-current"); }
  });
  if(t==="manifs"){
    var m=parts[1]?manif(parts[1]):null;
    $("manifsList").hidden=!!m; $("manifDetail").hidden=!m;
    if(m) renderManifDetail(m); else renderManifs();
    document.title=m?(m.hashtag+" · Atlas des manifs"):"Manifs · Atlas des manifs";
  } else document.title="Atlas des manifs";
  window.scrollTo(0,0);
}
window.addEventListener("hashchange",route);

/* ---------- pancartes : filtres ---------- */
function matches(p, skip){
  var f=S.f;
  if(f.q){ var hay=(p.texte+" "+(p.ville||"")+" "+(p.note||"")+" "+(manif(p.manif)?manif(p.manif).hashtag+" "+manif(p.manif).nom:"")).toLowerCase(); if(hay.indexOf(f.q.toLowerCase().replace(/^#/,""))<0 && hay.indexOf(f.q.toLowerCase())<0) return false; }
  if(skip!=="manif" && f.manif && p.manif!==f.manif) return false;
  if(skip!=="type" && f.type && pType(p)!==f.type) return false;
  if(skip!=="mouvement" && f.mouvement && pMouvement(p)!==f.mouvement) return false;
  if(skip!=="ville" && f.ville && p.ville!==f.ville) return false;
  for(var k in FACETS){
    if(k===skip) continue;
    var sel=f[k]; if(!sel.length) continue;
    var vals=arr(p[k]);
    for(var i=0;i<sel.length;i++) if(vals.indexOf(sel[i])<0) return false;
  }
  return true;
}
function sorted(list){
  list=list.slice();
  if(S.sort==="pepite") list.sort(function(a,b){return (b.pepite?1:0)-(a.pepite?1:0)||pDate(b).localeCompare(pDate(a));});
  else if(S.sort==="old") list.sort(function(a,b){return pDate(a).localeCompare(pDate(b));});
  else list.sort(function(a,b){return pDate(b).localeCompare(pDate(a));});
  return list;
}
function renderFilters(){
  // types
  var tc={}; D.pancartes.forEach(function(p){ if(!matches(p,"type")) return; var t=pType(p); if(t) tc[t]=(tc[t]||0)+1; });
  var types=[]; D.manifs.forEach(function(m){ if(types.indexOf(m.type)<0) types.push(m.type); });
  $("fType").innerHTML=types.map(function(t){
    return '<button type="button" class="chip'+(tc[t]?'':' zero')+'" data-type="'+esc(t)+'" aria-pressed="'+(S.f.type===t)+'">'+esc(t)+'<span class="n">'+(tc[t]||0)+'</span></button>';
  }).join("");
  // manifs
  var ms=D.manifs.filter(function(m){return !S.f.type || m.type===S.f.type;}).sort(function(a,b){return (b.date||"").localeCompare(a.date||"");});
  var h='<button class="jbtn" type="button" data-j="" aria-pressed="'+(!S.f.manif)+'"><span class="d">Toutes</span><span class="n">'+D.pancartes.filter(function(p){return matches(p,"manif");}).length+'</span></button>';
  ms.forEach(function(m){
    var n=D.pancartes.filter(function(p){return p.manif===m.slug && matches(p,"manif");}).length;
    h+='<button class="jbtn" type="button" data-j="'+esc(m.slug)+'" aria-pressed="'+(S.f.manif===m.slug)+'"><span><span class="d">'+esc(m.hashtag)+'</span><br><small>'+esc(m.nom)+'</small></span><span class="n">'+n+'</span></button>';
  });
  $("fJ").innerHTML=h;
  // villes
  var villes={}; D.pancartes.forEach(function(p){ if(p.ville) villes[p.ville]=1; });
  var vs=Object.keys(villes).sort(function(a,b){return a.localeCompare(b,"fr");});
  $("fVille").innerHTML='<option value="">Toutes les villes</option>'+vs.map(function(v){return '<option'+(v===S.f.ville?' selected':'')+'>'+esc(v)+'</option>';}).join("");
  // critères
  var box="";
  var amv=S.f.mouvement?mouvement(S.f.mouvement):null;
  if(amv) box+='<div class="fgroup"><h3>Mouvement</h3><div class="chips"><button type="button" class="chip" data-clearmvt="1" aria-pressed="true">'+esc(amv.hashtag)+' ✕</button></div></div>';
  for(var k in FACETS){
    var counts={};
    D.pancartes.forEach(function(p){ if(!matches(p,k)) return; arr(p[k]).forEach(function(v){counts[v]=(counts[v]||0)+1;}); });
    var vals=FACETS[k].values.slice();
    Object.keys(counts).forEach(function(v){ if(vals.indexOf(v)<0) vals.push(v); });
    var chips=vals.filter(function(v){return counts[v]||S.f[k].indexOf(v)>=0;}).map(function(v){
      return '<button type="button" class="chip" data-k="'+k+'" data-v="'+esc(v)+'" aria-pressed="'+(S.f[k].indexOf(v)>=0)+'">'+esc(v)+'<span class="n">'+(counts[v]||0)+'</span></button>';
    }).join("");
    if(chips) box+='<div class="fgroup"><h3>'+FACETS[k].label+'</h3><div class="chips">'+chips+'</div></div>';
  }
  $("facetBox").innerHTML=box;
}
function cardHtml(p){
  var h=hash(p.id||p.texte), cls="card"+(h%3===1?" g":"")+(h%4===2?" h":"");
  return '<article class="'+cls+'" tabindex="0" role="button" data-id="'+esc(p.id)+'" aria-label="'+esc(p.texte)+'">'+
    (p.pepite?'<span class="star">Pépite</span>':'')+
    (p.photo&&p.photo.fichier?'<span class="ph">photo</span>':'')+
    '<div class="face seyes"><div class="slogan"><span>'+esc(p.texte)+'</span></div></div>'+
    '<div class="foot"><span class="where">'+esc(p.ville||"Lieu inconnu")+'</span>'+htagLink(p)+'</div>'+
  '</article>';
}
function renderGrid(){
  var list=sorted(D.pancartes.filter(function(p){return matches(p);}));
  $("rCount").textContent=list.length+(list.length>1?" pancartes":" pancarte");
  if(!list.length){
    var m=S.f.manif?manif(S.f.manif):null;
    $("grid").innerHTML='<div class="empty"><p>'+(m?"Aucune pancarte pour "+esc(m.hashtag)+" pour l’instant.":"Aucune pancarte ne correspond à ces filtres.")+'</p><a class="btn primary" href="#contribuer">Proposer une pancarte</a></div>';
    return;
  }
  $("grid").innerHTML=list.map(cardHtml).join("");
}
function renderStats(){
  var v={}; D.pancartes.forEach(function(p){ if(p.ville) v[p.ville]=1; });
  $("stP").textContent=D.pancartes.length; $("stM").textContent=D.manifs.filter(function(m){return !m.aVenir;}).length;
  $("stV").textContent=Object.keys(v).length; $("stT").textContent=D.tactiques.length;
}
function renderBig(next){
  if(!D.pancartes.length){ $("bigTxt").textContent="La première pancarte, c’est peut-être la vôtre."; return; }
  if(next||S.bigIdx<0){ var i; do{ i=Math.floor(Math.random()*D.pancartes.length); }while(D.pancartes.length>1 && i===S.bigIdx); S.bigIdx=i; }
  var p=D.pancartes[S.bigIdx], m=manif(p.manif);
  $("bigTxt").textContent=p.texte;
  $("bigMeta").innerHTML=esc(p.ville||"")+(p.ville&&m?" ":"")+(m?'<a class="htag" href="#manifs/'+esc(m.slug)+'">'+esc(m.hashtag)+'</a>':"");
  $("bigsign").dataset.id=p.id;
}
function refresh(){ renderFilters(); renderGrid(); }

/* ---------- fiche pancarte ---------- */
function openDetail(id){
  var p=null; D.pancartes.forEach(function(x){ if(x.id===id) p=x; }); if(!p) return;
  var m=manif(p.manif);
  $("dlgSlogan").textContent=p.texte;
  var b="";
  if(p.photo&&p.photo.fichier) b+='<img src="'+esc(p.photo.fichier)+'" alt="Photo de la pancarte" onerror="this.remove()">';
  b+='<dl class="facts">';
  b+='<dt>Où et quand</dt><dd>'+esc([p.ville, fmtDate(pDate(p))].filter(Boolean).join(", ")||"Inconnu")+'</dd>';
  b+='<dt>Manif</dt><dd>'+(m?'<a class="htag" href="#manifs/'+esc(m.slug)+'">'+esc(m.hashtag)+'</a> '+esc(m.nom):(htagLink(p)||"Inconnue"))+'</dd>';
  for(var k in FACETS){ var v=arr(p[k]); if(v.length) b+='<dt>'+FACETS[k].label+'</dt><dd class="tags">'+v.map(function(x){return '<span class="tag">'+esc(x)+'</span>';}).join("")+'</dd>'; }
  b+='<dt>Pancarte faite par</dt><dd>'+(p.auteur?esc(p.auteur):'Inconnu·e. Vous la reconnaissez ? <a href="#contribuer">Dites-le-nous</a>.')+'</dd>';
  b+='<dt>Photo</dt><dd>'+esc(p.photo&&p.photo.credit?p.photo.credit:"Voir la source")+'</dd>';
  if(p.source&&safeUrl(p.source.url)) b+='<dt>Source</dt><dd><a href="'+esc(safeUrl(p.source.url))+'" target="_blank" rel="noopener">'+esc(p.source.titre||"Voir la publication")+'</a></dd>';
  b+='</dl>';
  if(p.note) b+='<div class="note">'+esc(p.note)+'</div>';
  if(p.echos) b+='<div class="note"><strong>Ailleurs :</strong> '+esc(p.echos)+'</div>';
  $("dlgBody").innerHTML=b;
  var d=$("dlg"); if(d.showModal) d.showModal(); else d.setAttribute("open","");
}
$("dlgClose").addEventListener("click",function(){ $("dlg").close(); });
$("dlg").addEventListener("click",function(e){ if(e.target===this) this.close(); if(e.target.closest("a[href^='#']")) this.close(); });

/* ---------- manifs ---------- */
function renderManifs(){
  var types=[]; D.manifs.forEach(function(m){ if(types.indexOf(m.type)<0) types.push(m.type); });
  $("mType").innerHTML='<button type="button" class="chip" data-mtype="" aria-pressed="'+(!S.mtype)+'">Tous les types</button>'+
    types.map(function(t){return '<button type="button" class="chip" data-mtype="'+esc(t)+'" aria-pressed="'+(S.mtype===t)+'">'+esc(t)+'</button>';}).join("");
  var groups=D.mouvements.slice(); var orphans=D.manifs.filter(function(m){return !mouvement(m.mouvement);});
  if(orphans.length) groups.push({id:"__autres", nom:"Autres manifs", contexte:"", sources:[]});
  var h="";
  groups.forEach(function(mv){
    var ms=D.manifs.filter(function(m){ return (mv.id==="__autres"?!mouvement(m.mouvement):m.mouvement===mv.id) && (!S.mtype||m.type===S.mtype); })
      .sort(function(a,b){return (a.date||"").localeCompare(b.date||"");});
    if(!ms.length) return;
    var nTot=D.pancartes.filter(function(p){return pMouvement(p)===mv.id;}).length;
    h+='<div class="mvt">'+(mv.hashtag?'<span class="htag">'+esc(mv.hashtag)+'</span>':'')+'<h2>'+esc(mv.nom)+'</h2>'+
      (mv.periode?'<p class="per">'+esc(mv.periode)+(nTot?', '+nTot+' pancartes':'')+'</p>':'')+
      (mv.contexte?'<p>'+esc(mv.contexte)+'</p>':'')+
      (arr(mv.sources).length?'<div class="srcs">Sources : '+arr(mv.sources).map(function(s){return safeUrl(s.url)?'<a href="'+esc(safeUrl(s.url))+'" target="_blank" rel="noopener">'+esc(s.titre)+'</a>':esc(s.titre);}).join("")+'</div>':'')+
      (mv.id!=="__autres"&&nTot?'<p style="margin:14px 0 0"><button class="btn small" type="button" data-showmvt="'+esc(mv.id)+'">Voir toutes les pancartes du mouvement</button></p>':'')+
    '</div><ol class="timeline">';
    ms.forEach(function(m){
      var n=countFor(m.slug);
      h+='<li class="'+(m.aVenir?'later':'')+'"><a class="tl" href="#manifs/'+esc(m.slug)+'"><span class="d">'+esc(fmtDate(m.date,true))+'</span>'+
        '<span class="t">'+esc(m.nom)+(m.aVenir?'<span class="badge">À venir</span>':'')+'</span>'+
        '<span class="n">'+(n?n+(n>1?" pancartes":" pancarte"):"")+'</span>'+
        '<span class="meta"><span class="htag">'+esc(m.hashtag)+'</span> <span class="typechip">'+esc(m.type)+'</span></span></a></li>';
    });
    h+='</ol>';
  });
  $("mvts").innerHTML=h||'<div class="empty"><p>Aucune manif de ce type pour l’instant.</p></div>';
}
function renderManifDetail(m){
  var mv=mouvement(m.mouvement);
  var ps=sorted(D.pancartes.filter(function(p){return p.manif===m.slug;}));
  var ts=D.tactiques.filter(function(t){ return arr(t.exemples).some(function(e){return e.manif===m.slug;}); });
  var h='<div class="mhead"><a class="back" href="#manifs">Toutes les manifs</a>'+
    '<div class="bigtag">'+esc(m.hashtag)+'</div><h1>'+esc(m.nom)+(m.aVenir?'<span class="badge">À venir</span>':'')+'</h1></div>'+
    '<dl class="mfacts"><dt>Date</dt><dd>'+esc(fmtDate(m.date))+(m.dateFin?" au "+esc(fmtDate(m.dateFin)):"")+'</dd>'+
    '<dt>Type d’événement</dt><dd><span class="typechip">'+esc(m.type)+'</span></dd>'+
    (mv?'<dt>Mouvement</dt><dd><a href="#manifs">'+esc(mv.nom)+'</a></dd>':'')+
    (arr(m.villes).length?'<dt>Villes</dt><dd>'+esc(arr(m.villes).join(", "))+'</dd>':'')+
    (m.chiffres?'<dt>Chiffres</dt><dd>'+esc(m.chiffres)+'</dd>':'')+'</dl>'+
    (m.contexte?'<p class="mctx">'+esc(m.contexte)+'</p>':'')+
    (arr(m.sources).length?'<div class="srcs">Sources : '+arr(m.sources).map(function(s){return safeUrl(s.url)?'<a href="'+esc(safeUrl(s.url))+'" target="_blank" rel="noopener">'+esc(s.titre)+'</a>':esc(s.titre);}).join("")+'</div>':'');
  if(ts.length) h+='<h2 class="sectitle">Tactiques vues ce jour-là</h2><div class="mtacts">'+ts.map(function(t){return '<a class="chip" href="#tactiques" data-gotact="'+esc(t.id)+'">'+esc(t.nom)+'</a>';}).join("")+'</div>';
  h+='<h2 class="sectitle">'+(ps.length?ps.length+(ps.length>1?" pancartes":" pancarte"):"Pancartes")+'</h2>';
  h+=ps.length?'<div class="grid">'+ps.map(cardHtml).join("")+'</div>':'<div class="empty"><p>'+(m.aVenir?"Cette manif n’a pas encore eu lieu. Revenez y déposer vos pancartes.":"Pas encore de pancarte pour cette manif.")+'</p><a class="btn primary" href="#contribuer">Proposer une pancarte</a></div>';
  $("manifDetail").innerHTML=h;
}

/* ---------- tactiques ---------- */
function renderTactiques(openId){
  var counts={}; D.tactiques.forEach(function(t){counts[t.famille]=(counts[t.famille]||0)+1;});
  var chips='<button type="button" class="chip" data-fam="" aria-pressed="'+(!S.tfam)+'">Toutes<span class="n">'+D.tactiques.length+'</span></button>';
  FAMILLES.forEach(function(f){ chips+='<button type="button" class="chip'+(counts[f.id]?'':' zero')+'" data-fam="'+f.id+'" aria-pressed="'+(S.tfam===f.id)+'">'+esc(f.label)+'<span class="n">'+(counts[f.id]||0)+'</span></button>'; });
  $("tFam").innerHTML=chips;
  var q=S.tq.toLowerCase();
  var list=D.tactiques.filter(function(t){
    if(S.tfam && t.famille!==S.tfam) return false;
    if(q && ((t.nom||"")+" "+(t.description||"")).toLowerCase().indexOf(q)<0) return false;
    return true;
  }).sort(function(a,b){return (a.nom||"").localeCompare(b.nom||"","fr");});
  if(!list.length){ $("tlist").innerHTML='<div class="empty"><p>Aucune tactique dans cette famille pour l’instant.</p><a class="btn primary" href="#contribuer">Proposer une tactique</a></div>'; return; }
  $("tlist").innerHTML=list.map(function(t){
    var f=famOf(t.famille);
    var ex=arr(t.exemples).map(function(e){
      var u=safeUrl(e.url), m=manif(e.manif);
      return '<li>'+(m?'<a class="htag" href="#manifs/'+esc(m.slug)+'">'+esc(m.hashtag)+'</a> ':'')+esc(e.texte||"")+(u?' <a href="'+esc(u)+'" target="_blank" rel="noopener">'+esc(e.source||"Source")+'</a>':(e.source?" ("+esc(e.source)+")":""))+'</li>';
    }).join("");
    return '<details class="tact" id="tact-'+esc(t.id)+'" style="--fam:'+f.color+'"'+(openId===t.id?' open':'')+'><summary><h3>'+esc(t.nom)+'</h3><span class="plus" aria-hidden="true">+</span><span class="fam">'+esc(f.label)+'</span></summary>'+
      '<div class="tbody"><p>'+esc(t.description||"")+'</p>'+(ex?'<strong>Vu dans les mobilisations</strong><ul>'+ex+'</ul>':'')+
      (t.credit?'<p><small>Crédit : '+esc(t.credit)+'</small></p>':'')+'</div></details>';
  }).join("");
}

/* ---------- événements ---------- */
document.addEventListener("click",function(e){
  if(e.target.closest("a")){
    var gt=e.target.closest("[data-gotact]");
    if(gt){ var id=gt.getAttribute("data-gotact"); setTimeout(function(){ S.tfam=null; S.tq=""; $("tq").value=""; renderTactiques(id); var el=$("tact-"+id); if(el) el.scrollIntoView({block:"center"}); },30); }
    return;
  }
  if(e.target.closest("[data-clearmvt]")){ S.f.mouvement=null; refresh(); return; }
  var c=e.target.closest(".card"); if(c){ openDetail(c.getAttribute("data-id")); return; }
  var jb=e.target.closest(".jbtn"); if(jb){ S.f.manif=jb.getAttribute("data-j")||null; refresh(); return; }
  var ty=e.target.closest("[data-type]"); if(ty){ var t=ty.getAttribute("data-type"); S.f.type=(S.f.type===t)?null:t; if(S.f.manif && manif(S.f.manif).type!==S.f.type) S.f.manif=null; refresh(); return; }
  var ch=e.target.closest(".chip[data-k]");
  if(ch){ var k=ch.getAttribute("data-k"), v=ch.getAttribute("data-v"), a=S.f[k], i=a.indexOf(v); if(i>=0) a.splice(i,1); else a.push(v); refresh(); return; }
  var fm=e.target.closest(".chip[data-fam]"); if(fm){ S.tfam=fm.getAttribute("data-fam")||null; renderTactiques(); return; }
  var mt=e.target.closest("[data-mtype]"); if(mt){ S.mtype=mt.getAttribute("data-mtype")||null; renderManifs(); return; }
  var sm=e.target.closest("[data-showmvt]"); if(sm){ resetFilters(); S.f.mouvement=sm.getAttribute("data-showmvt"); refresh(); location.hash="#pancartes"; return; }
});
document.addEventListener("keydown",function(e){
  if((e.key==="Enter"||e.key===" ") && e.target.classList && e.target.classList.contains("card")){ e.preventDefault(); openDetail(e.target.getAttribute("data-id")); }
  if((e.key==="Enter"||e.key===" ") && e.target.id==="bigTxt"){ e.preventDefault(); openDetail($("bigsign").dataset.id); }
});
function resetFilters(){ S.f={q:"",manif:null,type:null,mouvement:null,ville:"",registre:[],procede:[],sujet:[],forme:[],references:[]}; $("q").value=""; }
$("q").addEventListener("input",function(){ S.f.q=this.value.trim(); refresh(); });
$("fVille").addEventListener("change",function(){ S.f.ville=this.value; refresh(); });
$("sort").addEventListener("change",function(){ S.sort=this.value; renderGrid(); });
$("reset").addEventListener("click",function(){ resetFilters(); refresh(); });
$("ftoggle").addEventListener("click",function(){ var o=$("filters").classList.toggle("open"); this.setAttribute("aria-expanded",o); });
$("tq").addEventListener("input",function(){ S.tq=this.value.trim(); renderTactiques(); });
$("bigNext").addEventListener("click",function(){ renderBig(true); });
$("bigTxt").addEventListener("click",function(){ openDetail($("bigsign").dataset.id); });

/* ---------- formulaires (Netlify Forms) ---------- */
(function(){
  var opts=D.manifs.slice().sort(function(a,b){return (b.date||"").localeCompare(a.date||"");})
    .map(function(m){return '<option value="'+esc(m.slug)+'">'+esc(m.hashtag+" · "+m.nom)+'</option>';}).join("");
  $("pManif").innerHTML='<option value="">Je ne sais pas</option>'+opts+'<option value="autre">Une autre manif…</option>';
  var h="";
  ["registre","procede","sujet","references"].forEach(function(k){
    h+='<div class="field"><span class="lab">'+FACETS[k].label+'</span><div class="chips">'+FACETS[k].values.map(function(v){return '<button type="button" class="chip" data-pf="'+k+'" data-v="'+esc(v)+'" aria-pressed="false">'+esc(v)+'</button>';}).join("")+'</div></div>';
  });
  $("pFacets").innerHTML=h;
  $("pForme").innerHTML=FACETS.forme.values.map(function(v){return '<option>'+esc(v)+'</option>';}).join(""); $("pForme").value="Non précisée";
  $("tFamSel").innerHTML=FAMILLES.map(function(f){return '<option value="'+f.id+'">'+esc(f.label)+'</option>';}).join("");
  $("mType2").innerHTML=TYPES.map(function(t){return '<option>'+esc(t)+'</option>';}).join("");
})();
$("pManif").addEventListener("change",function(){ $("pAutre").hidden=this.value!=="autre"; });
$("pFacets").addEventListener("click",function(e){
  var c=e.target.closest(".chip"); if(!c) return;
  c.setAttribute("aria-pressed", c.getAttribute("aria-pressed")!=="true");
  var k=c.getAttribute("data-pf");
  $("h-"+k).value=Array.prototype.map.call(document.querySelectorAll('[data-pf="'+k+'"][aria-pressed="true"]'),function(x){return x.getAttribute("data-v");}).join(", ");
});
Array.prototype.forEach.call(document.querySelectorAll("[data-seg]"),function(b){
  b.addEventListener("click",function(){
    var w=b.getAttribute("data-seg");
    Array.prototype.forEach.call(document.querySelectorAll("[data-seg]"),function(x){ x.setAttribute("aria-pressed", x===b); });
    ["pancarte","manif","tactique"].forEach(function(f){ $("form-"+f).hidden=(f!==w); });
    $("formMsg").innerHTML="";
  });
});
function formMsg(ok,txt){ $("formMsg").innerHTML='<div class="msg '+(ok?"ok":"err")+'" role="status">'+esc(txt)+'</div>'; $("formMsg").scrollIntoView({block:"center"}); }

/* floutage */
var cv=$("pCanvas"), ctx=cv.getContext("2d"), hist=[], drag=null, hasPhoto=false;
$("pFile").addEventListener("change",function(){
  var f=this.files&&this.files[0]; if(!f) return;
  var img=new Image(), url=URL.createObjectURL(f);
  img.onload=function(){
    var max=1600, w=img.naturalWidth, h=img.naturalHeight, r=Math.min(1,max/Math.max(w,h));
    cv.width=Math.round(w*r); cv.height=Math.round(h*r);
    ctx.drawImage(img,0,0,cv.width,cv.height); URL.revokeObjectURL(url);
    hist=[]; hasPhoto=true; cv.hidden=false; $("blurTools").hidden=false;
  };
  img.src=url;
});
function pt(e){ var r=cv.getBoundingClientRect(); return {x:(e.clientX-r.left)*cv.width/r.width, y:(e.clientY-r.top)*cv.height/r.height}; }
cv.addEventListener("pointerdown",function(e){ drag={a:pt(e),snap:ctx.getImageData(0,0,cv.width,cv.height)}; cv.setPointerCapture(e.pointerId); });
cv.addEventListener("pointermove",function(e){
  if(!drag) return; var b=pt(e);
  ctx.putImageData(drag.snap,0,0);
  ctx.save(); ctx.strokeStyle="#F6E43F"; ctx.lineWidth=Math.max(3,cv.width/300); ctx.strokeRect(drag.a.x,drag.a.y,b.x-drag.a.x,b.y-drag.a.y); ctx.restore();
});
cv.addEventListener("pointerup",function(e){
  if(!drag) return; var b=pt(e), a=drag.a; ctx.putImageData(drag.snap,0,0);
  var x=Math.max(0,Math.min(a.x,b.x))|0, y=Math.max(0,Math.min(a.y,b.y))|0, w=Math.abs(b.x-a.x)|0, h=Math.abs(b.y-a.y)|0;
  if(w>6&&h>6){ hist.push(drag.snap); pixelate(x,y,Math.min(w,cv.width-x),Math.min(h,cv.height-y)); }
  drag=null;
});
function pixelate(x,y,w,h){
  var bs=Math.max(10,Math.round(Math.max(w,h)/10));
  for(var yy=y; yy<y+h; yy+=bs) for(var xx=x; xx<x+w; xx+=bs){
    var bw=Math.min(bs,x+w-xx), bh=Math.min(bs,y+h-yy), d=ctx.getImageData(xx,yy,bw,bh).data, r=0,g=0,bl=0,n=d.length/4;
    for(var i=0;i<d.length;i+=4){r+=d[i];g+=d[i+1];bl+=d[i+2];}
    ctx.fillStyle="rgb("+(r/n|0)+","+(g/n|0)+","+(bl/n|0)+")"; ctx.fillRect(xx,yy,bw,bh);
  }
}
$("undoBlur").addEventListener("click",function(){ var s=hist.pop(); if(s) ctx.putImageData(s,0,0); });
$("removePhoto").addEventListener("click",function(){ hasPhoto=false; hist=[]; cv.hidden=true; $("blurTools").hidden=true; $("pFile").value=""; });

function send(form, extra){
  var fd=new FormData(form);
  if(extra) extra(fd);
  return fetch("/", {method:"POST", body:fd}).then(function(r){ if(!r.ok) throw new Error(r.status); });
}
function onLocal(){ return location.protocol==="file:"; }
function handle(form, check, okText, extra){
  form.addEventListener("submit",function(e){
    e.preventDefault();
    var err=check(); if(err){ formMsg(false,err); return; }
    if(onLocal()){ formMsg(false,"Le formulaire fonctionnera une fois le site en ligne sur Netlify. En local, rien n’est envoyé."); return; }
    var btn=form.querySelector("button[type=submit]"), label=btn.textContent; btn.disabled=true; btn.textContent="Envoi…";
    Promise.resolve(extra?extra():null).then(function(fn){ return send(form, fn); }).then(function(){
      formMsg(true,okText); form.reset();
      if(form.id==="form-pancarte"){ $("pForme").value="Non précisée"; $("pAutre").hidden=true; Array.prototype.forEach.call(document.querySelectorAll('[data-pf][aria-pressed="true"]'),function(c){c.setAttribute("aria-pressed","false");}); ["registre","procede","sujet","references"].forEach(function(k){$("h-"+k).value="";}); $("removePhoto").click(); }
    }).catch(function(){ formMsg(false,"L’envoi a échoué. Vérifiez votre connexion et réessayez."); })
      .then(function(){ btn.disabled=false; btn.textContent=label; });
  });
}
handle($("form-pancarte"), function(){
  if(!$("pTexte").value.trim()) return "Recopiez le texte de la pancarte avant d’envoyer.";
  if(hasPhoto && !$("pOk").checked) return "Cochez la case de confirmation : les visages doivent être floutés ou hors cadre.";
  return "";
}, "Merci ! Votre pancarte est envoyée. Elle apparaîtra dans l’atlas après relecture.", function(){
  if(!hasPhoto) return null;
  return new Promise(function(res){ cv.toBlob(function(b){ res(function(fd){ fd.delete("photo"); if(b) fd.append("photo", b, "pancarte.jpg"); }); },"image/jpeg",0.85); });
});
handle($("form-manif"), function(){ return (!$("mNom").value.trim()||!$("mDate").value)?"Donnez au moins un nom et une date à la manif.":""; }, "Merci ! La manif est envoyée. Sa page sera créée après relecture.");
handle($("form-tactique"), function(){ return (!$("tNom").value.trim()||!$("tDesc").value.trim())?"Donnez au moins un nom et une description à la tactique.":""; }, "Merci ! Votre tactique est envoyée. Elle apparaîtra après relecture.");

/* ---------- démarrage ---------- */
renderFilters(); renderGrid(); renderStats(); renderBig(true); renderTactiques(); route();
})();

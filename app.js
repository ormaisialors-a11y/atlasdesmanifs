/* Atlas des manifs : logique du site (aucune dépendance) */
(function(){
"use strict";

var D = window.ATLAS || {}; ["mouvements","manifs","pancartes","tactiques","chants"].forEach(function(k){ if(!Array.isArray(D[k])) D[k]=[]; });
var FACETS = {
  registre:{label:"Registre", values:["Revendication","Interpellation","Cri de colère","Jeu de mots","Humour","Détournement","Témoignage","Mème, culture web","Poésie","Solidarité","Méta","Autre"]},
  sujet:{label:"Sujet", values:["Démocratie","Antifascisme","Antiracisme","Anticapitalisme","Justice","Droits","Éducation","Jeunesse","Violences policières","Économie","Travail","Féminisme","LGBTQIA+","Écologie","Pouvoir d’achat","Inégalités et justice sociale","Numérique","Culture","Autre"]},
  references:{label:"Références", values:["Pop culture","Web","Musique","Histoire","Slogan historique","Littérature, arts","Phrase de personnalité politique","Autre"]},
  forme:{label:"Forme", values:["Dessin","Inscription","Impression","Symboles","Drapeau","Vêtements","Affiche","Autocollant","Tag","Costume","Objets détournés","Marionnettes","Instruments","Autre"]}
};
var CHANT_TYPES = ["Slogan scandé","Chanson détournée","Chanson originale","Chant traditionnel","Autre"];
var TYPES = ["Manifestation nationale","Manifestation lycéenne","Manifestation syndicale","Grève","Blocus","Autre"];
var FAMILLES = [
  {id:"detournement", label:"Détournement et parodie", color:"#2346C2"},
  {id:"canular", label:"Canular", color:"#7A4FD0"},
  {id:"costumes", label:"Costumes et personnages", color:"#C0265B"},
  {id:"musique", label:"Musique et bruit", color:"#D97B00"},
  {id:"danse", label:"Danse et trends", color:"#9B4FD0"},
  {id:"performance", label:"Performance et théâtre de rue", color:"#B33A3A"},
  {id:"gonflables", label:"Gonflables et objets géants", color:"#C9A800"},
  {id:"affichage", label:"Affichage et projections", color:"#16804A"},
  {id:"reseaux", label:"Réseaux et images", color:"#0F8FA8"},
  {id:"blocage", label:"Blocage", color:"#13213F"},
  {id:"occupation", label:"Occupation et convivialité", color:"#2E9E63"},
  {id:"corteges", label:"Cortèges inventifs", color:"#5470C9"},
  {id:"ripostes", label:"Ripostes créatives", color:"#D9480F"},
  {id:"protection", label:"Protection et soin", color:"#3FA34D"},
  {id:"interpellation", label:"Interpellation des responsables", color:"#1F6FB2"},
  {id:"micro", label:"Micro-interventions urbaines", color:"#8A6D3B", desc:"Drapeaux plantés dans les crottes, étiquettes sur le mobilier urbain, petits objets semés dans la ville."}
];
var ICONS = {
  detournement:'<path d="M5 8h12l-3.5-3.5"/><path d="M19 16H7l3.5 3.5"/>',
  canular:'<circle cx="12" cy="12" r="8.5"/><path d="M8.5 10.2h.01"/><path d="M14 10.2h2.2"/><path d="M8.5 14.5c1.9 2 5.1 2 7 0"/>',
  costumes:'<path d="M3 9.5c3-2.6 6-2.2 9 .2 3-2.4 6-2.8 9-.2-.6 4.2-3.6 5.6-5.8 4.6-1.4-.6-2-2-3.2-2s-1.8 1.4-3.2 2C6.6 15.1 3.6 13.7 3 9.5z"/><path d="M7.5 11h.01"/><path d="M16.5 11h.01"/>',
  musique:'<path d="M9 18V6l10-2v12"/><circle cx="6.5" cy="18" r="2.5"/><circle cx="16.5" cy="16" r="2.5"/>',
  danse:'<circle cx="13" cy="4.5" r="1.8"/><path d="M13 7.5l-1.5 6 3.5 3-1 4.5"/><path d="M11.5 13.5L8 20"/><path d="M8 9l5-1.5 4.5 2.5"/>',
  performance:'<path d="M3 4h18"/><path d="M4.5 4v16"/><path d="M19.5 4v16"/><path d="M4.5 4c1.5 4.5 4.5 6.5 7.5 6.5s6-2 7.5-6.5"/><path d="M9 20h6"/>',
  gonflables:'<ellipse cx="12" cy="9" rx="5.5" ry="6.5"/><path d="M11 15.5h2l-1 1.5z"/><path d="M12 17c-1.5 1.5 1.5 2.5 0 4.5"/>',
  affichage:'<path d="M4 3v18"/><path d="M20 3v18"/><path d="M4 6h16v8H4z"/><path d="M7.5 9.2h9"/><path d="M7.5 11.2h6"/>',
  reseaux:'<path d="M9.5 4L7.5 20"/><path d="M16.5 4l-2 16"/><path d="M4.5 9h16"/><path d="M3.5 15h16"/>',
  blocage:'<path d="M3 8h18v5H3z"/><path d="M7 8l-3 5"/><path d="M13 8l-3 5"/><path d="M19 8l-3 5"/><path d="M6 13v7"/><path d="M18 13v7"/>',
  occupation:'<path d="M12 4L3 19h18z"/><path d="M12 4v15"/><path d="M12 19l-3-6"/><path d="M12 19l3-6"/>',
  corteges:'<circle cx="6" cy="16" r="3.5"/><circle cx="18" cy="16" r="3.5"/><path d="M6 16l4-7h5l3 7"/><path d="M10 9l2.5 7H6"/><path d="M14 6.5h2.5"/>',
  ripostes:'<path d="M13.5 2.5L5 13.5h6l-1.5 8 8.5-11h-6z"/>',
  protection:'<path d="M3 12a9 9 0 0118 0z"/><path d="M12 12v6.5a2 2 0 01-4 0"/><path d="M12 3v0"/>',
  interpellation:'<path d="M4 10v4h3l7 4V6L7 10z"/><path d="M17.5 9.5a3.5 3.5 0 010 5"/><path d="M19.8 7.5a6.5 6.5 0 010 9"/>',
  micro:'<path d="M9 20V5"/><path d="M9 5.5h8l-2 2.5 2 2.5H9"/><path d="M5 20c1-2.2 2.6-3.2 4-3.2s3 1 4 3.2z"/>'
};
function picto(id, cls){ var p=ICONS[id]; if(!p) return ""; return '<svg class="picto'+(cls?" "+cls:"")+'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'+p+'</svg>'; }
var CAMERA='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="M3.5 8h3.2l1.8-2.5h7l1.8 2.5h3.2v11h-17z" stroke-linejoin="round"/><circle cx="12" cy="13.3" r="3.6"/></svg>';

var S = {
  f:{q:"", manif:null, type:null, mouvement:null, ville:"", registre:[], sujet:[], forme:[], references:[]},
  sort:"date", tq:"", tfam:null, mtype:null, myear:null, cq:"", ctype:null, bigIdx:-1
};

function $(id){return document.getElementById(id);}
function esc(s){return String(s==null?"":s).replace(/[&<>"']/g,function(c){return {"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;"}[c];});}
function arr(x){return Array.isArray(x)?x:(x?[x]:[]);}
function hash(s){var h=0;for(var i=0;i<s.length;i++){h=(h*31+s.charCodeAt(i))|0;}return Math.abs(h);}
function safeUrl(u){u=String(u||"").trim(); return /^https?:\/\//i.test(u)?u:"";}
var MOIS=["janvier","février","mars","avril","mai","juin","juillet","août","septembre","octobre","novembre","décembre"];
function fmtDate(d,short){ if(!d) return ""; var p=String(d).split("-"); if(p.length<3) return d; return (+p[2])+" "+MOIS[+p[1]-1]+(short?"":" "+p[0]); }
function villeKey(v){ return String(v||"").replace(/\s*\(.*\)\s*$/,"").trim().toLowerCase(); }
function manifLabel(m){ if(!m) return ""; if(m.dateFin){ var a=String(m.date).split("-"), b=String(m.dateFin).split("-"); return "Du "+(+a[2])+(a[1]===b[1]?"":" "+MOIS[+a[1]-1])+" au "+fmtDate(m.dateFin); } return fmtDate(m.date); }
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
var TABS=["pancartes","manifs","tactiques","chants","contribuer","ressources"];
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
  if(f.q){ var hay=(p.texte+" "+(p.ville||"")+" "+(p.note||"")+" "+(manif(p.manif)?manif(p.manif).hashtag+" "+manifLabel(manif(p.manif)):"")).toLowerCase(); if(hay.indexOf(f.q.toLowerCase().replace(/^#/,""))<0 && hay.indexOf(f.q.toLowerCase())<0) return false; }
  if(skip!=="manif" && f.manif && p.manif!==f.manif) return false;
  if(skip!=="type" && f.type && pType(p)!==f.type) return false;
  if(skip!=="mouvement" && f.mouvement && pMouvement(p)!==f.mouvement) return false;
  if(skip!=="ville" && f.ville && villeKey(p.ville)!==villeKey(f.ville)) return false;
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
  if(S.sort==="old") list.sort(function(a,b){return pDate(a).localeCompare(pDate(b));});
  else list.sort(function(a,b){return pDate(b).localeCompare(pDate(a));});
  return list;
}
function renderFilters(){
  // types
  var tc={}; D.pancartes.forEach(function(p){ if(!matches(p,"type")) return; var t=pType(p); if(t) tc[t]=(tc[t]||0)+1; });
  var types=TYPES.slice(); D.manifs.forEach(function(m){ if(m.type && types.indexOf(m.type)<0) types.splice(types.length-1,0,m.type); });
  $("fType").innerHTML=types.map(function(t){
    return '<button type="button" class="chip'+(tc[t]?'':' zero')+'" data-type="'+esc(t)+'" aria-pressed="'+(S.f.type===t)+'">'+esc(t)+'<span class="n">'+(tc[t]||0)+'</span></button>';
  }).join("");
  // manifs
  var ms=D.manifs.filter(function(m){return !S.f.type || m.type===S.f.type;}).sort(function(a,b){return (b.date||"").localeCompare(a.date||"");});
  var h='<button class="jbtn" type="button" data-j="" aria-pressed="'+(!S.f.manif)+'"><span class="d">Toutes</span><span class="n">'+D.pancartes.filter(function(p){return matches(p,"manif");}).length+'</span></button>';
  var years=[]; ms.forEach(function(m){ var y=String(m.date||"").slice(0,4)||"?"; if(years.indexOf(y)<0) years.push(y); });
  var selYear=S.f.manif&&manif(S.f.manif)?String(manif(S.f.manif).date).slice(0,4):years[0];
  years.forEach(function(y){
    var inY=ms.filter(function(m){return String(m.date||"").slice(0,4)===y;});
    h+='<details class="ygroup"'+(y===selYear?' open':'')+'><summary>'+esc(y)+' <span class="n">'+inY.length+' manif'+(inY.length>1?"s":"")+'</span></summary>';
    inY.forEach(function(m){
      var n=D.pancartes.filter(function(p){return p.manif===m.slug && matches(p,"manif");}).length;
      h+='<button class="jbtn" type="button" data-j="'+esc(m.slug)+'" aria-pressed="'+(S.f.manif===m.slug)+'"><span><span class="d">'+esc(m.hashtag)+'</span><br><small>'+esc(manifLabel(m))+'</small></span><span class="n">'+n+'</span></button>';
    });
    h+='</details>';
  });
  $("fJ").innerHTML=h;
  // villes
  var villes={}; D.pancartes.forEach(function(p){ if(p.ville) villes[p.ville]=1; });
  var vs=Object.keys(villes).sort(function(a,b){return a.localeCompare(b,"fr");});
  DATA_VILLES=vs; fillFilterList(vs, []);
  // critères
  var box="";
  var amv=S.f.mouvement?mouvement(S.f.mouvement):null;
  if(amv) box+='<div class="fgroup"><h3>Mouvement</h3><div class="chips"><button type="button" class="chip" data-clearmvt="1" aria-pressed="true">'+esc(amv.hashtag)+' ✕</button></div></div>';
  for(var k in FACETS){
    var counts={};
    D.pancartes.forEach(function(p){ if(!matches(p,k)) return; arr(p[k]).forEach(function(v){counts[v]=(counts[v]||0)+1;}); });
    var vals=FACETS[k].values.slice();
    Object.keys(counts).forEach(function(v){ if(vals.indexOf(v)<0) vals.splice(vals.length-1,0,v); });
    var chips=vals.map(function(v){
      return '<button type="button" class="chip'+(counts[v]?'':' zero')+'" data-k="'+k+'" data-v="'+esc(v)+'" aria-pressed="'+(S.f[k].indexOf(v)>=0)+'">'+esc(v)+'<span class="n">'+(counts[v]||0)+'</span></button>';
    }).join("");
    box+='<div class="fgroup"><h3>'+FACETS[k].label+'</h3><div class="chips">'+chips+'</div></div>';
  }
  $("facetBox").innerHTML=box;
}
function photoOf(p){ return p.photo&&p.photo.fichier?p.photo.fichier:""; }
function cardHtml(p){
  var src=photoOf(p), m=manif(p.manif);
  var cap=(p.ville?'<span class="pc-ville">'+esc(p.ville)+'</span>':'')+(m?'<span class="pc-type">'+esc(m.type)+'</span>':'');
  return '<button type="button" class="pcard" data-id="'+esc(p.id)+'" aria-label="'+esc(p.texte)+'">'+
    '<span class="pimg'+(src?' has-img':'')+'">'+(src?'<img src="'+esc(src)+'" alt="'+esc(p.texte)+'" loading="lazy">':'<span class="noph seyes">'+CAMERA+'</span>')+'</span>'+
    (cap?'<span class="pcap">'+cap+'</span>':'')+
  '</button>';
}
function renderGrid(){
  var list=sorted(D.pancartes.filter(function(p){return matches(p);}));
  $("rCount").textContent=list.length?list.length+(list.length>1?" pancartes":" pancarte"):"Pancartes";
  if(!D.pancartes.length){
    $("grid").innerHTML='<div class="empty" style="grid-column:1/-1"><p><strong>L’atlas attend ses premières pancartes.</strong></p><p>Vous avez photographié une pancarte en manif ? Floutez les visages et envoyez-la : elle sera en ligne en quelques minutes.</p><a class="btn primary" href="#contribuer">Envoyer une photo de pancarte</a></div>';
    return;
  }
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
  $("stV").textContent=Object.keys(v).length; $("stT").textContent=D.tactiques.length; $("stC").textContent=D.chants.length;
}
function renderBig(next){
  var withPh=D.pancartes.filter(function(p){return photoOf(p);});
  if(!withPh.length){
    $("bigsign").innerHTML='<div class="ph-empty seyes">'+CAMERA+'<a class="btn primary" href="#contribuer">Envoyer une photo de pancarte</a></div>';
    return;
  }
  if(next||S.bigIdx<0||S.bigIdx>=withPh.length){ var i; do{ i=Math.floor(Math.random()*withPh.length); }while(withPh.length>1 && i===S.bigIdx); S.bigIdx=i; }
  var p=withPh[S.bigIdx];
  $("bigsign").innerHTML='<img src="'+esc(photoOf(p))+'" alt="'+esc(p.texte)+'" data-open="'+esc(p.id)+'">'+(withPh.length>1?'<button class="btn primary small" type="button" id="bigNext">Une autre pancarte</button>':'');
}
function renderStrip(){
  var counts={}; D.tactiques.forEach(function(t){counts[t.famille]=(counts[t.famille]||0)+1;});
  $("tstrip").innerHTML='<span class="ts-label">Explorer les tactiques</span><span class="ts-icons">'+FAMILLES.map(function(f){
    return '<a href="#tactiques" class="ts-item'+(counts[f.id]?'':' ts-none')+'" data-gofam="'+f.id+'" title="'+esc(f.label)+'" aria-label="'+esc(f.label)+'" style="--fam:'+f.color+'">'+picto(f.id)+'</a>';
  }).join("")+'</span>';
}
function refresh(){ renderFilters(); renderGrid(); }

/* ---------- fiche pancarte ---------- */
function openDetail(id){
  var p=null; D.pancartes.forEach(function(x){ if(x.id===id) p=x; }); if(!p) return;
  var m=manif(p.manif), src=photoOf(p);
  $("dlgPhoto").innerHTML=src?'<img src="'+esc(src)+'" alt="'+esc(p.texte)+'">':CAMERA;
  var b='<p class="dlg-caption">'+esc(p.texte)+'</p><dl class="facts">';
  b+='<dt>Où et quand</dt><dd>'+esc([p.ville, fmtDate(pDate(p))].filter(Boolean).join(", ")||"Inconnu")+'</dd>';
  b+='<dt>Manif</dt><dd>'+(m?'<a class="htag" href="#manifs/'+esc(m.slug)+'">'+esc(m.hashtag)+'</a> '+esc(m.type):(htagLink(p)||"Inconnue"))+'</dd>';
  for(var k in FACETS){ var v=arr(p[k]); if(v.length) b+='<dt>'+FACETS[k].label+'</dt><dd class="tags">'+v.map(function(x){return '<span class="tag">'+esc(x)+'</span>';}).join("")+'</dd>'; }
  b+='<dt>Pancarte faite par</dt><dd>'+(p.auteur?esc(p.auteur):'Inconnu·e. Vous la reconnaissez ? <a href="#contribuer" data-goseg="contact">Dites-le-nous</a>.')+'</dd>';
  b+='<dt>Photo</dt><dd>'+(src?esc(p.photo.credit||"Crédit à préciser"):'Pas encore de photo. Vous en avez une ? <a href="#contribuer">Envoyez-la</a>.')+'</dd>';
  if(p.source&&safeUrl(p.source.url)) b+='<dt>Source</dt><dd><a href="'+esc(safeUrl(p.source.url))+'" target="_blank" rel="noopener">'+esc(p.source.titre||"Voir la publication")+'</a></dd>';
  b+='</dl>';
  if(p.note) b+='<div class="note">'+esc(p.note)+'</div>';
  if(p.echos) b+='<div class="note"><strong>Ailleurs :</strong> '+esc(p.echos)+'</div>';
  b+='<p><button type="button" class="signal" data-signal="pancarte '+esc(p.id)+'" data-what="'+esc(p.texte)+'">Signaler cette pancarte</button></p>';
  $("dlgBody").innerHTML=b;
  var d=$("dlg"); if(d.showModal) d.showModal(); else d.setAttribute("open","");
}
$("dlgClose").addEventListener("click",function(){ $("dlg").close(); });
$("dlg").addEventListener("click",function(e){ if(e.target===this) this.close(); if(e.target.closest("a[href^='#']")) this.close(); });

/* ---------- manifs ---------- */
function renderManifs(){
  var types=[]; D.manifs.forEach(function(m){ if(types.indexOf(m.type)<0) types.push(m.type); });
  var yrs=[]; D.manifs.forEach(function(m){ var y=String(m.date||"").slice(0,4); if(y&&yrs.indexOf(y)<0) yrs.push(y); }); yrs.sort().reverse();
  $("mType").innerHTML='<button type="button" class="chip" data-mtype="" aria-pressed="'+(!S.mtype)+'">Tous les types</button>'+
    types.map(function(t){return '<button type="button" class="chip" data-mtype="'+esc(t)+'" aria-pressed="'+(S.mtype===t)+'">'+esc(t)+'</button>';}).join("")+
    (yrs.length>1?'<span class="chipsep" aria-hidden="true"></span><button type="button" class="chip" data-myear="" aria-pressed="'+(!S.myear)+'">Toutes les années</button>'+yrs.map(function(y){return '<button type="button" class="chip" data-myear="'+y+'" aria-pressed="'+(S.myear===y)+'">'+y+'</button>';}).join(""):'');
  var groups=D.mouvements.slice(); var orphans=D.manifs.filter(function(m){return !mouvement(m.mouvement);});
  if(orphans.length) groups.push({id:"__autres", nom:"Autres manifs", contexte:"", sources:[]});
  var h="";
  groups.forEach(function(mv){
    var ms=D.manifs.filter(function(m){ return (mv.id==="__autres"?!mouvement(m.mouvement):m.mouvement===mv.id) && (!S.mtype||m.type===S.mtype) && (!S.myear||String(m.date).slice(0,4)===S.myear); })
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
        '<span class="t">'+esc(m.type)+(m.aVenir?'<span class="badge">À venir</span>':'')+'</span>'+
        '<span class="n">'+(n?n+(n>1?" pancartes":" pancarte"):"")+'</span>'+
        '<span class="meta"><span class="htag">'+esc(m.hashtag)+'</span>'+(m.dateFin?' '+esc(manifLabel(m)):'')+'</span></a></li>';
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
    '<div class="bigtag">'+esc(m.hashtag)+'</div><h1>'+esc(manifLabel(m))+(m.aVenir?'<span class="badge">À venir</span>':'')+'</h1></div>'+
    '<dl class="mfacts">'+
    '<dt>Type d’événement</dt><dd><span class="typechip">'+esc(m.type)+'</span></dd>'+
    (mv?'<dt>Mouvement</dt><dd><a href="#manifs">'+esc(mv.nom)+'</a></dd>':'')+
    (arr(m.villes).length?'<dt>Villes</dt><dd>'+esc(arr(m.villes).join(", "))+'</dd>':'')+
    (m.chiffres?'<dt>Chiffres</dt><dd>'+esc(m.chiffres)+'</dd>':'')+'</dl>'+
    (m.contexte?'<p class="mctx">'+esc(m.contexte)+'</p>':'')+
    (arr(m.sources).length?'<div class="srcs">Sources : '+arr(m.sources).map(function(s){return safeUrl(s.url)?'<a href="'+esc(safeUrl(s.url))+'" target="_blank" rel="noopener">'+esc(s.titre)+'</a>':esc(s.titre);}).join("")+'</div>':'');
  if(ts.length) h+='<h2 class="sectitle">Tactiques vues ce jour-là</h2><div class="mtacts">'+ts.map(function(t){return '<a class="chip chip-ic" href="#tactiques" data-gotact="'+esc(t.id)+'">'+picto(t.famille)+esc(t.nom)+'</a>';}).join("")+'</div>';
  var cs=D.chants.filter(function(c){return c.manif===m.slug;});
  if(cs.length) h+='<h2 class="sectitle">Chants entendus ce jour-là</h2><div class="mtacts">'+cs.map(function(c){return '<a class="chip" href="#chants">'+esc(c.titre)+'</a>';}).join("")+'</div>';
  h+='<h2 class="sectitle">'+(ps.length?ps.length+(ps.length>1?" pancartes":" pancarte"):"Pancartes")+'</h2>';
  h+=ps.length?'<div class="grid">'+ps.map(cardHtml).join("")+'</div>':'<div class="empty"><p>'+(m.aVenir?"Cette manif n’a pas encore eu lieu. Revenez y déposer vos pancartes.":"Pas encore de pancarte pour cette manif.")+'</p><a class="btn primary" href="#contribuer">Proposer une pancarte</a></div>';
  $("manifDetail").innerHTML=h;
}

/* ---------- tactiques ---------- */
function renderTactiques(openId){
  var counts={}; D.tactiques.forEach(function(t){counts[t.famille]=(counts[t.famille]||0)+1;});
  var chips='<button type="button" class="chip" data-fam="" aria-pressed="'+(!S.tfam)+'">Toutes<span class="n">'+D.tactiques.length+'</span></button>';
  FAMILLES.forEach(function(f){ chips+='<button type="button" class="chip chip-ic'+(counts[f.id]?'':' zero')+'" data-fam="'+f.id+'" aria-pressed="'+(S.tfam===f.id)+'">'+picto(f.id)+esc(f.label)+'<span class="n">'+(counts[f.id]||0)+'</span></button>'; });
  $("tFam").innerHTML=chips;
  var fd=S.tfam?famOf(S.tfam).desc:""; $("famDesc").hidden=!fd; $("famDesc").textContent=fd||"";
  var q=S.tq.toLowerCase();
  var list=D.tactiques.filter(function(t){
    if(S.tfam && t.famille!==S.tfam) return false;
    if(q && ((t.nom||"")+" "+(t.description||"")).toLowerCase().indexOf(q)<0) return false;
    return true;
  }).sort(function(a,b){return (a.nom||"").localeCompare(b.nom||"","fr");});
  if(!list.length){ $("tlist").innerHTML='<div class="empty"><p>Aucune tactique dans cette famille pour l’instant.</p><a class="btn primary" href="#contribuer">Proposer une tactique</a></div>'; return; }
  $("tlist").innerHTML=list.map(function(t){
    var f=famOf(t.famille); if(t.famille==="autre") f={label:"Autre"+(t.famillePrecision?" : "+t.famillePrecision:""),color:"#4A5878"};
    var ex=arr(t.exemples).map(function(e){
      var u=safeUrl(e.url), m=manif(e.manif);
      return '<li>'+(m?'<a class="htag" href="#manifs/'+esc(m.slug)+'">'+esc(m.hashtag)+'</a> ':'')+esc(e.texte||"")+(u?' <a href="'+esc(u)+'" target="_blank" rel="noopener">'+esc(e.source||"Source")+'</a>':(e.source?" ("+esc(e.source)+")":""))+'</li>';
    }).join("");
    return '<details class="tact" id="tact-'+esc(t.id)+'" style="--fam:'+f.color+'"'+(openId===t.id?' open':'')+'><summary><span class="t-ic" style="color:'+f.color+'">'+picto(t.famille)+'</span><h3>'+esc(t.nom)+'</h3><span class="plus" aria-hidden="true">+</span><span class="fam">'+esc(f.label)+'</span></summary>'+
      '<div class="tbody"><p>'+esc(t.description||"")+'</p>'+(ex?'<strong>Vu dans les mobilisations</strong><ul>'+ex+'</ul>':'')+
      (t.credit?'<p><small>Crédit : '+esc(t.credit)+'</small></p>':'')+'<p><button type="button" class="signal" data-signal="tactique '+esc(t.id)+'" data-what="'+esc(t.nom)+'">Signaler cette tactique</button></p></div></details>';
  }).join("");
}

/* ---------- chants ---------- */
function chantTag(c){
  var m=manif(c.manif); if(m) return '<a class="htag" href="#manifs/'+esc(m.slug)+'">'+esc(m.hashtag)+'</a>';
  var mv=mouvement(c.mouvement); return mv?'<a class="htag" href="#manifs">'+esc(mv.hashtag)+'</a>':'';
}
function renderChants(){
  var counts={}; D.chants.forEach(function(c){counts[c.type]=(counts[c.type]||0)+1;});
  var types=CHANT_TYPES.slice(); Object.keys(counts).forEach(function(t){ if(types.indexOf(t)<0) types.splice(types.length-1,0,t); });
  $("cType").innerHTML='<button type="button" class="chip" data-ctype="" aria-pressed="'+(!S.ctype)+'">Tous<span class="n">'+D.chants.length+'</span></button>'+
    types.map(function(t){return '<button type="button" class="chip'+(counts[t]?'':' zero')+'" data-ctype="'+esc(t)+'" aria-pressed="'+(S.ctype===t)+'">'+esc(t)+'<span class="n">'+(counts[t]||0)+'</span></button>';}).join("");
  var q=S.cq.toLowerCase();
  var list=D.chants.filter(function(c){
    if(S.ctype && c.type!==S.ctype) return false;
    if(q && ((c.titre||"")+" "+(c.paroles||"")+" "+(c.air||"")).toLowerCase().indexOf(q)<0) return false;
    return true;
  }).sort(function(a,b){return (a.titre||"").localeCompare(b.titre||"","fr");});
  if(!list.length){ $("clist").innerHTML='<div class="empty"><p>Aucun chant pour l’instant dans cette catégorie.</p><a class="btn primary" href="#contribuer" data-goseg="chant">Proposer un chant</a></div>'; return; }
  $("clist").innerHTML=list.map(function(c){
    var lines=String(c.paroles||"").split("\n"), short=lines.slice(0,4).join("\n"), more=lines.length>4;
    var lien=safeUrl(c.lien), src=c.source&&safeUrl(c.source.url);
    return '<article class="chant" id="chant-'+esc(c.id)+'"><h3>'+esc(c.titre)+'</h3>'+
      '<div class="cmeta"><span class="typechip">'+esc(c.type||"Chant")+'</span>'+chantTag(c)+(c.air?'<span>Sur l’air de '+esc(c.air)+'</span>':'')+'</div>'+
      (more?'<details><summary>Voir toutes les paroles</summary><p class="lyrics">'+esc(c.paroles)+'</p></details><p class="lyrics" data-short>'+esc(short)+'…</p>':'<p class="lyrics">'+esc(c.paroles||"")+'</p>')+
      (c.note?'<p class="note">'+esc(c.note)+'</p>':'')+
      '<div class="cfoot">'+(lien?'<a class="btn small primary" href="'+esc(lien)+'" target="_blank" rel="noopener">Écouter</a>':'')+
      (src?'<a class="btn small" href="'+esc(src)+'" target="_blank" rel="noopener">'+esc(c.source.titre||"Source")+'</a>':'')+
      (c.credit?'<span class="credit">'+esc(c.credit)+'</span>':'')+'<button type="button" class="signal" data-signal="chant '+esc(c.id)+'" data-what="'+esc(c.titre)+'" style="margin-left:auto">Signaler</button></div></article>';
  }).join("");
}

/* ---------- événements ---------- */
document.addEventListener("click",function(e){
  if(e.target.closest("a")){
    var gs=e.target.closest("[data-goseg]"); if(gs){ var sg=document.querySelector('[data-seg="'+gs.getAttribute("data-goseg")+'"]'); setTimeout(function(){ if(sg) sg.click(); },30); return; }
    var gf=e.target.closest("[data-gofam]");
    if(gf){ var fid=gf.getAttribute("data-gofam"); S.tfam=fid; S.tq=""; $("tq").value=""; setTimeout(function(){ renderTactiques(); },30); return; }
    var gt=e.target.closest("[data-gotact]");
    if(gt){ var id=gt.getAttribute("data-gotact"); setTimeout(function(){ S.tfam=null; S.tq=""; $("tq").value=""; renderTactiques(id); var el=$("tact-"+id); if(el) el.scrollIntoView({block:"center"}); },30); }
    return;
  }
  if(e.target.closest("[data-clearmvt]")){ S.f.mouvement=null; refresh(); return; }
  var sg=e.target.closest("[data-signal]");
  if(sg){ $("sigItem").value=sg.getAttribute("data-signal"); $("sigWhat").textContent="« "+sg.getAttribute("data-what")+" »"; $("sigMsg").innerHTML=""; if($("dlg").open) $("dlg").close(); $("dlgSignal").showModal(); return; }
  var c=e.target.closest(".pcard"); if(c){ openDetail(c.getAttribute("data-id")); return; }
  var op=e.target.closest("[data-open]"); if(op){ openDetail(op.getAttribute("data-open")); return; }
  if(e.target.id==="bigNext"){ renderBig(true); return; }
  var jb=e.target.closest(".jbtn"); if(jb){ S.f.manif=jb.getAttribute("data-j")||null; refresh(); return; }
  var ty=e.target.closest("[data-type]"); if(ty){ var t=ty.getAttribute("data-type"); S.f.type=(S.f.type===t)?null:t; if(S.f.manif && manif(S.f.manif).type!==S.f.type) S.f.manif=null; refresh(); return; }
  var ch=e.target.closest(".chip[data-k]");
  if(ch){ var k=ch.getAttribute("data-k"), v=ch.getAttribute("data-v"), a=S.f[k], i=a.indexOf(v); if(i>=0) a.splice(i,1); else a.push(v); refresh(); return; }
  var fm=e.target.closest(".chip[data-fam]"); if(fm){ S.tfam=fm.getAttribute("data-fam")||null; renderTactiques(); return; }
  var mt=e.target.closest("[data-mtype]"); if(mt){ S.mtype=mt.getAttribute("data-mtype")||null; renderManifs(); return; }
  var ct=e.target.closest("[data-ctype]"); if(ct){ S.ctype=ct.getAttribute("data-ctype")||null; renderChants(); return; }
  var my=e.target.closest("[data-myear]"); if(my){ S.myear=my.getAttribute("data-myear")||null; renderManifs(); return; }
  var sm=e.target.closest("[data-showmvt]"); if(sm){ resetFilters(); S.f.mouvement=sm.getAttribute("data-showmvt"); refresh(); location.hash="#pancartes"; return; }
});
document.addEventListener("keydown",function(e){
});
function resetFilters(){ S.f={q:"",manif:null,type:null,mouvement:null,ville:"",registre:[],sujet:[],forme:[],references:[]}; $("q").value=""; $("fVille").value=""; }
$("q").addEventListener("input",function(){ S.f.q=this.value.trim(); refresh(); });
$("fVille").addEventListener("input",function(){
  var v=this.value.trim(); S.f.ville=v; refresh();
  communes(v,function(list){ fillFilterList(DATA_VILLES, list); });
});
$("sort").addEventListener("change",function(){ S.sort=this.value; renderGrid(); });
$("reset").addEventListener("click",function(){ resetFilters(); refresh(); });
$("ftoggle").addEventListener("click",function(){ var o=$("filters").classList.toggle("open"); this.setAttribute("aria-expanded",o); });
$("tq").addEventListener("input",function(){ S.tq=this.value.trim(); renderTactiques(); });
$("cq").addEventListener("input",function(){ S.cq=this.value.trim(); renderChants(); });
document.addEventListener("toggle",function(e){ var d=e.target; if(d.tagName==="DETAILS" && d.parentNode.classList.contains("chant")){ var sh=d.parentNode.querySelector("[data-short]"); if(sh) sh.hidden=d.open; } },true);


/* ---------- communes de France (API officielle geo.api.gouv.fr) ---------- */
var DATA_VILLES=[], geoTimer=null, geoCache={}, lastCommunes={};
function communes(q, cb){
  q=String(q||"").trim(); if(q.length<2){ cb([]); return; }
  if(geoCache[q]){ cb(geoCache[q]); return; }
  clearTimeout(geoTimer);
  geoTimer=setTimeout(function(){
    fetch("https://geo.api.gouv.fr/communes?nom="+encodeURIComponent(q)+"&fields=nom,code,codeDepartement&boost=population&limit=10")
      .then(function(r){return r.ok?r.json():[];}).then(function(l){ geoCache[q]=l||[]; cb(geoCache[q]); }).catch(function(){ cb([]); });
  },220);
}
function communeLabel(c){ return c.nom+" ("+c.codeDepartement+")"; }
function fillFilterList(dataCities, apiList){
  var seen={}, h="";
  dataCities.forEach(function(v){ seen[villeKey(v)]=1; h+='<option value="'+esc(v)+'"></option>'; });
  apiList.forEach(function(c){ if(!seen[villeKey(c.nom)]){ seen[villeKey(c.nom)]=1; h+='<option value="'+esc(c.nom)+'">'+esc(communeLabel(c))+'</option>'; } });
  $("dlVilleFiltre").innerHTML=h;
}

/* ---------- formulaires (Netlify Forms) ---------- */
(function(){
  var sortedM=D.manifs.slice().sort(function(a,b){return (b.date||"").localeCompare(a.date||"");}), opts="", curY=null;
  sortedM.forEach(function(m){ var y=String(m.date||"").slice(0,4); if(y!==curY){ if(curY!==null) opts+='</optgroup>'; opts+='<optgroup label="'+esc(y)+'">'; curY=y; } opts+='<option value="'+esc(m.slug)+'">'+esc(m.hashtag+" · "+m.type)+'</option>'; });
  if(curY!==null) opts+='</optgroup>';
  $("mMouv").innerHTML='<option value="">Aucun, ou je ne sais pas</option>'+D.mouvements.map(function(mv){return '<option value="'+esc(mv.id)+'">'+esc(mv.nom)+'</option>';}).join("");
  $("pManif").innerHTML='<option value="">Je ne sais pas</option>'+opts+'<option value="autre">Une autre manif…</option>';
  var h="";
  ["registre","sujet","references","forme"].forEach(function(k){
    h+='<div class="field"><span class="lab">'+FACETS[k].label+'</span><div class="chips">'+FACETS[k].values.map(function(v){return '<button type="button" class="chip" data-pf="'+k+'" data-v="'+esc(v)+'" aria-pressed="false">'+esc(v)+'</button>';}).join("")+'</div>'+
      '<input type="text" class="autre-in" id="pa-'+k+'" data-autre="'+k+'" placeholder="Précisez « autre »" hidden></div>';
  });
  $("pFacets").innerHTML=h;
  var typeOpts=TYPES.map(function(t){return '<option>'+esc(t)+'</option>';}).join("");
  $("mType2").innerHTML=typeOpts; $("pAutreType").innerHTML=typeOpts;
  $("tFamSel").innerHTML=FAMILLES.map(function(f){return '<option value="'+f.id+'">'+esc(f.label)+'</option>';}).join("")+'<option value="autre">Autre</option>';
})();
(function(){
  $("cTypeSel").innerHTML=CHANT_TYPES.map(function(t){return '<option>'+esc(t)+'</option>';}).join("");
  $("cManif").innerHTML='<option value="">Je ne sais pas, ou plusieurs</option>'+$("pManif").innerHTML.replace('<option value="">Je ne sais pas</option>','').replace('<option value="autre">Une autre manif…</option>','');
  $("cFacets").innerHTML='<div class="field"><span class="lab">Sujet</span><div class="chips">'+FACETS.sujet.values.map(function(v){return '<button type="button" class="chip" data-cf="sujet" data-v="'+esc(v)+'" aria-pressed="false">'+esc(v)+'</button>';}).join("")+'</div><input type="text" class="autre-in" id="cpa-sujet" placeholder="Précisez « autre »" hidden></div>';
})();
$("cTypeSel").addEventListener("change",function(){ $("cTypeAutre").hidden=this.value!=="Autre"; });
$("cFacets").addEventListener("click",function(e){
  var c=e.target.closest(".chip"); if(!c) return;
  c.setAttribute("aria-pressed", c.getAttribute("aria-pressed")!=="true");
  if(c.getAttribute("data-v")==="Autre"){ var on=c.getAttribute("aria-pressed")==="true"; $("cpa-sujet").hidden=!on; if(!on){ $("cpa-sujet").value=""; $("hca-sujet").value=""; } }
  $("hc-sujet").value=Array.prototype.map.call(document.querySelectorAll('[data-cf][aria-pressed="true"]'),function(x){return x.getAttribute("data-v");}).join(" | ");
});
$("cFacets").addEventListener("input",function(e){ if(e.target.id==="cpa-sujet") $("hca-sujet").value=e.target.value; });
$("pAutreType").addEventListener("change",function(){ $("pAutreTypeAutreBox").hidden=this.value!=="Autre"; });
$("mType2").addEventListener("change",function(){ $("mTypeAutre").hidden=this.value!=="Autre"; });
$("tFamSel").addEventListener("change",function(){ $("tFamAutre").hidden=this.value!=="autre"; });
$("pFacets").addEventListener("input",function(e){ var k=e.target.getAttribute("data-autre"); if(k) $("ha-"+k).value=e.target.value; });
// communes dans le formulaire
$("pVille").addEventListener("input",function(){
  var v=this.value, hit=lastCommunes[v];
  $("pVilleInsee").value=hit?hit.code:""; $("pVilleDep").value=hit?hit.codeDepartement:"";
  communes(v.replace(/\s*\(.*$/,""),function(list){
    $("dlVille").innerHTML=list.map(function(c){ var l=communeLabel(c); lastCommunes[l]=c; return '<option value="'+esc(l)+'"></option>'; }).join("");
  });
});
$("pManif").addEventListener("change",function(){ $("pAutre").hidden=this.value!=="autre"; });
$("pFacets").addEventListener("click",function(e){
  var c=e.target.closest(".chip"); if(!c) return;
  c.setAttribute("aria-pressed", c.getAttribute("aria-pressed")!=="true");
  var k=c.getAttribute("data-pf");
  if(c.getAttribute("data-v")==="Autre"){ var on=c.getAttribute("aria-pressed")==="true"; $("pa-"+k).hidden=!on; if(on) $("pa-"+k).focus(); else { $("pa-"+k).value=""; $("ha-"+k).value=""; } }
  $("h-"+k).value=Array.prototype.map.call(document.querySelectorAll('[data-pf="'+k+'"][aria-pressed="true"]'),function(x){return x.getAttribute("data-v");}).join(" | ");
});
Array.prototype.forEach.call(document.querySelectorAll("[data-seg]"),function(b){
  b.addEventListener("click",function(){
    var w=b.getAttribute("data-seg");
    Array.prototype.forEach.call(document.querySelectorAll("[data-seg]"),function(x){ x.setAttribute("aria-pressed", x===b); });
    ["pancarte","manif","tactique","chant","contact"].forEach(function(f){ $("form-"+f).hidden=(f!==w); });
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
$("removePhoto").addEventListener("click",function(){ hasPhoto=false; hist=[]; cv.hidden=true; $("blurTools").hidden=true; $("pFile").value=""; $("pFile").click(); });
function clearPhoto(){ hasPhoto=false; hist=[]; cv.hidden=true; $("blurTools").hidden=true; $("pFile").value=""; }

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
      if(form.id==="form-pancarte"){ $("pAutre").hidden=true; Array.prototype.forEach.call(document.querySelectorAll('[data-pf][aria-pressed="true"]'),function(c){c.setAttribute("aria-pressed","false");}); ["registre","sujet","references","forme"].forEach(function(k){$("h-"+k).value=""; $("ha-"+k).value=""; $("pa-"+k).value=""; $("pa-"+k).hidden=true;}); clearPhoto(); }
      if(form.id==="form-manif") $("mTypeAutre").hidden=true;
      if(form.id==="form-tactique") $("tFamAutre").hidden=true;
      if(form.id==="form-chant"){ $("cTypeAutre").hidden=true; $("cpa-sujet").hidden=true; $("hc-sujet").value=""; $("hca-sujet").value=""; Array.prototype.forEach.call(document.querySelectorAll('[data-cf][aria-pressed="true"]'),function(c){c.setAttribute("aria-pressed","false");}); }
    }).catch(function(){ formMsg(false,"L’envoi a échoué. Vérifiez votre connexion et réessayez."); })
      .then(function(){ btn.disabled=false; btn.textContent=label; });
  });
}
handle($("form-pancarte"), function(){
  if(!hasPhoto) return "Ajoutez la photo de la pancarte : c’est le cœur de l’atlas.";
  if(!$("pTexte").value.trim()) return "Recopiez le texte de la pancarte avant d’envoyer.";
  if(!$("pCredit").value.trim()) return "Indiquez qui a pris la photo, pour pouvoir la créditer.";
  if(!$("pOk").checked) return "Cochez la case de confirmation : les visages doivent être floutés ou hors cadre.";
  return "";
}, "Merci ! Votre pancarte sera en ligne dans quelques minutes.", function(){
  return new Promise(function(res){ cv.toBlob(function(b){ res(function(fd){ fd.delete("photo"); if(b) fd.append("photo", b, "pancarte.jpg"); }); },"image/jpeg",0.85); });
});
handle($("form-manif"), function(){ return !$("mDate").value?"Indiquez au moins la date de la manif.":""; }, "Merci ! La manif est envoyée. Sa page sera créée après relecture.");
handle($("form-contact"), function(){ return !$("ctMessage").value.trim()?"Écrivez votre message avant d’envoyer.":""; }, "Merci, votre message est bien arrivé. Nous vous répondrons si vous avez laissé votre e-mail.");
handle($("form-chant"), function(){ return (!$("cTitre").value.trim()||!$("cParoles").value.trim())?"Donnez au moins un titre et les paroles du chant.":""; }, "Merci ! Votre chant sera en ligne dans quelques minutes.");
handle($("form-tactique"), function(){ return (!$("tNom").value.trim()||!$("tDesc").value.trim())?"Donnez au moins un nom et une description à la tactique.":""; }, "Merci ! Votre tactique sera en ligne dans quelques minutes.");

$("sigClose").addEventListener("click",function(){ $("dlgSignal").close(); });
$("form-signalement").addEventListener("submit",function(e){
  e.preventDefault();
  var msg=function(ok,t){ $("sigMsg").innerHTML='<div class="msg '+(ok?"ok":"err")+'">'+esc(t)+'</div>'; };
  if(onLocal()){ msg(false,"Le signalement fonctionnera une fois le site en ligne."); return; }
  send(this).then(function(){ msg(true,"Merci, le signalement est transmis. Le contenu sera vérifié rapidement."); $("sigCom").value=""; setTimeout(function(){ $("dlgSignal").close(); },1800); })
    .catch(function(){ msg(false,"L’envoi a échoué. Réessayez dans un instant."); });
});

/* ---------- démarrage ---------- */
renderFilters(); renderGrid(); renderStats(); renderBig(true); renderStrip(); renderTactiques(); renderChants(); route();
})();

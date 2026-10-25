// Expanded collection, discovery and composition tools.
let pickerMode='compose',pickerPage=0;
const pickerPageSize=42;
function initRefinement(){
 document.querySelectorAll('[data-glyph-count]').forEach(el=>el.textContent=glyphs.length);
 const rail=$('#specimenRail');
 const ids=['g-28-0','g-29-1','g-41-0','g-61-0','g-81-3','g-95-1','g-41-1','g-28-3','g-61-3','g-81-1','g-95-2','g-29-2'];
 ids.forEach((id,i)=>{const it=glyphs.find(x=>x.id===id);if(!it)return;const b=document.createElement('button');b.innerHTML=`<img src="${path(it)}" alt="精选字样，原书第${it.page}页"><small>${String(i+1).padStart(2,'0')}</small>`;b.onclick=()=>openDetail(it);rail.append(b)});
}
$('#refreshHero').onclick=()=>{const pool=[...glyphs];heroIds=heroIds.map(()=>pool.splice(Math.floor(Math.random()*pool.length),1)[0].id);heroScattered=false;$('#playground').classList.remove('is-scattered');initHero();tone(3)};
$('#archiveSearch').oninput=renderGallery;
$('#densityToggle').onclick=()=>{const dense=$('#gallery').classList.toggle('dense');$('#densityToggle').setAttribute('aria-pressed',dense);$('#densityToggle').textContent=dense?'舒展浏览 ▢':'密集浏览 ▦'};
$('#randomArt').onclick=()=>{const pool=(view==='work'?works:glyphs.filter(it=>author<0||it.author===author)).filter(it=>matchesQuery(it,$('#archiveSearch').value));if(pool.length)openDetail(pool[Math.floor(Math.random()*pool.length)]);else notice('先换一个检索线索，再与字相遇')};
function stepDetail(step){const pool=detail.kind==='glyph'?glyphs:works;openDetail(pool[(pool.indexOf(detail)+step+pool.length)%pool.length])}
$('#prevDetail').onclick=()=>stepDetail(-1);$('#nextDetail').onclick=()=>stepDetail(1);
function openPicker(mode='compose'){
 pickerMode=mode;pickerPage=0;$('#pickerSearch').value='';$('#pickerCategory').value='all';
 $('#pickerCategory').querySelector('option[value="work"]').hidden=mode!=='compose';
 $('#pickerTitle').textContent=mode==='decon'?'挑一个字，发现另一种形。':'每一个字，都可以是起点。';
 $('#pickerHelp').textContent=mode==='decon'?'372 个原书字样。点击一个，开始解构。':'点击字样加入海报，可以连续选择。';
 $('#pickerDone').textContent=mode==='decon'?'返回实验 ↗':'回到我的海报 ↗';
 if(mode==='ink'||mode==='rhythm'){$('#pickerTitle').textContent='选一个字，让实验继续。';$('#pickerHelp').textContent='点击字样替换当前实验中的字。';$('#pickerDone').textContent='返回实验 ↗'}renderPicker();$('#pickerDialog').showModal();
}
function renderPicker(){
 const category=$('#pickerCategory').value,query=$('#pickerSearch').value;
 const list=(category==='work'&&pickerMode!=='decon'?works:glyphs.filter(it=>category==='all'||it.author===Number(category))).filter(it=>matchesQuery(it,query));
 const pages=Math.max(1,Math.ceil(list.length/pickerPageSize));pickerPage=clamp(pickerPage,0,pages-1);
 const grid=$('#pickerGrid');grid.replaceChildren();
 list.slice(pickerPage*pickerPageSize,(pickerPage+1)*pickerPageSize).forEach(it=>{
  const b=document.createElement('button');b.className='picker-item';b.innerHTML=`<img src="${path(it)}" alt="${it.kind==='glyph'?authors[it.author]:'字体构成'} · 第${it.page}页" loading="lazy"><span>P.${it.page}</span><i>＋</i>`;
  b.setAttribute('aria-label',`${pickerMode==='decon'?'解构':pickerMode==='compose'?'添加':'选用'} ${it.id}，原书第${it.page}页`);
  b.onclick=()=>{if(pickerMode==='ink'||pickerMode==='rhythm'){chooseLabGlyph(it,pickerMode);$('#pickerDialog').close();return}if(pickerMode==='decon'){deconIndex=glyphs.indexOf(it);$('#spread').value=0;$('#pickerDialog').close();goScene(2)}else{const count=poster.items.length;addItem(it);renderPoster();if(poster.items.length>count){b.classList.add('picked');b.querySelector('i').textContent='✓';$('#pickerCount').textContent=`${list.length} 件素材 · 画布已有 ${poster.items.length} 件`;$('#pickerHelp').textContent=`已加入第 ${it.page} 页字样，可以继续选择。`;tone(poster.items.length)}}};grid.append(b);
 });
 if(!list.length)grid.innerHTML='<p class="empty-state">没有找到对应字样。试试作者名或页码。</p>';
 $('#pickerCount').textContent=`${list.length} 件素材${pickerMode==='compose'?` · 画布已有 ${poster.items.length} 件`:''}`;
 $('#pickerPage').textContent=`${pickerPage+1} / ${pages}`;$('#pickerPrev').disabled=pickerPage===0;$('#pickerNext').disabled=pickerPage===pages-1;grid.scrollTop=0;
}
$('#openPicker').onclick=()=>openPicker();$('#chooseDecon').onclick=()=>openPicker('decon');
$('#pickerSearch').oninput=()=>{pickerPage=0;renderPicker()};$('#pickerCategory').onchange=()=>{pickerPage=0;renderPicker()};
$('#pickerPrev').onclick=()=>{pickerPage--;renderPicker()};$('#pickerNext').onclick=()=>{pickerPage++;renderPicker()};$('#pickerDone').onclick=()=>$('#pickerDialog').close();
$('#inspirePoster').onclick=()=>{
 remember();const pool=[...glyphs],points=[[32,27,110,-13],[70,35,90,9],[36,53,130,0],[70,65,100,14],[29,77,64,-7]];
 poster.items=points.map((p,i)=>({uid:Date.now()+i,id:pool.splice(Math.floor(Math.random()*pool.length),1)[0].id,x:p[0],y:p[1],size:p[2],rotation:p[3]}));selected=null;savePoster();renderPoster();tone(3);notice('新的字形相遇了。拖动它们，完成你的构图。');
};
document.addEventListener('keydown',e=>{if(e.key==='/'&&scene===1&&!document.querySelector('dialog[open]')&&!['INPUT','TEXTAREA','SELECT'].includes(e.target.tagName)){e.preventDefault();$('#archiveSearch').focus()}});

$$('[data-slices]').forEach(b=>b.onclick=()=>{sliceGrid=Number(b.dataset.slices);$$('[data-slices]').forEach(t=>{t.classList.toggle('active',t===b);t.setAttribute('aria-pressed',t===b)});renderPieces();tone(sliceGrid)});

// Start only after both script modules and all UI bindings are available.


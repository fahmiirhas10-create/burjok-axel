const MENU=[
["Nasi","Nasi Putih",4000],["Nasi","Nasi Telur Dadar",9000],["Nasi","Nasi Telur Ceplok",9000],["Nasi","Nasi Orak-arik",9000],["Nasi","Nasi Sarden",12000],["Nasi","Nasi Ayam Goreng",15000],["Nasi","Nasi Orek Tempe",8000],["Nasi","Nasi Omelet",10000],
["Mie","Indomie Goreng",7000],["Mie","Indomie Rebus",7000],["Mie","Indomie Goreng Telur",10000],["Mie","Indomie Rebus Telur",10000],["Mie","Indomie Double",12000],["Mie","Indomie Double Telur",15000],["Mie","Mie Nyemek",9000],
["Minuman","Es Teh",4000],["Minuman","Teh Hangat",3000],["Minuman","Es Jeruk",5000],["Minuman","Jeruk Hangat",4000],["Minuman","Kopi Hitam",4000],["Minuman","Kopi Susu",5000],["Minuman","Susu Jahe",6000],["Minuman","Es Susu Coklat",6000],["Minuman","Es Milo",7000],["Minuman","Air Mineral",3000],
["Burjo","Bubur Kacang Ijo",7000],["Burjo","Ketan Hitam",7000],["Burjo","Burjo Susu",8000],["Burjo","Roti Bakar Coklat",10000],
["Gorengan","Tempe Goreng",1000],["Gorengan","Tahu Goreng",1000],["Gorengan","Bakwan",1000],["Gorengan","Telur Rebus",3000],["Gorengan","Kerupuk",1000],["Gorengan","Sosis Goreng",2000]
];
const CATS=["Semua","Nasi","Mie","Minuman","Burjo","Gorengan"];
const IC={Nasi:"🍚",Mie:"🍜",Minuman:"🧋",Burjo:"🥣",Gorengan:"🍤"};
const $=id=>document.getElementById(id);
const rp=n=>"Rp"+Math.round(n).toLocaleString("id-ID");
let cart={},cat="Semua",q="",last=null,armed=false;
function load(){try{return JSON.parse(localStorage.getItem("burjo2")||"[]")}catch(e){return[]}}
function save(){try{localStorage.setItem("burjo2",JSON.stringify(hist))}catch(e){}}
let hist=load();
const total=()=>Object.keys(cart).reduce((s,i)=>s+MENU[i][2]*cart[i],0);

function rMenu(){
 $("tabs").innerHTML=CATS.map(c=>`<button class="${c===cat?"on":""}" data-c="${c}">${IC[c]||"🍽️"} ${c}</button>`).join("");
 $("menu").innerHTML=MENU.map((m,i)=>[m,i]).filter(([m])=>(cat==="Semua"||m[0]===cat)&&m[1].toLowerCase().includes(q)).map(([m,i])=>`<button class="item" data-i="${i}"><i>${IC[m[0]]}</i><b>${m[1]}</b><span>${rp(m[2])}</span></button>`).join("")||'<p class="mut">Menu tidak ditemukan.</p>';
}
function rCart(){
 const ks=Object.keys(cart);
 $("cart").innerHTML=ks.length?ks.map(i=>`<div class="row"><div><b>${MENU[i][1]}</b><div class="mut">${rp(MENU[i][2])}</div></div><div class="qty"><button data-m="${i}">−</button><b>${cart[i]}</b><button data-p="${i}">+</button></div><b>${rp(MENU[i][2]*cart[i])}</b></div>`).join(""):'<p class="mut">Belum ada pesanan. Ketuk menu untuk menambah.</p>';
 const t=total();$("total").textContent=rp(t);
 const tn=+$("tunai").value||0;
 $("kemb").textContent=rp(Math.max(0,tn-t));
 $("bayar").disabled=!(t>0&&tn>=t);
 const opts=[["Uang pas",t],["10.000",10000],["20.000",20000],["50.000",50000],["100.000",100000]];
 $("quick").innerHTML=opts.filter((o,j)=>j===0?t>0:true).map(o=>`<button data-u="${o[1]}">${o[0]}</button>`).join("");
}
function rHist(){
 const hari=new Date().toDateString();
 const h=hist.filter(x=>new Date(x.t).toDateString()===hari).reverse();
 $("sum").textContent=`${h.length} transaksi · Omzet ${rp(h.reduce((s,x)=>s+x.total,0))}`;
 $("hist").innerHTML=h.map(x=>`<div class="row" style="align-items:flex-start"><div><b>${new Date(x.t).toLocaleTimeString("id-ID",{hour:"2-digit",minute:"2-digit"})}</b>${x.meja?" · "+x.meja:""}<div class="mut">${x.items.map(i=>i.q+"× "+i.n).join(", ")}</div></div><b>${rp(x.total)}</b></div>`).join("")||'<p class="mut">Belum ada transaksi hari ini.</p>';
}
function view(k){$("vk").classList.toggle("hide",!k);$("vr").classList.toggle("hide",k);$("nk").classList.toggle("on",k);$("nr").classList.toggle("on",!k);if(!k)rHist()}

$("nk").onclick=()=>view(true);$("nr").onclick=()=>view(false);
$("cari").oninput=e=>{q=e.target.value.toLowerCase();rMenu()};
$("tabs").onclick=e=>{const c=e.target.dataset.c;if(c){cat=c;rMenu()}};
$("menu").onclick=e=>{const b=e.target.closest("[data-i]");if(b){const i=b.dataset.i;cart[i]=(cart[i]||0)+1;rCart()}};
$("cart").onclick=e=>{const m=e.target.dataset.m,p=e.target.dataset.p;if(p!==undefined)cart[p]++;if(m!==undefined){if(--cart[m]<=0)delete cart[m]}rCart()};
$("quick").onclick=e=>{const u=e.target.dataset.u;if(u){$("tunai").value=u;rCart()}};
$("tunai").oninput=rCart;
$("kosong").onclick=()=>{cart={};$("tunai").value="";rCart()};
$("bayar").onclick=()=>{
 const t=total(),tn=+$("tunai").value;
 const items=Object.keys(cart).map(i=>({n:MENU[i][1],q:cart[i],h:MENU[i][2]}));
 last={t:Date.now(),meja:$("meja").value.trim(),items,total:t,tunai:tn};
 hist.push(last);save();
 $("sw").innerHTML=new Date(last.t).toLocaleString("id-ID")+(last.meja?"<br>"+last.meja:"");
 $("si").innerHTML=items.map(i=>`<div style="display:flex;justify-content:space-between"><span>${i.q}× ${i.n}</span><span>${rp(i.q*i.h)}</span></div>`).join("");
 $("ss").innerHTML=`<hr><div style="display:flex;justify-content:space-between"><b>Total</b><b>${rp(t)}</b></div><div style="display:flex;justify-content:space-between"><span>Tunai</span><span>${rp(tn)}</span></div><div style="display:flex;justify-content:space-between"><span>Kembali</span><span>${rp(tn-t)}</span></div>`;
 $("struk").classList.add("on");
};
$("baru").onclick=()=>{$("struk").classList.remove("on");cart={};$("tunai").value="";$("meja").value="";rCart()};
$("hapus").onclick=()=>{
 if(!armed){armed=true;$("hapus").textContent="Ketuk lagi untuk konfirmasi hapus";setTimeout(()=>{armed=false;$("hapus").textContent="Hapus semua riwayat"},3000);return}
 hist=[];save();armed=false;$("hapus").textContent="Hapus semua riwayat";rHist();
};
rMenu();rCart();

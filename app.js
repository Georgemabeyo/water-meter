const PRICE_PER_LITER = 1.6;
const tenants = ["Alice","Bob","Charlie","David","Eve","Frank","Grace","Hannah","Ivan","Judy"];
const meters = [];
tenants.forEach((name, idx)=>{
    let usage=[];
    for(let i=0;i<30;i++){
        usage.push(Math.floor(Math.random()*41)+10);
    }
    meters.push({meter_id:`WM-${101+idx}`, room_id:`R${100+idx}`, tenant:name, usageHistory:usage});
});
function getStatus(usageHistory, dayIndex){
    const totalSoFar=usageHistory.slice(0, dayIndex+1).reduce((a,b)=>a+b,0);
    const avgSoFar=totalSoFar/(dayIndex+1);
    return usageHistory[dayIndex]>avgSoFar?"abnormal":"normal";
}
const daySelect=document.getElementById("daySelect");
const today=new Date();
const monthDates=Array.from({length:30},(_,i)=>{
    const d=new Date(today.getFullYear(),today.getMonth(),i+1);
    const opt=document.createElement("option");
    opt.value=i; opt.text=`${d.getDate().toString().padStart(2,'0')}-${(d.getMonth()+1).toString().padStart(2,'0')}`;
    daySelect.appendChild(opt);
    return `${d.getDate().toString().padStart(2,'0')}-${(d.getMonth()+1).toString().padStart(2,'0')}`;
});
function renderTable(filter=""){
    const dayIndex=parseInt(daySelect.value)||29;
    let table="";
    meters.forEach(m=>{
        if(m.meter_id.includes(filter)||m.room_id.includes(filter)||m.tenant.toLowerCase().includes(filter.toLowerCase())){
            const totalUsage=m.usageHistory.reduce((a,b)=>a+b,0);
            const statusClass=getStatus(m.usageHistory,dayIndex);
            const cost=(totalUsage*PRICE_PER_LITER).toFixed(2);
            table+=`<tr onclick="showRoomGraph('${m.meter_id}')">
            <td>${m.meter_id}</td>
            <td>${m.room_id}</td>
            <td style="color:${statusClass==='abnormal'?'#b22222':'#2e8b57'}">${m.tenant}</td>
            <td class="${statusClass==='abnormal'?'abnormal-cell':''}">${totalUsage}</td>
            <td><span class="alert-sign ${statusClass}">${statusClass}</span></td>
            <td>${cost}</td>
            </tr>`;
        }
    });
    document.getElementById("meterTable").innerHTML=table;
}
let roomChartInstance=null;
let selectedRoom=meters[0];
function showRoomGraph(meterId){
    selectedRoom=meters.find(m=>m.meter_id===meterId);
    if(!selectedRoom) return;
    const ctx=document.getElementById("roomChart").getContext("2d");
    if(roomChartInstance) roomChartInstance.destroy();
    const borderColors=selectedRoom.usageHistory.map((u,i)=>getStatus(selectedRoom.usageHistory,i)==="abnormal"?'#ff4c4c':'#6fcf97');
    const bgColors=selectedRoom.usageHistory.map((u,i)=>getStatus(selectedRoom.usageHistory,i)==="abnormal"?'rgba(255,76,76,0.3)':'rgba(111,207,151,0.3)');
    roomChartInstance=new Chart(ctx,{type:'line',data:{labels:monthDates,datasets:[{label:`${selectedRoom.tenant} (${selectedRoom.room_id})`,data:selectedRoom.usageHistory,borderColor:borderColors,backgroundColor:bgColors,fill:true,tension:0.3,pointRadius:5,pointHoverRadius:7}]},options:{responsive:true,plugins:{legend:{display:true}},scales:{y:{beginAtZero:true}}}});
}
const summaryContainer=document.getElementById("meterSummaryCards");
meters.forEach(m=>{
    const totalUsage=m.usageHistory.reduce((a,b)=>a+b,0);
    const card=`<div class="col-lg-3 col-md-4 col-sm-6">
    <div class="card p-4 text-center card-gradient">
        <h5>${m.tenant} (${m.meter_id})</h5>
        <h6>Room: ${m.room_id}</h6>
        <h6>Total Usage: ${totalUsage} L</h6>
        <h6>Cost: ${(totalUsage*PRICE_PER_LITER).toFixed(2)} Tsh</h6>
    </div></div>`;
    summaryContainer.innerHTML+=card;
});
function renderSummaryChart(){
    const labels=meters.map(m=>m.tenant);
    const dayIndex=parseInt(daySelect.value)||29;
    const normalCounts=meters.map(m=>getStatus(m.usageHistory,dayIndex)==="normal"?1:0);
    const abnormalCounts=meters.map(m=>getStatus(m.usageHistory,dayIndex)==="abnormal"?1:0);
    const ctxSummary=document.getElementById("summaryChart").getContext("2d");
    new Chart(ctxSummary,{type:'bar',data:{labels:labels,datasets:[{label:'Normal',data:normalCounts,backgroundColor:'#6fcf97'},{label:'Abnormal',data:abnormalCounts,backgroundColor:'#ff4c4c'}]},options:{responsive:true,plugins:{legend:{display:true},tooltip:{callbacks:{label:function(context){return`${context.dataset.label}: ${context.raw}`;}}}},scales:{y:{beginAtZero:true,stepSize:1}}}});
}
renderTable();
renderSummaryChart();
daySelect.addEventListener("change",()=>{renderTable(document.getElementById("searchInput").value);renderSummaryChart();});
document.getElementById("searchInput").addEventListener("input",function(){renderTable(this.value);});
document.getElementById("toggleSidebar").addEventListener("click",()=>{document.getElementById("sidebar").classList.toggle("collapsed");document.getElementById("mainContent").classList.toggle("expanded");});
document.querySelectorAll('.sidebar a').forEach(link=>{link.addEventListener('click',e=>{e.preventDefault();const pageId=link.getAttribute('data-page');document.querySelectorAll('.page').forEach(p=>p.classList.remove('active'));document.getElementById(pageId).classList.add('active');});});
showRoomGraph(selectedRoom.meter_id);
if('serviceWorker' in navigator){window.addEventListener('load',()=>{navigator.serviceWorker.register('service-worker.js').then(reg=>{console.log('Service Worker Registered',reg);}).catch(err=>console.log('SW Registration Failed:',err));});}
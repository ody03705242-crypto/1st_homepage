const DB = {
  복무:[
    ["연가 사용 기준 및 절차","연가 일수, 사용방법, 승인절차 등 복무 관련 기준"],
    ["육아휴직 신청 방법","육아휴직 신청 대상, 기간 및 제출서류"],
    ["공가 사용 기준","공가 사유 및 사용 절차 안내"]
  ],
  복지:[
    ["자녀 학자금 지원","직원 자녀 학자금 지원 기준 및 신청 절차"],
    ["건강검진 지원제도","건강검진 대상 및 지원범위 안내"],
    ["복지포인트 사용방법","복지포인트 지급 및 사용 기준"]
  ],
  SOP:[
    ["화재 현장 안전 SOP","화재 현장 선착대 안전관리 및 대응절차"],
    ["구조 현장 안전관리 절차","구조활동 단계별 안전관리 기준"],
    ["장비 점검 SOP","소방장비 일상점검 및 관리절차"]
  ],
  통계:[
    ["2025년 화재 발생 통계","연도별·월별·지역별 화재 발생 현황"],
    ["119 출동 통계","출동 유형 및 시간대별 출동 현황"],
    ["2025년 구조 출동 통계 분석","구조 출동 유형 및 지역별 분석"]
  ]
};
let currentType="복무";

const modal=document.getElementById("modal"), query=document.getElementById("query"), results=document.getElementById("results");
const toast=document.getElementById("toast");

function openSearch(type){
  currentType=type; document.getElementById("modalTitle").textContent=`AI ${type}검색`;
  query.value=""; renderResults(DB[type]); modal.classList.add("show"); setTimeout(()=>query.focus(),50);
}
function renderResults(items){
  results.innerHTML=items.map(x=>`<div class="result"><strong>${x[0]}</strong><span>${x[1]}</span></div>`).join("");
}
function doSearch(){
  const q=query.value.trim();
  if(!q){renderResults(DB[currentType]);return}
  const all=Object.values(DB).flat();
  const found=all.filter(x=>(x[0]+" "+x[1]).toLowerCase().includes(q.toLowerCase()));
  renderResults(found.length?found:[["검색 결과가 없습니다.","검색어를 변경하거나 다른 검색 분야를 선택해 주세요."]]);
  const key="ai119-history";
  const old=JSON.parse(localStorage.getItem(key)||"[]");
  old.unshift({q,type:currentType,date:new Date().toLocaleString("ko-KR",{hour12:false})});
  localStorage.setItem(key,JSON.stringify(old.slice(0,10)));
  showToast("검색 기록이 저장되었습니다.");
}
function showToast(msg){toast.textContent=msg;toast.classList.add("show");setTimeout(()=>toast.classList.remove("show"),1800)}

const NOTEBOOK_URLS = {
  "복무": "https://notebook.google.com/notebook/90fee1fd-e609-48b2-af8f-4546ad40a299",
  "복지": "https://notebook.google.com/notebook/b437d223-78b3-4f71-b667-3beaa65ecd25",
  "SOP": "https://notebook.google.com/notebook/e11ecb55-02db-4e4b-a03b-f06b5d0a77c7",
  "통계": "https://notebook.google.com/notebook/cd94e6f3-81ac-4682-a84d-0b1b0d839ae6"
};

document.querySelectorAll(".search-btn").forEach(b=>b.addEventListener("click",()=>{
  const type = b.dataset.type;
  if(NOTEBOOK_URLS[type]){
    window.open( NOTEBOOK_URLS[type], '_blank');
  } else {
    openSearch(type);
  }
}));
document.getElementById("close").onclick=()=>modal.classList.remove("show");
modal.addEventListener("click",e=>{if(e.target===modal)modal.classList.remove("show")});
document.getElementById("doSearch").onclick=doSearch;
query.addEventListener("keydown",e=>{if(e.key==="Enter")doSearch()});

//좌측 메뉴들
document.querySelectorAll(".nav").forEach(n=>n.addEventListener("click",()=>{
  //document.querySelectorAll(".nav").forEach(x=>x.classList.remove("active")); n.classList.add("active");
  const name=n.dataset.nav;
  const map={"복무검색":"복무","복지검색":"복지","SOP 검색":"SOP","통계검색":"통계"};
  if(map[name]) openSearch(map[name]);
  else if(name=="자료실") {
    const subNavGroup = n.nextElementSibling; // 바로 뒤의 .sub-nav-group 선택
    n.classList.toggle("open");

    if (n.classList.contains("open")) {
      subNavGroup.style.maxHeight = subNavGroup.scrollHeight + "px";
    } else {
      subNavGroup.style.maxHeight = null;
    }
  }
  else if(name!=="홈") showToast(`${name} 메뉴는 연결 대상입니다.`);
}));

// 좌측 메뉴의 하위 메뉴. 일단 자료실 밑의 하위메뉴
document.querySelectorAll(".sub-nav").forEach(sub => {
  sub.addEventListener("click", () => {
    const targetUrl = sub.dataset.url || "https://www.google.com";
    window.open(targetUrl, "_blank");
  });
});


document.querySelectorAll(".tag").forEach(t=>t.onclick=()=>{
  const text=t.textContent.replace("# ",""); openSearch(text.includes("연가")||text.includes("육아")?"복무":text.includes("학자금")?"복지":text.includes("통계")?"통계":"SOP");
  query.value=text; doSearch();
});
document.getElementById("clearHistory").onclick=()=>{
  localStorage.removeItem("ai119-history"); showToast("최근 검색 기록을 삭제했습니다.");
};
document.getElementById("noticeMore").onclick=()=>showToast("공지사항 전체 목록으로 이동합니다.");

window.addEventListener("keydown",e=>{if(e.key==="Escape")modal.classList.remove("show")});

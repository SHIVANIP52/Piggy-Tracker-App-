// SELECT THE PIG SVG ELEMENT
const pigSvg = document.getElementById("pig");

// CURRENCY SYMBOL
let currencySymbol = "$";

// FUNCTION TO DRAW THE PIG
function drawPig(mood) {
  const smile = `<path d="M42 83 Q55 93 68 83" stroke="#C2517A" stroke-width="2.5" fill="none" stroke-linecap="round"/>`;
  const flat = `<path d="M42 85 Q55 85 68 85" stroke="#C2517A" stroke-width="2.5" fill="none" stroke-linecap="round"/>`;
  const frown = `<path d="M42 88 Q55 80 68 88" stroke="#C2517A" stroke-width="2.5" fill="none" stroke-linecap="round"/>`;
  const tears = `<ellipse cx="40" cy="65" rx="2.5" ry="3.5" fill="#93C5FD" opacity=".9"/>
                 <ellipse cx="40" cy="73" rx="2" ry="3" fill="#93C5FD" opacity=".7"/>
                 <ellipse cx="70" cy="65" rx="2.5" ry="3.5" fill="#93C5FD" opacity=".9"/>
                 <ellipse cx="70" cy="73" rx="2" ry="3" fill="#93C5FD" opacity=".7"/>`;
  const mouth = mood === "happy" ? smile : mood === "sad" ? frown : flat;
  const tear = mood === "sad" ? tears : "";
  pigSvg.innerHTML = `
    <ellipse cx="22" cy="34" rx="13" ry="15" fill="#F9A8C9"/>
    <ellipse cx="88" cy="34" rx="13" ry="15" fill="#F9A8C9"/>
    <ellipse cx="22" cy="34" rx="7" ry="9" fill="#F472B6"/>
    <ellipse cx="88" cy="34" rx="7" ry="9" fill="#F472B6"/>
    <circle cx="55" cy="60" r="42" fill="#F9A8C9"/>
    <ellipse cx="38" cy="64" rx="8" ry="6" fill="#FB7185" opacity=".25"/>
    <ellipse cx="72" cy="64" rx="8" ry="6" fill="#FB7185" opacity=".25"/>
    <circle cx="40" cy="53" r="5" fill="#2C1A22"/>
    <circle cx="70" cy="53" r="5" fill="#2C1A22"/>
    <circle cx="42" cy="51" r="1.8" fill="#fff"/>
    <circle cx="72" cy="51" r="1.8" fill="#fff"/>
    <ellipse cx="55" cy="70" rx="13" ry="9" fill="#F472B6" opacity=".5"/>
    <circle cx="49" cy="70" r="3.5" fill="#C2517A" opacity=".45"/>
    <circle cx="61" cy="70" r="3.5" fill="#C2517A" opacity=".45"/>
    ${mouth}
    ${tear}
  `;
}

drawPig("neutral");

// SELECT CANVAS
const canvas = document.getElementById("donutChart");
const ctx = canvas.getContext("2d");
let chart = null;

function drawChart(totalIn, totalOut) {
  const total = totalIn + totalOut;
  if (chart) chart.destroy();
  chart = new Chart(ctx, {
    type: "doughnut",
    data: {
      datasets: [
        {
          data: total === 0 ? [1] : [totalIn, totalOut],
          backgroundColor: total === 0 ? ["#E5E7EB"] : ["#3B82F6", "#E11D48"],
          borderWidth: 0,
        },
      ],
    },
    options: {
      cutout: "70%",
      animation: { duration: 400 },
      plugins: {
        legend: { display: false },
        tooltip: { enabled: total > 0 },
      },
      responsive: false,
      elements: { point: { radius: 0 } },
    },
  });
}

canvas.width = 200;
canvas.height = 200;
drawChart(0, 0);

// VARIABLES
let balance = 0;
let totalIn = 0;
let totalOut = 0;

// SELECT ELEMENTS
const balanceEl = document.getElementById("balance");
const totalInEl = document.getElementById("totalIn");
const totalOutEl = document.getElementById("totalOut");
const pigMoodEl = document.getElementById("pigMood");
const donutPctEl = document.getElementById("donutPct");

// UPDATE EVERYTHING ON SCREEN
function updateUI() {
  balanceEl.textContent = currencySymbol + Math.abs(balance).toFixed(2);
  totalInEl.textContent = "+" + currencySymbol + totalIn.toFixed(2);
  totalOutEl.textContent = "-" + currencySymbol + totalOut.toFixed(2);
  let mood = "neutral";
  let moodText = "Neutral Piggy 😐";
  if (balance > 0) {
    mood = "happy";
    moodText = "Happy Piggy!! 🎉";
  } else if (balance < 0) {
    mood = "sad";
    moodText = "Crying Piggy 😢";
  }
  pigMoodEl.textContent = moodText;
  drawPig(mood);
  const total = totalIn + totalOut;
  const pct = total > 0 ? Math.round((totalIn / total) * 100) : 0;
  donutPctEl.textContent = pct + "%";
  drawChart(totalIn, totalOut);
}

// TRANSACTIONS STORAGE
let incomeList = [];
let expenseList = [];
let selectedIncCat = "💰";
let selectedExpCat = "🛒";
const months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

// SCREEN NAVIGATION
function showScreen(screenId) {
  // hide all screens first
  document.getElementById("splashScreen").style.display = "none";
  document.getElementById("welcomeScreen").style.display = "none";
  document.getElementById("termsScreen").style.display = "none";
  document.getElementById("mainScreen").style.display = "none";
  document.getElementById("incomeScreen").style.display = "none";
  document.getElementById("expenseScreen").style.display = "none";

  // show the right one
  const target = document.getElementById(screenId);
  if (screenId === "welcomeScreen" || screenId === "termsScreen") {
    target.style.display = "flex";
  } else {
    target.style.display = "block";
  }
  window.scrollTo(0, 0);
}

document.getElementById("feedBtn").addEventListener("click", function () {
  showScreen("incomeScreen");
});
document.getElementById("starveBtn").addEventListener("click", function () {
  showScreen("expenseScreen");
});
document
  .getElementById("backFromIncome")
  .addEventListener("click", function () {
    showScreen("mainScreen");
  });
document
  .getElementById("backFromExpense")
  .addEventListener("click", function () {
    showScreen("mainScreen");
  });

document
  .getElementById("showIncomeForm")
  .addEventListener("click", function () {
    const form = document.getElementById("incomeForm");
    form.style.display = form.style.display === "flex" ? "none" : "flex";
  });

document
  .getElementById("showExpenseForm")
  .addEventListener("click", function () {
    const form = document.getElementById("expenseForm");
    form.style.display = form.style.display === "flex" ? "none" : "flex";
  });

document.querySelectorAll("#incomeForm .cat-btn").forEach(function (btn) {
  btn.addEventListener("click", function () {
    document
      .querySelectorAll("#incomeForm .cat-btn")
      .forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    selectedIncCat = btn.textContent;
  });
});

document.querySelectorAll("#expenseForm .cat-btn").forEach(function (btn) {
  btn.addEventListener("click", function () {
    document
      .querySelectorAll("#expenseForm .cat-btn")
      .forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    selectedExpCat = btn.textContent;
  });
});

// RENDER TRANSACTION LIST
function renderList(type) {
  const listEl = document.getElementById(
    type === "income" ? "incomeList" : "expenseList",
  );
  const txs = type === "income" ? incomeList : expenseList;
  if (txs.length === 0) {
    listEl.innerHTML =
      '<p class="empty-msg">' +
      (type === "income" ? "No income yet" : "No expenses yet") +
      "</p>";
    return;
  }
  listEl.innerHTML = [...txs]
    .reverse()
    .map(
      (tx) => `
    <div class="tx-item">
      <div>
        <div class="tx-name">${tx.cat} ${tx.desc}</div>
        <div class="tx-date">${tx.date}</div>
      </div>
      <div class="${type === "income" ? "tx-amt-inc" : "tx-amt-exp"}">
        ${type === "income" ? "+" : "-"}${currencySymbol}${tx.amt.toFixed(2)}
      </div>
    </div>
  `,
    )
    .join("");
}

// CONFIRM INCOME
document.getElementById("confirmIncome").addEventListener("click", function () {
  const desc = document.getElementById("incomeDesc").value.trim() || "Income";
  const amt = parseFloat(document.getElementById("incomeAmt").value);
  if (!amt || amt <= 0) return;
  const d = new Date();
  const date = months[d.getMonth()] + " " + d.getDate();
  incomeList.push({ desc, amt, date, cat: selectedIncCat });
  balance += amt;
  totalIn += amt;
  balance = Math.round(balance * 100) / 100;
  document.getElementById("incomeDesc").value = "";
  document.getElementById("incomeAmt").value = "";
  document.getElementById("incomeForm").style.display = "none";
  renderList("income");
  updateUI();
});

// CONFIRM EXPENSE
document
  .getElementById("confirmExpense")
  .addEventListener("click", function () {
    const desc =
      document.getElementById("expenseDesc").value.trim() || "Expense";
    const amt = parseFloat(document.getElementById("expenseAmt").value);
    if (!amt || amt <= 0) return;
    const d = new Date();
    const date = months[d.getMonth()] + " " + d.getDate();
    expenseList.push({ desc, amt, date, cat: selectedExpCat });
    balance -= amt;
    totalOut += amt;
    balance = Math.round(balance * 100) / 100;
    document.getElementById("expenseDesc").value = "";
    document.getElementById("expenseAmt").value = "";
    document.getElementById("expenseForm").style.display = "none";
    renderList("expense");
    updateUI();
  });

// CURRENCY SELECTOR
document
  .getElementById("currencySelect")
  .addEventListener("change", function () {
    currencySymbol = this.value;
    updateUI();
  });

  // ONBOARDING
function goToTerms() {
  const name = document.getElementById('userName').value.trim();
  if (!name) return;
  document.getElementById('welcomeScreen').style.display = 'none';
  const t = document.getElementById('termsScreen');
  t.style.display = 'flex';
}

function finishOnboarding() {
  const checked = document.getElementById("termsCheck").checked;
  if (!checked) {
    alert("Please agree to the terms!");
    return;
  }
  localStorage.setItem("piggyOnboarded", "true");
  showScreen("mainScreen");
}
// CHECK IF ALREADY ONBOARDED
window.addEventListener("load", function () {
  if (localStorage.getItem("piggyOnboarded")) {
    showScreen("mainScreen");
  } else {
    showScreen("splashScreen");
  }
}); 
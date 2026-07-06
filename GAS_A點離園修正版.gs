// A點離園端 GAS 修正版
// 用途：修正「人數更正」被寫成 IN 1 的問題
// 正確應該是：人數更正 1 人 → OUT -1

// ==============================
// 1. 請用這段整段取代原本 appendStatusLog(logSheet, data)
// ==============================
function appendStatusLog(logSheet, data) {
  let type = String(data.type || "").toUpperCase();

  let delta = Number(
    data.netOutDelta ??
    data.outDelta ??
    data.delta ??
    data.people ??
    1
  );

  if (!isFinite(delta) || delta === 0) {
    delta = 1;
  }

  const source = String(data.source || data.note || "手動操作");

  const isCorrection =
    data.isCorrection === true ||
    data.action === "outCorrection" ||
    data.mode === "correction" ||
    source.indexOf("人數更正") !== -1;

  // 人數更正：一定要寫成 OUT 負數
  // 例：人數更正 1 人 → OUT -1
  if (isCorrection) {
    type = "OUT";
    delta = -Math.abs(delta);
  }
  // 正常離園：OUT 正數
  // 例：離園 10 人 → OUT 10
  else if (type === "OUT") {
    delta = Math.abs(delta);
  }
  // 正常入園：IN 正數
  else if (type === "IN") {
    delta = Math.abs(delta);
  }
  // 其他沒有寫清楚的，先當 IN
  else {
    type = "IN";
    delta = Math.abs(delta);
  }

  logSheet.appendRow([
    new Date(),
    type,
    delta,
    source
  ]);
}

// ==============================
// 2. getCounts 裡面請確認這幾行
// ==============================
// 正確統計方式：
// if (type === "IN") todayIn += num;
// if (type === "OUT") todayOut += num;
//
// 注意：todayOut 要允許負數相加
// OUT 10 + OUT -1 = 9

// ==============================
// 3. getCounts 裡面這行可以保留或調整
// ==============================
// 如果不想讓場內出現負數：
// const current = Math.max(0, todayIn - todayOut);
//
// 如果允許測試時場內出現負數：
// const current = todayIn - todayOut;

// ==============================
// 4. 手機操作提醒
// ==============================
// 改完 Apps Script 後，一定要：
// 儲存 → 部署 → 管理部署作業 → 編輯 → 新增版本 → 部署
// 不重新部署，網頁仍會吃舊版本。

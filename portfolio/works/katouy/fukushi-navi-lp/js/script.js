/* ==========================================================
   福祉のお仕事ナビゲーター LP - script.js(診断フォームの動き)

   ■ 全体の流れ
   STEP1(職種・単一選択)→ 押すと自動で次へ
   STEP2(叶えたいこと)・STEP3(施設)→ 複数選択+[次へ][戻る]
   STEP4(連絡先入力)→ 必須チェックのうえ送信
   STEP5(サンクス表示)→ CVタグ発火ポイント

   ■ 主な構成
   ・answers   … 回答を貯めるオブジェクト(送信時に使用)
   ・goStep(n) … 画面(.q_step)の切り替えと進捗バー更新
   ・選択肢     … .q_opts の data-type で single / multi を判定
   ・送信       … submitBtn クリック時に入力チェック → showThanks()
                  ※本番のPOST先はコメント部分を差し替える
========================================================== */
(function(){
  "use strict";

  /* ---------------- 状態管理 ---------------- */
  var answers = {
    job: "",        // Q1(単一)
    hope: [],       // Q2(複数)
    facility: []    // Q3(複数)
  };
  var currentStep = 1;
  var TOTAL_STEPS = 4; // 進捗表示はSTEP1〜4(5はサンクス)

  var steps        = document.querySelectorAll(".q_step");
  var progress     = document.getElementById("progress");
  var progressText = document.getElementById("progressText");
  var progressLeft = document.getElementById("progressLeft");
  // ステップごとの「あと何問」表示
  var LEFT_LABEL = { 1: "あと3問", 2: "あと2問", 3: "あと1問", 4: "あとは入力だけ!" };
  var progressFill = document.getElementById("progressFill");
  var spCta        = document.getElementById("spCta");

  /* ---------------- 画面切り替え ---------------- */
  function goStep(n){
    currentStep = n;
    steps.forEach(function(s){
      s.classList.toggle("is-active", Number(s.dataset.step) === n);
    });
    if(n <= TOTAL_STEPS){
      progress.style.display = "";
      progressText.textContent = "STEP " + n + " / " + TOTAL_STEPS;
      progressLeft.textContent = LEFT_LABEL[n] || "";
      progressFill.style.width = (n / TOTAL_STEPS * 100) + "%";
    }else{
      progress.style.display = "none"; // サンクスでは非表示
      if(spCta){ spCta.style.display = "none"; }
    }
    // フォーム上部へスクロール(ヘッダー分オフセット)
    var box = document.querySelector(".form_box");
    var y = box.getBoundingClientRect().top + window.pageYOffset - 90;
    window.scrollTo({ top:y, behavior:"smooth" });
  }

  /* ---------------- 選択肢(単一・複数) ---------------- */
  document.querySelectorAll(".q_opts").forEach(function(group){
    var key  = group.dataset.q;
    var type = group.dataset.type;

    group.querySelectorAll(".opt").forEach(function(btn){
      btn.addEventListener("click", function(){
        var val = btn.dataset.value;

        if(type === "single"){
          group.querySelectorAll(".opt").forEach(function(b){ b.classList.remove("is-selected"); });
          btn.classList.add("is-selected");
          answers[key] = val;
          // 単一選択は押したら自動で次へ
          setTimeout(function(){ goStep(currentStep + 1); }, 250);
        }else{
          // 複数選択はトグル
          btn.classList.toggle("is-selected");
          var idx = answers[key].indexOf(val);
          if(idx === -1){ answers[key].push(val); }
          else{ answers[key].splice(idx, 1); }
          hideStepError(currentStep);
        }
      });
    });
  });

  /* ---------------- 戻る・次へ ---------------- */
  document.querySelectorAll("[data-back]").forEach(function(btn){
    btn.addEventListener("click", function(){
      if(currentStep > 1){ goStep(currentStep - 1); }
    });
  });

  document.querySelectorAll("[data-next]").forEach(function(btn){
    btn.addEventListener("click", function(){
      // 複数選択は1つ以上必須
      if(currentStep === 2 && answers.hope.length === 0){ showStepError(2); return; }
      if(currentStep === 3 && answers.facility.length === 0){ showStepError(3); return; }
      goStep(currentStep + 1);
    });
  });

  function showStepError(n){
    var el = document.querySelector('.q_err[data-err="' + n + '"]');
    if(el){ el.classList.add("is-show"); }
  }
  function hideStepError(n){
    var el = document.querySelector('.q_err[data-err="' + n + '"]');
    if(el){ el.classList.remove("is-show"); }
  }

  /* ---------------- 入力フォームの検証・送信 ---------------- */
  function setError(fieldName, hasError){
    var field = document.querySelector('.field[data-field="' + fieldName + '"]');
    if(field){ field.classList.toggle("is-error", hasError); }
    return !hasError;
  }

  document.getElementById("submitBtn").addEventListener("click", function(){
    var name    = document.getElementById("fName").value.trim();
    var birth   = document.getElementById("fBirth").value;
    var license = document.getElementById("fLicense").value;
    var address = document.getElementById("fAddress").value.trim();
    var tel     = document.getElementById("fTel").value.replace(/[-\s]/g, "");
    var email   = document.getElementById("fEmail").value.trim();

    var ok = true;
    ok = setError("name",    name === "")                          && ok;
    ok = setError("birth",   birth === "")                         && ok;
    ok = setError("license", license === "")                       && ok;
    ok = setError("address", address === "")                       && ok;
    ok = setError("tel",     !/^0\d{9,10}$/.test(tel))             && ok;
    ok = setError("email",   !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) && ok;

    if(!ok){
      // 最初のエラー項目までスクロール
      var firstErr = document.querySelector(".field.is-error");
      if(firstErr){ firstErr.scrollIntoView({ behavior:"smooth", block:"center" }); }
      return;
    }

    /* 送信データ(本番では管理システムのAPI/フォームエンドポイントへPOST)
       fetch("https://example.com/api/entry", {
         method: "POST",
         headers: { "Content-Type": "application/json" },
         body: JSON.stringify({
           job: answers.job, hope: answers.hope, facility: answers.facility,
           name: name, birth: birth, license: license,
           address: address, tel: tel, email: email
         })
       });
       ※自動返信メール送信・管理システムへの登録はサーバー側で実行 */

    showThanks();
  });

  function showThanks(){
    goStep(5);
    /* ▼ Google広告CVタグ・GA4イベントはここで発火(本番反映時に実装)
       gtag('event', 'conversion', { send_to: 'AW-XXXXXXXXX/XXXXXXX' }); */
  }

  /* ---------------- スクロールでふわっと表示 ---------------- */
  if("IntersectionObserver" in window){
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(e){
        if(e.isIntersecting){
          e.target.classList.add("is-in");
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.15 });
    document.querySelectorAll(".reveal").forEach(function(el){ io.observe(el); });
  }else{
    document.querySelectorAll(".reveal").forEach(function(el){ el.classList.add("is-in"); });
  }
})();

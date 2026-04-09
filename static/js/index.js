async function analyze() {
  const calculateBtn = document.querySelector('button');
  calculateBtn.innerText = "计算中...";
  /*
  const resultDiv = document.getElementById('result');
  if (resultDiv) {
    resultDiv.style.display = 'block';
  }
  */



  // 1. 收集数据
  // 获取性别
  const genderEl = document.querySelector('input[name="gender"]:checked');
  if (!genderEl) {
    alert("请选择性别");
    calculateBtn.innerText = "开始数据计算";
    return;
  }
  const payload = {
    name: document.getElementById('name').value,
    year: document.getElementById('year').value,
    month: document.getElementById('month').value,
    day: document.getElementById('day').value,
    hour: document.getElementById('hour').value,
    minute: document.getElementById('minute').value || '0',
    gender: genderEl.value
  };

  try {
    // 2. 调用刚才写的 Python API
    // http://127.0.0.1:5000/api/calculate
    // https://bazzi-collection-api.onrender.com/api/calculate
    const response = await fetch('https://bazzi-collection-api.onrender.com/api/calculate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const json = await response.json();

    if (json.status === 'success') {
      const data = json.data;

      // 3. 把数据填到网页上
      document.getElementById('result').style.display = 'block';

      // 显示八字
      let baziStr = data.bazi.map(item => `<span class="tag">${item}</span>`).join(' ');
      document.getElementById('bazi-text').innerHTML = baziStr;

      // 显示日主
      document.getElementById('day-master').innerText =
        `${data.day_master} (${data.day_master_element}命)`;

      // 显示图片 (Base64)
      document.getElementById('chart-img').src =
        "data:image/png;base64," + data.chart_image;
    } else {
      alert("计算出错：" + json.message);
    }
  } catch (err) {
    alert("连接服务器失败，请确认 Python 脚本在运行！");
    console.error(err);
  }

  calculateBtn.innerText = "开始数据计算";
}



function clearInputs() {
  // Clear text and number
  const ids = ['name', 'year', 'month', 'day', 'hour', 'minute', 'gender'];
  ids.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = '';
  });

  // Clear radios (gender)
  const genders = document.getElementsByName('gender');
  genders.forEach(radio => radio.checked = false);

  // Clear the generated img
  const resultDiv = document.getElementById('result');
  if (resultDiv) {
    resultDiv.innerHTML = '';
    // resultDiv.style.display = 'none';
  }

  console.log("All inputs have been cleared");
}
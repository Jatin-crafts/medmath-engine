document.addEventListener("DOMContentLoaded", () => {
  const tabs = document.querySelectorAll(".tab-btn");
  const contents = document.querySelectorAll(".tab-content");

  tabs.forEach(tab => {
    tab.addEventListener("click", () => {
      tabs.forEach(t => t.classList.remove("active"));
      contents.forEach(c => c.classList.remove("active"));
      
      tab.classList.add("active");
      document.getElementById(tab.dataset.tab).classList.add("active");
      document.getElementById("result-box").classList.add("hidden");
    });
  });
});

function displayResult(value, steps) {
  const box = document.getElementById("result-box");
  document.getElementById("primary-result").innerText = value;
  document.getElementById("breakdown-steps").innerText = steps;
  box.classList.remove("hidden");
}

function calculateDripRate() {
  const volume = parseFloat(document.getElementById("drip-volume").value);
  const time = parseFloat(document.getElementById("drip-time").value);
  const factor = parseFloat(document.getElementById("drop-factor").value);

  if (!volume || !time || volume <= 0 || time <= 0) {
    alert("Please enter valid positive values for volume and time.");
    return;
  }

  const dripRate = Math.round((volume * factor) / time);
  const exact = ((volume * factor) / time).toFixed(2);

  const steps = `1. Total Volume = ${volume} mL
2. Drop Factor = ${factor} gtt/mL
3. Infusion Time = ${time} min

Formula: (Volume [mL] × Drop Factor [gtt/mL]) / Time [min]
Calculation: (${volume} × ${factor}) / ${time}
Exact Result: ${exact} gtt/min
Clinical Rounding: ${dripRate} gtt/min`;

  displayResult(`${dripRate} gtt/min`, steps);
}

function calculateFlowRate() {
  const volume = parseFloat(document.getElementById("flow-volume").value);
  const time = parseFloat(document.getElementById("flow-time").value);

  if (!volume || !time || volume <= 0 || time <= 0) {
    alert("Please enter valid positive values for volume and time.");
    return;
  }

  const rate = (volume / time).toFixed(1);

  const steps = `1. Total Volume = ${volume} mL
2. Time = ${time} hours

Formula: Total Volume [mL] / Time [hr]
Calculation: ${volume} / ${time}
Clinical Setting: Set pump to ${rate} mL/hr`;

  displayResult(`${rate} mL/hr`, steps);
}

function calculateWeightDose() {
  let weight = parseFloat(document.getElementById("patient-weight").value);
  const unit = document.getElementById("weight-unit").value;
  const doseOrder = parseFloat(document.getElementById("dose-order").value);
  const concentration = parseFloat(document.getElementById("concentration").value);

  if (!weight || !doseOrder || !concentration || weight <= 0 || doseOrder <= 0 || concentration <= 0) {
    alert("Please enter valid positive numbers for all parameters.");
    return;
  }

  let weightConversionStep = "";
  if (unit === "lbs") {
    const originalLbs = weight;
// Standard clinical exam convention (rounds kg to 1 decimal place first):
weight = Math.round((weight / 2.2) * 10) / 10; // 154 / 2.2 = 70.0 kg exact
    weightConversionStep = `1. Convert Weight: ${originalLbs} lbs ÷ 2.2 = ${weight.toFixed(2)} kg\n`;
  } else {
    weightConversionStep = `1. Patient Weight: ${weight.toFixed(2)} kg\n`;
  }

  const totalDoseMg = weight * doseOrder;
  const volumeToAdminister = (totalDoseMg / concentration).toFixed(2);

  const steps = `${weightConversionStep}2. Calculate Total Target Dose:
   ${weight.toFixed(2)} kg × ${doseOrder} mg/kg = ${totalDoseMg.toFixed(2)} mg

3. Apply Dimensional Analysis for Volume:
   (${totalDoseMg.toFixed(2)} mg) / (${concentration} mg/mL)
   Result: ${volumeToAdminister} mL`;

  displayResult(`${volumeToAdminister} mL to Administer`, steps);
}
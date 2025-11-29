"use client";

import { useState, useEffect } from "react";
import { Slider } from "@/components/ui/slider";
import { Calculator, Home, TrendingUp, CheckCircle, IndianRupee, Percent, Calendar, Building2 } from "lucide-react";

export default function CalculatorsPage() {
  // EMI Calculator State
  const [emiPrincipal, setEmiPrincipal] = useState(5000000);
  const [emiRate, setEmiRate] = useState(8.5);
  const [tenureMode, setTenureMode] = useState<"tenure" | "emis">("tenure");
  const [emiTenureYears, setEmiTenureYears] = useState(20);
  const [emiTenureMonths, setEmiTenureMonths] = useState(0);
  const [numberOfEmis, setNumberOfEmis] = useState(240);
  const [emiResult, setEmiResult] = useState<string>("₹0");
  const [emiDetails, setEmiDetails] = useState({
    months: 0,
    numberOfEmis: 0,
    totalInterest: 0,
    totalAmount: 0
  });

  // LAP Calculator State
  const [lapValue, setLapValue] = useState(10000000);
  const [lapLtv, setLapLtv] = useState(60);
  const [lapRate, setLapRate] = useState(10);
  const [lapTenure, setLapTenure] = useState(15);
  const [lapResult, setLapResult] = useState<string>("₹0");
  const [lapDetails, setLapDetails] = useState({
    loanAmount: 0,
    monthlyEmi: 0,
    totalInterest: 0,
    totalAmount: 0
  });

  // ROI Calculator State
  const [roiPurchase, setRoiPurchase] = useState(5000000);
  const [roiCurrent, setRoiCurrent] = useState(7000000);
  const [roiYears, setRoiYears] = useState(5);
  const [roiResult, setRoiResult] = useState<string>("0%");

  // Loan Eligibility Calculator State
  const [eligibilityIncome, setEligibilityIncome] = useState(100000);
  const [eligibilityExistingEmi, setEligibilityExistingEmi] = useState(20000);
  const [eligibilityCibil, setEligibilityCibil] = useState(750);
  const [eligibilityRate, setEligibilityRate] = useState(9.0);
  const [eligibilityTenure, setEligibilityTenure] = useState(20);
  const [eligibilityResult, setEligibilityResult] = useState<string>("₹0");
  const [eligibilityDetails, setEligibilityDetails] = useState({
    disposableIncome: 0,
    eligibleEmi: 0,
    loanAmount: 0,
    cibilImpact: ""
  });

  // Real-time EMI calculation
  useEffect(() => {
    const totalMonths = tenureMode === "tenure" 
      ? emiTenureYears * 12 + emiTenureMonths 
      : numberOfEmis;
    
    if (emiPrincipal && emiRate && totalMonths > 0) {
      const rate = emiRate / 12 / 100;
      const tenure = totalMonths;
      const emi = (emiPrincipal * rate * Math.pow(1 + rate, tenure)) / (Math.pow(1 + rate, tenure) - 1);
      const totalAmount = emi * tenure;
      const totalInterest = totalAmount - emiPrincipal;
      
      setEmiResult(`₹${emi.toLocaleString("en-IN", { maximumFractionDigits: 0 })}`);
      setEmiDetails({
        months: tenure,
        numberOfEmis: tenure,
        totalInterest: totalInterest,
        totalAmount: totalAmount
      });
    } else {
      setEmiResult("₹0");
      setEmiDetails({
        months: 0,
        numberOfEmis: 0,
        totalInterest: 0,
        totalAmount: 0
      });
    }
  }, [emiPrincipal, emiRate, emiTenureYears, emiTenureMonths, numberOfEmis, tenureMode]);

  // Real-time LAP calculation
  useEffect(() => {
    if (lapValue && lapLtv && lapRate && lapTenure > 0) {
      const loanAmount = (lapValue * lapLtv) / 100;
      const rate = lapRate / 12 / 100;
      const tenure = lapTenure * 12;
      const emi = (loanAmount * rate * Math.pow(1 + rate, tenure)) / (Math.pow(1 + rate, tenure) - 1);
      const totalAmount = emi * tenure;
      const totalInterest = totalAmount - loanAmount;
      
      setLapResult(`₹${loanAmount.toLocaleString("en-IN", { maximumFractionDigits: 0 })}`);
      setLapDetails({
        loanAmount: loanAmount,
        monthlyEmi: emi,
        totalInterest: totalInterest,
        totalAmount: totalAmount
      });
    } else {
      setLapResult("₹0");
      setLapDetails({
        loanAmount: 0,
        monthlyEmi: 0,
        totalInterest: 0,
        totalAmount: 0
      });
    }
  }, [lapValue, lapLtv, lapRate, lapTenure]);

  // Real-time ROI calculation
  useEffect(() => {
    if (roiPurchase && roiCurrent && roiYears) {
      const totalReturn = ((roiCurrent - roiPurchase) / roiPurchase) * 100;
      const annualROI = totalReturn / roiYears;
      setRoiResult(`${annualROI.toFixed(2)}%`);
    } else {
      setRoiResult("0%");
    }
  }, [roiPurchase, roiCurrent, roiYears]);

  // Real-time Loan Eligibility calculation
  useEffect(() => {
    if (eligibilityIncome && eligibilityRate && eligibilityTenure > 0) {
      const disposableIncome = eligibilityIncome - eligibilityExistingEmi;
      const eligibleEmi = disposableIncome * 0.4; // 40% rule
      
      // Reverse calculate loan amount from eligible EMI
      const rate = eligibilityRate / 12 / 100;
      const tenure = eligibilityTenure * 12;
      const baseLoanAmount = (eligibleEmi * (Math.pow(1 + rate, tenure) - 1)) / (rate * Math.pow(1 + rate, tenure));
      
      // CIBIL Score Impact Logic
      let cibilMultiplier = 1.0;
      let cibilImpact = "";
      
      if (eligibilityCibil >= 750) {
        cibilMultiplier = 1.0;
        cibilImpact = "Excellent - Maximum loan eligibility";
      } else if (eligibilityCibil >= 700) {
        cibilMultiplier = 0.9;
        cibilImpact = "Good - 90% of max eligibility";
      } else if (eligibilityCibil >= 650) {
        cibilMultiplier = 0.75;
        cibilImpact = "Fair - 75% of max eligibility";
      } else if (eligibilityCibil >= 600) {
        cibilMultiplier = 0.5;
        cibilImpact = "Below Average - 50% of max eligibility";
      } else {
        cibilMultiplier = 0.25;
        cibilImpact = "Poor - Loan approval unlikely";
      }
      
      const adjustedLoanAmount = baseLoanAmount * cibilMultiplier;
      
      setEligibilityResult(`₹${adjustedLoanAmount.toLocaleString("en-IN", { maximumFractionDigits: 0 })}`);
      setEligibilityDetails({
        disposableIncome: disposableIncome,
        eligibleEmi: eligibleEmi,
        loanAmount: adjustedLoanAmount,
        cibilImpact: cibilImpact
      });
    } else {
      setEligibilityResult("₹0");
      setEligibilityDetails({
        disposableIncome: 0,
        eligibleEmi: 0,
        loanAmount: 0,
        cibilImpact: ""
      });
    }
  }, [eligibilityIncome, eligibilityExistingEmi, eligibilityCibil, eligibilityRate, eligibilityTenure]);

  return (
    <section className="py-16 min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="max-w-[1440px] mx-auto px-4 md:px-8 lg:px-20">
        {/* Hero Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold mb-6">
            <Calculator className="w-4 h-4" />
            <span>Professional Financial Tools</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-extrabold mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 bg-clip-text text-transparent">
            Smart Property Calculators
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Make informed financial decisions with our advanced calculators. Calculate EMI, loan eligibility, ROI, and more with precision.
          </p>
        </div>

        <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-8">
          {/* EMI Calculator */}
          <div className="group bg-white p-8 rounded-3xl border-2 border-gray-100 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 relative overflow-hidden">
            {/* Gradient Accent */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500 to-purple-600 opacity-10 rounded-full -mr-16 -mt-16"></div>
            
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl shadow-lg">
                <Calculator className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900">EMI Calculator</h3>
                <p className="text-xs text-gray-500">Calculate monthly payments</p>
              </div>
            </div>

            <div className="space-y-5">
              {/* Loan Amount with Slider */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <IndianRupee className="w-4 h-4 text-blue-600" />
                  <label className="block text-sm font-bold text-gray-900">
                    Loan Amount
                  </label>
                </div>
                <Slider
                  value={[emiPrincipal]}
                  onValueChange={(value) => setEmiPrincipal(value[0])}
                  min={100000}
                  max={50000000}
                  step={100000}
                  className="mb-3"
                />
                <input
                  type="number"
                  value={emiPrincipal}
                  onChange={(e) => setEmiPrincipal(parseFloat(e.target.value) || 0)}
                  className="w-full px-4 py-3 text-sm font-semibold border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-all bg-gray-50"
                />
              </div>

              {/* Interest Rate with Slider */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Percent className="w-4 h-4 text-purple-600" />
                  <label className="block text-sm font-bold text-gray-900">
                    Interest Rate (p.a.)
                  </label>
                </div>
                <Slider
                  value={[emiRate]}
                  onValueChange={(value) => setEmiRate(value[0])}
                  min={1}
                  max={20}
                  step={0.1}
                  className="mb-3"
                />
                <input
                  type="number"
                  value={emiRate}
                  onChange={(e) => setEmiRate(parseFloat(e.target.value) || 0)}
                  step="0.1"
                  className="w-full px-4 py-3 text-sm font-semibold border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none transition-all bg-gray-50"
                />
              </div>
              
              {/* Toggle between Tenure and Number of EMIs */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Calendar className="w-4 h-4 text-green-600" />
                  <label className="block text-sm font-bold text-gray-900">
                    Calculation Mode
                  </label>
                </div>
                <div className="flex gap-2 mb-3 p-1 bg-gray-100 rounded-xl">
                  <button
                    onClick={() => setTenureMode("tenure")}
                    className={`flex-1 px-4 py-2.5 rounded-lg font-bold text-sm transition-all ${
                      tenureMode === "tenure"
                        ? "bg-white text-blue-600 shadow-md"
                        : "text-gray-600 hover:text-gray-900"
                    }`}
                  >
                    By Tenure
                  </button>
                  <button
                    onClick={() => setTenureMode("emis")}
                    className={`flex-1 px-4 py-2.5 rounded-lg font-bold text-sm transition-all ${
                      tenureMode === "emis"
                        ? "bg-white text-blue-600 shadow-md"
                        : "text-gray-600 hover:text-gray-900"
                    }`}
                  >
                    By EMIs
                  </button>
                </div>
              </div>

              {/* Conditional Rendering based on mode */}
              {tenureMode === "tenure" ? (
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-3">
                    Loan Tenure
                  </label>
                  
                  {/* Years Slider */}
                  <div className="mb-4">
                    <label className="block text-xs text-gray-600 mb-2 font-semibold">Years</label>
                    <Slider
                      value={[emiTenureYears]}
                      onValueChange={(value) => setEmiTenureYears(value[0])}
                      min={0}
                      max={30}
                      step={1}
                      className="mb-2"
                    />
                    <input
                      type="number"
                      value={emiTenureYears}
                      onChange={(e) => setEmiTenureYears(Math.max(0, parseInt(e.target.value) || 0))}
                      min="0"
                      className="w-full px-4 py-2.5 text-sm font-semibold border-2 border-gray-200 rounded-xl focus:border-green-500 focus:outline-none transition-all bg-gray-50"
                    />
                  </div>

                  {/* Months Slider */}
                  <div>
                    <label className="block text-xs text-gray-600 mb-2 font-semibold">Months</label>
                    <Slider
                      value={[emiTenureMonths]}
                      onValueChange={(value) => setEmiTenureMonths(value[0])}
                      min={0}
                      max={11}
                      step={1}
                      className="mb-2"
                    />
                    <input
                      type="number"
                      value={emiTenureMonths}
                      onChange={(e) => setEmiTenureMonths(Math.max(0, Math.min(11, parseInt(e.target.value) || 0)))}
                      min="0"
                      max="11"
                      className="w-full px-4 py-2.5 text-sm font-semibold border-2 border-gray-200 rounded-xl focus:border-green-500 focus:outline-none transition-all bg-gray-50"
                    />
                  </div>

                  <p className="text-xs text-gray-500 mt-2 font-medium">
                    Total: {emiTenureYears}y {emiTenureMonths}m
                  </p>
                </div>
              ) : (
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-3">
                    Number of EMIs
                  </label>
                  <Slider
                    value={[numberOfEmis]}
                    onValueChange={(value) => setNumberOfEmis(value[0])}
                    min={1}
                    max={360}
                    step={1}
                    className="mb-2"
                  />
                  <input
                    type="number"
                    value={numberOfEmis}
                    onChange={(e) => setNumberOfEmis(Math.max(1, parseInt(e.target.value) || 1))}
                    min="1"
                    className="w-full px-4 py-2.5 text-sm font-semibold border-2 border-gray-200 rounded-xl focus:border-green-500 focus:outline-none transition-all bg-gray-50"
                  />
                  <p className="text-xs text-gray-500 mt-2 font-medium">
                    Total: {numberOfEmis} monthly installments
                  </p>
                </div>
              )}
              
              {/* EMI Result */}
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-6 rounded-2xl text-center mt-6 shadow-lg relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-white opacity-10 rounded-full -mr-12 -mt-12"></div>
                <span className="block text-sm text-blue-100 mb-2 font-semibold">Monthly EMI</span>
                <strong className="block text-3xl font-extrabold text-white drop-shadow-lg">
                  {emiResult}
                </strong>
              </div>

              {/* Detailed Breakdown */}
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-5 rounded-2xl space-y-3 border border-gray-200">
                <h4 className="font-bold text-gray-900 text-sm mb-3 flex items-center gap-2">
                  <div className="w-1 h-4 bg-blue-600 rounded-full"></div>
                  Loan Breakdown
                </h4>
                
                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                  <span className="text-xs text-gray-600 font-medium">Loan Duration</span>
                  <span className="font-bold text-sm text-gray-900">
                    {emiDetails.months}m ({Math.floor(emiDetails.months / 12)}y {emiDetails.months % 12}m)
                  </span>
                </div>

                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                  <span className="text-xs text-gray-600 font-medium">Principal Amount</span>
                  <span className="font-bold text-sm text-gray-900">
                    ₹{emiPrincipal.toLocaleString("en-IN", { maximumFractionDigits: 0 })}
                  </span>
                </div>

                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                  <span className="text-xs text-gray-600 font-medium">Total Interest</span>
                  <span className="font-bold text-sm text-orange-600">
                    ₹{emiDetails.totalInterest.toLocaleString("en-IN", { maximumFractionDigits: 0 })}
                  </span>
                </div>

                <div className="flex justify-between items-center pt-3">
                  <span className="text-sm font-bold text-gray-900">Total Payable</span>
                  <span className="font-extrabold text-lg text-green-600">
                    ₹{emiDetails.totalAmount.toLocaleString("en-IN", { maximumFractionDigits: 0 })}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* LAP Calculator */}
          <div className="group bg-white p-8 rounded-3xl border-2 border-gray-100 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 relative overflow-hidden">
            {/* Gradient Accent */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-500 to-pink-600 opacity-10 rounded-full -mr-16 -mt-16"></div>
            
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl shadow-lg">
                <Building2 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900">Loan Against Property</h3>
                <p className="text-xs text-gray-500">Calculate loan eligibility</p>
              </div>
            </div>

            <div className="space-y-5">
              {/* Property Value with Slider */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Home className="w-4 h-4 text-purple-600" />
                  <label className="block text-sm font-bold text-gray-900">
                    Property Value
                  </label>
                </div>
                <Slider
                  value={[lapValue]}
                  onValueChange={(value) => setLapValue(value[0])}
                  min={1000000}
                  max={100000000}
                  step={500000}
                  className="mb-3"
                />
                <input
                  type="number"
                  value={lapValue}
                  onChange={(e) => setLapValue(parseFloat(e.target.value) || 0)}
                  className="w-full px-4 py-3 text-sm font-semibold border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none transition-all bg-gray-50"
                />
              </div>

              {/* LTV Ratio with Slider */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Percent className="w-4 h-4 text-pink-600" />
                  <label className="block text-sm font-bold text-gray-900">
                    LTV Ratio
                  </label>
                </div>
                <Slider
                  value={[lapLtv]}
                  onValueChange={(value) => setLapLtv(value[0])}
                  min={30}
                  max={75}
                  step={1}
                  className="mb-3"
                />
                <input
                  type="number"
                  value={lapLtv}
                  onChange={(e) => setLapLtv(parseFloat(e.target.value) || 0)}
                  max="75"
                  className="w-full px-4 py-3 text-sm font-semibold border-2 border-gray-200 rounded-xl focus:border-pink-500 focus:outline-none transition-all bg-gray-50"
                />
              </div>

              {/* Interest Rate with Slider */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Percent className="w-4 h-4 text-blue-600" />
                  <label className="block text-sm font-bold text-gray-900">
                    Interest Rate (p.a.)
                  </label>
                </div>
                <Slider
                  value={[lapRate]}
                  onValueChange={(value) => setLapRate(value[0])}
                  min={7}
                  max={18}
                  step={0.1}
                  className="mb-3"
                />
                <input
                  type="number"
                  value={lapRate}
                  onChange={(e) => setLapRate(parseFloat(e.target.value) || 0)}
                  step="0.1"
                  className="w-full px-4 py-3 text-sm font-semibold border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-all bg-gray-50"
                />
              </div>

              {/* Loan Tenure with Slider */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Calendar className="w-4 h-4 text-green-600" />
                  <label className="block text-sm font-bold text-gray-900">
                    Loan Tenure (Years)
                  </label>
                </div>
                <Slider
                  value={[lapTenure]}
                  onValueChange={(value) => setLapTenure(value[0])}
                  min={1}
                  max={20}
                  step={1}
                  className="mb-3"
                />
                <input
                  type="number"
                  value={lapTenure}
                  onChange={(e) => setLapTenure(parseFloat(e.target.value) || 0)}
                  className="w-full px-4 py-3 text-sm font-semibold border-2 border-gray-200 rounded-xl focus:border-green-500 focus:outline-none transition-all bg-gray-50"
                />
              </div>

              {/* Maximum Loan Amount Result */}
              <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-6 rounded-2xl text-center mt-6 shadow-lg relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-white opacity-10 rounded-full -mr-12 -mt-12"></div>
                <span className="block text-sm text-purple-100 mb-2 font-semibold">Maximum Loan Amount</span>
                <strong className="block text-3xl font-extrabold text-white drop-shadow-lg">
                  {lapResult}
                </strong>
              </div>

              {/* Detailed Breakdown */}
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-5 rounded-2xl space-y-3 border border-gray-200">
                <h4 className="font-bold text-gray-900 text-sm mb-3 flex items-center gap-2">
                  <div className="w-1 h-4 bg-purple-600 rounded-full"></div>
                  LAP Breakdown
                </h4>
                
                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                  <span className="text-xs text-gray-600 font-medium">Property Value</span>
                  <span className="font-bold text-sm text-gray-900">
                    ₹{lapValue.toLocaleString("en-IN", { maximumFractionDigits: 0 })}
                  </span>
                </div>

                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                  <span className="text-xs text-gray-600 font-medium">Monthly EMI</span>
                  <span className="font-bold text-sm text-purple-600">
                    ₹{lapDetails.monthlyEmi.toLocaleString("en-IN", { maximumFractionDigits: 0 })}
                  </span>
                </div>

                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                  <span className="text-xs text-gray-600 font-medium">Total Interest</span>
                  <span className="font-bold text-sm text-orange-600">
                    ₹{lapDetails.totalInterest.toLocaleString("en-IN", { maximumFractionDigits: 0 })}
                  </span>
                </div>

                <div className="flex justify-between items-center pt-3">
                  <span className="text-sm font-bold text-gray-900">Total Payable</span>
                  <span className="font-extrabold text-lg text-green-600">
                    ₹{lapDetails.totalAmount.toLocaleString("en-IN", { maximumFractionDigits: 0 })}
                  </span>
                </div>

                <div className="mt-3 p-3 bg-purple-50 rounded-xl border border-purple-100">
                  <p className="text-xs text-gray-700 font-medium">
                    {lapLtv}% LTV at {lapRate}% for {lapTenure} years
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* ROI Calculator */}
          <div className="group bg-white p-8 rounded-3xl border-2 border-gray-100 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 relative overflow-hidden">
            {/* Gradient Accent */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-green-500 to-emerald-600 opacity-10 rounded-full -mr-16 -mt-16"></div>
            
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl shadow-lg">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900">ROI Calculator</h3>
                <p className="text-xs text-gray-500">Calculate returns on investment</p>
              </div>
            </div>

            <div className="space-y-5">
              {/* Purchase Price with Slider */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <IndianRupee className="w-4 h-4 text-red-600" />
                  <label className="block text-sm font-bold text-gray-900">
                    Purchase Price
                  </label>
                </div>
                <Slider
                  value={[roiPurchase]}
                  onValueChange={(value) => setRoiPurchase(value[0])}
                  min={500000}
                  max={50000000}
                  step={500000}
                  className="mb-3"
                />
                <input
                  type="number"
                  value={roiPurchase}
                  onChange={(e) => setRoiPurchase(parseFloat(e.target.value) || 0)}
                  className="w-full px-4 py-3 text-sm font-semibold border-2 border-gray-200 rounded-xl focus:border-red-500 focus:outline-none transition-all bg-gray-50"
                />
              </div>

              {/* Current Value with Slider */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <IndianRupee className="w-4 h-4 text-green-600" />
                  <label className="block text-sm font-bold text-gray-900">
                    Current Value
                  </label>
                </div>
                <Slider
                  value={[roiCurrent]}
                  onValueChange={(value) => setRoiCurrent(value[0])}
                  min={500000}
                  max={100000000}
                  step={500000}
                  className="mb-3"
                />
                <input
                  type="number"
                  value={roiCurrent}
                  onChange={(e) => setRoiCurrent(parseFloat(e.target.value) || 0)}
                  className="w-full px-4 py-3 text-sm font-semibold border-2 border-gray-200 rounded-xl focus:border-green-500 focus:outline-none transition-all bg-gray-50"
                />
              </div>

              {/* Holding Period with Slider */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Calendar className="w-4 h-4 text-blue-600" />
                  <label className="block text-sm font-bold text-gray-900">
                    Holding Period (Years)
                  </label>
                </div>
                <Slider
                  value={[roiYears]}
                  onValueChange={(value) => setRoiYears(value[0])}
                  min={1}
                  max={30}
                  step={1}
                  className="mb-3"
                />
                <input
                  type="number"
                  value={roiYears}
                  onChange={(e) => setRoiYears(parseFloat(e.target.value) || 0)}
                  className="w-full px-4 py-3 text-sm font-semibold border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-all bg-gray-50"
                />
              </div>

              <div className="bg-gradient-to-br from-green-500 to-green-600 p-6 rounded-2xl text-center mt-6 shadow-lg relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-white opacity-10 rounded-full -mr-12 -mt-12"></div>
                <span className="block text-sm text-green-100 mb-2 font-semibold">Annual ROI</span>
                <strong className="block text-3xl font-extrabold text-white drop-shadow-lg">
                  {roiResult}
                </strong>
              </div>

              {/* Additional Info */}
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-5 rounded-2xl space-y-3 border border-gray-200">
                <h4 className="font-bold text-gray-900 text-sm mb-3 flex items-center gap-2">
                  <div className="w-1 h-4 bg-green-600 rounded-full"></div>
                  Investment Summary
                </h4>
                
                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                  <span className="text-xs text-gray-600 font-medium">Initial Investment</span>
                  <span className="font-bold text-sm text-gray-900">
                    ₹{roiPurchase.toLocaleString("en-IN", { maximumFractionDigits: 0 })}
                  </span>
                </div>

                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                  <span className="text-xs text-gray-600 font-medium">Current Value</span>
                  <span className="font-bold text-sm text-green-600">
                    ₹{roiCurrent.toLocaleString("en-IN", { maximumFractionDigits: 0 })}
                  </span>
                </div>

                <div className="flex justify-between items-center pt-3">
                  <span className="text-sm font-bold text-gray-900">Total Gain</span>
                  <span className="font-extrabold text-lg text-emerald-600">
                    ₹{(roiCurrent - roiPurchase).toLocaleString("en-IN", { maximumFractionDigits: 0 })}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Loan Eligibility Calculator */}
          <div className="group bg-white p-8 rounded-3xl border-2 border-gray-100 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 relative overflow-hidden">
            {/* Gradient Accent */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-emerald-500 to-teal-600 opacity-10 rounded-full -mr-16 -mt-16"></div>
            
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl shadow-lg">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900">Loan Eligibility</h3>
                <p className="text-xs text-gray-500">Check your loan eligibility</p>
              </div>
            </div>

            <div className="space-y-5">
              {/* Monthly Income with Slider */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <IndianRupee className="w-4 h-4 text-emerald-600" />
                  <label className="block text-sm font-bold text-gray-900">
                    Monthly Income / Salary
                  </label>
                </div>
                <Slider
                  value={[eligibilityIncome]}
                  onValueChange={(value) => setEligibilityIncome(value[0])}
                  min={10000}
                  max={500000}
                  step={5000}
                  className="mb-3"
                />
                <input
                  type="number"
                  value={eligibilityIncome}
                  onChange={(e) => setEligibilityIncome(parseFloat(e.target.value) || 0)}
                  className="w-full px-4 py-3 text-sm font-semibold border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:outline-none transition-all bg-gray-50"
                />
              </div>

              {/* Existing EMIs with Slider */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <IndianRupee className="w-4 h-4 text-red-600" />
                  <label className="block text-sm font-bold text-gray-900">
                    Existing EMIs / Liabilities
                  </label>
                </div>
                <Slider
                  value={[eligibilityExistingEmi]}
                  onValueChange={(value) => setEligibilityExistingEmi(value[0])}
                  min={0}
                  max={200000}
                  step={1000}
                  className="mb-3"
                />
                <input
                  type="number"
                  value={eligibilityExistingEmi}
                  onChange={(e) => setEligibilityExistingEmi(parseFloat(e.target.value) || 0)}
                  className="w-full px-4 py-3 text-sm font-semibold border-2 border-gray-200 rounded-xl focus:border-red-500 focus:outline-none transition-all bg-gray-50"
                />
              </div>

              {/* CIBIL Score with Slider */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <CheckCircle className="w-4 h-4 text-teal-600" />
                  <label className="block text-sm font-bold text-gray-900">
                    CIBIL Score
                  </label>
                </div>
                <Slider
                  value={[eligibilityCibil]}
                  onValueChange={(value) => setEligibilityCibil(value[0])}
                  min={300}
                  max={900}
                  step={10}
                  className="mb-3"
                />
                <input
                  type="number"
                  value={eligibilityCibil}
                  onChange={(e) => setEligibilityCibil(Math.max(300, Math.min(900, parseFloat(e.target.value) || 300)))}
                  min="300"
                  max="900"
                  className="w-full px-4 py-3 text-sm font-semibold border-2 border-gray-200 rounded-xl focus:border-teal-500 focus:outline-none transition-all bg-gray-50"
                />
                <div className="mt-2 flex items-center gap-2">
                  <div className={`h-2 flex-1 rounded-full ${
                    eligibilityCibil >= 750 ? 'bg-green-500' :
                    eligibilityCibil >= 700 ? 'bg-blue-500' :
                    eligibilityCibil >= 650 ? 'bg-yellow-500' :
                    eligibilityCibil >= 600 ? 'bg-orange-500' : 'bg-red-500'
                  }`}></div>
                  <span className={`text-xs font-bold ${
                    eligibilityCibil >= 750 ? 'text-green-600' :
                    eligibilityCibil >= 700 ? 'text-blue-600' :
                    eligibilityCibil >= 650 ? 'text-yellow-600' :
                    eligibilityCibil >= 600 ? 'text-orange-600' : 'text-red-600'
                  }`}>
                    {eligibilityCibil >= 750 ? 'Excellent' :
                     eligibilityCibil >= 700 ? 'Good' :
                     eligibilityCibil >= 650 ? 'Fair' :
                     eligibilityCibil >= 600 ? 'Below Avg' : 'Poor'}
                  </span>
                </div>
              </div>

              {/* Interest Rate with Slider */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Percent className="w-4 h-4 text-blue-600" />
                  <label className="block text-sm font-bold text-gray-900">
                    Expected Interest Rate (p.a.)
                  </label>
                </div>
                <Slider
                  value={[eligibilityRate]}
                  onValueChange={(value) => setEligibilityRate(value[0])}
                  min={6}
                  max={15}
                  step={0.1}
                  className="mb-3"
                />
                <input
                  type="number"
                  value={eligibilityRate}
                  onChange={(e) => setEligibilityRate(parseFloat(e.target.value) || 0)}
                  step="0.1"
                  className="w-full px-4 py-3 text-sm font-semibold border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-all bg-gray-50"
                />
              </div>

              {/* Loan Tenure with Slider */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Calendar className="w-4 h-4 text-purple-600" />
                  <label className="block text-sm font-bold text-gray-900">
                    Loan Tenure (Years)
                  </label>
                </div>
                <Slider
                  value={[eligibilityTenure]}
                  onValueChange={(value) => setEligibilityTenure(value[0])}
                  min={1}
                  max={30}
                  step={1}
                  className="mb-3"
                />
                <input
                  type="number"
                  value={eligibilityTenure}
                  onChange={(e) => setEligibilityTenure(parseFloat(e.target.value) || 0)}
                  className="w-full px-4 py-3 text-sm font-semibold border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none transition-all bg-gray-50"
                />
              </div>

              {/* Eligibility Result */}
              <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 p-6 rounded-2xl text-center mt-6 shadow-lg relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-white opacity-10 rounded-full -mr-12 -mt-12"></div>
                <span className="block text-sm text-emerald-100 mb-2 font-semibold">Approved Loan Amount</span>
                <strong className="block text-3xl font-extrabold text-white drop-shadow-lg">
                  {eligibilityResult}
                </strong>
              </div>

              {/* Detailed Breakdown */}
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-5 rounded-2xl space-y-3 border border-gray-200">
                <h4 className="font-bold text-gray-900 text-sm mb-3 flex items-center gap-2">
                  <div className="w-1 h-4 bg-emerald-600 rounded-full"></div>
                  Eligibility Breakdown
                </h4>
                
                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                  <span className="text-xs text-gray-600 font-medium">Monthly Income</span>
                  <span className="font-bold text-sm text-gray-900">
                    ₹{eligibilityIncome.toLocaleString("en-IN", { maximumFractionDigits: 0 })}
                  </span>
                </div>

                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                  <span className="text-xs text-gray-600 font-medium">Existing EMIs</span>
                  <span className="font-bold text-sm text-red-600">
                    - ₹{eligibilityExistingEmi.toLocaleString("en-IN", { maximumFractionDigits: 0 })}
                  </span>
                </div>

                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                  <span className="text-xs text-gray-600 font-medium">Eligible EMI (40%)</span>
                  <span className="font-bold text-sm text-blue-600">
                    ₹{eligibilityDetails.eligibleEmi.toLocaleString("en-IN", { maximumFractionDigits: 0 })}
                  </span>
                </div>

                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                  <span className="text-xs text-gray-600 font-medium">CIBIL Score Impact</span>
                  <span className={`font-bold text-xs ${
                    eligibilityCibil >= 750 ? 'text-green-600' :
                    eligibilityCibil >= 700 ? 'text-blue-600' :
                    eligibilityCibil >= 650 ? 'text-yellow-600' :
                    eligibilityCibil >= 600 ? 'text-orange-600' : 'text-red-600'
                  }`}>
                    {eligibilityDetails.cibilImpact}
                  </span>
                </div>

                <div className="flex justify-between items-center pt-3">
                  <span className="text-sm font-bold text-gray-900">Max Loan Amount</span>
                  <span className="font-extrabold text-lg text-emerald-600">
                    ₹{eligibilityDetails.loanAmount.toLocaleString("en-IN", { maximumFractionDigits: 0 })}
                  </span>
                </div>

                <div className="mt-3 p-3 bg-emerald-50 rounded-xl border border-emerald-100">
                  <p className="text-xs text-gray-700 font-medium">
                    Based on 40% rule at {eligibilityRate}% for {eligibilityTenure} years
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="mt-16 grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <div className="text-center p-6 bg-white rounded-2xl border border-gray-100 shadow-md">
            <div className="text-3xl font-extrabold text-blue-600 mb-2">100%</div>
            <div className="text-sm text-gray-600 font-medium">Accurate Calculations</div>
          </div>
          <div className="text-center p-6 bg-white rounded-2xl border border-gray-100 shadow-md">
            <div className="text-3xl font-extrabold text-purple-600 mb-2">4</div>
            <div className="text-sm text-gray-600 font-medium">Financial Tools</div>
          </div>
          <div className="text-center p-6 bg-white rounded-2xl border border-gray-100 shadow-md">
            <div className="text-3xl font-extrabold text-green-600 mb-2">Real-Time</div>
            <div className="text-sm text-gray-600 font-medium">Instant Results</div>
          </div>
        </div>
      </div>
    </section>
  );
}
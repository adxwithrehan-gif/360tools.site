import React, { useState, useMemo } from 'react';
import { DollarSign, Percent, TrendingUp, Calendar, ArrowRight, ShieldCheck, PieChart, Landmark } from 'lucide-react';

interface AdvancedFinanceSuiteProps {
  toolId: string;
}

export const AdvancedFinanceSuite: React.FC<AdvancedFinanceSuiteProps> = ({ toolId }) => {
  // 1. Core Loan & Mortgage State
  const [loanAmount, setLoanAmount] = useState('350000');
  const [interestRate, setInterestRate] = useState('6.5');
  const [loanTermYears, setLoanTermYears] = useState('30');
  const [downPayment, setDownPayment] = useState('70000');
  const [propertyTaxYear, setPropertyTaxYear] = useState('4200');
  const [homeInsuranceYear, setHomeInsuranceYear] = useState('1200');

  // 2. Investment & Retirement State
  const [currentAge, setCurrentAge] = useState('30');
  const [retirementAge, setRetirementAge] = useState('65');
  const [currentSavings, setCurrentSavings] = useState('25000');
  const [monthlyContribution, setMonthlyContribution] = useState('500');
  const [annualReturnRate, setAnnualReturnRate] = useState('8');

  // 3. Credit Card & Debt Payoff State
  const [creditBalance, setCreditBalance] = useState('8500');
  const [creditApr, setCreditApr] = useState('21.99');
  const [monthlyPayment, setMonthlyPayment] = useState('250');

  // 4. ROI & Margin State
  const [costPrice, setCostPrice] = useState('150');
  const [sellingPrice, setSellingPrice] = useState('250');

  // 5. Income Tax & Salary State
  const [grossAnnualSalary, setGrossAnnualSalary] = useState('85000');

  // 6. Discount & Percent Off State
  const [originalPrice, setOriginalPrice] = useState('120');
  const [discountPercent, setDiscountPercent] = useState('25');

  // 7. Auto Lease State
  const [vehiclePrice, setVehiclePrice] = useState('35000');
  const [residualValue, setResidualValue] = useState('19000');
  const [leaseTermMonths, setLeaseTermMonths] = useState('36');
  const [moneyFactor, setMoneyFactor] = useState('0.0025');

  // Mortgage & Amortization Calculations
  const mortgageCalc = useMemo(() => {
    const principal = Math.max(0, (parseFloat(loanAmount) || 0) - (parseFloat(downPayment) || 0));
    const annualRate = (parseFloat(interestRate) || 0) / 100;
    const monthlyRate = annualRate / 12;
    const totalMonths = (parseFloat(loanTermYears) || 30) * 12;

    if (principal <= 0 || totalMonths <= 0) return null;

    let monthlyPI = 0;
    if (monthlyRate > 0) {
      monthlyPI =
        (principal * (monthlyRate * Math.pow(1 + monthlyRate, totalMonths))) /
        (Math.pow(1 + monthlyRate, totalMonths) - 1);
    } else {
      monthlyPI = principal / totalMonths;
    }

    const monthlyTax = (parseFloat(propertyTaxYear) || 0) / 12;
    const monthlyIns = (parseFloat(homeInsuranceYear) || 0) / 12;
    const totalMonthly = monthlyPI + monthlyTax + monthlyIns;
    const totalInterest = monthlyPI * totalMonths - principal;
    const totalCost = principal + totalInterest;

    // First 5 years amortization summary
    const schedule: { year: number; balance: number; interestPaidYear: number }[] = [];
    let curBal = principal;
    for (let y = 1; y <= Math.min(5, parseFloat(loanTermYears) || 30); y++) {
      let interestThisYear = 0;
      for (let m = 1; m <= 12; m++) {
        const intM = curBal * monthlyRate;
        const prinM = monthlyPI - intM;
        interestThisYear += intM;
        curBal = Math.max(0, curBal - prinM);
      }
      schedule.push({ year: y, balance: curBal, interestPaidYear: interestThisYear });
    }

    return {
      principal,
      monthlyPI: monthlyPI.toFixed(2),
      monthlyTax: monthlyTax.toFixed(2),
      monthlyIns: monthlyIns.toFixed(2),
      totalMonthly: totalMonthly.toFixed(2),
      totalInterest: totalInterest.toFixed(2),
      totalCost: totalCost.toFixed(2),
      schedule,
    };
  }, [loanAmount, downPayment, interestRate, loanTermYears, propertyTaxYear, homeInsuranceYear]);

  // Retirement & 401K Growth Calculations
  const retirementCalc = useMemo(() => {
    const years = Math.max(1, (parseInt(retirementAge) || 65) - (parseInt(currentAge) || 30));
    const init = parseFloat(currentSavings) || 0;
    const monthly = parseFloat(monthlyContribution) || 0;
    const r = (parseFloat(annualReturnRate) || 7) / 100;
    const monthlyR = r / 12;
    const months = years * 12;

    let balance = init;
    let totalContributed = init;

    for (let i = 0; i < months; i++) {
      balance = balance * (1 + monthlyR) + monthly;
      totalContributed += monthly;
    }

    const totalInterestEarned = balance - totalContributed;
    // 4% safe withdrawal rate per year
    const annualRetirementIncome = balance * 0.04;

    return {
      years,
      nestEgg: balance.toFixed(0),
      totalContributed: totalContributed.toFixed(0),
      totalInterestEarned: totalInterestEarned.toFixed(0),
      monthlyRetirementIncome: (annualRetirementIncome / 12).toFixed(0),
    };
  }, [currentAge, retirementAge, currentSavings, monthlyContribution, annualReturnRate]);

  // Credit Card Payoff Calculations
  const creditCardCalc = useMemo(() => {
    const bal = parseFloat(creditBalance) || 0;
    const apr = (parseFloat(creditApr) || 0) / 100;
    const monthlyR = apr / 12;
    const pay = parseFloat(monthlyPayment) || 0;

    if (bal <= 0 || pay <= 0) return null;
    const firstMonthInterest = bal * monthlyR;
    if (pay <= firstMonthInterest) {
      return { impossible: true, minNeeded: (firstMonthInterest + 10).toFixed(0) };
    }

    let curBal = bal;
    let totalInt = 0;
    let months = 0;

    while (curBal > 0 && months < 600) {
      months++;
      const intMonth = curBal * monthlyR;
      totalInt += intMonth;
      curBal = curBal + intMonth - pay;
    }

    return {
      impossible: false,
      months,
      years: (months / 12).toFixed(1),
      totalInterest: totalInt.toFixed(2),
      totalPaid: (bal + totalInt).toFixed(2),
    };
  }, [creditBalance, creditApr, monthlyPayment]);

  return (
    <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs">
      {/* 1. Mortgage & Loans Suite */}
      {(toolId === 'mortgage-calculator' ||
        toolId === 'loan-calculator' ||
        toolId === 'auto-loan-calculator' ||
        toolId === 'payment-calculator' ||
        toolId === 'amortization-calculator' ||
        toolId === 'mortgage-payoff-calculator' ||
        toolId === 'house-affordability-calculator' ||
        toolId === 'business-loan-calculator' ||
        toolId === 'personal-loan-calculator' ||
        toolId === 'boat-loan-calculator' ||
        toolId === 'fha-loan-calculator' ||
        toolId === 'va-mortgage-calculator' ||
        toolId === 'home-equity-loan-calculator' ||
        toolId === 'heloc-calculator' ||
        toolId === 'down-payment-calculator' ||
        toolId === 'mortgage-calculator-uk' ||
        toolId === 'canadian-mortgage-calculator' ||
        toolId === 'mortgage-amortization-calculator' ||
        toolId === 'refinance-calculator' ||
        toolId === 'debt-to-income-ratio-calculator') && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Home / Loan Amount ($)
              </label>
              <input
                type="number"
                value={loanAmount}
                onChange={(e) => setLoanAmount(e.target.value)}
                className="w-full p-3 border border-slate-300 rounded-xl font-bold text-slate-900 bg-slate-50"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Down Payment ($)
              </label>
              <input
                type="number"
                value={downPayment}
                onChange={(e) => setDownPayment(e.target.value)}
                className="w-full p-3 border border-slate-300 rounded-xl font-bold text-slate-900 bg-slate-50"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Interest Rate (%)
              </label>
              <input
                type="number"
                step="0.1"
                value={interestRate}
                onChange={(e) => setInterestRate(e.target.value)}
                className="w-full p-3 border border-slate-300 rounded-xl font-bold text-slate-900 bg-slate-50"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Loan Term (Years)
              </label>
              <select
                value={loanTermYears}
                onChange={(e) => setLoanTermYears(e.target.value)}
                className="w-full p-3 border border-slate-300 rounded-xl font-bold text-slate-900 bg-slate-50"
              >
                <option value="10">10 Years</option>
                <option value="15">15 Years</option>
                <option value="20">20 Years</option>
                <option value="30">30 Years</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Yearly Property Tax ($)
              </label>
              <input
                type="number"
                value={propertyTaxYear}
                onChange={(e) => setPropertyTaxYear(e.target.value)}
                className="w-full p-3 border border-slate-300 rounded-xl font-bold text-slate-900 bg-slate-50"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Yearly Insurance ($)
              </label>
              <input
                type="number"
                value={homeInsuranceYear}
                onChange={(e) => setHomeInsuranceYear(e.target.value)}
                className="w-full p-3 border border-slate-300 rounded-xl font-bold text-slate-900 bg-slate-50"
              />
            </div>
          </div>

          {mortgageCalc && (
            <div className="space-y-4">
              <div className="p-6 rounded-2xl bg-emerald-50/70 border border-emerald-200 text-center">
                <span className="text-xs text-emerald-800 font-bold uppercase tracking-wider">
                  Total Estimated Monthly Payment
                </span>
                <div className="text-4xl sm:text-5xl font-black text-emerald-700 mt-2">
                  ${parseFloat(mortgageCalc.totalMonthly).toLocaleString()}
                </div>
                <div className="flex justify-center gap-4 text-xs text-emerald-800 mt-2 font-medium">
                  <span>P&I: ${mortgageCalc.monthlyPI}</span>
                  <span>•</span>
                  <span>Tax: ${mortgageCalc.monthlyTax}</span>
                  <span>•</span>
                  <span>Insurance: ${mortgageCalc.monthlyIns}</span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-center">
                  <span className="text-xs text-slate-500 font-medium">Loan Principal</span>
                  <div className="text-xl font-bold text-slate-900 mt-1">
                    ${mortgageCalc.principal.toLocaleString()}
                  </div>
                </div>
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-center">
                  <span className="text-xs text-slate-500 font-medium">Total Interest Over Life</span>
                  <div className="text-xl font-bold text-rose-600 mt-1">
                    ${parseFloat(mortgageCalc.totalInterest).toLocaleString()}
                  </div>
                </div>
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-center">
                  <span className="text-xs text-slate-500 font-medium">Total 30-Year Cost</span>
                  <div className="text-xl font-bold text-slate-900 mt-1">
                    ${parseFloat(mortgageCalc.totalCost).toLocaleString()}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 2. Retirement, 401K & Investment Suite */}
      {(toolId === 'retirement-calculator' ||
        toolId === '401k-calculator' ||
        toolId === 'investment-calculator' ||
        toolId === 'pension-calculator' ||
        toolId === 'social-security-calculator' ||
        toolId === 'roth-ira-calculator' ||
        toolId === 'ira-calculator' ||
        toolId === 'annuity-calculator' ||
        toolId === 'annuity-payout-calculator' ||
        toolId === 'rmd-calculator' ||
        toolId === 'mutual-fund-calculator') && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Current Age</label>
              <input
                type="number"
                value={currentAge}
                onChange={(e) => setCurrentAge(e.target.value)}
                className="w-full p-3 border border-slate-300 rounded-xl font-bold text-slate-900 bg-slate-50"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Retire Age</label>
              <input
                type="number"
                value={retirementAge}
                onChange={(e) => setRetirementAge(e.target.value)}
                className="w-full p-3 border border-slate-300 rounded-xl font-bold text-slate-900 bg-slate-50"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Current Savings ($)</label>
              <input
                type="number"
                value={currentSavings}
                onChange={(e) => setCurrentSavings(e.target.value)}
                className="w-full p-3 border border-slate-300 rounded-xl font-bold text-slate-900 bg-slate-50"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Monthly Deposit ($)</label>
              <input
                type="number"
                value={monthlyContribution}
                onChange={(e) => setMonthlyContribution(e.target.value)}
                className="w-full p-3 border border-slate-300 rounded-xl font-bold text-slate-900 bg-slate-50"
              />
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-blue-50/70 border border-blue-200 text-center">
            <span className="text-xs text-blue-700 font-bold uppercase tracking-wider">
              Projected Nest Egg at Age {retirementAge} ({retirementCalc.years} Years of Growth)
            </span>
            <div className="text-4xl sm:text-5xl font-black text-slate-900 mt-2">
              ${parseFloat(retirementCalc.nestEgg).toLocaleString()}
            </div>
            <div className="mt-2 text-xs font-semibold text-blue-800">
              Can generate approx. <span className="font-bold text-emerald-600">${parseFloat(retirementCalc.monthlyRetirementIncome).toLocaleString()} / month</span> in sustainable passive income (4% rule).
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-center">
              <span className="text-xs text-slate-500 font-medium">Your Total Contributions</span>
              <div className="text-2xl font-bold text-slate-900 mt-1">
                ${parseFloat(retirementCalc.totalContributed).toLocaleString()}
              </div>
            </div>
            <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-200 text-center">
              <span className="text-xs text-emerald-800 font-bold">Compound Interest Growth</span>
              <div className="text-2xl font-bold text-emerald-700 mt-1">
                +${parseFloat(retirementCalc.totalInterestEarned).toLocaleString()}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. Credit Card & Debt Payoff Suite */}
      {(toolId === 'credit-card-calculator' ||
        toolId === 'credit-cards-payoff-calculator' ||
        toolId === 'debt-payoff-calculator' ||
        toolId === 'debt-consolidation-calculator' ||
        toolId === 'repayment-calculator' ||
        toolId === 'student-loan-calculator' ||
        toolId === 'college-cost-calculator') && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Card Balance ($)</label>
              <input
                type="number"
                value={creditBalance}
                onChange={(e) => setCreditBalance(e.target.value)}
                className="w-full p-3 border border-slate-300 rounded-xl font-bold text-slate-900 bg-slate-50"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Annual APR (%)</label>
              <input
                type="number"
                step="0.1"
                value={creditApr}
                onChange={(e) => setCreditApr(e.target.value)}
                className="w-full p-3 border border-slate-300 rounded-xl font-bold text-slate-900 bg-slate-50"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Monthly Payment ($)</label>
              <input
                type="number"
                value={monthlyPayment}
                onChange={(e) => setMonthlyPayment(e.target.value)}
                className="w-full p-3 border border-slate-300 rounded-xl font-bold text-slate-900 bg-slate-50"
              />
            </div>
          </div>

          {creditCardCalc && (
            <div>
              {creditCardCalc.impossible ? (
                <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold text-center">
                  Monthly payment is too low to cover interest! Please increase payment above ${creditCardCalc.minNeeded}/mo to reduce principal.
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-5 rounded-2xl bg-blue-50/70 border border-blue-200 text-center">
                    <span className="text-xs text-blue-700 font-bold uppercase">Time to Debt-Free</span>
                    <div className="text-3xl font-black text-slate-900 mt-1">
                      {creditCardCalc.months} <span className="text-sm font-bold text-slate-600">months ({creditCardCalc.years} yrs)</span>
                    </div>
                  </div>
                  <div className="p-5 rounded-2xl bg-rose-50/70 border border-rose-200 text-center">
                    <span className="text-xs text-rose-800 font-bold uppercase">Total Interest Paid</span>
                    <div className="text-3xl font-black text-rose-700 mt-1">
                      ${parseFloat(creditCardCalc.totalInterest).toLocaleString()}
                    </div>
                  </div>
                  <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 text-center">
                    <span className="text-xs text-slate-500 font-medium">Total Amount Paid</span>
                    <div className="text-2xl font-bold text-slate-900 mt-1">
                      ${parseFloat(creditCardCalc.totalPaid).toLocaleString()}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* 4. Margin, ROI, Discount & Percent Off */}
      {(toolId === 'margin-calculator' ||
        toolId === 'roi-calculator' ||
        toolId === 'discount-calculator' ||
        toolId === 'percent-off-calculator' ||
        toolId === 'commission-calculator' ||
        toolId === 'payback-period-calculator') && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Cost / Original Price ($)</label>
              <input
                type="number"
                value={costPrice}
                onChange={(e) => setCostPrice(e.target.value)}
                className="w-full p-3 border border-slate-300 rounded-xl font-bold text-slate-900 bg-slate-50"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Selling / Revenue Price ($)</label>
              <input
                type="number"
                value={sellingPrice}
                onChange={(e) => setSellingPrice(e.target.value)}
                className="w-full p-3 border border-slate-300 rounded-xl font-bold text-slate-900 bg-slate-50"
              />
            </div>
          </div>

          {(() => {
            const c = parseFloat(costPrice) || 0;
            const s = parseFloat(sellingPrice) || 0;
            const profit = s - c;
            const margin = s > 0 ? (profit / s) * 100 : 0;
            const markup = c > 0 ? (profit / c) * 100 : 0;
            const roi = c > 0 ? (profit / c) * 100 : 0;

            return (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-200 text-center">
                  <span className="text-xs text-emerald-800 font-bold uppercase">Net Profit</span>
                  <div className="text-2xl font-black text-emerald-700 mt-1">${profit.toFixed(2)}</div>
                </div>
                <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-200 text-center">
                  <span className="text-xs text-blue-700 font-bold uppercase">Profit Margin</span>
                  <div className="text-2xl font-black text-blue-600 mt-1">{margin.toFixed(2)}%</div>
                </div>
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-center">
                  <span className="text-xs text-slate-500 font-medium">Markup</span>
                  <div className="text-2xl font-black text-slate-900 mt-1">{markup.toFixed(2)}%</div>
                </div>
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-center">
                  <span className="text-xs text-slate-500 font-medium">Return on Investment (ROI)</span>
                  <div className="text-2xl font-black text-slate-900 mt-1">{roi.toFixed(1)}%</div>
                </div>
              </div>
            );
          })()}
        </div>
      )}
    </div>
  );
};

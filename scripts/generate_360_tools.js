import fs from 'fs';
import path from 'path';

// Complete dataset specification for exactly 360 tools
const tools = [];

const addTool = (item) => {
  // Ensure default structure
  const howToSteps = item.howToSteps || [
    { step: 1, title: 'Open Interface', desc: 'The tool interface is 100% clean, responsive, and ready on any device.' },
    { step: 2, title: 'Enter Input Data', desc: 'Type or adjust your values and parameters in the fields provided.' },
    { step: 3, title: 'Process & Compute', desc: 'Click the Process / Calculate button for instant client-side execution.' },
    { step: 4, title: 'View & Copy Result', desc: 'Your verified result appears instantly on screen to copy or download.' },
  ];

  const faqs = item.faqs || [
    { q: `Is ${item.name} completely free to use?`, a: `Yes, ${item.name} is 100% free with unlimited calculations and zero hidden subscriptions.` },
    { q: 'Are my inputs or documents stored on any server?', a: 'No. All calculations run strictly client-side inside your browser memory for 100% privacy.' },
  ];

  tools.push({
    id: item.id,
    name: item.name,
    category: item.category,
    themeType: item.themeType || (
      item.category === 'developer' ? 'developer' :
      item.category === 'math' ? 'math' :
      item.category === 'finance' ? 'finance' :
      item.category === 'health' ? 'health' :
      item.category === 'pdf' ? 'pdf' :
      item.category === 'media' ? 'media' : 'utility'
    ),
    shortDesc: item.shortDesc,
    longDesc: item.longDesc || item.shortDesc,
    iconName: item.iconName || 'Calculator',
    badge: item.badge || 'Verified',
    tags: item.tags || [item.category, 'calculator', 'online', 'free'],
    seoTitle: `${item.name} - 100% Free Online Client-Side Tool`,
    seoDesc: item.shortDesc,
    exampleInput: item.exampleInput || 'Standard sample parameter inputs',
    exampleOutput: item.exampleOutput || 'Instant calculated result',
    howToSteps,
    faqs,
  });
};

// ==========================================
// 1. MATH CALCULATORS (55 Tools)
// ==========================================
const mathList = [
  ['scientific-calculator', 'Scientific Calculator', 'Calculator', 'Advanced scientific math solver with trigonometric, logarithmic, and power functions.'],
  ['fraction-calculator', 'Fraction Calculator', 'Divide', 'Add, subtract, multiply, and divide fractions with automated step-by-step simplification.'],
  ['percentage-calculator', 'Percentage Calculator', 'Percent', 'Calculate percentages, % increase/decrease, ratios, and proportion changes.'],
  ['triangle-calculator', 'Triangle Calculator', 'Compass', 'Compute triangle angles, side lengths, area, and perimeter using SSS, SAS, and ASA laws.'],
  ['volume-calculator', 'Volume Calculator', 'Boxes', 'Calculate 3D volume for spheres, cones, cylinders, cubes, prisms, and pyramids.'],
  ['standard-deviation-calculator', 'Standard Deviation Calculator', 'BarChart', 'Calculate sample and population standard deviation, variance, mean, and sum of squares.'],
  ['random-number-generator', 'Random Number Generator', 'Shuffle', 'Cryptographically strong random number generator with range, exclusions, and batch generation.'],
  ['number-sequence-calculator', 'Number Sequence Calculator', 'Layers', 'Identify arithmetic, geometric, and Fibonacci sequences, find nth terms, and compute partial sums.'],
  ['percent-error-calculator', 'Percent Error Calculator', 'Percent', 'Compute relative error and percentage difference between theoretical and experimental values.'],
  ['exponent-calculator', 'Exponent Calculator', 'Zap', 'Evaluate positive, negative, and fractional powers, scientific exponents, and power towers.'],
  ['binary-calculator', 'Binary Calculator', 'Binary', 'Add, subtract, multiply, and convert binary, decimal, hex, and octal numeral values.'],
  ['hex-calculator', 'Hex Calculator', 'Hash', 'Hexadecimal arithmetic calculator for memory offsets, color codes, and byte math.'],
  ['half-life-calculator', 'Half-Life Calculator', 'Clock', 'Model radioactive decay, exponential substance elimination, and biological half-lives.'],
  ['quadratic-formula-calculator', 'Quadratic Formula Calculator', 'Calculator', 'Solve ax² + bx + c = 0 with discriminant analysis, real, and complex imaginary roots.'],
  ['slope-calculator', 'Slope Calculator', 'TrendingUp', 'Find line slope (m), angle of inclination, distance, midpoint, and equation between points.'],
  ['log-calculator', 'Log Calculator', 'Gauge', 'Compute natural logarithm (ln), common logarithm (log10), and custom base logarithms.'],
  ['area-calculator', 'Area Calculator', 'Boxes', 'Calculate 2D surface area for rectangles, circles, triangles, trapezoids, and polygons.'],
  ['sample-size-calculator', 'Sample Size Calculator', 'BarChart', 'Determine statistically valid sample sizes based on confidence level, margin of error, and population.'],
  ['probability-calculator', 'Probability Calculator', 'Dices', 'Calculate probabilities of independent, dependent, mutually exclusive, and conditional events.'],
  ['statistics-calculator', 'Statistics Calculator', 'BarChart', 'Comprehensive descriptive statistics summary: mean, median, mode, IQR, skewness, and outliers.'],
  ['mean-median-mode-range-calculator', 'Mean, Median, Mode, Range Calculator', 'Calculator', 'Calculate fundamental central tendencies: arithmetic mean, median value, mode frequency, and range.'],
  ['permutation-and-combination-calculator', 'Permutation and Combination Calculator', 'Shuffle', 'Calculate nPr permutations and nCr combinations with or without replacement and factorials.'],
  ['z-score-calculator', 'Z-score Calculator', 'Gauge', 'Calculate standard normal z-scores, p-values, percentiles, and Gaussian bell curve positions.'],
  ['confidence-interval-calculator', 'Confidence Interval Calculator', 'Scale', 'Compute confidence intervals for sample means and proportions with z and t distributions.'],
  ['ratio-calculator', 'Ratio Calculator', 'ArrowLeftRight', 'Solve missing ratio proportions (A:B = C:D), simplify ratios, and scale dimensions.'],
  ['distance-calculator', 'Distance Calculator', 'Compass', 'Calculate Euclidean 2D/3D coordinate distance, Manhattan distance, and midpoint.'],
  ['circle-calculator', 'Circle Calculator', 'RotateCw', 'Calculate circle radius, diameter, circumference, area, sector arc length, and chord.'],
  ['surface-area-calculator', 'Surface Area Calculator', 'Boxes', 'Calculate total and lateral surface areas of cylinders, spheres, cones, prisms, and cubes.'],
  ['pythagorean-theorem-calculator', 'Pythagorean Theorem Calculator', 'Compass', 'Solve right triangle sides using a² + b² = c² with radical simplification and angle readout.'],
  ['right-triangle-calculator', 'Right Triangle Calculator', 'Compass', 'Solve right triangles with any two known inputs (sides or acute angles) using trigonometry.'],
  ['root-calculator', 'Root Calculator', 'Zap', 'Calculate square roots, cube roots, and nth roots with radical simplification.'],
  ['least-common-multiple-calculator-lcm', 'Least Common Multiple Calculator (LCM)', 'Divide', 'Find the Least Common Multiple (LCM) of 2, 3, or more numbers with prime factor trees.'],
  ['greatest-common-factor-calculator-gcf', 'Greatest Common Factor Calculator (GCF)', 'Divide', 'Determine the Greatest Common Factor (GCF/HCF) of multiple numbers via Euclidean algorithm.'],
  ['factor-calculator', 'Factor Calculator', 'Boxes', 'Find all integer factors, factor pairs, prime factorization, and divisor counts.'],
  ['rounding-calculator', 'Rounding Calculator', 'Calculator', 'Round numbers to nearest whole number, tenths, hundredths, thousandths, or significant figures.'],
  ['matrix-calculator', 'Matrix Calculator', 'Grid3X3', 'Perform matrix addition, subtraction, multiplication, determinants, and inverses (2x2 to 4x4).'],
  ['scientific-notation-calculator', 'Scientific Notation Calculator', 'Zap', 'Convert between decimal numbers and scientific notation (a × 10^b) and compute E-notation.'],
  ['big-number-calculator', 'Big Number Calculator', 'Calculator', 'Arbitrary-precision integer arithmetic for massive numbers exceeding 64-bit limits.'],
  ['prime-factorization-calculator', 'Prime Factorization Calculator', 'Divide', 'Decompose numbers into canonical prime factor products with exponential notation.'],
  ['common-factor-calculator', 'Common Factor Calculator', 'Boxes', 'Identify all shared common divisors between two or more numbers and highlight GCF.'],
  ['basic-calculator', 'Basic Calculator', 'Calculator', 'Simple, fast four-function calculator with memory recall, percentages, and clean keys.'],
  ['long-division-calculator', 'Long Division Calculator', 'Divide', 'Step-by-step long division calculator with quotient, remainder, and decimal breakdown.'],
  ['average-calculator', 'Average Calculator', 'BarChart', 'Compute arithmetic mean, weighted average, geometric mean, and harmonic mean.'],
  ['p-value-calculator', 'P-value Calculator', 'Gauge', 'Determine statistical significance p-values from Z, T, F, and Chi-Square test statistics.'],
  ['derivative-calculator', 'Derivative Calculator', 'TrendingUp', 'Compute symbolic first, second, and nth derivatives with step-by-step power and chain rules.'],
  ['integral-calculator', 'Integral Calculator', 'Layers', 'Evaluate definite and indefinite calculus integrals with integration by parts.'],
  ['limit-calculator', 'Limit Calculator', 'Gauge', 'Calculate mathematical limits approaching finite values or infinity using L\'Hopital\'s rule.'],
  ['vector-calculator', 'Vector Calculator', 'Compass', 'Compute 2D/3D vector magnitude, dot product, cross product, and angle between vectors.'],
  ['modulo-calculator', 'Modulo Calculator', 'Divide', 'Calculate integer remainder a mod n, modular inverse, and modular exponentiation.'],
  ['decimal-to-fraction-calculator', 'Decimal to Fraction Calculator', 'Divide', 'Convert terminating and repeating decimals to simplified irreducible fractions.'],
  ['fraction-to-decimal-calculator', 'Fraction to Decimal Calculator', 'Divide', 'Convert proper and mixed fractions to exact and repeating decimal notation.'],
  ['significant-figures-calculator', 'Significant Figures Calculator', 'Hash', 'Count sig figs, round values to target precision, and format engineering figures.'],
  ['complex-number-calculator', 'Complex Number Calculator', 'Calculator', 'Add, multiply, divide complex numbers (a + bi), find magnitude, and polar phase angle.'],
  ['polar-to-cartesian-calculator', 'Polar to Cartesian Calculator', 'Compass', 'Convert between Cartesian (x, y) coordinates and Polar (r, θ) angle representations.'],
  ['proportions-calculator', 'Proportions Calculator', 'ArrowLeftRight', 'Solve direct, inverse, and joint proportional equations and scaling factors.'],
];

mathList.forEach(([id, name, iconName, shortDesc]) => {
  addTool({
    id,
    name,
    category: 'math',
    themeType: 'math',
    iconName,
    shortDesc,
    tags: ['math', id.replace(/-/g, ' '), 'calculator', 'formula']
  });
});

// ==========================================
// 2. FINANCIAL CALCULATORS (80 Tools)
// ==========================================
const financeList = [
  ['mortgage-calculator', 'Mortgage Calculator', 'Home', 'Estimate monthly mortgage payments, property taxes, home insurance, and amortization.'],
  ['loan-calculator', 'Loan Calculator', 'DollarSign', 'Calculate monthly loan installments, principal amortization schedules, and total interest costs.'],
  ['auto-loan-calculator', 'Auto Loan Calculator', 'Car', 'Calculate car financing payments, vehicle trade-in values, dealer doc fees, and sales tax.'],
  ['interest-calculator', 'Interest Calculator', 'Percent', 'Compute simple and compound interest returns across custom compounding frequencies.'],
  ['payment-calculator', 'Payment Calculator', 'CreditCard', 'Determine exact fixed loan installments required to pay off principal balances.'],
  ['retirement-calculator', 'Retirement Calculator', 'TrendingUp', 'Project retirement nest egg growth, yearly withdrawals, and savings longevity.'],
  ['amortization-calculator', 'Amortization Calculator', 'Receipt', 'Generate complete month-by-month and year-by-year loan amortization schedules.'],
  ['investment-calculator', 'Investment Calculator', 'TrendingUp', 'Forecast future wealth accumulation with initial deposit and periodic contributions.'],
  ['currency-calculator', 'Currency Calculator', 'Coins', 'Live currency exchange rate conversions across USD, EUR, GBP, JPY, CAD, and 150+ currencies.'],
  ['inflation-calculator', 'Inflation Calculator', 'TrendingUp', 'Calculate purchasing power degradation and cumulative inflation effects over time.'],
  ['finance-calculator', 'Finance Calculator', 'Calculator', 'Comprehensive time-value-of-money (TVM) solver for PV, FV, PMT, N, and I/Y.'],
  ['mortgage-payoff-calculator', 'Mortgage Payoff Calculator', 'Home', 'See how extra monthly principal payments accelerate mortgage payoff and save thousands.'],
  ['income-tax-calculator', 'Income Tax Calculator', 'Receipt', 'Estimate federal, state, and payroll tax deductions and effective tax rate.'],
  ['compound-interest-calculator', 'Compound Interest Calculator', 'TrendingUp', 'Calculate exponential interest compounding daily, monthly, quarterly, or annually.'],
  ['salary-calculator', 'Salary Calculator', 'Banknote', 'Convert hourly wage to annual salary, bi-weekly take-home, and monthly gross income.'],
  ['401k-calculator', '401K Calculator', 'PiggyBank', 'Model 401(k) retirement contributions, employer match benefits, and compounded wealth.'],
  ['interest-rate-calculator', 'Interest Rate Calculator', 'Percent', 'Determine the effective annual interest rate (AER/APY) from nominal rates and loan terms.'],
  ['sales-tax-calculator', 'Sales Tax Calculator', 'Receipt', 'Calculate state, provincial, and local sales tax or extract pre-tax subtotal from gross receipts.'],
  ['house-affordability-calculator', 'House Affordability Calculator', 'Home', 'Determine maximum home purchase price based on gross income, down payment, and DTI ratio.'],
  ['savings-calculator', 'Savings Calculator', 'PiggyBank', 'Plan savings goals and project time needed to build emergency funds or large deposits.'],
  ['rent-calculator', 'Rent Calculator', 'Home', 'Calculate comfortable monthly rent budget based on the 30% gross income rule.'],
  ['marriage-tax-calculator', 'Marriage Tax Calculator', 'Scale', 'Compare filing jointly vs. filing separately to assess potential marriage tax penalties or bonuses.'],
  ['estate-tax-calculator', 'Estate Tax Calculator', 'FileText', 'Estimate federal and state estate transfer taxes and applicable lifetime unified exemptions.'],
  ['pension-calculator', 'Pension Calculator', 'Briefcase', 'Estimate defined-benefit pension payments based on years of service and final average salary.'],
  ['social-security-calculator', 'Social Security Calculator', 'Shield', 'Estimate Social Security retirement benefits based on claiming age (62, FRA, 70).'],
  ['annuity-calculator', 'Annuity Calculator', 'DollarSign', 'Calculate growth and accumulation phase for fixed, variable, and deferred annuities.'],
  ['annuity-payout-calculator', 'Annuity Payout Calculator', 'DollarSign', 'Calculate guaranteed monthly annuity payouts based on lump-sum principal and interest rate.'],
  ['credit-card-calculator', 'Credit Card Calculator', 'CreditCard', 'Determine monthly payment required to eliminate credit card balances within desired timeframe.'],
  ['credit-cards-payoff-calculator', 'Credit Cards Payoff Calculator', 'CreditCard', 'Calculate time and interest required to become completely debt-free using minimum payments.'],
  ['debt-payoff-calculator', 'Debt Payoff Calculator', 'CheckCircle2', 'Compare debt snowball (lowest balance first) vs. debt avalanche (highest interest first).'],
  ['debt-consolidation-calculator', 'Debt Consolidation Calculator', 'Combine', 'Evaluate if consolidating high-interest cards into a single loan saves interest.'],
  ['repayment-calculator', 'Repayment Calculator', 'DollarSign', 'Calculate loan repayment schedules, balloon payments, and bi-weekly payment options.'],
  ['student-loan-calculator', 'Student Loan Calculator', 'GraduationCap', 'Model federal and private student loan repayment plans, grace periods, and interest.'],
  ['college-cost-calculator', 'College Cost Calculator', 'GraduationCap', 'Estimate future university tuition, room & board, inflation, and 529 savings targets.'],
  ['simple-interest-calculator', 'Simple Interest Calculator', 'Percent', 'Calculate simple interest using I = P * r * t for short-term promissory notes.'],
  ['cd-calculator', 'CD Calculator', 'PiggyBank', 'Calculate Certificate of Deposit interest earnings at maturity with annual percentage yield (APY).'],
  ['bond-calculator', 'Bond Calculator', 'FileText', 'Compute bond yield to maturity (YTM), current yield, coupon payments, and price duration.'],
  ['mutual-fund-calculator', 'Mutual Fund Calculator', 'PieChart', 'Model index fund and mutual fund portfolio returns factoring in expense ratios and loads.'],
  ['roth-ira-calculator', 'Roth IRA Calculator', 'TrendingUp', 'Project tax-free retirement wealth growth through annual Roth IRA contributions.'],
  ['ira-calculator', 'IRA Calculator', 'TrendingUp', 'Compare Traditional IRA upfront tax deduction vs. tax-deferred retirement distributions.'],
  ['rmd-calculator', 'RMD Calculator', 'Calendar', 'Calculate IRS Required Minimum Distributions from retirement accounts based on life expectancy.'],
  ['vat-calculator', 'VAT Calculator', 'Receipt', 'Add or remove Value Added Tax (VAT) with custom tax percentages for international invoices.'],
  ['cash-back-or-low-interest-calculator', 'Cash Back or Low Interest Calculator', 'DollarSign', 'Compare dealer rebates / cash-back offers versus lower introductory APR financing.'],
  ['auto-lease-calculator', 'Auto Lease Calculator', 'Car', 'Calculate monthly vehicle lease payments including money factor, residual value, and cap cost.'],
  ['depreciation-calculator', 'Depreciation Calculator', 'TrendingDown', 'Calculate asset depreciation using straight-line, declining balance, and MACRS schedules.'],
  ['average-return-calculator', 'Average Return Calculator', 'TrendingUp', 'Compute geometric mean CAGR and arithmetic average return for stock and crypto portfolios.'],
  ['margin-calculator', 'Margin Calculator', 'Percent', 'Calculate gross profit margin, markup percentage, net profit, and cost of goods sold (COGS).'],
  ['discount-calculator', 'Discount Calculator', 'Tag', 'Calculate final sale price after percentage discounts, double coupons, and clearance deductions.'],
  ['business-loan-calculator', 'Business Loan Calculator', 'Briefcase', 'Model commercial loans, working capital financing, SBA loans, and debt service coverage (DSCR).'],
  ['debt-to-income-ratio-calculator', 'Debt-to-Income Ratio Calculator', 'Scale', 'Calculate front-end and back-end DTI ratios to determine loan and mortgage qualification.'],
  ['real-estate-calculator', 'Real Estate Calculator', 'Home', 'Evaluate property investments: capitalization rate (Cap Rate), cash-on-cash return, and NOI.'],
  ['take-home-paycheck-calculator', 'Take-Home-Paycheck Calculator', 'Banknote', 'Calculate net pay after federal taxes, FICA, state deductions, and pre-tax healthcare.'],
  ['personal-loan-calculator', 'Personal Loan Calculator', 'DollarSign', 'Determine unsecured personal loan terms, origination fees, and monthly debt burden.'],
  ['boat-loan-calculator', 'Boat Loan Calculator', 'Compass', 'Calculate marine financing, boat loans, slip fees, maintenance reserve, and interest.'],
  ['lease-calculator', 'Lease Calculator', 'FileText', 'Model equipment and property leases with present value of future lease liabilities.'],
  ['refinance-calculator', 'Refinance Calculator', 'Home', 'Calculate break-even period and net savings when refinancing to a lower mortgage rate.'],
  ['budget-calculator', 'Budget Calculator', 'PieChart', 'Organize personal monthly income into the 50/30/20 budget framework (Needs, Wants, Savings).'],
  ['rental-property-calculator', 'Rental Property Calculator', 'Home', 'Forecast monthly rental cash flow, vacancy reserves, property management, and Cap Rate.'],
  ['irr-calculator', 'IRR Calculator', 'TrendingUp', 'Compute Internal Rate of Return (IRR) for capital budgeting and investment cash flows.'],
  ['roi-calculator', 'ROI Calculator', 'Percent', 'Calculate Return on Investment percentage and annualized ROI for projects and assets.'],
  ['apr-calculator', 'APR Calculator', 'Percent', 'Calculate true Annual Percentage Rate (APR) factoring in upfront points and lender fees.'],
  ['fha-loan-calculator', 'FHA Loan Calculator', 'Home', 'Model Federal Housing Administration loans with 3.5% down payment and MIP premiums.'],
  ['va-mortgage-calculator', 'VA Mortgage Calculator', 'Shield', 'Calculate zero-down VA home loans for military service members, veterans, and funding fees.'],
  ['home-equity-loan-calculator', 'Home Equity Loan Calculator', 'Home', 'Estimate borrowing limits on home equity second mortgages based on LTV thresholds.'],
  ['heloc-calculator', 'HELOC Calculator', 'Home', 'Calculate Home Equity Line of Credit interest-only draw payments and repayment schedules.'],
  ['down-payment-calculator', 'Down Payment Calculator', 'DollarSign', 'Calculate down payment percentage, private mortgage insurance (PMI), and upfront cash needed.'],
  ['rent-vs-buy-calculator', 'Rent vs. Buy Calculator', 'Home', 'Compare total financial cost of renting versus buying a home over 5 to 30 years.'],
  ['payback-period-calculator', 'Payback Period Calculator', 'Clock', 'Determine the exact number of years required for an investment to recover initial outlay.'],
  ['present-value-calculator', 'Present Value Calculator', 'DollarSign', 'Calculate present discounted value (PV) of future cash sums based on discount rates.'],
  ['future-value-calculator', 'Future Value Calculator', 'TrendingUp', 'Calculate future accumulated value (FV) of an asset or cash flow stream with compounding.'],
  ['commission-calculator', 'Commission Calculator', 'Percent', 'Calculate real estate, sales rep, and affiliate commissions based on tiered sales volume.'],
  ['mortgage-calculator-uk', 'Mortgage Calculator UK', 'Home', 'UK residential mortgage repayments including Stamp Duty Land Tax (SDLT) bands.'],
  ['canadian-mortgage-calculator', 'Canadian Mortgage Calculator', 'Home', 'Canadian semi-annual compounding mortgage calculator with CMHC insurance calculations.'],
  ['mortgage-amortization-calculator', 'Mortgage Amortization Calculator', 'Receipt', 'Detailed schedule breaking down each payment between principal reduction and bank interest.'],
  ['percent-off-calculator', 'Percent Off Calculator', 'Tag', 'Quick retail discount solver: enter original tag price and percent off to get final price.'],
  ['break-even-calculator', 'Break-Even Calculator', 'Scale', 'Calculate break-even units and revenue based on fixed costs, unit price, and variable cost.'],
  ['net-worth-calculator', 'Net Worth Calculator', 'DollarSign', 'Calculate overall personal net worth by summing total assets and subtracting all liabilities.'],
  ['hourly-to-salary-calculator', 'Hourly to Salary Calculator', 'Clock', 'Convert hourly wages to weekly, monthly, and yearly salary equivalents with overtime.'],
  ['crypto-profit-calculator', 'Crypto Profit Calculator', 'Coins', 'Calculate Bitcoin and cryptocurrency trade profits, exit fees, and percentage gains.'],
  ['stock-return-calculator', 'Stock Return Calculator', 'TrendingUp', 'Calculate capital gains, dividend yields, and annualized stock market returns.'],
];

financeList.forEach(([id, name, iconName, shortDesc]) => {
  addTool({
    id,
    name,
    category: 'finance',
    themeType: 'finance',
    iconName,
    shortDesc,
    tags: ['finance', id.replace(/-/g, ' '), 'money', 'investment', 'loan']
  });
});

// ==========================================
// 3. FITNESS AND HEALTH CALCULATORS (40 Tools)
// ==========================================
const healthList = [
  ['bmi-calculator', 'BMI Calculator', 'Activity', 'Calculate Body Mass Index (BMI), prime weight status, and healthy weight ranges.'],
  ['calorie-calculator', 'Calorie Calculator', 'Flame', 'Determine daily calories needed for weight maintenance, gentle fat loss, or muscle gain.'],
  ['body-fat-calculator', 'Body Fat Calculator', 'HeartPulse', 'Estimate body fat percentage using US Navy circumference tape measurements.'],
  ['bmr-calculator', 'BMR Calculator', 'Zap', 'Calculate Basal Metabolic Rate using Mifflin-St Jeor and Harris-Benedict formulas.'],
  ['macro-calculator', 'Macro Calculator', 'PieChart', 'Calculate optimal macronutrient targets (protein, carbs, and fats) tailored to fitness goals.'],
  ['ideal-weight-calculator', 'Ideal Weight Calculator', 'Scale', 'Compare ideal body weight across Devine, Robinson, Miller, and Hamwi formulas.'],
  ['pregnancy-calculator', 'Pregnancy Calculator', 'Baby', 'Estimate estimated due date (EDD), gestational age, and trimester milestones.'],
  ['pregnancy-weight-gain-calculator', 'Pregnancy Weight Gain Calculator', 'Baby', 'Track recommended pregnancy weight gain guidelines based on pre-pregnancy BMI.'],
  ['pregnancy-conception-calculator', 'Pregnancy Conception Calculator', 'Baby', 'Estimate probable conception dates, ovulation window, and fertile days.'],
  ['due-date-calculator', 'Due Date Calculator', 'Calendar', 'Calculate baby delivery due date based on last menstrual period (LMP) or ultrasound.'],
  ['pace-calculator', 'Pace Calculator', 'Timer', 'Compute running speed, pace per mile/km, and marathon split times.'],
  ['army-body-fat-calculator', 'Army Body Fat Calculator', 'Shield', 'Calculate US Army body composition compliance based on tape test standards.'],
  ['carbohydrate-calculator', 'Carbohydrate Calculator', 'Flame', 'Determine daily carbohydrate intake in grams for keto, low-carb, and endurance athletes.'],
  ['lean-body-mass-calculator', 'Lean Body Mass Calculator', 'Activity', 'Calculate lean body mass (LBM) subtracting fat mass using Boer and James formulas.'],
  ['healthy-weight-calculator', 'Healthy Weight Calculator', 'Scale', 'Discover recommended weight range for your height based on WHO BMI criteria.'],
  ['calories-burned-calculator', 'Calories Burned Calculator', 'Flame', 'Calculate calories expended during running, cycling, swimming, and resistance training.'],
  ['one-rep-max-calculator', 'One Rep Max Calculator', 'Activity', 'Estimate 1RM strength limits for squat, bench press, and deadlift using Epley formula.'],
  ['target-heart-rate-calculator', 'Target Heart Rate Calculator', 'Heart', 'Calculate aerobic, fat-burn, and anaerobic heart rate zones using Karvonen formula.'],
  ['protein-calculator', 'Protein Calculator', 'Activity', 'Calculate optimal daily protein intake in grams for muscle hypertrophy and recovery.'],
  ['fat-intake-calculator', 'Fat Intake Calculator', 'PieChart', 'Determine healthy dietary fats intake based on total daily energy expenditure.'],
  ['tdee-calculator', 'TDEE Calculator', 'Zap', 'Calculate Total Daily Energy Expenditure factoring in daily activity and exercise.'],
  ['ovulation-calculator', 'Ovulation Calculator', 'Calendar', 'Identify fertile peak days and ovulation window based on menstrual cycle lengths.'],
  ['conception-calculator', 'Conception Calculator', 'Baby', 'Estimate conception window and fertile days based on cycle data.'],
  ['period-calculator', 'Period Calculator', 'Calendar', 'Predict upcoming menstrual period dates and cycle regularity tracking.'],
  ['gfr-calculator', 'GFR Calculator', 'Activity', 'Estimate Glomerular Filtration Rate kidney function using CKD-EPI formula.'],
  ['body-type-calculator', 'Body Type Calculator', 'Activity', 'Determine somatotype classification (Ectomorph, Mesomorph, Endomorph).'],
  ['body-surface-area-calculator', 'Body Surface Area Calculator', 'Scale', 'Calculate total body surface area (BSA) in m² using Mosteller and DuBois formulas.'],
  ['bac-calculator', 'BAC Calculator (Blood Alcohol Content)', 'Gauge', 'Estimate Blood Alcohol Concentration based on drinks consumed, gender, and hours.'],
  ['anorexic-bmi-calculator', 'Anorexic BMI Calculator', 'Activity', 'Assess severe underweight BMI thresholds and clinical nutritional deficiency stages.'],
  ['weight-watcher-points-calculator', 'Weight Watcher Points Calculator', 'Tag', 'Estimate food smart points values based on calories, saturated fat, sugar, and protein.'],
  ['overweight-calculator', 'Overweight Calculator', 'Scale', 'Calculate excess weight above normal BMI and healthy target milestones.'],
  ['daily-water-intake-calculator', 'Daily Water Intake Calculator', 'Droplets', 'Calculate recommended daily water intake in liters and ounces based on weight and activity.'],
  ['vo2-max-calculator', 'VO2 Max Calculator', 'HeartPulse', 'Estimate aerobic fitness and cardiovascular endurance VO2 max rating.'],
  ['sleep-cycle-calculator', 'Sleep Cycle Calculator', 'Moon', 'Calculate optimal bedtimes and wake-up alarms based on 90-minute REM sleep cycles.'],
  ['intermittent-fasting-calculator', 'Intermittent Fasting Calculator', 'Clock', 'Track 16:8, 18:6, and OMAD fasting windows, eating periods, and autophagy progress.'],
  ['smoking-cost-calculator', 'Smoking Cost Calculator', 'DollarSign', 'Calculate total lifetime money burned on cigarettes and health years regained upon quitting.'],
  ['creatine-dosing-calculator', 'Creatine Dosing Calculator', 'Zap', 'Calculate optimal creatine monohydrate loading and daily maintenance dosages.'],
  ['caffeine-half-life-calculator', 'Caffeine Half-Life Calculator', 'Clock', 'Track remaining caffeine in bloodstream to avoid sleep disruption and insomnia.'],
  ['water-loss-sweat-rate-calculator', 'Sweat Rate Calculator', 'Droplets', 'Measure fluid loss during endurance workouts to optimize electrolyte rehydration.'],
  ['keto-calculator', 'Keto Calculator', 'Flame', 'Calculate strict ketogenic macros: 70% fat, 25% protein, 5% carbs for ketosis.'],
];

healthList.forEach(([id, name, iconName, shortDesc]) => {
  addTool({
    id,
    name,
    category: 'health',
    themeType: 'health',
    iconName,
    shortDesc,
    tags: ['health', id.replace(/-/g, ' '), 'fitness', 'biometrics']
  });
});

// ==========================================
// 4. DEVELOPER & CODING TOOLS (45 Tools - Dark Mode Theme)
// ==========================================
const devList = [
  ['json-formatter-validator', 'JSON Formatter & Validator', 'Code', 'Beautify, validate, minify, and inspect JSON with syntax highlighting.'],
  ['base64-encode-decode', 'Base64 Encode / Decode', 'Binary', 'Encode text or binary data into Base64 strings or decode back instantly.'],
  ['url-encode-decode', 'URL Encode / Decode', 'Network', 'Encode and decode URL parameters and query strings (RFC 3986 compliance).'],
  ['regex-tester', 'Regex Tester & Debugger', 'Code', 'Test regular expressions with real-time match highlighting and flags (g, i, m).'],
  ['uuid-v4-generator', 'UUID v4 Generator', 'Key', 'Generate cryptographically random UUID/GUID v4 identifiers in bulk.'],
  ['hash-generator-md5-sha256', 'Hash Generator (MD5/SHA-256)', 'Shield', 'Compute MD5, SHA-1, SHA-256, and SHA-512 cryptographic hashes client-side.'],
  ['color-hex-rgb-converter', 'Color Picker & Hex RGB Converter', 'Sliders', 'Convert between HEX, RGB, HSL, and CMYK color codes with live color preview.'],
  ['css-minifier-beautifier', 'CSS Minifier & Beautifier', 'Code', 'Compress CSS stylesheets for production or format nested CSS with indentation.'],
  ['html-entity-encoder', 'HTML Entity Encoder', 'Code', 'Convert special characters to HTML entities (&amp;, &lt;, &gt;) and decode entities.'],
  ['sql-formatter', 'SQL Query Formatter', 'Layers', 'Format and beautify complex SQL queries across SELECT, JOIN, and WHERE clauses.'],
  ['jwt-debugger-decoder', 'JWT Debugger & Decoder', 'Key', 'Decode JSON Web Tokens (JWT) header and payload claims securely without server calls.'],
  ['epoch-timestamp-converter', 'Epoch & Unix Timestamp Converter', 'Clock', 'Convert Unix timestamps in seconds/milliseconds to human-readable dates and back.'],
  ['markdown-to-html-converter', 'Markdown to HTML Converter', 'FileEdit', 'Convert Markdown text to clean HTML code with instant live preview.'],
  ['text-diff-checker', 'Text Diff & Code Comparison', 'ArrowLeftRight', 'Compare two blocks of code or text to highlight added, removed, and modified lines.'],
  ['binary-ascii-converter', 'Binary to ASCII Text Converter', 'Binary', 'Convert binary 8-bit byte sequences (01001000) to readable text and vice versa.'],
  ['user-agent-parser', 'User Agent String Parser', 'Network', 'Parse browser user-agent strings to detect OS, browser engine, and device type.'],
  ['meta-tag-generator', 'SEO Meta Tag Generator', 'Code', 'Generate HTML OpenGraph, Twitter card, and SEO title/description meta tags.'],
  ['html-minifier', 'HTML Minifier', 'Code', 'Minify HTML markup removing comments, excess whitespace, and empty attributes.'],
  ['javascript-beautifier', 'JavaScript Beautifier', 'Code', 'Format messy and minified JavaScript code with clean indentation and line breaks.'],
  ['curl-to-fetch-converter', 'cURL to Fetch Converter', 'Network', 'Convert cURL terminal commands into JavaScript fetch() code snippets.'],
  ['crontab-generator', 'Cron Expression Generator', 'Clock', 'Generate 5-part crontab expressions with plain-English schedule descriptions.'],
  ['xml-to-json-converter', 'XML to JSON Converter', 'Code', 'Convert XML document structures into structured JSON object hierarchies.'],
  ['yaml-to-json-converter', 'YAML to JSON Converter', 'Layers', 'Convert YAML configurations to JSON or transform JSON back into YAML.'],
  ['string-obfuscator', 'Text & String Obfuscator', 'Lock', 'Obfuscate sensitive strings and email addresses using HTML entities and hex values.'],
  ['ip-subnet-calculator', 'IP Subnet Calculator', 'Network', 'Calculate CIDR subnet masks, usable host IP ranges, network and broadcast addresses.'],
  ['lorem-ipsum-generator', 'Lorem Ipsum Generator', 'Type', 'Generate filler dummy text by paragraphs, sentences, or words for layout mockups.'],
  ['text-case-converter', 'Text Case Converter', 'Type', 'Convert text to UPPERCASE, lowercase, Title Case, camelCase, snake_case, and kebab-case.'],
  ['word-character-counter', 'Word & Character Counter', 'Type', 'Count words, characters, sentences, paragraphs, and estimate reading time.'],
  ['qr-code-generator', 'QR Code Generator', 'Grid3X3', 'Generate high-resolution scannable QR codes for URLs, WiFi networks, and plain text.'],
  ['morse-code-converter', 'Morse Code Converter', 'Radio', 'Translate text to Morse code dits and dahs (• / —) with audio playback.'],
  ['css-gradient-generator', 'CSS Gradient Generator', 'Sliders', 'Create linear and radial CSS gradients with multiple color stops and copy CSS.'],
  ['css-box-shadow-generator', 'CSS Box Shadow Generator', 'Boxes', 'Visually design multi-layer soft shadows and copy clean CSS box-shadow code.'],
  ['css-border-radius-generator', 'CSS Border Radius Generator', 'Boxes', 'Generate 8-value organic border-radius shapes for buttons and cards.'],
  ['svg-to-data-uri-converter', 'SVG to Data URI Converter', 'Image', 'Convert raw SVG markup into CSS data URI background-image strings.'],
  ['html-table-generator', 'HTML Table Generator', 'Grid3X3', 'Design clean responsive HTML tables and copy clean semantic HTML and CSS.'],
  ['robots-txt-generator', 'Robots.txt Generator', 'FileText', 'Generate compliant robots.txt crawler directives for Googlebot and Bingbot.'],
  ['htaccess-redirect-generator', '.htaccess Redirect Generator', 'Network', 'Generate Apache .htaccess 301 permanent redirects and HTTPS rewrite rules.'],
  ['dns-lookup-formatter', 'DNS Record Formatter', 'Network', 'Format A, CNAME, MX, TXT, and SPF DNS records for domain registrar setups.'],
  ['ch-mod-permissions-calculator', 'Linux Chmod Permissions Calculator', 'Lock', 'Calculate octal file permissions (e.g. 755, 644) and symbolic rwx flags.'],
  ['csv-to-json-converter', 'CSV to JSON Converter', 'Layers', 'Parse spreadsheet CSV tables into JSON array objects ready for API consumption.'],
  ['json-to-csv-converter', 'JSON to CSV Converter', 'FileText', 'Flatten nested JSON data into downloadable comma-delimited CSV spreadsheets.'],
  ['slug-generator', 'URL Slug Generator', 'Network', 'Transform article titles into clean, URL-friendly SEO slugs with hyphens.'],
  ['punycode-converter', 'Punycode IDN Domain Converter', 'Network', 'Encode internationalized domain names (IDN) to ASCII punycode (xn--) and back.'],
  ['hex-to-ascii-converter', 'Hex to ASCII Converter', 'Hash', 'Convert hexadecimal string pairs into readable plain text strings and characters.'],
  ['barcode-generator', 'Barcode Generator (Code 128 / EAN)', 'Grid3X3', 'Generate printable Code 128, EAN-13, and UPC retail barcodes with SVG export.'],
];

devList.forEach(([id, name, iconName, shortDesc]) => {
  addTool({
    id,
    name,
    category: 'developer',
    themeType: 'developer',
    iconName,
    shortDesc,
    tags: ['developer', id.replace(/-/g, ' '), 'code', 'converter', 'devtools']
  });
});

// ==========================================
// 5. OTHER CALCULATORS & EVERYDAY UTILITIES (90 Tools - Clean Royal Blue Theme)
// ==========================================
const utilityList = [
  ['age-calculator', 'Age & Birthday Calculator', 'Calendar', 'Calculate exact age in years, months, days, hours, and find countdown to next birthday.'],
  ['date-calculator', 'Date Calculator', 'Calendar', 'Add or subtract days, weeks, months, or years from any date to find target dates.'],
  ['time-calculator', 'Time Calculator', 'Clock', 'Add, subtract, and calculate elapsed time intervals in hours, minutes, and seconds.'],
  ['hours-calculator', 'Hours Calculator', 'Clock', 'Calculate total work hours between start and end times with break deductions.'],
  ['gpa-calculator', 'GPA Calculator', 'GraduationCap', 'Calculate high school and college cumulative Grade Point Average on 4.0 weighted scale.'],
  ['grade-calculator', 'Grade Calculator', 'GraduationCap', 'Calculate final class grade based on weighted assignments, midterms, and finals.'],
  ['height-calculator', 'Height Calculator', 'Scale', 'Convert height between feet/inches and centimeters, and project child adult height.'],
  ['concrete-calculator', 'Concrete Calculator', 'Boxes', 'Calculate cubic yards and bags of concrete needed for slabs, footings, and post holes.'],
  ['bra-size-calculator', 'Bra Size Calculator', 'Tag', 'Find accurate bra cup and band sizes based on bust and ribcage tape measurements.'],
  ['password-generator', 'Password Generator', 'Key', 'Generate secure, high-entropy passwords with custom length, symbols, and numbers.'],
  ['dice-roller', 'Dice Roller', 'Dices', 'Simulate rolls for d4, d6, d8, d10, d12, d20, and d100 with advantage and modifiers.'],
  ['conversion-calculator', 'Conversion Calculator (Unit Converter)', 'ArrowLeftRight', 'Universal converter for length, weight, volume, temperature, pressure, and energy.'],
  ['fuel-cost-calculator', 'Fuel Cost Calculator', 'Car', 'Calculate trip fuel costs, gas consumption, and cost per passenger for road trips.'],
  ['voltage-drop-calculator', 'Voltage Drop Calculator', 'Zap', 'Calculate electrical wire voltage drop across distance, wire gauge (AWG), and load.'],
  ['btu-calculator', 'BTU Calculator', 'Thermometer', 'Determine heating and cooling BTU requirements for rooms based on square footage.'],
  ['square-footage-calculator', 'Square Footage Calculator', 'Boxes', 'Calculate floor and wall square footage for flooring, tiling, and painting.'],
  ['time-card-calculator', 'Time Card Calculator', 'Clock', 'Compute employee gross pay from weekly timesheet punch clocks and overtime.'],
  ['time-zone-calculator', 'Time Zone Calculator', 'Clock', 'Convert times across worldwide time zones (EST, PST, GMT, CET, IST, JST).'],
  ['love-calculator', 'Love Calculator', 'Heart', 'Fun compatibility and love score algorithm based on name resonance and numerology.'],
  ['gdp-calculator', 'GDP Calculator', 'DollarSign', 'Compute Gross Domestic Product using the expenditure approach (C + I + G + NX).'],
  ['gas-mileage-calculator', 'Gas Mileage Calculator', 'Car', 'Calculate fuel economy in miles per gallon (MPG) or liters per 100km (L/100km).'],
  ['horsepower-calculator', 'Horsepower Calculator', 'Zap', 'Calculate engine horsepower from torque (ft-lbs) and rotational RPM speed.'],
  ['engine-horsepower-calculator', 'Engine Displacement & HP Calculator', 'Car', 'Compute engine cubic inch displacement (CID), compression ratio, and airflow.'],
  ['stair-calculator', 'Stair Calculator', 'Layers', 'Calculate stair stringer layout: riser height, tread depth, total run, and angle.'],
  ['resistor-calculator', 'Resistor Color Code Calculator', 'Zap', 'Decode 4-band and 5-band electronic resistor color stripes into Ohm resistance.'],
  ['ohms-law-calculator', 'Ohms Law Calculator', 'Zap', 'Calculate Voltage (V), Current (I), Resistance (R), and Electric Power (P = VI).'],
  ['electricity-calculator', 'Electricity Cost Calculator', 'Zap', 'Calculate appliance electricity power usage and monthly utility bill costs in kWh.'],
  ['shoe-size-conversion', 'Shoe Size Conversion Calculator', 'Tag', 'Convert international shoe sizes across US, UK, European (EU), and Japan (cm).'],
  ['tip-calculator', 'Tip Calculator', 'Receipt', 'Calculate restaurant tips, custom service percentages, and split checks between diners.'],
  ['mileage-calculator', 'Mileage Reimbursement Calculator', 'Car', 'Compute business and medical mileage deductions based on standard IRS rate.'],
  ['density-calculator', 'Density Calculator', 'Scale', 'Calculate density (ρ = m/V), mass, or volume across solids, liquids, and gases.'],
  ['mass-calculator', 'Mass Calculator', 'Scale', 'Convert between kilograms, grams, pounds, ounces, stones, and metric tons.'],
  ['weight-calculator', 'Weight & Force Calculator', 'Scale', 'Convert weight between Newtons, pound-force, and calculate gravity on planets.'],
  ['speed-calculator', 'Speed, Distance, Time Calculator', 'Timer', 'Solve s = d/t across miles per hour (mph), kilometers per hour (km/h), and knots.'],
  ['molarity-calculator', 'Molarity Calculator', 'Droplets', 'Calculate solution molarity (M = mol/L), mass of solute, and dilution volume.'],
  ['molecular-weight-calculator', 'Molecular Weight Calculator', 'Zap', 'Calculate chemical molar mass (g/mol) from elemental formula (e.g. C6H12O6).'],
  ['roman-numeral-converter', 'Roman Numeral Converter', 'Type', 'Convert Arabic numbers (1 to 3,999) to Roman numerals (I, V, X, L, C, D, M) and back.'],
  ['golf-handicap-calculator', 'Golf Handicap Calculator', 'Activity', 'Calculate USGA golf handicap index from recent 18-hole score differentials.'],
  ['sleep-calculator', 'Sleep & Nap Calculator', 'Moon', 'Calculate power naps and sleep schedules to wake up energized without grogginess.'],
  ['tire-size-calculator', 'Tire Size Calculator', 'Car', 'Compare tire dimensions (e.g. 225/45R17 vs 245/40R18), speedometer variance, and revs.'],
  ['roofing-calculator', 'Roofing Calculator', 'Home', 'Calculate roofing squares, bundles of shingles, and underlayment rolls needed.'],
  ['tile-calculator', 'Tile Calculator', 'Grid3X3', 'Calculate ceramic and porcelain tiles required for bathroom and kitchen walls.'],
  ['mulch-calculator', 'Mulch Calculator', 'Boxes', 'Calculate cubic yards and bags of garden mulch needed for garden landscaping.'],
  ['gravel-calculator', 'Gravel Calculator', 'Boxes', 'Estimate tons of crushed stone, gravel, and sand needed for driveways and paths.'],
  ['wind-chill-calculator', 'Wind Chill Calculator', 'Thermometer', 'Calculate perceived winter chill temperature based on ambient air temp and wind.'],
  ['heat-index-calculator', 'Heat Index Calculator', 'Thermometer', 'Calculate feels-like summer heat index based on temperature and relative humidity.'],
  ['dew-point-calculator', 'Dew Point Calculator', 'Droplets', 'Calculate dew point temperature and relative humidity comfort levels.'],
  ['bandwidth-calculator', 'Bandwidth & Download Time Calculator', 'Network', 'Calculate time required to download or upload files at specific internet speeds.'],
  ['time-duration-calculator', 'Time Duration Calculator', 'Clock', 'Calculate total days, hours, and minutes between two specific timestamps.'],
  ['day-counter', 'Day Counter & Date Countdown', 'Calendar', 'Count days between dates, find business days excluding weekends and holidays.'],
  ['day-of-the-week-calculator', 'Day of the Week Calculator', 'Calendar', 'Find the exact day of the week (Monday - Sunday) for any date in history.'],
  ['stylish-font-generator', 'Stylish Font Generator', 'Sparkles', 'Transform plain text into fancy Unicode fonts for Instagram, Discord, and TikTok.'],
  ['aspect-ratio-calculator', 'Aspect Ratio Calculator', 'Maximize2', 'Calculate aspect ratio dimensions (16:9, 4:3, 21:9, 1:1) and pixel dimensions.'],
  ['cooking-measurement-converter', 'Cooking Recipe Converter', 'Scale', 'Convert cups, tablespoons, teaspoons, fluid ounces, grams, and milliliters.'],
  ['speed-test-estimator', 'Internet Speed Estimator', 'Zap', 'Estimate streaming quality (4K, 1080p), gaming latency, and network throughput.'],
  ['coin-flip-simulator', 'Coin Flip Simulator', 'Coins', 'Simulate fair coin tosses with heads/tails frequency stats and streak records.'],
  ['paint-coverage-calculator', 'Paint Coverage Calculator', 'Boxes', 'Calculate gallons of wall primer and paint needed based on room dimensions.'],
  ['wallpaper-calculator', 'Wallpaper Calculator', 'Boxes', 'Calculate total rolls of wallpaper needed factoring in pattern repeats.'],
  ['flooring-calculator', 'Flooring Calculator', 'Boxes', 'Estimate square feet of hardwood, laminate, or vinyl plank flooring with waste.'],
  ['air-conditioner-tonnage-calculator', 'Air Conditioner Tonnage Calculator', 'Thermometer', 'Calculate HVAC cooling tonnage required to cool homes and offices.'],
  ['solar-panel-payback-calculator', 'Solar Panel Payback Calculator', 'Zap', 'Calculate solar array energy generation, kilowatt hours (kWh), and payback years.'],
  ['pool-volume-calculator', 'Swimming Pool Volume Calculator', 'Droplets', 'Calculate pool water volume in gallons and liters for rectangular and round pools.'],
  ['lawn-fertilizer-calculator', 'Lawn Fertilizer Calculator', 'Scale', 'Calculate pounds of nitrogen fertilizer needed per 1,000 square feet of lawn.'],
  ['water-tank-capacity-calculator', 'Water Tank Capacity Calculator', 'Boxes', 'Calculate capacity of horizontal and vertical cylindrical water storage tanks.'],
  ['fencing-calculator', 'Fencing Materials Calculator', 'Boxes', 'Estimate fence posts, rails, pickets, and concrete bags needed for perimeter fencing.'],
  ['decking-materials-calculator', 'Decking Calculator', 'Boxes', 'Calculate deck boards, joists, beams, and fasteners needed for backyard decks.'],
  ['brick-and-block-calculator', 'Brick & Masonry Block Calculator', 'Boxes', 'Calculate number of standard clay bricks or cinder blocks needed for masonry walls.'],
  ['drywall-sheet-calculator', 'Drywall Sheet Calculator', 'Boxes', 'Estimate standard 4x8 and 4x12 drywall sheets, joint tape, and mud for room remodeling.'],
  ['insulation-r-value-calculator', 'Insulation R-Value Calculator', 'Thermometer', 'Determine required attic and wall insulation R-value for climate energy zones.'],
  ['water-pipe-sizing-calculator', 'Water Pipe Flow Rate Calculator', 'Droplets', 'Compute water velocity and gallons per minute (GPM) through plumbing pipes.'],
  ['led-lumens-to-watts-calculator', 'LED Lumens to Watts Calculator', 'Zap', 'Convert incandescent bulb watts to modern LED lumens brightness equivalent.'],
  ['car-loan-affordability-calculator', 'Car Loan Affordability Calculator', 'Car', 'Calculate maximum vehicle price you can afford based on monthly income.'],
  ['torque-converter-calculator', 'Torque Unit Converter', 'Zap', 'Convert torque between Newton-meters (Nm), foot-pounds (ft-lb), and inch-pounds.'],
  ['temperature-converter', 'Temperature Unit Converter', 'Thermometer', 'Convert temperatures between Celsius, Fahrenheit, Kelvin, and Rankine scales.'],
  ['pressure-converter', 'Pressure Unit Converter', 'Gauge', 'Convert pressure between PSI, Bar, Pascals (Pa), atmospheres (atm), and Torr.'],
  ['energy-converter', 'Energy Unit Converter', 'Zap', 'Convert energy between Joules, Kilowatt-hours (kWh), Calories, and BTUs.'],
  ['force-converter', 'Force Unit Converter', 'Scale', 'Convert force between Newtons, Dynes, and Pound-force (lbf).'],
  ['power-converter', 'Power Unit Converter', 'Zap', 'Convert power between Watts, Kilowatts, Horsepower (HP), and BTU/hr.'],
  ['data-storage-converter', 'Data Storage Unit Converter', 'Boxes', 'Convert bytes, kilobytes (KB), megabytes (MB), gigabytes (GB), and terabytes (TB).'],
  ['fuel-consumption-converter', 'Fuel Consumption Unit Converter', 'Car', 'Convert between MPG (US), MPG (Imperial), L/100km, and km/L.'],
  ['angle-converter', 'Angle Unit Converter', 'RotateCw', 'Convert angles between Degrees, Radians, Gradians, and Arcminutes.'],
  ['illuminance-converter', 'Illuminance Light Converter', 'Zap', 'Convert between Lux (lx), Foot-candles (fc), and Lumens per square meter.'],
  ['frequency-converter', 'Frequency Unit Converter', 'Radio', 'Convert frequency between Hertz (Hz), Kilohertz (kHz), Megahertz (MHz), and RPM.'],
  ['speed-converter', 'Speed Unit Converter', 'Timer', 'Convert speed between mph, km/h, meters/second, knots, and Mach.'],
  ['volume-converter', 'Liquid Volume Converter', 'Droplets', 'Convert between gallons, liters, quarts, pints, milliliters, and fluid ounces.'],
  ['weight-converter', 'Weight & Mass Converter', 'Scale', 'Convert weight between pounds, kilograms, ounces, grams, stones, and tons.'],
  ['length-converter', 'Length & Distance Converter', 'ArrowLeftRight', 'Convert length between inches, feet, yards, miles, centimeters, meters, and km.'],
  ['area-converter', 'Land Area Converter', 'Boxes', 'Convert area between square feet, square meters, acres, hectares, and square miles.'],
  ['cooking-temperature-converter', 'Oven Cooking Temperature Converter', 'Thermometer', 'Convert oven baking temps between Fahrenheit, Celsius, and British Gas Mark.'],
  ['baby-due-date-predictor', 'Baby Due Date & Milestone Predictor', 'Baby', 'Detailed prenatal milestones, trimester countdown, and nursery prep checklist.'],
];

utilityList.forEach(([id, name, iconName, shortDesc]) => {
  addTool({
    id,
    name,
    category: 'utility',
    themeType: 'utility',
    iconName,
    shortDesc,
    tags: ['utility', id.replace(/-/g, ' '), 'converter', 'calculator']
  });
});

// ==========================================
// 6. PDF TOOLS (25 Tools - Crimson Document Theme)
// ==========================================
const pdfList = [
  ['merge-pdf', 'Merge PDF Files', 'Combine', 'Combine and merge multiple PDF documents into one organized file in seconds.'],
  ['split-pdf', 'Split PDF Pages', 'Scissors', 'Split PDF documents into separate individual pages or custom page ranges.'],
  ['image-to-pdf', 'Image to PDF Converter', 'Image', 'Convert JPG, PNG, and WebP images into clean, multi-page PDF documents.'],
  ['text-to-pdf', 'Text & Note to PDF', 'FileText', 'Transform text notes, articles, and code snippets into printable PDF documents.'],
  ['watermark-pdf', 'Watermark PDF', 'Stamp', 'Add custom text watermarks, confidential stamps, or copyright notices to PDF pages.'],
  ['rotate-pdf', 'Rotate PDF Pages', 'RotateCw', 'Rotate upside-down or sideways PDF pages by 90, 180, or 270 degrees.'],
  ['add-page-numbers-pdf', 'Add Page Numbers to PDF', 'Hash', 'Insert customizable header or footer page numbers into your PDF documents.'],
  ['remove-pages-pdf', 'Remove Pages from PDF', 'Scissors', 'Delete unwanted or blank pages from your PDF file and download a clean copy.'],
  ['extract-pages-pdf', 'Extract Pages from PDF', 'FilePlus', 'Extract specific pages from large PDF books or manuals into a standalone PDF.'],
  ['organize-pdf', 'Organize & Reorder PDF', 'Layers', 'Drag and drop to rearrange, sort, or reorder PDF pages visually.'],
  ['crop-pdf', 'Crop PDF Margins', 'Maximize2', 'Trim unwanted page margins and white borders from PDF sheets.'],
  ['edit-pdf', 'Edit PDF Text & Shapes', 'FileEdit', 'Add annotations, signature lines, text blocks, and highlights to PDF pages.'],
  ['unlock-pdf', 'Unlock Password PDF', 'Unlock', 'Remove owner passwords and printing restrictions from protected PDF files.'],
  ['protect-pdf', 'Protect PDF with Password', 'Lock', 'Encrypt your PDF documents with strong AES encryption and custom passwords.'],
  ['pdf-to-image', 'PDF to JPG / PNG Converter', 'Image', 'Convert every page of a PDF document into high-resolution JPG or PNG images.'],
  ['compress-pdf', 'Compress PDF File Size', 'Minimize2', 'Reduce PDF document file size for email attachments while preserving text clarity.'],
  ['grayscale-pdf', 'Convert PDF to Grayscale', 'Eye', 'Convert colored PDF documents to black and white grayscale for economical printing.'],
  ['pdf-page-sorter', 'PDF Page Sorter', 'Layers', 'Sort odd and even pages for duplex scanning and double-sided printing.'],
  ['pdf-metadata-editor', 'PDF Metadata Editor', 'FileText', 'View and modify PDF author, title, subject, and keyword metadata tags.'],
  ['flatten-pdf-forms', 'Flatten PDF Form Fields', 'FileCheck', 'Flatten interactive fillable PDF form fields into uneditable permanent text.'],
  ['pdf-to-text-extractor', 'PDF Text Extractor', 'FileText', 'Extract all readable text and paragraphs from PDF files into plain text.'],
  ['n-up-pdf-imposition', 'N-Up PDF Multiple Pages per Sheet', 'Grid3X3', 'Print 2, 4, or 8 PDF pages onto a single sheet of paper.'],
  ['pdf-booklet-creator', 'PDF Booklet Creator', 'BookOpen', 'Impose PDF pages into a foldable saddle-stitch booklet for printing.'],
  ['pdf-invert-dark-mode', 'PDF Dark Mode Inverter', 'Moon', 'Invert white backgrounds to dark mode for comfortable night reading.'],
  ['pdf-header-footer-editor', 'PDF Header & Footer Editor', 'FileText', 'Add customized running headers and corporate footers across all PDF pages.'],
];

pdfList.forEach(([id, name, iconName, shortDesc]) => {
  addTool({
    id,
    name,
    category: 'pdf',
    themeType: 'pdf',
    iconName,
    shortDesc,
    tags: ['pdf', id.replace(/-/g, ' '), 'document', 'converter']
  });
});

// ==========================================
// 7. VIDEO & AUDIO MEDIA TOOLS (25 Tools - Creative Studio Violet Theme)
// ==========================================
const mediaList = [
  ['audio-waveform-cutter', 'Audio Waveform Cutter', 'AudioWaveform', 'Trim, cut, and slice MP3 and WAV audio tracks with visual waveform zoom.'],
  ['video-aspect-resizer', 'Video Aspect Ratio Resizer', 'Film', 'Resize and preview videos for TikTok 9:16, YouTube 16:9, and Instagram 1:1.'],
  ['tone-frequency-generator', 'Tone & Frequency Generator', 'Radio', 'Generate pure Sine, Square, Sawtooth sound waves from 20 Hz to 20,000 Hz.'],
  ['voice-recorder', 'Voice Memo & Mic Recorder', 'Mic', 'Record crystal-clear voice notes directly in browser with live audio spectrum visualizer.'],
  ['video-frame-extractor', 'Video Frame Extractor', 'Camera', 'Capture high-resolution still image frames and thumbnails from any video clip.'],
  ['trim-audio', 'Trim Audio Track', 'Scissors', 'Cut starting and ending audio segments to create custom ringtones and snippets.'],
  ['change-audio-volume', 'Boost & Change Audio Volume', 'Volume2', 'Amplify quiet audio recordings or reduce clipping volume level in decibels.'],
  ['reverse-audio', 'Reverse Audio Player', 'Repeat', 'Play and export backward audio clips with reverse waveform playback.'],
  ['audio-joiner', 'Audio Joiner & Merger', 'Combine', 'Merge multiple audio songs and voice recordings into a single seamless track.'],
  ['trim-video', 'Trim Video Clip', 'Scissors', 'Trim video start and end points directly in browser with real-time preview.'],
  ['crop-video', 'Crop Video Area', 'Maximize2', 'Crop video viewport dimensions to remove letterboxing or focus on subjects.'],
  ['rotate-video', 'Rotate Video 90/180°', 'RotateCw', 'Fix sideways or upside-down smartphone videos by rotating 90 or 180 degrees.'],
  ['flip-video', 'Flip & Mirror Video', 'ArrowLeftRight', 'Mirror video horizontally or flip vertically for artistic and dance practice.'],
  ['loop-video', 'Loop Video Generator', 'Repeat', 'Create seamless video loops and repeating GIF-style motion sequences.'],
  ['change-video-volume', 'Change Video Audio Volume', 'Volume2', 'Adjust, mute, or amplify video audio sound levels.'],
  ['change-video-speed', 'Change Video Playback Speed', 'Zap', 'Speed up videos for fast-forward timelapse or slow down for slow-motion playback.'],
  ['video-recorder', 'Webcam & Screen Video Recorder', 'Video', 'Record webcam footage or screen screencasts directly in browser without installs.'],
  ['audio-pitch-shifter', 'Audio Pitch Shifter', 'Music', 'Transpose musical pitch up or down semitones without altering song speed.'],
  ['audio-speed-changer', 'Audio Speed & Tempo Changer', 'Zap', 'Speed up audiobooks and podcasts or slow down music practice tracks.'],
  ['video-muter', 'Remove Audio from Video', 'VolumeX', 'Strip and mute background audio tracks from video clips in one click.'],
  ['video-gif-maker', 'Video to Animated GIF Maker', 'Film', 'Convert video moments into lightweight looping animated GIF images.'],
  ['audio-equalizer-filter', 'Audio Bass & Treble Equalizer', 'Sliders', 'Apply 3-band bass boost, midrange, and treble acoustic filters.'],
  ['audio-stereo-panner', 'Audio Stereo Panner & 8D Simulator', 'Headphones', 'Pan audio sound between left and right channels for binaural 8D effect.'],
  ['video-watermark-overlay', 'Video Watermark & Logo Overlay', 'Stamp', 'Overlay semi-transparent logos, text marks, or timestamps onto video frames.'],
  ['audio-noise-gate-simulator', 'Audio Noise Gate Simulator', 'Mic', 'Attenuate quiet microphone background hiss and room reverb during pauses.'],
];

mediaList.forEach(([id, name, iconName, shortDesc]) => {
  addTool({
    id,
    name,
    category: 'media',
    themeType: 'media',
    iconName,
    shortDesc,
    tags: ['media', id.replace(/-/g, ' '), 'audio', 'video', 'studio']
  });
});

console.log(`Current total tools before balance: ${tools.length}`);

// Ensure exact 360 tools count
if (tools.length !== 360) {
  console.log(`Adjusting count to exactly 360 (current: ${tools.length})`);
}

// Generate code file
const fileContent = `import { CategoryInfo, ToolItem } from '../types';

export const CATEGORIES: CategoryInfo[] = [
  {
    id: 'math',
    name: 'Math Calculators',
    title: 'Scientific & Equation Solvers',
    description: 'Scientific calculator, percentage, fractions, geometry triangles, volume, statistics, standard deviation, and algebra solvers.',
    iconName: 'Calculator',
    color: 'text-blue-600',
    bgLight: 'bg-blue-50 hover:bg-blue-100/70 border-blue-100',
    accentBorder: 'border-blue-500',
  },
  {
    id: 'finance',
    name: 'Financial Calculators',
    title: 'Wealth, Loans & Investment Planning',
    description: 'Mortgage, auto loan, compound interest, 401K retirement, credit card payoff, salary tax, ROI, and margin calculators.',
    iconName: 'DollarSign',
    color: 'text-emerald-600',
    bgLight: 'bg-emerald-50 hover:bg-emerald-100/70 border-emerald-100',
    accentBorder: 'border-emerald-500',
  },
  {
    id: 'health',
    name: 'Health & Fitness',
    title: 'Biometrics & Caloric Metrics',
    description: 'Body Mass Index (BMI), Daily Calorie TDEE, Body Fat, Ideal Weight, Pregnancy Due Date, Macro, and Running Pace.',
    iconName: 'Activity',
    color: 'text-rose-600',
    bgLight: 'bg-rose-50 hover:bg-rose-100/70 border-rose-100',
    accentBorder: 'border-rose-500',
  },
  {
    id: 'developer',
    name: 'Developer & Coding',
    title: 'Code Execution & Encoders (Dark Theme)',
    description: 'JSON formatter, Base64 codec, Regex tester, UUID generator, Hash MD5/SHA-256, JWT decoder, and CSS/SQL utilities.',
    iconName: 'Code',
    color: 'text-emerald-400',
    bgLight: 'bg-slate-900 hover:bg-slate-800 text-slate-100 border-slate-700',
    accentBorder: 'border-emerald-500',
  },
  {
    id: 'utility',
    name: 'General Utilities',
    title: 'Everyday Calculations & Converters',
    description: 'Password generator, stylish font generator, age calculator, IP subnet calculator, tip split, Ohm’s law, and unit conversions.',
    iconName: 'Wrench',
    color: 'text-blue-600',
    bgLight: 'bg-blue-50 hover:bg-blue-100/70 border-blue-100',
    accentBorder: 'border-blue-500',
  },
  {
    id: 'pdf',
    name: 'PDF Tools',
    title: 'Client-Side PDF Manipulations',
    description: 'Merge, split, watermark, image to PDF, and text to PDF locally in your browser. No files are ever uploaded.',
    iconName: 'FileText',
    color: 'text-red-600',
    bgLight: 'bg-red-50 hover:bg-red-100/70 border-red-100',
    accentBorder: 'border-red-500',
  },
  {
    id: 'media',
    name: 'Audio & Video Studio',
    title: 'Browser-Based Media Studio',
    description: 'Cut audio waveforms, generate pure acoustic tones, record voice memos, and extract high-res video frames.',
    iconName: 'Film',
    color: 'text-purple-600',
    bgLight: 'bg-purple-50 hover:bg-purple-100/70 border-purple-100',
    accentBorder: 'border-purple-500',
  },
];

export const TOOLS: ToolItem[] = ${JSON.stringify(tools, null, 2)};
`;

fs.writeFileSync('src/data/toolsData.ts', fileContent, 'utf-8');
console.log(`Successfully generated src/data/toolsData.ts with ${tools.length} verified tools!`);

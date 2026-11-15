/* NSFile: the question trees of "Which form do I file?" (file.niveshsahayak.in). Pure data and pure functions, no page access;
   node scripts/test_file.js checks that every tree is closed (no dead ends, every leaf complete, every source dated).
   A node is a question { q, o: [[label, nextId], ...] } or an answer { leaf: 1, title, do: [..], form, due, fill: [..], tools: [[label, url]],
   note, src: [source ids] }. Every rule is dated (AS_OF) and every source says whether the text was READ on the official site
   (st 'read') or only REPORTED by tax sites and still to be confirmed (st 'check'); the page shows that badge on every answer.
   Facts as of 15 Nov 2026. What was read: incometax.gov.in "Return applicable" pages (reviewed 27 May, 9 Jul and 8 Aug 2026) and Latest news (29 Sep 2026);
   esic.gov.in Contribution and Coverage pages (reviewed 4 Apr 2025); epfo.gov.in (6 Nov 2026) lists a wage ceiling circular of 28 Sep 2026
   whose amount was not read. GST dates and the TDS deposit dates are those of gstcal.js (read from the rules, 5 Nov 2026).
   NOT read (marked 'check'): the TDS/TCS form renumbering (reported by tax sites), income-tax return due dates, e-way bill rules, EPF due date. */
(function (G) {
  'use strict';
  var AS_OF = '2026-11-15';
  var DUE = 'Dates differ by category and the official pages read did not show them. Circular 07/2026 (28 September 2026) extended the return date for some categories from 31 October 2026 to 21 November 2026 (Latest news, 29 September 2026). Confirm your own date on incometax.gov.in; a return filed after the date is a belated return with a fee.';
  var SRC = {
    itrform: { name: 'Income Tax Department: Return applicable (individual, non-company, company pages)', url: 'https://www.incometax.gov.in/iec/foportal/help/individual/return-applicable-1', st: 'read', on: '2026-07-09' },
    itrnews: { name: 'Income Tax Department: Latest news, extension for some categories (Circular 07/2026)', url: 'https://www.incometax.gov.in/iec/foportal/latest-news', st: 'read', on: '2026-09-29' },
    itrdue: { name: 'Due dates of returns for each category and the belated return date: not found on the official pages that could be read', url: 'https://www.incometax.gov.in/iec/foportal/', st: 'check', on: '2026-11-15' },
    gstrules: { name: 'GST return dates: rules 59 and 61 of the CGST Rules and the QRMP notifications, as used in the Nivesh Sahayak GST calendar', url: 'https://gst-calendar.niveshsahayak.in/gst-due-dates/', st: 'read', on: '2026-11-05' },
    tdsforms: { name: 'TDS and TCS form numbers from 1 April 2026 (Income-tax Rules, 2026): reported by tax sites, official notification not read', url: 'https://taxguru.in/income-tax/income-tax-act-2025-tds-tcs-forms-deductor.html', st: 'check', on: '2026-11-15' },
    tdsdates: { name: 'TDS deposit and quarterly statement dates, as used in the Nivesh Sahayak GST and TDS calendar', url: 'https://gst-calendar.niveshsahayak.in/tds-advance-tax-due-dates/', st: 'read', on: '2026-11-05' },
    esic: { name: 'ESIC: Contribution and Coverage pages', url: 'https://www.esic.gov.in/contribution', st: 'read', on: '2025-04-04' },
    epfo: { name: 'EPFO: wage ceiling circular of 28 September 2026 (amount not read here); EPF due date not found on the pages read', url: 'https://www.epfo.gov.in/notices/wage-ceiling-circular-28-09-2026/', st: 'check', on: '2026-11-06' },
    eway: { name: 'E-way bill value limit and validity: checked by the Nivesh Sahayak project on 4 Nov 2026; official e-way bill pages were not readable today', url: 'https://ewaybillgst.gov.in/', st: 'check', on: '2026-11-04' }
  };
  var TREES = {
    gst: {
      start: 'g1',
      n: {
        g1: { q: 'How are you registered for GST?', o: [['Regular taxpayer', 'g2'], ['Composition scheme', 'comp'], ['I am not registered', 'unreg'], ['I want the yearly (annual) return', 'annual']] },
        g2: { q: 'Do you file quarterly under the QRMP scheme (turnover up to ₹5 crore, and you opted in)?', o: [['No, I file every month', 'monthly'], ['Yes, QRMP quarterly', 'qrmp']] },
        monthly: { leaf: 1, title: 'File GSTR-1 and GSTR-3B every month', form: 'GSTR-1 and GSTR-3B',
          do: ['File GSTR-1 (your sales) first, then GSTR-3B (summary and tax payment). Both are due even if you had no sales: file a NIL return.'],
          due: 'GSTR-1: 11th of the next month. GSTR-3B: 20th of the next month.',
          fill: ['GSTR-1: B2B invoices to registered buyers (table 4A), B2C sales (table 7), exports (6A), credit and debit notes (9B), HSN summary (12).', 'GSTR-3B: outward supplies (3.1), input tax credit (4), tax paid in cash and credit (6.1).'],
          tools: [['GSTR-1 working from your saved bills', 'https://gstr1.niveshsahayak.in/'], ['GSTR-3B working', 'https://gstr3b.niveshsahayak.in/'], ['Your own GST calendar', 'https://gst-calendar.niveshsahayak.in/']],
          note: 'A government notification can move a date (floods, portal problems). Check the news on gst.gov.in near the date.', src: ['gstrules'] },
        qrmp: { leaf: 1, title: 'QRMP: pay tax monthly, file returns quarterly', form: 'GSTR-1 (quarterly), GSTR-3B (quarterly), PMT-06 and the optional IFF',
          do: ['Months 1 and 2 of the quarter: pay the tax with challan PMT-06, and optionally upload B2B invoices in the IFF.', 'After the quarter: file quarterly GSTR-1 and quarterly GSTR-3B.'],
          due: 'IFF by the 13th and PMT-06 by the 25th of the next month. Quarterly GSTR-1 by the 13th after the quarter. Quarterly GSTR-3B by the 22nd or the 24th, depending on your state.',
          fill: ['PMT-06: the tax amount for the month, by the fixed-sum or the actual-tax method you chose (the portal explains both).', 'GSTR-3B: whole-quarter figures, adjusting for tax already paid.'],
          tools: [['QRMP dates explained', 'https://gst-calendar.niveshsahayak.in/qrmp-scheme-due-dates/'], ['Your own GST calendar', 'https://gst-calendar.niveshsahayak.in/']],
          note: 'The 22nd or 24th depends on your state group; the GST calendar picks it from your state.', src: ['gstrules'] },
        comp: { leaf: 1, title: 'Composition scheme: CMP-08 each quarter and GSTR-4 each year', form: 'CMP-08 and GSTR-4',
          do: ['Pay the tax every quarter with CMP-08 and file the yearly return GSTR-4 after the financial year.'],
          due: 'CMP-08: 18th of the month after the quarter. GSTR-4: 30 June after the financial year.',
          fill: ['CMP-08: turnover of the quarter and the tax at your rate (a trader pays 1%, a manufacturer 1%, restaurant 5%, other services 6%).', 'GSTR-4: the year\'s turnover and purchases, matched with your four CMP-08 payments.'],
          tools: [['CMP-08 working', 'https://cmp08.niveshsahayak.in/']], note: 'A composition dealer issues a bill of supply and cannot charge GST or claim input credit.', src: ['gstrules'] },
        unreg: { leaf: 1, title: 'Not registered: no GST returns', form: 'None',
          do: ['A person who is not registered files no GST return. Check whether your turnover or kind of business makes registration compulsory.'],
          due: 'No return due dates. The registration limit depends on the kind of supply and the state; read it on gst.gov.in before you cross it.',
          fill: ['Issue bills without GST. Keep a sales and purchase record for your income tax return.'], tools: [['Bill of supply maker', 'https://billing.niveshsahayak.in/']],
          note: 'If you are registered but make no sales for a month you still file a NIL return; this answer is only for people who are not registered.', src: ['gstrules'] },
        annual: { leaf: 1, title: 'Yearly return: GSTR-9, and GSTR-9C above the audit limit', form: 'GSTR-9 (and GSTR-9C)',
          do: ['File GSTR-9 for a regular taxpayer after each financial year. GSTR-9C (reconciliation statement) applies above the turnover limit in the rules; confirm the current limit on gst.gov.in.'],
          due: '31 December after the financial year.', fill: ['Totals of the year from GSTR-1 and GSTR-3B, input credit, tax paid, and differences to be explained.'],
          tools: [['Your own GST calendar', 'https://gst-calendar.niveshsahayak.in/']], note: 'Composition dealers file GSTR-4, not GSTR-9.', src: ['gstrules'] }
      }
    },
    tds: {
      start: 't1',
      n: {
        t1: { q: 'What did you pay, from which TDS is cut?', o: [['Salary to employees', 'sal'], ['A contractor, professional, commission, rent or interest paid to a resident', 'res'], ['A payment to a non-resident', 'nr'], ['I bought or rent property and must deduct', 'prop']] },
        sal: { leaf: 1, title: 'Salary: deposit monthly, file Form 138 each quarter, give Form 130', form: 'Form 138 (quarterly statement, was 24Q); Form 130 (salary certificate, was Form 16)',
          do: ['Deposit the TDS by the 7th of the next month (30 April for March).', 'File the quarterly statement for salary after each quarter.', 'Give each employee the salary TDS certificate after the year.'],
          due: 'Deposit: 7th of the next month. Statements: 31 July, 31 October, 31 January and 31 May.',
          fill: ['Employee PAN, salary paid and TDS cut each month, challan details of every deposit.', 'The new form numbers apply from the first quarter of 2026-27 (April to June 2026); the fourth quarter of 2025-26 still uses the old form 24Q.'],
          tools: [['Monthly TDS on salary in the salary slip maker', 'https://salary-slip.niveshsahayak.in/'], ['TDS and advance tax dates', 'https://gst-calendar.niveshsahayak.in/tds-advance-tax-due-dates/']],
          note: 'Form numbers are as reported by tax sites after the Income-tax Rules, 2026; the official notification was not read. Confirm on incometax.gov.in or TRACES before you file.', src: ['tdsforms', 'tdsdates'] },
        res: { leaf: 1, title: 'Payments to residents other than salary: Form 140', form: 'Form 140 (quarterly statement, was 26Q); certificate Form 131 (was 16A)',
          do: ['Deposit the TDS by the 7th of the next month, then file the quarterly statement.', 'The section and rate depend on the payment: use the TDS calculator.'],
          due: 'Deposit: 7th of the next month (30 April for March). Statements: 31 July, 31 October, 31 January and 31 May.',
          fill: ['Payee PAN, amount paid, section, TDS cut, challan details.'],
          tools: [['TDS calculator', 'https://tds.niveshsahayak.in/']], note: 'Form numbers as reported by tax sites; confirm on the official portal. If the payee has no PAN, a higher rate applies.', src: ['tdsforms', 'tdsdates'] },
        nr: { leaf: 1, title: 'Payments to non-residents: Form 144', form: 'Form 144 (quarterly statement, was 27Q)',
          do: ['Deposit the TDS, file the quarterly statement for payments to non-residents and, where the rules ask, the remittance forms (a chartered accountant usually handles these).'],
          due: 'Deposit: 7th of the next month. Statements: 31 July, 31 October, 31 January and 31 May.',
          fill: ['Payee details, country, nature of payment, rate (treaty rate if the payee gives a tax residency certificate), challan details.'],
          tools: [['TDS calculator', 'https://tds.niveshsahayak.in/']], note: 'Form numbers as reported by tax sites; confirm on the official portal.', src: ['tdsforms', 'tdsdates'] },
        prop: { leaf: 1, title: 'Property purchase or rent above the limit: the single challan-cum-statement', form: 'Form 141 (was 26QB and the related 26QC, 26QD, 26QE)',
          do: ['Pay the TDS online and file the challan-cum-statement for each transaction; there is no separate quarterly return for these.'],
          due: 'Within the period the rules give after the end of the month of deduction; confirm the date on the portal.',
          fill: ['Seller or landlord PAN, amount, date of payment, the section that applies.'],
          tools: [['TDS calculator', 'https://tds.niveshsahayak.in/']], note: 'Form number as reported by tax sites; the deposit date for these forms was not read officially.', src: ['tdsforms'] }
      }
    },
    itr: {
      start: 'i1',
      n: {
        i1: { q: 'Who is filing?', o: [['An individual', 'ind'], ['A Hindu undivided family (HUF)', 'huf'], ['A firm (not an LLP)', 'firm'], ['An LLP, AOP or BOI', 'itr5'], ['A company', 'itr6'], ['A charitable or religious trust, or a political party, university or research body', 'itr7']] },
        ind: { q: 'Do you have income from a business or a profession (not salary)?', o: [['No', 'ind2'], ['Yes', 'indb']] },
        ind2: { q: 'Are you resident (not "not ordinarily resident"), with total income up to ₹50 lakh, from salary or pension, ONE house property, interest or other sources, agricultural income up to ₹5,000 and long-term gains under section 112A up to ₹1,25,000 — and none of these apply: director in a company, short-term capital gains, unlisted shares, any asset or signing authority outside India, foreign income, TDS under 194N, ESOP tax deferred, brought-forward or carry-forward loss?', o: [['Yes, all of that', 'itr1'], ['No, one of them does not fit', 'itr2']] },
        indb: { q: 'Is your business income only under the presumptive schemes (44AD, 44ADA, 44AE), and none of the exclusions above applies (resident, no company directorship, no unlisted shares, no foreign assets, no short-term gains)?', o: [['Yes', 'itr4'], ['No', 'itr3']] },
        huf: { q: 'Does the HUF have business or profession income?', o: [['No', 'itr2'], ['Yes, presumptive only, none of the exclusions', 'itr4'], ['Yes, otherwise', 'itr3']] },
        firm: { q: 'Is the firm\'s business income presumptive (44AD/44ADA/44AE), and does none of the ITR-4 exclusions apply?', o: [['Yes', 'itr4'], ['No', 'itr5']] },
        itr1: { leaf: 1, title: 'File ITR-1 (Sahaj)', form: 'ITR-1', do: ['Use the simple form for a salaried or pension resident individual within the limits above.'], due: DUE,
          fill: ['Salary (from Form 16 / the salary certificate), one house property, interest and other income, deductions, TDS credited in Form 26AS / the annual statement.'], tools: [['Rent receipts for HRA', 'https://rent-receipt.niveshsahayak.in/']], note: 'Cannot be used with brought-forward losses, foreign assets, or more than one house property.', src: ['itrform', 'itrdue'] },
        itr2: { leaf: 1, title: 'File ITR-2', form: 'ITR-2', do: ['For individuals and HUFs without business or professional income who do not fit ITR-1: for example capital gains, more than one house property, foreign assets, company directorship.'], due: DUE,
          fill: ['Salary, house properties, capital gains schedules, other sources, foreign assets schedule if any, deductions, tax paid.'], tools: [], note: 'If you also start earning business income, ITR-3 is the form.', src: ['itrform', 'itrdue'] },
        itr3: { leaf: 1, title: 'File ITR-3', form: 'ITR-3', do: ['For individuals and HUFs with business or professional income who cannot use ITR-4: profit and loss account and balance sheet details are filled in.'], due: DUE,
          fill: ['Profit and loss and balance sheet of the business, other heads of income, deductions, tax paid.'], tools: [['Profit and loss and balance sheet from your bills', 'https://profit-loss.niveshsahayak.in/']], note: 'Tax audit and presumptive-scheme eligibility are conditions to confirm with your accountant.', src: ['itrform', 'itrdue'] },
        itr4: { leaf: 1, title: 'ITR-4 (Sugam) is available', form: 'ITR-4', do: ['For resident individuals, HUFs and firms (not LLPs) with presumptive income under 44AD, 44ADA or 44AE. Using ITR-4 is optional.'], due: DUE,
          fill: ['Presumptive income and turnover, plus salary, one house property and other sources if any, deductions, tax paid.'], tools: [], note: 'If any exclusion applies, ITR-3 is the form.', src: ['itrform', 'itrdue'] },
        itr5: { leaf: 1, title: 'File ITR-5', form: 'ITR-5', do: ['For firms, LLPs, associations of persons, bodies of individuals, local authorities, co-operative societies and some trusts and funds.'], due: DUE, fill: ['Accounts, partners\' remuneration and interest, tax paid.'], tools: [], note: 'Not for persons who must file under sections 139(4A) to 139(4D): that is ITR-7.', src: ['itrform', 'itrdue'] },
        itr6: { leaf: 1, title: 'File ITR-6', form: 'ITR-6', do: ['For companies other than those claiming exemption under section 11 (charitable or religious purpose).'], due: DUE, fill: ['Accounts, schedules, tax paid. A tax audit report is filed first when it applies.'], tools: [], note: 'A company claiming section 11 files ITR-7.', src: ['itrform', 'itrdue'] },
        itr7: { leaf: 1, title: 'File ITR-7', form: 'ITR-7', do: ['For persons filing under section 139(4A) (property held for charitable or religious purposes), 139(4B) (political parties), 139(4C) (research associations, news agencies and others) or 139(4D) (universities, colleges and similar).'], due: DUE, fill: ['Income of the institution, application of income, registration details.'], tools: [], note: 'Trusts that are not required to use ITR-7 file ITR-5.', src: ['itrform', 'itrdue'] }
      }
    },
    pfesi: {
      start: 'p1',
      n: {
        p1: { q: 'Which one are you looking at?', o: [['Provident fund (EPF)', 'pf'], ['Employees\' State Insurance (ESI)', 'esi']] },
        pf: { leaf: 1, title: 'Provident fund: pay the contribution and file the monthly ECR', form: 'ECR (electronic challan-cum-return) on the EPFO employer portal',
          do: ['Deduct the employee share from wages and add the employer share; file the ECR and pay the challan on the EPFO unified portal each month.'],
          due: 'The long-standing date is the 15th of the next month. This date was not found on the EPFO pages read today: confirm it on the portal.',
          fill: ['UAN of each employee, wages for PF, the employee share, the employer share (12% of basic pay and dearness allowance each, as EPFO\'s scheme page says), days worked.', 'The wage limit for compulsory coverage was raised from ₹15,000 to ₹25,000 a month, as noted by the Nivesh Sahayak project in November 2026 from the government\'s release; EPFO lists a wage ceiling circular dated 28 September 2026, which was not read here.'],
          tools: [['PF in the salary slip maker', 'https://salary-slip.niveshsahayak.in/']], note: 'Whether the law applies to your business depends on the number of employees and your state; confirm with EPFO.', src: ['epfo'] },
        esi: { leaf: 1, title: 'ESI: pay the monthly contribution', form: 'Monthly contribution on the ESIC employer portal',
          do: ['Pay the employer and employee contributions every month on the ESIC portal and file the monthly contribution details.'],
          due: 'Within 15 days of the last day of the calendar month in which the contribution falls due (ESIC Contribution page).',
          fill: ['Wages of each insured person, employee share 0.75% and employer share 3.25% (rates as printed on the ESIC page, in force since 1 July 2019).', 'Coverage: wages up to ₹21,000 a month (₹25,000 for a person with disability), as printed on the ESIC Coverage page reviewed 4 April 2025.'],
          tools: [['ESI in the salary slip maker', 'https://salary-slip.niveshsahayak.in/']], note: 'The ESIC pages read were last reviewed in April 2025; rates and limits change by notification, so confirm before you pay.', src: ['esic'] }
      }
    },
    eway: {
      start: 'e1',
      n: {
        e1: { q: 'Are you moving goods (not services) as part of a supply, a return or a transfer between your own places?', o: [['Yes', 'e2'], ['No, it is a service', 'none']] },
        e2: { q: 'Is the value of goods in one consignment above ₹50,000?', o: [['Yes', 'yes'], ['No, it is ₹50,000 or less', 'low']] },
        yes: { leaf: 1, title: 'Generate an e-way bill before the goods move', form: 'E-way bill (Part A and Part B)',
          do: ['Generate it on the e-way bill portal before the vehicle leaves: Part A from the invoice (GSTIN, invoice number, value, HSN), Part B with the vehicle number.', 'Carry the e-way bill number or the printout with the goods.'],
          due: 'Before the goods move. Validity is one day for every 200 km of distance (rules for over-dimensional cargo differ).',
          fill: ['Supplier and receiver GSTIN, invoice number and date, value, HSN code, distance, transporter and vehicle number.'],
          tools: [['E-way bill file maker', 'https://eway-bill.niveshsahayak.in/'], ['Find an HSN code', 'https://hsn.niveshsahayak.in/']],
          note: 'The ₹50,000 limit and the 200 km rule were checked by the Nivesh Sahayak project on 4 November 2026. Some goods are exempt and some states set their own limits inside the state: confirm for your goods and route.', src: ['eway'] },
        low: { leaf: 1, title: 'Usually no e-way bill is needed, with exceptions', form: 'None, in the usual case',
          do: ['Under the usual rule goods of ₹50,000 or less in one consignment do not need an e-way bill, but some kinds of goods and some movements need one at any value, and states have their own rules inside the state.'],
          due: 'Not applicable in the usual case.', fill: ['Keep the invoice or delivery challan with the goods.'], tools: [['E-way bill file maker', 'https://eway-bill.niveshsahayak.in/']], note: 'Check the rule for your goods and state before you decide not to generate one.', src: ['eway'] },
        none: { leaf: 1, title: 'No e-way bill for services', form: 'None', do: ['An e-way bill is for the movement of goods.'], due: 'Not applicable.', fill: [], tools: [], note: '', src: ['eway'] }
      }
    }
  };
  var ORDER = ['gst', 'tds', 'itr', 'pfesi', 'eway'];

  function step(tree, id) { return TREES[tree].n[id] || null; }
  /* follow answers (indexes of the options chosen) from the start; returns {path:[{id,node,pick}], node, id, ok} */
  function walk(tree, answers) {
    var T = TREES[tree]; if (!T) return null;
    var id = T.start, path = [];
    for (var i = 0; i < answers.length; i++) {
      var n = T.n[id];
      if (!n || n.leaf) return { ok: false, path: path };
      var pick = parseInt(answers[i], 10);
      if (!(pick >= 0 && pick < n.o.length)) return { ok: false, path: path };
      path.push({ id: id, node: n, pick: pick });
      id = n.o[pick][1];
    }
    return { ok: true, path: path, id: id, node: T.n[id] };
  }
  /* shareable link: "#itr=0.1.0" */
  function toHash(tree, answers) { return '#' + tree + (answers.length ? '=' + answers.join('.') : ''); }
  function fromHash(h) {
    var m = /^#?([a-z0-9]+)(?:=([0-9.]*))?$/.exec(String(h || ''));
    if (!m || !TREES[m[1]]) return null;
    return { tree: m[1], answers: m[2] ? m[2].split('.').filter(Boolean) : [] };
  }
  /* plain text of an answer, for copying */
  function text(tree, answers) {
    var w = walk(tree, answers); if (!w || !w.ok || !w.node || !w.node.leaf) return '';
    var n = w.node, L = [];
    L.push(n.title, '', 'Form: ' + n.form, 'When: ' + n.due, '');
    n.do.forEach(function (x) { L.push('- ' + x); });
    if (n.fill.length) { L.push('', 'What to fill:'); n.fill.forEach(function (x) { L.push('- ' + x); }); }
    if (n.note) L.push('', n.note);
    L.push('', 'Rules as of ' + AS_OF + '. Sources:');
    n.src.forEach(function (s) { L.push('- ' + SRC[s].name + ' (' + (SRC[s].st === 'read' ? 'read on the official site' : 'to confirm') + ', ' + SRC[s].on + ')'); });
    return L.join('\n');
  }

  var API = { TREES: TREES, SRC: SRC, ORDER: ORDER, AS_OF: AS_OF, step: step, walk: walk, toHash: toHash, fromHash: fromHash, text: text };
  if (typeof module !== 'undefined' && module.exports) module.exports = API; else G.NSFile = API;
})(typeof window !== 'undefined' ? window : this);

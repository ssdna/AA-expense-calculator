const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

// 姓名库
const surnames = ['赵', '钱', '孙', '李', '周', '吴', '郑', '王', '冯', '陈', '褚', '卫', '蒋', '沈', '韩', '杨', '朱', '秦', '尤', '许'];
const givenNames = ['伟', '芳', '娜', '敏', '静', '丽', '强', '磊', '军', '洋', '勇', '艳', '杰', '娟', '涛', '明', '超', '秀', '霞', '平'];

// 费用说明库
const expenseDescriptions = [
  '午餐费用', '晚餐费用', '早餐费用', '下午茶', '咖啡费用',
  '打车费', '地铁费', '停车费', '加油费', '过路费',
  '电影票', 'KTV费用', '游戏厅', '桌游费', '密室逃脱',
  '购物费用', '超市采购', '日用品', '零食费用', '饮料费用',
  '住宿费', '景点门票', '导游费', '纪念品', '旅游保险'
];

// 生成随机姓名
function generateRandomName() {
  const surname = surnames[Math.floor(Math.random() * surnames.length)];
  const givenName = givenNames[Math.floor(Math.random() * givenNames.length)];
  return `${surname}${givenName}`;
}

// 生成随机日期
function generateRandomDate() {
  const start = new Date(2024, 0, 1);
  const end = new Date(2024, 11, 31);
  const date = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
  return date.toISOString().split('T')[0];
}

// 生成随机金额
function generateRandomAmount() {
  return Math.round((Math.random() * 500 + 10) * 100) / 100;
}

// 计算个人汇总
function calculatePersonSummary(person, expenses) {
  let totalPaid = 0;
  let totalShould = 0;

  expenses.forEach(expense => {
    if (expense.payerName === person.name) {
      totalPaid += expense.amount;
    }
    
    if (expense.participantNames.includes(person.name)) {
      totalShould += expense.amount / expense.participantNames.length;
    }
  });

  return {
    totalPaid: Math.round(totalPaid * 100) / 100,
    totalShould: Math.round(totalShould * 100) / 100,
    balance: Math.round((totalPaid - totalShould) * 100) / 100
  };
}

// 计算结算方案
function calculateSettlement(persons, expenses) {
  const balances = {};
  
  persons.forEach(person => {
    const summary = calculatePersonSummary(person, expenses);
    balances[person.name] = summary.balance;
  });

  const creditors = [];
  const debtors = [];

  Object.entries(balances).forEach(([name, balance]) => {
    if (balance > 0.01) {
      creditors.push({ name, balance });
    } else if (balance < -0.01) {
      debtors.push({ name, balance: -balance });
    }
  });

  const settlements = [];
  let i = 0, j = 0;

  while (i < creditors.length && j < debtors.length) {
    const creditor = creditors[i];
    const debtor = debtors[j];
    
    const amount = Math.min(creditor.balance, debtor.balance);
    
    if (amount > 0.01) {
      settlements.push({
        from: debtor.name,
        to: creditor.name,
        amount: Math.round(amount * 100) / 100
      });
    }
    
    creditor.balance -= amount;
    debtor.balance -= amount;
    
    if (creditor.balance < 0.01) i++;
    if (debtor.balance < 0.01) j++;
  }

  return settlements;
}

// 生成测试数据
function generateTestData(testNumber) {
  const personCount = Math.floor(Math.random() * 8) + 3; // 3-10人
  const expenseCount = Math.floor(Math.random() * 91) + 10; // 10-100条费用
  
  // 生成人员数据
  const persons = [];
  const usedNames = new Set();
  
  for (let i = 0; i < personCount; i++) {
    let name;
    do {
      name = generateRandomName();
    } while (usedNames.has(name));
    
    usedNames.add(name);
    persons.push({ name });
  }
  
  // 生成费用数据
  const expenses = [];
  
  for (let i = 0; i < expenseCount; i++) {
    const amount = generateRandomAmount();
    const description = expenseDescriptions[Math.floor(Math.random() * expenseDescriptions.length)];
    const date = generateRandomDate();
    const payerName = persons[Math.floor(Math.random() * persons.length)].name;
    
    // 随机选择分摊人员（至少包含支付人）
    const participantCount = Math.floor(Math.random() * personCount) + 1;
    const shuffledPersons = [...persons].sort(() => Math.random() - 0.5);
    const participants = shuffledPersons.slice(0, participantCount);
    
    // 确保支付人在分摊人员中
    if (!participants.some(p => p.name === payerName)) {
      participants[0] = { name: payerName };
    }
    
    const participantNames = participants.map(p => p.name);
    
    expenses.push({
      amount,
      description,
      date,
      payerName,
      participantNames
    });
  }
  
  return { persons, expenses };
}

// 创建Excel文件
function createExcelFile(testData, filename) {
  const wb = XLSX.utils.book_new();
  
  // 创建人员表
  const personData = testData.persons.map(person => ({ '姓名': person.name }));
  const personWs = XLSX.utils.json_to_sheet(personData);
  XLSX.utils.book_append_sheet(wb, personWs, '人员表');
  
  // 创建费用表
  const expenseData = testData.expenses.map(expense => ({
    '金额': expense.amount,
    '说明': expense.description,
    '日期': expense.date,
    '支付人': expense.payerName,
    '分摊人': expense.participantNames.join(',')
  }));
  const expenseWs = XLSX.utils.json_to_sheet(expenseData);
  XLSX.utils.book_append_sheet(wb, expenseWs, '费用表');
  
  // 写入文件
  XLSX.writeFile(wb, filename);
}

// 生成验证报告
function generateValidationReport(testData, testNumber) {
  const { persons, expenses } = testData;
  
  let report = `# 测试文件 ${testNumber} 验证报告\n\n`;
  report += `## 基本信息\n`;
  report += `- 参与人数: ${persons.length}\n`;
  report += `- 费用记录数: ${expenses.length}\n`;
  report += `- 总费用: ¥${expenses.reduce((sum, e) => sum + e.amount, 0).toFixed(2)}\n\n`;
  
  report += `## 人员明细\n`;
  persons.forEach((person, index) => {
    report += `${index + 1}. ${person.name}\n`;
  });
  report += '\n';
  
  report += `## 个人费用汇总\n`;
  report += `| 姓名 | 已支付 | 应分摊 | 余额 |\n`;
  report += `|------|--------|--------|------|\n`;
  
  persons.forEach(person => {
    const summary = calculatePersonSummary(person, expenses);
    const balanceStr = summary.balance > 0 ? `+¥${summary.balance.toFixed(2)}` : 
                      summary.balance < 0 ? `-¥${Math.abs(summary.balance).toFixed(2)}` : '¥0.00';
    report += `| ${person.name} | ¥${summary.totalPaid.toFixed(2)} | ¥${summary.totalShould.toFixed(2)} | ${balanceStr} |\n`;
  });
  report += '\n';
  
  // 验证总和平衡
  const totalBalance = persons.reduce((sum, person) => {
    const summary = calculatePersonSummary(person, expenses);
    return sum + summary.balance;
  }, 0);
  
  report += `## 验证结果\n`;
  report += `- 总余额: ¥${totalBalance.toFixed(2)} (应为0.00)\n`;
  report += `- 余额验证: ${Math.abs(totalBalance) < 0.01 ? '✅ 通过' : '❌ 失败'}\n\n`;
  
  // 结算方案
  const settlement = calculateSettlement(persons, expenses);
  report += `## 结算方案\n`;
  if (settlement.length === 0) {
    report += `✅ 账目已平衡，无需转账\n\n`;
  } else {
    settlement.forEach((item, index) => {
      report += `${index + 1}. ${item.from} → ${item.to}: ¥${item.amount.toFixed(2)}\n`;
    });
    report += '\n';
  }
  
  // 验证结算方案
  const balancesAfterSettlement = {};
  persons.forEach(person => {
    const summary = calculatePersonSummary(person, expenses);
    balancesAfterSettlement[person.name] = summary.balance;
  });
  
  settlement.forEach(item => {
    balancesAfterSettlement[item.from] += item.amount;
    balancesAfterSettlement[item.to] -= item.amount;
  });
  
  const maxBalanceAfterSettlement = Math.max(...Object.values(balancesAfterSettlement).map(Math.abs));
  report += `- 结算后最大余额: ¥${maxBalanceAfterSettlement.toFixed(2)}\n`;
  report += `- 结算验证: ${maxBalanceAfterSettlement < 0.01 ? '✅ 通过' : '❌ 失败'}\n\n`;
  
  return report;
}

// 确保tests目录存在
if (!fs.existsSync('tests')) {
  fs.mkdirSync('tests');
}

// 生成5个测试文件
let allReports = '# AA制费用计算器测试验证报告\n\n';

for (let i = 1; i <= 5; i++) {
  console.log(`生成测试文件 ${i}...`);
  
  const testData = generateTestData(i);
  const filename = path.join('tests', `test-data-${i}.xlsx`);
  
  createExcelFile(testData, filename);
  
  const report = generateValidationReport(testData, i);
  allReports += report;
  
  console.log(`✅ 测试文件 ${i} 生成完成: ${testData.persons.length}人, ${testData.expenses.length}条费用`);
}

// 写入验证报告
fs.writeFileSync(path.join('tests', 'validation-report.md'), allReports);

console.log('\n🎉 所有测试文件生成完成！');
console.log('📁 文件位置: tests/test-data-1.xlsx ~ test-data-5.xlsx');
console.log('📊 验证报告: tests/validation-report.md');

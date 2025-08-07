// 手动验证计算逻辑的准确性
const XLSX = require('xlsx');
const fs = require('fs');

// 读取Excel文件并验证
function verifyExcelFile(filename) {
  console.log(`\n🔍 验证文件: ${filename}`);
  
  const workbook = XLSX.readFile(filename);
  
  // 读取人员数据
  const personSheet = workbook.Sheets['人员表'];
  const personData = XLSX.utils.sheet_to_json(personSheet);
  const persons = personData.map(row => ({ name: row['姓名'] }));
  
  // 读取费用数据
  const expenseSheet = workbook.Sheets['费用表'];
  const expenseData = XLSX.utils.sheet_to_json(expenseSheet);
  const expenses = expenseData.map(row => ({
    amount: parseFloat(row['金额']),
    description: row['说明'],
    date: row['日期'],
    payerName: row['支付人'],
    participantNames: row['分摊人'].split(',').map(name => name.trim())
  }));
  
  console.log(`👥 人员数量: ${persons.length}`);
  console.log(`💰 费用记录: ${expenses.length}条`);
  
  // 验证数据完整性
  let isValid = true;
  
  // 检查支付人是否都在人员列表中
  expenses.forEach((expense, index) => {
    if (!persons.some(p => p.name === expense.payerName)) {
      console.log(`❌ 费用${index + 1}: 支付人"${expense.payerName}"不在人员列表中`);
      isValid = false;
    }
    
    // 检查分摊人是否都在人员列表中
    expense.participantNames.forEach(participantName => {
      if (!persons.some(p => p.name === participantName)) {
        console.log(`❌ 费用${index + 1}: 分摊人"${participantName}"不在人员列表中`);
        isValid = false;
      }
    });
    
    // 检查支付人是否在分摊人中
    if (!expense.participantNames.includes(expense.payerName)) {
      console.log(`⚠️  费用${index + 1}: 支付人"${expense.payerName}"不在分摊人列表中`);
    }
  });
  
  if (!isValid) {
    console.log('❌ 数据验证失败');
    return false;
  }
  
  // 计算总费用
  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  console.log(`💵 总费用: ¥${totalExpenses.toFixed(2)}`);
  
  // 计算每个人的费用汇总
  console.log('\n📊 个人费用汇总:');
  let totalPaidSum = 0;
  let totalShouldSum = 0;
  let totalBalanceSum = 0;
  
  persons.forEach(person => {
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
    
    totalPaid = Math.round(totalPaid * 100) / 100;
    totalShould = Math.round(totalShould * 100) / 100;
    const balance = Math.round((totalPaid - totalShould) * 100) / 100;
    
    totalPaidSum += totalPaid;
    totalShouldSum += totalShould;
    totalBalanceSum += balance;
    
    const balanceStr = balance > 0 ? `+¥${balance.toFixed(2)}` : 
                      balance < 0 ? `-¥${Math.abs(balance).toFixed(2)}` : '¥0.00';
    
    console.log(`  ${person.name}: 已支付¥${totalPaid.toFixed(2)}, 应分摊¥${totalShould.toFixed(2)}, 余额${balanceStr}`);
  });
  
  console.log('\n🔍 验证结果:');
  console.log(`  总支付: ¥${totalPaidSum.toFixed(2)} (应等于总费用¥${totalExpenses.toFixed(2)})`);
  console.log(`  总分摊: ¥${totalShouldSum.toFixed(2)} (应等于总费用¥${totalExpenses.toFixed(2)})`);
  console.log(`  总余额: ¥${totalBalanceSum.toFixed(2)} (应为¥0.00)`);
  
  const paidValid = Math.abs(totalPaidSum - totalExpenses) < 0.01;
  const shouldValid = Math.abs(totalShouldSum - totalExpenses) < 0.01;
  const balanceValid = Math.abs(totalBalanceSum) < 0.01;
  
  console.log(`  支付验证: ${paidValid ? '✅' : '❌'}`);
  console.log(`  分摊验证: ${shouldValid ? '✅' : '❌'}`);
  console.log(`  余额验证: ${balanceValid ? '✅' : '❌'}`);
  
  return paidValid && shouldValid && balanceValid;
}

// 验证所有测试文件
console.log('🚀 开始验证测试文件...');

let allValid = true;
for (let i = 1; i <= 5; i++) {
  const filename = `tests/test-data-${i}.xlsx`;
  if (fs.existsSync(filename)) {
    const isValid = verifyExcelFile(filename);
    if (!isValid) {
      allValid = false;
    }
  } else {
    console.log(`❌ 文件不存在: ${filename}`);
    allValid = false;
  }
}

console.log(`\n${allValid ? '🎉' : '❌'} 验证${allValid ? '通过' : '失败'}: 所有测试文件${allValid ? '计算正确' : '存在问题'}`);

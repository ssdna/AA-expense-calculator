import React from 'react';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

const ExcelExport = ({ persons, expenses }) => {
  const exportToExcel = () => {
    if (persons.length === 0 && expenses.length === 0) {
      alert('暂无数据可导出');
      return;
    }

    const wb = XLSX.utils.book_new();
    
    // 创建人员表
    if (persons.length > 0) {
      const personData = persons.map(person => ({
        'ID': person.id,
        '姓名': person.name
      }));
      const personWs = XLSX.utils.json_to_sheet(personData);
      XLSX.utils.book_append_sheet(wb, personWs, '人员表');
    }
    
    // 创建费用表
    if (expenses.length > 0) {
      const expenseData = expenses.map(expense => {
        const payer = persons.find(p => p.id === expense.payerId);
        const participantNames = expense.participants
          .map(id => persons.find(p => p.id === id)?.name)
          .filter(name => name)
          .join(',');
        
        return {
          'ID': expense.id,
          '金额': expense.amount,
          '说明': expense.description,
          '日期': expense.date,
          '支付人': payer?.name || '未知',
          '分摊人': participantNames,
          '创建时间': new Date(expense.timestamp).toLocaleString('zh-CN')
        };
      });
      const expenseWs = XLSX.utils.json_to_sheet(expenseData);
      XLSX.utils.book_append_sheet(wb, expenseWs, '费用表');
    }
    
    // 创建汇总表
    if (persons.length > 0 && expenses.length > 0) {
      const summaryData = persons.map(person => {
        let totalPaid = 0;
        let totalShould = 0;

        expenses.forEach(expense => {
          if (expense.payerId === person.id) {
            totalPaid += expense.amount;
          }
          
          if (expense.participants.includes(person.id)) {
            totalShould += expense.amount / expense.participants.length;
          }
        });

        totalPaid = Math.round(totalPaid * 100) / 100;
        totalShould = Math.round(totalShould * 100) / 100;
        const balance = Math.round((totalPaid - totalShould) * 100) / 100;

        return {
          '姓名': person.name,
          '已支付': totalPaid,
          '应分摊': totalShould,
          '余额': balance,
          '状态': balance > 0 ? '应收回' : balance < 0 ? '应补交' : '已平衡'
        };
      });
      
      // 添加总计行
      const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
      summaryData.push({
        '姓名': '总计',
        '已支付': totalExpenses,
        '应分摊': totalExpenses,
        '余额': 0,
        '状态': '平衡'
      });
      
      const summaryWs = XLSX.utils.json_to_sheet(summaryData);
      XLSX.utils.book_append_sheet(wb, summaryWs, '费用汇总');
    }
    
    // 生成文件名
    const now = new Date();
    const dateStr = now.toISOString().split('T')[0];
    const timeStr = now.toTimeString().split(' ')[0].replace(/:/g, '-');
    const filename = `AA制费用计算_${dateStr}_${timeStr}.xlsx`;
    
    // 导出文件
    const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([wbout], { type: 'application/octet-stream' });
    saveAs(blob, filename);
    
    alert(`Excel文件已导出: ${filename}`);
  };

  const getTotalExpenses = () => {
    return expenses.reduce((sum, expense) => sum + expense.amount, 0);
  };

  return (
    <div className="card">
      <h2 className="text-lg font-bold mb-3 text-gray-800">数据导出</h2>
      
      <div className="space-y-3">
        <div className="bg-blue-50 p-3 rounded-lg">
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div>
              <span className="text-gray-600">参与人数:</span>
              <span className="font-medium ml-2">{persons.length}人</span>
            </div>
            <div>
              <span className="text-gray-600">费用记录:</span>
              <span className="font-medium ml-2">{expenses.length}条</span>
            </div>
            <div className="col-span-2">
              <span className="text-gray-600">总费用:</span>
              <span className="font-medium ml-2 text-base">¥{getTotalExpenses().toFixed(2)}</span>
            </div>
          </div>
        </div>

        <button
          onClick={exportToExcel}
          className="btn-success w-full flex items-center justify-center gap-2 touch-target"
          disabled={persons.length === 0 && expenses.length === 0}
        >
          <span>📊</span>
          一键导出Excel文件
        </button>

        <div className="text-xs text-gray-600 bg-gray-50 p-2 rounded-lg">
          <div className="font-medium mb-1">📋 导出内容说明：</div>
          <ul className="space-y-0.5 text-xs">
            <li>• <strong>人员表</strong>：包含所有参与人员的ID和姓名</li>
            <li>• <strong>费用表</strong>：包含所有费用记录的详细信息</li>
            <li>• <strong>费用汇总</strong>：每个人的支付、分摊和余额统计</li>
            <li>• 文件名自动包含导出时间，便于管理</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ExcelExport;
